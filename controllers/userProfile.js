
const UserProfile = require("../models/userProfile");

// CREATE PROFILE
const createProfile = async (req, res) => {
  try {
    const { phone, address, dateOfBirth } = req.body;

    const existingProfile = await UserProfile.findOne({
      user: req.user._id
    });

    if (existingProfile) {
      return res.status(409).json({
        message: "Profile already exists. Please update it."
      });
    }

    const profile = await UserProfile.create({
      user: req.user._id,
      phone,
      address,
      dateOfBirth
    });

    res.status(201).json({
      message: "Profile created successfully",
      profile
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create profile",
      error: error.message
    });
  }
};

// GET MY PROFILE
const getMyProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({
      user: req.user._id
    }).populate("user", "name email");

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found. Please create one."
      });
    }

    res.status(200).json({ profile });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch profile",
      error: error.message
    });
  }
};

// UPDATE MY PROFILE
const updateMyProfile = async (req, res) => {
  try {
    const allowedFields = ["phone", "address", "dateOfBirth"];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const profile = await UserProfile.findOneAndUpdate(
      { user: req.user._id },
      { $set: updates },
      { new: true, runValidators: true }
    ).populate("user", "name email");

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found. Please create one first."
      });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      profile
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update profile",
      error: error.message
    });
  }
};

// DELETE MY PROFILE
const deleteMyProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOneAndDelete({
      user: req.user._id
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found"
      });
    }

    res.status(200).json({
      message: "Profile deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete profile",
      error: error.message
    });
  }
};

module.exports = {
  createProfile,
  getMyProfile,
  updateMyProfile,
  deleteMyProfile
};
