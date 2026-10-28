
const express = require("express");
const router = express.Router();

const {
  createProfile,
  getMyProfile,
  updateMyProfile,
  deleteMyProfile
} = require("../controllers/userProfile");

const { protect } = require("../middleware/authMiddleware");

// All profile routes require login
router.post("/", protect, createProfile);
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);
router.delete("/me", protect, deleteMyProfile);

module.exports = router;
