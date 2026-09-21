const jwt = require("jsonwebtoken");

/**
 * Generate a short-lived JWT Access Token
 * Payload includes user ID and role for authorization checks
 */
const generateAccessToken = (user) => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new Error("JWT_ACCESS_SECRET is not defined in environment variables");
  }

  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    secret,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    }
  );
};

/**
 * Generate a long-lived JWT Refresh Token
 * Payload includes user ID
 */
const generateRefreshToken = (user) => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error("JWT_REFRESH_SECRET is not defined in environment variables");
  }

  return jwt.sign(
    {
      id: user._id,
    },
    secret,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    }
  );
};

/**
 * Verify JWT Access Token
 */
const verifyAccessToken = (token) => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new Error("JWT_ACCESS_SECRET is not defined in environment variables");
  }
  return jwt.verify(token, secret);
};

/**
 * Verify JWT Refresh Token
 */
const verifyRefreshToken = (token) => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error("JWT_REFRESH_SECRET is not defined in environment variables");
  }
  return jwt.verify(token, secret);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};

