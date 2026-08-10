const Attendance = require("../models/Attendance");
const Member = require("../models/Member");

const markAttendance = async (req, res) => {
  try {
    console.log("Authenticated user:", req.user);

    const { member, date, status } = req.body;

    const attendanceDate = date ? new Date(date) : new Date();

    attendanceDate.setHours(0, 0, 0, 0);

    const existingMember = await Member.findById(member);

    if (!existingMember) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    const attendance = await Attendance.create({
      member,
      date: attendanceDate,
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
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Attendance has already been marked for this member today",
      });
    }

    console.error("Mark attendance error:", error);

    res.status(500).json({
      success: false,
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
    console.error("Get attendance error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const { status, date } = req.body;

    const updateData = {};

    if (status !== undefined) {
      updateData.status = status;
    }

    if (date !== undefined) {
      const attendanceDate = new Date(date);
      attendanceDate.setHours(0, 0, 0, 0);
      updateData.date = attendanceDate;
    }

    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("member", "fullName email division year")
      .populate("markedBy", "fullName email role");

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    res.status(200).json({
      message: "Attendance updated successfully",
      attendance,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "Attendance has already been marked for this member on this date",
      });
    }

    console.error("Update attendance error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  markAttendance,
  getAllAttendance,
  updateAttendance,
};
