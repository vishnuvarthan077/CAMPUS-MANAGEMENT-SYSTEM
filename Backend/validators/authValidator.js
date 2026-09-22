const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const validRoles = ["admin", "faculty", "student"];

const validateRegister = (req) => {
  const errors = [];
  const { name, email, password, role } = req.body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    errors.push({ field: "name", message: "Name is required" });
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

  return errors;
};

const validateLogin = (req) => {
  const errors = [];
  const { email, password } = req.body;

  if (!email || typeof email !== "string" || email.trim().length === 0) {
    errors.push({ field: "email", message: "Email is required" });
  }

  if (!password || typeof password !== "string") {
    errors.push({ field: "password", message: "Password is required" });
  }

  return errors;
};

const validateRefresh = (req) => {
  const errors = [];
  const { refreshToken } = req.body;

  if (!refreshToken || typeof refreshToken !== "string" || refreshToken.trim().length === 0) {
    errors.push({ field: "refreshToken", message: "Refresh token is required" });
  }

  return errors;
};

module.exports = {
  validateRegister,
  validateLogin,
  validateRefresh,
};

