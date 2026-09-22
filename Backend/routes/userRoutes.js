const express = require("express");
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { validate, validateObjectId } = require("../middleware/validationMiddleware");
const {
  validateCreateUser,
  validateUpdateUser,
} = require("../validators/userValidator");

const router = express.Router();

// All user routes require authentication
router.use(protect);

router
  .route("/")
  .post(authorizeRoles("admin"), validate(validateCreateUser), createUser)
  .get(authorizeRoles("admin"), getUsers);

router
  .route("/:id")
  .get(validateObjectId("id"), getUserById)
  .put(validateObjectId("id"), validate(validateUpdateUser), updateUser)
  .delete(authorizeRoles("admin"), validateObjectId("id"), deleteUser);

module.exports = router;

