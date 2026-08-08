const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

router.get("/", authMiddleware, authorize("admin"), getAllUsers);
router.get("/:id", authMiddleware, authorize("admin"), getUserById);
router.put("/:id", authMiddleware, authorize("admin"), updateUser);
router.delete("/:id", authMiddleware, authorize("admin"), deleteUser);

module.exports = router;
