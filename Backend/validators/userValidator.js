const mongoose = require("mongoose");

const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const validRoles = ["admin", "faculty", "student"];

const validateCreateUser = (req) => {
  const errors = [];
  const { name, email, password, role, phone } = req.body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    errors.push({ field: "name", message: "Name is required" });
  } else if (name.trim().length > 100) {
    errors.push({ field: "name", message: "Name cannot exceed 100 characters" });
  }

  if (!email || typeof email !== "string" || email.trim().length === 0) {
    errors.push({ field: "email", message: "Email is required" });
  } else if (!emailRegex.test(email.trim())) {
    errors.push({ field: "email", message: "Valid email is required" });
  }

  if (!password || typeof password !== "string") {
    errors.push({ field: "password", message: "Password is required" });
  } else if (password.length < 6) {
    errors.push({ field: "password", message: "Password must be at least 6 characters" });
  }

  if (role !== undefined && role !== null) {
    if (!validRoles.includes(String(role).toLowerCase())) {
      errors.push({
        field: "role",
        message: `Role must be one of: ${validRoles.join(", ")}`,
      });
    }
  }

  if (phone !== undefined && phone !== null && phone !== "") {
    if (typeof phone !== "string" || phone.length < 7 || phone.length > 20) {
      errors.push({ field: "phone", message: "Phone number must be between 7 and 20 characters" });
    }
  }

  return errors;
};

const validateUpdateUser = (req) => {
  const errors = [];
  const { name, email, password, role, phone, isActive } = req.body;

  if (
    name === undefined &&
    email === undefined &&
    password === undefined &&
    role === undefined &&
    phone === undefined &&
    isActive === undefined
  ) {
    errors.push({ field: "body", message: "At least one field must be provided to update" });
    return errors;
  }

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length === 0) {
      errors.push({ field: "name", message: "Name cannot be empty" });
    } else if (name.trim().length > 100) {
      errors.push({ field: "name", message: "Name cannot exceed 100 characters" });
    }
  }

  if (email !== undefined) {
    if (!emailRegex.test(String(email).trim())) {
      errors.push({ field: "email", message: "Valid email is required" });
    }
  }

  if (password !== undefined) {
    if (typeof password !== "string" || password.length < 6) {
      errors.push({ field: "password", message: "Password must be at least 6 characters" });
    }
  }

  if (role !== undefined) {
    if (!validRoles.includes(String(role).toLowerCase())) {
      errors.push({
        field: "role",
        message: `Role must be one of: ${validRoles.join(", ")}`,
      });
    }
  }

  if (phone !== undefined && phone !== null && phone !== "") {
    if (typeof phone !== "string" || phone.length < 7 || phone.length > 20) {
      errors.push({ field: "phone", message: "Phone number must be between 7 and 20 characters" });
    }
  }

  if (isActive !== undefined && typeof isActive !== "boolean") {
    errors.push({ field: "isActive", message: "isActive must be a boolean" });
  }

  return errors;
};

const validateCreateStudent = (req) => {
  const errors = [];
  const { userId, rollNumber, department, semester } = req.body;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    errors.push({ field: "userId", message: "Valid User ObjectId is required" });
  }

  if (!rollNumber || typeof rollNumber !== "string" || rollNumber.trim().length === 0) {
    errors.push({ field: "rollNumber", message: "Roll number is required" });
  }

  if (!department || !mongoose.Types.ObjectId.isValid(department)) {
    errors.push({ field: "department", message: "Valid Department ObjectId is required" });
  }

  if (semester !== undefined) {
    const semNum = Number(semester);
    if (isNaN(semNum) || semNum < 1 || semNum > 8) {
      errors.push({ field: "semester", message: "Semester must be a number between 1 and 8" });
    }
  }

  return errors;
};

const validateUpdateStudent = (req) => {
  const errors = [];
  const { department, semester, gender } = req.body;

  if (department !== undefined && !mongoose.Types.ObjectId.isValid(department)) {
    errors.push({ field: "department", message: "Valid Department ObjectId is required" });
  }

  if (semester !== undefined) {
    const semNum = Number(semester);
    if (isNaN(semNum) || semNum < 1 || semNum > 8) {
      errors.push({ field: "semester", message: "Semester must be a number between 1 and 8" });
    }
  }

  if (gender !== undefined && !["Male", "Female", "Other"].includes(gender)) {
    errors.push({ field: "gender", message: "Gender must be Male, Female, or Other" });
  }

  return errors;
};

const validateCreateFaculty = (req) => {
  const errors = [];
  const { userId, employeeId, department, designation } = req.body;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    errors.push({ field: "userId", message: "Valid User ObjectId is required" });
  }

  if (!employeeId || typeof employeeId !== "string" || employeeId.trim().length === 0) {
    errors.push({ field: "employeeId", message: "Employee ID is required" });
  }

  if (!department || !mongoose.Types.ObjectId.isValid(department)) {
    errors.push({ field: "department", message: "Valid Department ObjectId is required" });
  }

  if (!designation || typeof designation !== "string" || designation.trim().length === 0) {
    errors.push({ field: "designation", message: "Designation is required" });
  }

  return errors;
};

const validateUpdateFaculty = (req) => {
  const errors = [];
  const { department } = req.body;

  if (department !== undefined && !mongoose.Types.ObjectId.isValid(department)) {
    errors.push({ field: "department", message: "Valid Department ObjectId is required" });
  }

  return errors;
};

module.exports = {
  validateCreateUser,
  validateUpdateUser,
  validateCreateStudent,
  validateUpdateStudent,
  validateCreateFaculty,
  validateUpdateFaculty,
};

