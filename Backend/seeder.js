require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");
const Department = require("./models/Department");
const Course = require("./models/Course");
const Student = require("./models/Student");
const Faculty = require("./models/Faculty");
const Fee = require("./models/Fee");

const dummyUsers = [
  {
    name: "System Administrator",
    email: "admin@campus.edu",
    password: "Admin@123",
    role: "admin",
    phone: "9876543210",
  },
  {
    name: "Dr. Robert Smith",
    email: "faculty@campus.edu",
    password: "Faculty@123",
    role: "faculty",
    phone: "9876543211",
  },
  {
    name: "Alice Johnson",
    email: "student@campus.edu",
    password: "Student@123",
    role: "student",
    phone: "9876543212",
  },
  {
    name: "John Doe",
    email: "john.student@campus.edu",
    password: "Student@123",
    role: "student",
    phone: "9876543213",
  },
];

const dummyDepartments = [
  {
    name: "Computer Science and Engineering",
    code: "CSE",
    description: "Department of Computer Science and Engineering",
    headOfDepartment: "Dr. Alan Turing",
    establishedYear: 2005,
    isActive: true,
  },
  {
    name: "Electronics and Communication Engineering",
    code: "ECE",
    description: "Department of Electronics and Communication Engineering",
    headOfDepartment: "Dr. Claude Shannon",
    establishedYear: 2008,
    isActive: true,
  },
  {
    name: "Information Technology",
    code: "IT",
    description: "Department of Information Technology",
    headOfDepartment: "Dr. Grace Hopper",
    establishedYear: 2012,
    isActive: true,
  },
];

