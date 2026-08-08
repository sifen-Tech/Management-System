const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const { validateMember } = require("../middleware/validationMiddleware");

const {
  createMember,
  getAllMembers,
  getMemberById,
  updateMember,
  deleteMember,
} = require("../controllers/memberController");

router.post(
  "/",
  authMiddleware,
  authorize("admin", "supervisor"),
  validateMember,
  createMember,
);

router.get(
  "/",
  authMiddleware,
  authorize("admin", "supervisor", "user"),
  getAllMembers,
);

router.get(
  "/:id",
  authMiddleware,
  authorize("admin", "supervisor", "user"),
  getMemberById,
);

router.put(
  "/:id",
  authMiddleware,
  authorize("admin", "supervisor"),
  validateMember,
  updateMember,
);

router.delete("/:id", authMiddleware, authorize("admin"), deleteMember);

module.exports = router;
