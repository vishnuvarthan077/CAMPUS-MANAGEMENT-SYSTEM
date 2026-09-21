const express = require("express");
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const router = express.Router();

router.route("/").post(createCourse).get(getCourses);

router.route("/:id").get(getCourseById).put(updateCourse).delete(deleteCourse);

module.exports = router;
