const express = require("express");
const {
  createDrive,
  getDrives,
  getDriveById,
  updateDrive,
  deleteDrive,
} = require("../controllers/driveController");

const router = express.Router();

router.route("/").post(createDrive).get(getDrives);

router.route("/:id").get(getDriveById).put(updateDrive).delete(deleteDrive);

module.exports = router;
