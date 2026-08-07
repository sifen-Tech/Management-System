const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const { createMember } = require("../controllers/memberController");

// Create member
router.post(
  "/",
  authMiddleware,
  authorize("admin", "supervisor"),
  createMember,
);

module.exports = router;
