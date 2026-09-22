const express = require("express");
const {
  createFaculty,
  getFaculties,
  getFacultyById,
  updateFaculty,
  deleteFaculty,
} = require("../controllers/facultyController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { validate, validateObjectId } = require("../middleware/validationMiddleware");
const {
  validateCreateFaculty,
  validateUpdateFaculty,
} = require("../validators/userValidator");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .post(authorizeRoles("admin"), validate(validateCreateFaculty), createFaculty)
  .get(getFaculties);

router
  .route("/:id")
  .get(validateObjectId("id"), getFacultyById)
  .put(validateObjectId("id"), validate(validateUpdateFaculty), updateFaculty)
  .delete(authorizeRoles("admin"), validateObjectId("id"), deleteFaculty);

module.exports = router;