const importData = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB for data seeding...");

    // Clear existing data
    await User.deleteMany();
    await Department.deleteMany();
    await Course.deleteMany();
    await Student.deleteMany();
    await Faculty.deleteMany();
    await Fee.deleteMany();
    console.log("Existing data cleared.");

    // 1. Seed Users (pre-save hook hashes the passwords)
    const createdUsers = await User.create(dummyUsers);
    console.log(`✓ Seeded ${createdUsers.length} users (Admin, Faculty, Student)`);

    const adminUser = createdUsers.find((u) => u.email === "admin@campus.edu");
    const facultyUser = createdUsers.find((u) => u.email === "faculty@campus.edu");
    const studentAlice = createdUsers.find((u) => u.email === "student@campus.edu");
    const studentJohn = createdUsers.find((u) => u.email === "john.student@campus.edu");

    // 2. Seed Departments
    const createdDepartments = await Department.create(dummyDepartments);
    console.log(`✓ Seeded ${createdDepartments.length} departments (CSE, ECE, IT)`);

    const cseDept = createdDepartments.find((d) => d.code === "CSE");
    const eceDept = createdDepartments.find((d) => d.code === "ECE");
    const itDept = createdDepartments.find((d) => d.code === "IT");

    // 3. Seed Courses linked to departments
    const dummyCourses = [
      {
        name: "Data Structures and Algorithms",
        code: "CS201",
        department: cseDept._id,
        description: "Fundamental data structures, sorting, searching, and algorithmic analysis.",
        credits: 4,
        semester: 3,
        courseType: "Core",
        seatsAvailable: 60,
      },
      {
        name: "Database Management Systems",
        code: "CS301",
        department: cseDept._id,
        description: "Relational database concepts, SQL, transactions, normalization, and indexing.",
        credits: 4,
        semester: 4,
        courseType: "Core",
        seatsAvailable: 60,
      },
      {
        name: "Full Stack Web Development Lab",
        code: "CS302L",
        department: cseDept._id,
        description: "Hands-on lab for building web applications using modern JavaScript stacks.",
        credits: 2,
        semester: 4,
        courseType: "Lab",
        seatsAvailable: 40,
      },
      {
        name: "Digital Signal Processing",
        code: "EC201",
        department: eceDept._id,
        description: "Discrete-time signals, Z-transforms, digital filters, and FFT algorithms.",
        credits: 3,
        semester: 3,
        courseType: "Core",
        seatsAvailable: 50,
      },
      {
        name: "Cloud Computing Architectures",
        code: "IT401",
        department: itDept._id,
        description: "Cloud virtualization, microservices, containerization, and distributed systems.",
        credits: 3,
        semester: 7,
        courseType: "Elective",
        seatsAvailable: 45,
      },
    ];

    const createdCourses = await Course.create(dummyCourses);
    console.log(`✓ Seeded ${createdCourses.length} courses linked to departments`);

    // 4. Seed Faculty Profile
    const createdFaculty = await Faculty.create({
      user: facultyUser._id,
      employeeId: "FAC_CSE_001",
      department: cseDept._id,
      designation: "Professor",
      qualification: "Ph.D in Computer Science",
      specialization: "Distributed Systems & Cloud Computing",
      officeLocation: "Turing Block, Room 302",
    });
    console.log(`✓ Seeded faculty profile for ${facultyUser.name} (${createdFaculty.employeeId})`);

    // 5. Seed Student Profiles
    const createdStudents = await Student.create([
      {
        user: studentAlice._id,
        rollNumber: "2024CSE001",
        department: cseDept._id,
        semester: 4,
        batch: "2024-2028",
        gender: "Female",
        address: "42 Knowledge Ave, Silicon City",
        guardianName: "Mark Johnson",
        guardianPhone: "9876500001",
      },
      {
        user: studentJohn._id,
        rollNumber: "2024IT002",
        department: itDept._id,
        semester: 4,
        batch: "2024-2028",
        gender: "Male",
        address: "7 Tech Park Blvd, Cyber City",
        guardianName: "David Doe",
        guardianPhone: "9876500002",
      },
    ]);
    console.log(`✓ Seeded ${createdStudents.length} student profiles (Alice & John)`);

    // 6. Seed Fee Invoices
    const createdFees = await Fee.create([
      {
        student: studentAlice._id,
        invoiceNumber: "INV-2026-001",
        title: "Semester 4 Tuition Fee",
        description: "Regular academic tuition fee for Semester 4",
        amount: 35000,
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        status: "PENDING",
      },
      {
        student: studentAlice._id,
        invoiceNumber: "INV-2026-002",
        title: "Semester 3 Tuition Fee",
        description: "Previous semester tuition fee",
        amount: 35000,
        dueDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        status: "PAID",
        paymentMethod: "UPI",
        transactionId: "TXN_MOCK_SEED_PAID_001",
        paidAt: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000),
      },
      {
        student: studentJohn._id,
        invoiceNumber: "INV-2026-003",
        title: "Semester 4 Tuition Fee",
        description: "Regular academic tuition fee for Semester 4",
        amount: 35000,
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        status: "PENDING",
      },
    ]);
    console.log(`✓ Seeded ${createdFees.length} fee invoices`);

    console.log("\n================ DUMMY DATA SEEDING COMPLETE ================");
    console.log("Test Login Accounts:");
    console.log("  1. Admin:   admin@campus.edu   / Admin@123   (Role: admin)");
    console.log("  2. Faculty: faculty@campus.edu / Faculty@123 (Role: faculty)");
    console.log("  3. Student: student@campus.edu / Student@123 (Role: student)");
    console.log("  4. Student: john.student@campus.edu / Student@123 (Role: student)");
    console.log("=============================================================\n");

    process.exit(0);
  } catch (error) {
    console.error(`Error during data seeding: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Department.deleteMany();
    await Course.deleteMany();
    console.log("All users, departments, and courses destroyed from database.");
    await Student.deleteMany();
    await Faculty.deleteMany();
    await Fee.deleteMany();
    console.log("All data destroyed from database.");
    process.exit(0);
  } catch (error) {
    console.error(`Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}

