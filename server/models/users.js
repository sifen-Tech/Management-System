const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character",
      ],
    },

    role: {
      type: String,
      enum: ["admin", "supervisor", "user"],
      default: "User",
    },

    division: {
      type: String,
      required: [true, "Division is required"],
      trim: true,
    },

    year: {
      type: String,
      required: [true, "Year is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
