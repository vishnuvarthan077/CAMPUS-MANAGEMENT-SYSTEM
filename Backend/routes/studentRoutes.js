const express = require("express");
const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { validate, validateObjectId } = require("../middleware/validationMiddleware");
const {
  validateCreateStudent,
  validateUpdateStudent,
} = require("../validators/userValidator");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .post(authorizeRoles("admin"), validate(validateCreateStudent), createStudent)
  .get(authorizeRoles("admin", "faculty"), getStudents);

router
  .route("/:id")
  .get(validateObjectId("id"), getStudentById)
  .put(validateObjectId("id"), validate(validateUpdateStudent), updateStudent)
  .delete(authorizeRoles("admin"), validateObjectId("id"), deleteStudent);

module.exports = router;

