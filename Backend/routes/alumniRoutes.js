const express = require("express");
const {
  registerAlumni,
  getAlumni,
  getAlumniById,
  updateAlumni,
  toggleVerifyAlumni,
  deleteAlumni,
} = require("../controllers/alumniController");

const router = express.Router();

router.route("/").post(registerAlumni).get(getAlumni);

router.route("/:id").get(getAlumniById).put(updateAlumni).delete(deleteAlumni);

router.patch("/:id/verify", toggleVerifyAlumni);

module.exports = router;
