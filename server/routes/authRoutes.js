const express = require("express");
const { validateSignup } = require("../middleware/validationMiddleware");

const router = express.Router();

const { signup, login, logout } = require("../controllers/authController");

router.post("/signup", validateSignup, signup);

router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
