require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");
const Department = require("./models/Department");
const Course = require("./models/Course");

const dummyUsers = [
  {
    name: "System Administrator",
    email: "admin@campus.edu",
    password: "Admin@123",
    role: "admin",
  },
  {
    name: "Dr. Robert Smith",
    email: "faculty@campus.edu",
    password: "Faculty@123",
    role: "faculty",
  },
  {
    name: "Alice Johnson",
    email: "student@campus.edu",
    password: "Student@123",
    role: "student",
  },
  {
    name: "John Doe",
    email: "john.student@campus.edu",
    password: "Student@123",
    role: "student",
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
    console.log("Existing data cleared.");

    // 1. Seed Users (pre-save hook hashes the passwords)
    const createdUsers = await User.create(dummyUsers);
    console.log(`✓ Seeded ${createdUsers.length} users (Admin, Faculty, Student)`);

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

