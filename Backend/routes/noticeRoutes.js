const express = require("express");
const {
  createNotice,
  getNotices,
  getNoticeById,
  updateNotice,
  togglePinNotice,
  deleteNotice,
} = require("../controllers/noticeController");

const router = express.Router();

router.route("/").post(createNotice).get(getNotices);

router.route("/:id").get(getNoticeById).put(updateNotice).delete(deleteNotice);

router.patch("/:id/pin", togglePinNotice);

module.exports = router;
