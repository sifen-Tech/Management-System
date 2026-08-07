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

module.exports = {
  createMember,
};
