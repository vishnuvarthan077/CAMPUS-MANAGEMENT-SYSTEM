require("dotenv").config();
const http = require("http");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = require("../app");
const connectDB = require("../config/db");
const User = require("../models/User");

async function runTests() {
  console.log("=== STARTING AUTHENTICATION & REFRESH TOKEN TESTS ===");
  let server;
  let baseUrl;
  let passedCount = 0;
  let failedCount = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  PASS: ${message}`);
      passedCount++;
    } else {
      console.error(`  FAIL: ${message}`);
      failedCount++;
    }
  }

  try {
    // 1. Connect to Database
    await connectDB();
    console.log("[Setup] Database connected successfully.");

    // Clean test users before starting
    await User.deleteMany({ email: /test.*@campus\.edu/i });

    // 2. Start HTTP server on dynamic port
    server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;
    baseUrl = `http://127.0.0.1:${port}`;
    console.log(`[Setup] Test server running on ${baseUrl}\n`);

    // --- TEST 1: Register a new student ---
    console.log("--- 1. Register Endpoint ---");
    const regStudentRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Student",
        email: "test.student@campus.edu",
        password: "password123",
        role: "Student",
      }),
    });
    const regStudentData = await regStudentRes.json();
    assert(regStudentRes.status === 201, "Student registration returns 201 Created");
    assert(regStudentData.success === true, "Response success is true");
    assert(typeof regStudentData.accessToken === "string", "Access token is returned");
    assert(typeof regStudentData.refreshToken === "string", "Refresh token is returned");
    assert(regStudentData.user.role === "student", "Role is normalized to student");
    assert(regStudentData.user.password === undefined, "Password is not leaked in response");

    // --- TEST 2: Duplicate registration rejected ---
    const dupRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Duplicate User",
        email: "test.student@campus.edu",
        password: "password123",
      }),
    });
    const dupData = await dupRes.json();
    assert(dupRes.status === 409, "Duplicate email returns 409 Conflict");
    assert(dupData.success === false, "Duplicate registration success is false");

    // --- TEST 3: Validation on missing fields ---
    const missRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test.student2@campus.edu",
      }),
    });
    assert(missRes.status === 400, "Missing registration fields returns 400 Bad Request");

    // --- TEST 4: Validation on short password ---
    const shortPassRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Short Pass",
        email: "test.short@campus.edu",
        password: "123",
      }),
    });
    assert(shortPassRes.status === 400, "Password under 6 chars returns 400 Bad Request");

    // --- TEST 5: Login with valid credentials ---
    console.log("\n--- 2. Login Endpoint ---");
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test.student@campus.edu",
        password: "password123",
      }),
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200, "Valid login returns 200 OK");
    assert(loginData.success === true, "Login response success is true");
    assert(typeof loginData.accessToken === "string", "Login returns new accessToken");
    assert(typeof loginData.refreshToken === "string", "Login returns new refreshToken");
    assert(loginData.user.email === "test.student@campus.edu", "User info matches");

    let studentAccessToken = loginData.accessToken;
    let studentRefreshToken = loginData.refreshToken;

    // --- TEST 6: Login with incorrect password ---
    const wrongPassRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test.student@campus.edu",
        password: "wrongpassword",
      }),
    });
    assert(wrongPassRes.status === 401, "Invalid password returns 401 Unauthorized");

    // --- TEST 7: Login with non-existing user ---
    const nonExistRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test.nonexistent@campus.edu",
        password: "password123",
      }),
    });
    assert(nonExistRes.status === 401, "Nonexistent user returns 401 Unauthorized");

    // --- TEST 8: Protected route /api/auth/me with valid token ---
    console.log("\n--- 3. Auth Middleware & Protected Route ---");
    const meRes = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${studentAccessToken}` },
    });
    const meData = await meRes.json();
    assert(meRes.status === 200, "Valid access token accesses protected /api/auth/me");
    assert(meData.data.email === "test.student@campus.edu", "/api/auth/me returns current user profile");

    // --- TEST 9: Protected route without token ---
    const noTokenRes = await fetch(`${baseUrl}/api/auth/me`);
    assert(noTokenRes.status === 401, "Missing Authorization token returns 401");

    // --- TEST 10: Protected route with malformed/invalid token ---
    const badTokenRes = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: "Bearer invalid_garbage_token_value" },
    });
    assert(badTokenRes.status === 401, "Malformed access token returns 401");

    // --- TEST 11: Refresh Token Flow (Valid) ---
    console.log("\n--- 4. Refresh Token Endpoint ---");
    const refreshRes = await fetch(`${baseUrl}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: studentRefreshToken }),
    });
    const refreshData = await refreshRes.json();
    assert(refreshRes.status === 200, "Valid refresh token returns 200 OK");
    assert(typeof refreshData.accessToken === "string", "New accessToken generated successfully");
    const newAccessToken = refreshData.accessToken;

    // Verify the new access token can access protected route
    const meWithNewTokenRes = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${newAccessToken}` },
    });
    assert(meWithNewTokenRes.status === 200, "Newly refreshed access token successfully authorizes user");

    // --- TEST 12: Missing refresh token ---
    const missingRefreshRes = await fetch(`${baseUrl}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    assert(missingRefreshRes.status === 400, "Missing refresh token in request returns 400 Bad Request");

    // --- TEST 13: Invalid/tampered refresh token ---
    const invalidRefreshRes = await fetch(`${baseUrl}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: "invalid.refresh.token" }),
    });
    assert(invalidRefreshRes.status === 401, "Invalid refresh token returns 401 Unauthorized");

    // --- TEST 14: Expired refresh token ---
    const expiredRefreshToken = jwt.sign(
      { id: loginData.user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "0s" }
    );
    const expiredRefreshRes = await fetch(`${baseUrl}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: expiredRefreshToken }),
    });
    const expiredRefreshData = await expiredRefreshRes.json();
    assert(expiredRefreshRes.status === 401, "Expired refresh token returns 401 Unauthorized");
    assert(
      expiredRefreshData.message.toLowerCase().includes("expired"),
      "Expired refresh token error message indicates expiry"
    );

    // --- TEST 15: Role-based authorization ---
    console.log("\n--- 5. Role-Based Access Control ---");
    // Register Admin
    const regAdminRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Admin",
        email: "test.admin@campus.edu",
        password: "adminpassword123",
        role: "admin",
      }),
    });
    const regAdminData = await regAdminRes.json();
    const adminAccessToken = regAdminData.accessToken;

    // Student attempts to access admin-only endpoint -> 403 Forbidden
    const studentToAdminRes = await fetch(`${baseUrl}/api/auth/admin-only`, {
      headers: { Authorization: `Bearer ${studentAccessToken}` },
    });
    assert(studentToAdminRes.status === 403, "Student accessing admin-only endpoint returns 403 Forbidden");

    // Admin attempts to access admin-only endpoint -> 200 OK
    const adminToAdminRes = await fetch(`${baseUrl}/api/auth/admin-only`, {
      headers: { Authorization: `Bearer ${adminAccessToken}` },
    });
    assert(adminToAdminRes.status === 200, "Admin accessing admin-only endpoint returns 200 OK");

    // --- TEST 16: Logout Endpoint ---
    console.log("\n--- 6. Logout Endpoint & Invalidation ---");
    const logoutRes = await fetch(`${baseUrl}/api/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: studentRefreshToken }),
    });
    assert(logoutRes.status === 200, "Logout returns 200 OK");

    // Attempt to reuse the logged-out refresh token -> 401
    const revokedRefreshRes = await fetch(`${baseUrl}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: studentRefreshToken }),
    });
    assert(revokedRefreshRes.status === 401, "Revoked/logged-out refresh token returns 401 Unauthorized");

    // --- TEST 17: Existing APIs health check ---
    console.log("\n--- 7. Existing API Preservation ---");
    const healthRes = await fetch(`${baseUrl}/api/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200, "Existing /api/health endpoint returns 200 OK");
    assert(healthData.success === true, "Health endpoint preserved");

  } catch (err) {
    console.error("Test execution encountered an error:", err);
    failedCount++;
  } finally {
    // Cleanup database test entries
    try {
      await User.deleteMany({ email: /test.*@campus\.edu/i });
      console.log("\n[Cleanup] Test users cleaned from database.");
    } catch (cleanErr) {
      console.error("Error during cleanup:", cleanErr);
    }

    if (server) {
      server.close();
    }
    await mongoose.connection.close();
    console.log("[Cleanup] Database connection closed.");

    console.log("\n=================================");
    console.log(`TEST SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED`);
    console.log("=================================");

    process.exit(failedCount > 0 ? 1 : 0);
  }
}

runTests();

