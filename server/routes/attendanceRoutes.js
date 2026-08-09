const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const { validateAttendance } = require("../middleware/validationMiddleware");

const {
  markAttendance,
  getAllAttendance,
  updateAttendance,
} = require("../controllers/attendanceController");

router.post(
  "/",
  authMiddleware,
  authorize("admin", "supervisor"),
  validateAttendance,
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
  validateAttendance,
  updateAttendance,
);

module.exports = router;
