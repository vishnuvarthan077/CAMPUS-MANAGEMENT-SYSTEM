const express = require("express");
const {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController");

const router = express.Router();

router.route("/").post(createDepartment).get(getDepartments);

router.route("/:id").get(getDepartmentById).put(updateDepartment).delete(deleteDepartment);

module.exports = router;
