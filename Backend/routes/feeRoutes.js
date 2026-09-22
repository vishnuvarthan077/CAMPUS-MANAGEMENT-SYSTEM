const express = require("express");
const {
  createFee,
  getFees,
  getFeeById,
  updateFee,
  deleteFee,
  payFee,
  getFeePayment,
} = require("../controllers/feeController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { validate, validateObjectId } = require("../middleware/validationMiddleware");
const {
  validateCreateFee,
  validateUpdateFee,
  validatePayFee,
} = require("../validators/feeValidator");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .post(authorizeRoles("admin"), validate(validateCreateFee), createFee)
  .get(getFees);

router
  .route("/:id")
  .get(validateObjectId("id"), getFeeById)
  .put(authorizeRoles("admin"), validateObjectId("id"), validate(validateUpdateFee), updateFee)
  .delete(authorizeRoles("admin"), validateObjectId("id"), deleteFee);

router
  .route("/:id/pay")
  .post(validateObjectId("id"), validate(validatePayFee), payFee);

router
  .route("/:id/payment")
  .get(validateObjectId("id"), getFeePayment);

module.exports = router;

