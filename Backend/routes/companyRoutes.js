const express = require("express");
const {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
} = require("../controllers/companyController");

const router = express.Router();

router.route("/").post(createCompany).get(getCompanies);

router.route("/:id").get(getCompanyById).put(updateCompany).delete(deleteCompany);

module.exports = router;
