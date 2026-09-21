/**
 * Role-based authorization middleware
 * @param  {...string} roles - Allowed roles (e.g., "admin", "faculty", "student")
 */
const authorizeRoles = (...roles) => {
  const normalizedRoles = roles.map((role) => role.toLowerCase());

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required before checking permissions.",
      });
    }

    const userRole = (req.user.role || "").toLowerCase();

    if (!normalizedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${req.user.role}' is not authorized to perform this action.`,
      });
    }

    next();
  };
};

module.exports = { authorizeRoles };

