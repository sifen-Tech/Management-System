const express = require("express");
const cors = require("cors");
const errorMiddleware = require("./middleware/errorMiddleware");
require("dotenv").config();

const connectDB = require("./config/db");

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("Role-Based Management System API is running...");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
