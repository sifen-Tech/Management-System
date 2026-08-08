const validateSignup = (req, res, next) => {
  const { fullName, email, password, division, year } = req.body;

  const errors = {};

  if (!fullName || !fullName.trim()) {
    errors.fullName = "Full name is required";
  }

  if (!email || !email.trim()) {
    errors.email = "Email is required";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      errors.email = "Please enter a valid email address";
    }
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  } else if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password)
  ) {
    errors.password =
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character";
  }

  if (!division || !division.trim()) {
    errors.division = "Division is required";
  }

  if (!year || !String(year).trim()) {
    errors.year = "Year is required";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};
const validateMember = (req, res, next) => {
  const { fullName, email, phone, division, year } = req.body;

  const errors = {};

  if (!fullName || !fullName.trim()) {
    errors.fullName = "Full name is required";
  }

  if (!email || !email.trim()) {
    errors.email = "Email is required";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      errors.email = "Please enter a valid email address";
    }
  }

  if (!phone || !String(phone).trim()) {
    errors.phone = "Phone number is required";
  }

  if (!division || !division.trim()) {
    errors.division = "Division is required";
  }

  if (year === undefined || year === null || String(year).trim() === "") {
    errors.year = "Year is required";
  } else if (isNaN(Number(year))) {
    errors.year = "Year must be a number";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};
const mongoose = require("mongoose");

const validateAttendance = (req, res, next) => {
  const { member, date, status } = req.body;

  const errors = {};

  if (!member) {
    errors.member = "Member ID is required";
  } else if (!mongoose.Types.ObjectId.isValid(member)) {
    errors.member = "Invalid member ID";
  }

  if (date !== undefined && date !== null && date !== "") {
    if (isNaN(Date.parse(date))) {
      errors.date = "Please provide a valid date";
    }
  }

  if (!status) {
    errors.status = "Attendance status is required";
  } else if (!["present", "absent"].includes(status)) {
    errors.status = "Status must be either present or absent";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

module.exports = {
  validateSignup,
  validateMember,
  validateAttendance,
};
