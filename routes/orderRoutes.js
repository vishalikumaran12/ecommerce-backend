
const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
} = require("../controllers/orderController");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

// Create order - Logged-in users
router.post("/", protect, createOrder);

// Get logged-in user's orders
router.get("/my-orders", protect, getMyOrders);

// Get all orders - Admin only
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getAllOrders
);

// Update order status - Admin only
router.put(
  "/:id/status",
  protect,
  authorizeRoles("admin"),
  updateOrderStatus
);

module.exports = router;
