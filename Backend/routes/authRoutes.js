const express = require("express");
const {
  register,
  login,
  refresh,
  logout,
  getMe,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

// Public auth routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

// Protected routes
router.get("/me", protect, getMe);

// Verification route for role-based authorization testing
router.get("/admin-only", protect, authorizeRoles("admin"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin access granted",
    user: { id: req.user._id, role: req.user.role },
  });
});

module.exports = router;

