const express = require("express");
const {
  createPlacement,
  getPlacements,
  getPlacementById,
  getPlacementStats,
  updatePlacement,
  deletePlacement,
} = require("../controllers/placementController");

const router = express.Router();

router.route("/").post(createPlacement).get(getPlacements);

router.get("/stats", getPlacementStats);

router.route("/:id").get(getPlacementById).put(updatePlacement).delete(deletePlacement);

module.exports = router;
