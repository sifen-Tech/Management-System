const Member = require("../models/Member");

const createMember = async (req, res) => {
  try {
    const { fullName, email, phone, division, year } = req.body;

    const member = await Member.create({
      fullName,
      email,
      phone,
      division,
      year,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Member created successfully",
      member,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllMembers = async (req, res) => {
  try {
    const members = await Member.find().populate(
      "createdBy",
      "fullName email role",
    );

    res.status(200).json({
      message: "Members retrieved successfully",
      members,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Get member by ID
const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id).populate(
      "createdBy",
      "fullName email role",
    );

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    res.status(200).json({
      message: "Member retrieved successfully",
      member,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("createdBy", "fullName email role");

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    res.status(200).json({
      message: "Member updated successfully",
      member,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    res.status(200).json({
      message: "Member deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  createMember,
  getAllMembers,
  getMemberById,
  updateMember,
  deleteMember,
};
