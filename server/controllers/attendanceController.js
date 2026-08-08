const Attendance = require("../models/Attendance");
const Member = require("../models/Member");

const markAttendance = async (req, res) => {
  try {
    const { member, date, status } = req.body;

    const attendance = await Attendance.create({
      member,
      date,
      status,
      markedBy: req.user.id,
    });

    const result = await Attendance.findById(attendance._id)
      .populate("member", "fullName email division year")
      .populate("markedBy", "fullName email role");

    res.status(201).json({
      message: "Attendance marked successfully",
      attendance: result,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate("member", "fullName email division year")
      .populate("markedBy", "fullName email role")
      .sort({ date: -1 });

    res.status(200).json({
      message: "Attendance retrieved successfully",
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const { status, date } = req.body;

    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      {
        status,
        date,
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("member", "fullName email division year")
      .populate("markedBy", "fullName email role");

    if (!attendance) {
      return res.status(404).json({
        message: "Attendance record not found",
      });
    }

    res.status(200).json({
      message: "Attendance updated successfully",
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  markAttendance,
  getAllAttendance,
  updateAttendance,
};
