const express = require("express");
const { validateSignup } = require("../middleware/validationMiddleware");

const router = express.Router();

const { signup, login } = require("../controllers/authController");

router.post("/signup", validateSignup, signup);

router.post("/login", login);

module.exports = router;
