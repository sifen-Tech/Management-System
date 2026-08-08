const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

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
  updateMember,
);
router.delete("/:id", authMiddleware, authorize("admin"), deleteMember);
module.exports = router;
