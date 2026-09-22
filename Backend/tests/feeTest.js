require("dotenv").config();
const http = require("http");
const mongoose = require("mongoose");
const app = require("../app");
const connectDB = require("../config/db");
const User = require("../models/User");
const Fee = require("../models/Fee");
const { generateAccessToken } = require("../utils/generateToken");

async function runTests() {
  console.log("=== STARTING FEES & MOCK PAYMENT GATEWAY TESTS ===");
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

    // Clean test fee data
    await User.deleteMany({ email: /test.*@feetest\.edu/i });
    await Fee.deleteMany({ invoiceNumber: /TEST_INV/i });

    // Setup Admin and Two Students
    const adminUser = await User.create({
      name: "Fee Admin",
      email: "test.admin@feetest.edu",
      password: "password123",
      role: "admin",
    });
    const adminToken = generateAccessToken(adminUser);

    const studentUser1 = await User.create({
      name: "Fee Student 1",
      email: "test.student1@feetest.edu",
      password: "password123",
      role: "student",
    });
    const student1Token = generateAccessToken(studentUser1);

    const studentUser2 = await User.create({
      name: "Fee Student 2",
      email: "test.student2@feetest.edu",
      password: "password123",
      role: "student",
    });
    const student2Token = generateAccessToken(studentUser2);

    server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;
    baseUrl = `http://127.0.0.1:${port}`;
    console.log(`[Setup] Server running at ${baseUrl}\n`);

    // --- 1. INVOICE CREATION & VALIDATION ---
    console.log("--- 1. Invoice Creation & Validation (/api/fees) ---");
    const createFeeRes = await fetch(`${baseUrl}/api/fees`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        student: studentUser1._id.toString(),
        invoiceNumber: "TEST_INV_1001",
        title: "Semester 4 Tuition Fee",
        description: "Standard tuition and laboratory fee",
        amount: 25000,
        dueDate: "2026-10-15",
      }),
    });
    const createFeeData = await createFeeRes.json();
    assert(createFeeRes.status === 201, "Admin creates fee invoice returns 201 Created");
    assert(createFeeData.data.status === "PENDING", "Initial invoice status is PENDING");
    assert(createFeeData.data.student.email === "test.student1@feetest.edu", "Student populated correctly");

    const fee1Id = createFeeData.data._id;

    // Duplicate invoice number
    const dupInvoiceRes = await fetch(`${baseUrl}/api/fees`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        student: studentUser1._id.toString(),
        invoiceNumber: "TEST_INV_1001",
        title: "Duplicate Fee",
        amount: 5000,
        dueDate: "2026-10-15",
      }),
    });
    assert(dupInvoiceRes.status === 409, "Duplicate invoice number returns 409 Conflict");

    // Validation failure: Negative amount
    const invalidAmountRes = await fetch(`${baseUrl}/api/fees`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        student: studentUser1._id.toString(),
        invoiceNumber: "TEST_INV_1002",
        title: "Negative Fee",
        amount: -500,
        dueDate: "2026-10-15",
      }),
    });
    assert(invalidAmountRes.status === 400, "Negative amount in fee returns 400 Bad Request");

    // Student cannot create fee
    const studentCreateFeeRes = await fetch(`${baseUrl}/api/fees`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${student1Token}`,
      },
      body: JSON.stringify({
        student: studentUser1._id.toString(),
        invoiceNumber: "TEST_INV_1003",
        title: "Student Created Fee",
        amount: 5000,
        dueDate: "2026-10-15",
      }),
    });
    assert(studentCreateFeeRes.status === 403, "Student creating fee returns 403 Forbidden");

    // Create a fee for Student 2 as well
    const fee2Res = await fetch(`${baseUrl}/api/fees`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        student: studentUser2._id.toString(),
        invoiceNumber: "TEST_INV_2001",
        title: "Library Caution Deposit",
        amount: 3000,
        dueDate: "2026-10-20",
      }),
    });
    const fee2Data = await fee2Res.json();
    const fee2Id = fee2Data.data._id;

    // --- 2. RETRIEVAL & ROLE ISOLATION ---
    console.log("\n--- 2. Invoice Retrieval & Role-Based Isolation ---");
    // Admin sees all
    const adminListRes = await fetch(`${baseUrl}/api/fees`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const adminListData = await adminListRes.json();
    assert(adminListRes.status === 200, "Admin retrieves all fees");
    assert(adminListData.total >= 2, "Admin sees fees for multiple students");

    // Student 1 sees only own fee
    const student1ListRes = await fetch(`${baseUrl}/api/fees`, {
      headers: { Authorization: `Bearer ${student1Token}` },
    });
    const student1ListData = await student1ListRes.json();
    assert(student1ListRes.status === 200, "Student 1 retrieves own fees");
    assert(student1ListData.data.length === 1, "Student 1 sees only their own single invoice");
    assert(
      student1ListData.data[0].invoiceNumber === "TEST_INV_1001",
      "Invoice matches Student 1 invoice number"
    );

    // Student 1 accesses own fee by ID -> 200
    const student1GetSelfRes = await fetch(`${baseUrl}/api/fees/${fee1Id}`, {
      headers: { Authorization: `Bearer ${student1Token}` },
    });
    assert(student1GetSelfRes.status === 200, "Student gets own fee by ID");

    // Student 1 attempts to access Student 2's fee by ID -> 403 Forbidden
    const student1GetOtherRes = await fetch(`${baseUrl}/api/fees/${fee2Id}`, {
      headers: { Authorization: `Bearer ${student1Token}` },
    });
    assert(student1GetOtherRes.status === 403, "Student accessing another student's fee returns 403");

    // --- 3. MOCK PAYMENT EXECUTION ---
    console.log("\n--- 3. Mock Payment Gateway Execution (/api/fees/:id/pay) ---");
    // Student 1 attempts to pay Student 2's invoice -> 403
    const unauthorizedPayRes = await fetch(`${baseUrl}/api/fees/${fee2Id}/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${student1Token}`,
      },
      body: JSON.stringify({ paymentMethod: "UPI" }),
    });
    assert(unauthorizedPayRes.status === 403, "Student paying another's invoice returns 403 Forbidden");

    // Student 1 pays own invoice via Mock Gateway
    const payRes = await fetch(`${baseUrl}/api/fees/${fee1Id}/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${student1Token}`,
      },
      body: JSON.stringify({ paymentMethod: "UPI" }),
    });
    const payData = await payRes.json();
    assert(payRes.status === 200, "Payment simulation returns 200 OK");
    assert(payData.status === "SUCCESS", "Payment status is SUCCESS");
    assert(
      payData.transaction.transactionId.startsWith("TXN_MOCK_"),
      "Simulated transaction ID is generated"
    );
    assert(payData.transaction.isSimulation === true, "Response clarifies it is a simulation");

    // Verify invoice status in database is now PAID
    const verifiedFee = await Fee.findById(fee1Id);
    assert(verifiedFee.status === "PAID", "Invoice status in DB is updated to PAID");
    assert(verifiedFee.transactionId === payData.transaction.transactionId, "Transaction ID stored in DB");
    assert(verifiedFee.paidAt instanceof Date, "paidAt timestamp stored in DB");

    // Paying an already PAID invoice -> 400 Bad Request
    const repayRes = await fetch(`${baseUrl}/api/fees/${fee1Id}/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${student1Token}`,
      },
      body: JSON.stringify({ paymentMethod: "Credit Card" }),
    });
    assert(repayRes.status === 400, "Attempting to pay an already PAID invoice returns 400 Bad Request");

    // Admin attempts to delete a PAID invoice -> 400 Bad Request
    const delPaidRes = await fetch(`${baseUrl}/api/fees/${fee1Id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(delPaidRes.status === 400, "Admin deleting a PAID invoice returns 400 Bad Request");

    // --- 4. PAYMENT RECEIPT ENDPOINT ---
    console.log("\n--- 4. Payment Receipt (/api/fees/:id/payment) ---");
    const receiptRes = await fetch(`${baseUrl}/api/fees/${fee1Id}/payment`, {
      headers: { Authorization: `Bearer ${student1Token}` },
    });
    const receiptData = await receiptRes.json();
    assert(receiptRes.status === 200, "Receipt retrieval returns 200 OK");
    assert(receiptData.data.status === "SUCCESS", "Receipt status is SUCCESS");
    assert(receiptData.data.amount === 25000, "Receipt amount matches invoice amount");
    assert(receiptData.data.isSimulation === true, "Receipt explicitly marks simulated payment");

    // Unpaid invoice receipt -> 400 Bad Request
    const unpaidReceiptRes = await fetch(`${baseUrl}/api/fees/${fee2Id}/payment`, {
      headers: { Authorization: `Bearer ${student2Token}` },
    });
    assert(unpaidReceiptRes.status === 400, "Receipt request on unpaid invoice returns 400");

  } catch (err) {
    console.error("Test error:", err);
    failedCount++;
  } finally {
    try {
      await User.deleteMany({ email: /test.*@feetest\.edu/i });
      await Fee.deleteMany({ invoiceNumber: /TEST_INV/i });
      console.log("\n[Cleanup] Test records cleaned.");
    } catch (cleanErr) {
      console.error("Cleanup error:", cleanErr);
    }

    if (server) server.close();
    await mongoose.connection.close();
    console.log("[Cleanup] Database closed.");

    console.log("\n=================================");
    console.log(`TASK 4 TEST SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED`);
    console.log("=================================");

    process.exit(failedCount > 0 ? 1 : 0);
  }
}

runTests();

