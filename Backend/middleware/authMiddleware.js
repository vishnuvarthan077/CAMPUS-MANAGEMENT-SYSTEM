const User = require("../models/User");
const { verifyAccessToken } = require("../utils/generateToken");

/**
 * Protect routes: verifies access token in Authorization header
 */
const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. No access token provided.",
    });
  }

  try {
    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account no longer exists.",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User account is deactivated. Please contact an administrator.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Access token has expired. Please refresh your token.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid access token.",
    });
  }
};

module.exports = { protect };

