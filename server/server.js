const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const errorMiddleware = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const memberRoutes = require("./routes/memberRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

connectDB();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      process.env.CLIENT_URL,
    ].filter(Boolean),
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/users", userRoutes);

app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Role-Based Management System API is running...",
  });
});

app.use(errorMiddleware);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
