const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  markAttendance,
  getAllAttendance,
  updateAttendance,
} = require("../controllers/attendanceController");

router.post(
  "/",
  authMiddleware,
  authorize("admin", "supervisor"),
  markAttendance,
);

router.get(
  "/",
  authMiddleware,
  authorize("admin", "supervisor"),
  getAllAttendance,
);

router.put(
  "/:id",
  authMiddleware,
  authorize("admin", "supervisor"),
  updateAttendance,
);

module.exports = router;
