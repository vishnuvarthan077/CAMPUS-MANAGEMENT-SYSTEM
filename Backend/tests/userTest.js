require("dotenv").config();
const http = require("http");
const mongoose = require("mongoose");
const app = require("../app");
const connectDB = require("../config/db");
const User = require("../models/User");
const Student = require("../models/Student");
const Faculty = require("../models/Faculty");
const Department = require("../models/Department");
const { generateAccessToken } = require("../utils/generateToken");

async function runTests() {
  console.log("=== STARTING USER & PROFILE CRUD & VALIDATION TESTS ===");
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
    await connectDB();
    console.log("[Setup] Database connected.");

    // Clean any prior test records
    await User.deleteMany({ email: /test.*@usercrud\.edu/i });
    await Department.deleteMany({ code: "TEST_DEPT" });

    // Setup Test Department
    const testDept = await Department.create({
      name: "Test User Department",
      code: "TEST_DEPT",
      headOfDepartment: "Dr. Tester",
      establishedYear: 2020,
    });

    // Setup Test Admin, Faculty, and Student users
    const adminUser = await User.create({
      name: "Admin Tester",
      email: "test.admin@usercrud.edu",
      password: "password123",
      role: "admin",
    });
    const adminToken = generateAccessToken(adminUser);

    const facultyUser = await User.create({
      name: "Faculty Tester",
      email: "test.faculty@usercrud.edu",
      password: "password123",
      role: "faculty",
    });
    const facultyToken = generateAccessToken(facultyUser);

    const studentUser1 = await User.create({
      name: "Student Tester 1",
      email: "test.student1@usercrud.edu",
      password: "password123",
      role: "student",
      phone: "1234567890",
    });
    const student1Token = generateAccessToken(studentUser1);

    const studentUser2 = await User.create({
      name: "Student Tester 2",
      email: "test.student2@usercrud.edu",
      password: "password123",
      role: "student",
    });
    const student2Token = generateAccessToken(studentUser2);

    // Start ephemeral HTTP server
    server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;
    baseUrl = `http://127.0.0.1:${port}`;
    console.log(`[Setup] Server running at ${baseUrl}\n`);

    // --- 1. USER CREATION & VALIDATION ---
    console.log("--- 1. User Creation & Validation (/api/users) ---");
    // Admin creates new user
    const createUserRes = await fetch(`${baseUrl}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: "Newly Created User",
        email: "test.newuser@usercrud.edu",
        password: "password123",
        role: "student",
        phone: "9876543210",
      }),
    });
    const createUserData = await createUserRes.json();
    assert(createUserRes.status === 201, "Admin creating user returns 201 Created");
    assert(createUserData.data.password === undefined, "Password is NEVER returned in response");
    assert(createUserData.data.email === "test.newuser@usercrud.edu", "Created user email matches");

    const newUserId = createUserData.data.id;

    // Duplicate email rejected
    const dupRes = await fetch(`${baseUrl}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: "Duplicate Email User",
        email: "test.newuser@usercrud.edu",
        password: "password123",
      }),
    });
    assert(dupRes.status === 409, "Duplicate email in createUser returns 409 Conflict");

    // Validation middleware failure: Missing email
    const valFailRes = await fetch(`${baseUrl}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: "No Email User",
        password: "password123",
      }),
    });
    const valFailData = await valFailRes.json();
    assert(valFailRes.status === 400, "Validation failure returns 400 Bad Request");
    assert(Array.isArray(valFailData.errors), "Errors array is returned in validation failure");
    assert(
      valFailData.errors.some((e) => e.field === "email"),
      "Validation identifies missing email field"
    );

    // Non-admin cannot create user
    const studentCreateRes = await fetch(`${baseUrl}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${student1Token}`,
      },
      body: JSON.stringify({
        name: "Unauthorized Creation",
        email: "test.unauth@usercrud.edu",
        password: "password123",
      }),
    });
    assert(studentCreateRes.status === 403, "Student attempting to create user returns 403 Forbidden");

    // --- 2. GET USERS LIST & PAGINATION ---
    console.log("\n--- 2. Get Users (/api/users) ---");
    const listRes = await fetch(`${baseUrl}/api/users?search=usercrud`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const listData = await listRes.json();
    assert(listRes.status === 200, "Admin can retrieve users list");
    assert(listData.total >= 4, "Users count matches seeded test users");

    const studentListRes = await fetch(`${baseUrl}/api/users`, {
      headers: { Authorization: `Bearer ${student1Token}` },
    });
    assert(studentListRes.status === 403, "Student listing users returns 403 Forbidden");

    // --- 3. GET USER BY ID ---
    console.log("\n--- 3. Get User By ID (/api/users/:id) ---");
    // Admin gets any user
    const adminGetUserRes = await fetch(`${baseUrl}/api/users/${studentUser1._id}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(adminGetUserRes.status === 200, "Admin can get any user by ID");

    // Student gets own user
    const studentGetSelfRes = await fetch(`${baseUrl}/api/users/${studentUser1._id}`, {
      headers: { Authorization: `Bearer ${student1Token}` },
    });
    assert(studentGetSelfRes.status === 200, "Student can get their own user by ID");

    // Student gets another user -> 403
    const studentGetOtherRes = await fetch(`${baseUrl}/api/users/${studentUser2._id}`, {
      headers: { Authorization: `Bearer ${student1Token}` },
    });
    assert(studentGetOtherRes.status === 403, "Student accessing another user returns 403 Forbidden");

    // Invalid ObjectId format -> 400
    const invalidIdRes = await fetch(`${baseUrl}/api/users/not-a-valid-id`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const invalidIdData = await invalidIdRes.json();
    assert(invalidIdRes.status === 400, "Invalid ObjectId format returns 400 Bad Request");
    assert(
      invalidIdData.errors?.[0]?.message.includes("ObjectId"),
      "Error indicates invalid ObjectId"
    );

    // --- 4. UPDATE USER ---
    console.log("\n--- 4. Update User (/api/users/:id) ---");
    // Student updates own name and phone
    const studentUpdateRes = await fetch(`${baseUrl}/api/users/${studentUser1._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${student1Token}`,
      },
      body: JSON.stringify({
        name: "Student Tester 1 Renamed",
        phone: "5551234567",
        role: "admin", // Malicious escalation attempt
      }),
    });
    const studentUpdateData = await studentUpdateRes.json();
    assert(studentUpdateRes.status === 200, "Student updates own profile successfully");
    assert(studentUpdateData.data.name === "Student Tester 1 Renamed", "Name was updated");
    assert(studentUpdateData.data.role === "student", "Role escalation attempt by student is ignored");

    // Student attempts to update another user -> 403
    const studentHackRes = await fetch(`${baseUrl}/api/users/${studentUser2._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${student1Token}`,
      },
      body: JSON.stringify({ name: "Hacked Name" }),
    });
    assert(studentHackRes.status === 403, "Student updating another user returns 403 Forbidden");

    // --- 5. DELETE USER ---
    console.log("\n--- 5. Delete User (/api/users/:id) ---");
    // Admin cannot delete own account
    const selfDelRes = await fetch(`${baseUrl}/api/users/${adminUser._id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(selfDelRes.status === 400, "Admin deleting own account returns 400 Bad Request");

    // Student cannot delete
    const studentDelRes = await fetch(`${baseUrl}/api/users/${newUserId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${student1Token}` },
    });
    assert(studentDelRes.status === 403, "Student deleting user returns 403 Forbidden");

    // Admin deletes user
    const adminDelRes = await fetch(`${baseUrl}/api/users/${newUserId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(adminDelRes.status === 200, "Admin deletes user returns 200 OK");

    // --- 6. STUDENT PROFILE CRUD ---
    console.log("\n--- 6. Student Profile APIs (/api/students) ---");
    // Admin creates student profile
    const createStudRes = await fetch(`${baseUrl}/api/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        userId: studentUser1._id.toString(),
        rollNumber: "ROLL_TEST_101",
        department: testDept._id.toString(),
        semester: 3,
        batch: "2024-2028",
        address: "123 Campus Way",
        guardianName: "Jane Doe",
      }),
    });
    const createStudData = await createStudRes.json();
    assert(createStudRes.status === 201, "Admin creates student profile returns 201");
    assert(createStudData.data.rollNumber === "ROLL_TEST_101", "Roll number is saved");
    assert(createStudData.data.department.code === "TEST_DEPT", "Department is populated");

    const studentProfileId = createStudData.data._id;

    // Duplicate roll number rejected
    const dupRollRes = await fetch(`${baseUrl}/api/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        userId: studentUser2._id.toString(),
        rollNumber: "ROLL_TEST_101",
        department: testDept._id.toString(),
      }),
    });
    assert(dupRollRes.status === 409, "Duplicate rollNumber returns 409 Conflict");

    // Student gets own profile by student ID
    const getOwnStudRes = await fetch(`${baseUrl}/api/students/${studentProfileId}`, {
      headers: { Authorization: `Bearer ${student1Token}` },
    });
    assert(getOwnStudRes.status === 200, "Student gets own profile by Student ID");

    // Student gets own profile using their User ID (fallback)
    const getOwnStudByUserRes = await fetch(`${baseUrl}/api/students/${studentUser1._id}`, {
      headers: { Authorization: `Bearer ${student1Token}` },
    });
    assert(getOwnStudByUserRes.status === 200, "Student gets own profile by User ID");

    // Student 2 attempts to get Student 1's profile -> 403
    const getOtherStudRes = await fetch(`${baseUrl}/api/students/${studentProfileId}`, {
      headers: { Authorization: `Bearer ${student2Token}` },
    });
    assert(getOtherStudRes.status === 403, "Student accessing another student profile returns 403");

    // Faculty gets student profile -> 200
    const facultyGetStudRes = await fetch(`${baseUrl}/api/students/${studentProfileId}`, {
      headers: { Authorization: `Bearer ${facultyToken}` },
    });
    assert(facultyGetStudRes.status === 200, "Faculty member can view student profile");

    // Student updates own address
    const updateStudRes = await fetch(`${baseUrl}/api/students/${studentProfileId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${student1Token}`,
      },
      body: JSON.stringify({
        address: "Updated Address 456",
        semester: 8, // Student attempting to tamper semester
      }),
    });
    const updateStudData = await updateStudRes.json();
    assert(updateStudRes.status === 200, "Student updates own address successfully");
    assert(updateStudData.data.address === "Updated Address 456", "Address updated");
    assert(updateStudData.data.semester === 3, "Student cannot change their own semester");

    // --- 7. FACULTY PROFILE CRUD ---
    console.log("\n--- 7. Faculty Profile APIs (/api/faculty) ---");
    // Admin creates faculty profile
    const createFacRes = await fetch(`${baseUrl}/api/faculty`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        userId: facultyUser._id.toString(),
        employeeId: "EMP_TEST_001",
        department: testDept._id.toString(),
        designation: "Assistant Professor",
        qualification: "Ph.D in AI",
        specialization: "Deep Learning",
        officeLocation: "Building A, Room 204",
      }),
    });
    const createFacData = await createFacRes.json();
    assert(createFacRes.status === 201, "Admin creates faculty profile returns 201");
    assert(createFacData.data.employeeId === "EMP_TEST_001", "Employee ID is saved");

    const facultyProfileId = createFacData.data._id;

    // Faculty member updates own specialization
    const updateFacRes = await fetch(`${baseUrl}/api/faculty/${facultyProfileId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${facultyToken}`,
      },
      body: JSON.stringify({
        specialization: "Reinforcement Learning",
      }),
    });
    const updateFacData = await updateFacRes.json();
    assert(updateFacRes.status === 200, "Faculty updates own specialization");
    assert(
      updateFacData.data.specialization === "Reinforcement Learning",
      "Specialization updated"
    );

    // Get faculty profile
    const getFacRes = await fetch(`${baseUrl}/api/faculty/${facultyProfileId}`, {
      headers: { Authorization: `Bearer ${student1Token}` },
    });
    assert(getFacRes.status === 200, "Faculty profile can be viewed");

  } catch (err) {
    console.error("Test error:", err);
    failedCount++;
  } finally {
    try {
      await User.deleteMany({ email: /test.*@usercrud\.edu/i });
      await Department.deleteMany({ code: "TEST_DEPT" });
      await Student.deleteMany({ rollNumber: /ROLL_TEST/i });
      await Faculty.deleteMany({ employeeId: /EMP_TEST/i });
      console.log("\n[Cleanup] Test records cleaned from database.");
    } catch (cleanErr) {
      console.error("Cleanup error:", cleanErr);
    }

    if (server) server.close();
    await mongoose.connection.close();
    console.log("[Cleanup] Database closed.");

    console.log("\n=================================");
    console.log(`TASK 1 TEST SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED`);
    console.log("=================================");

    process.exit(failedCount > 0 ? 1 : 0);
  }
}

runTests();

