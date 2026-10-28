
const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

// Create product - Admin only
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createProduct
);

// Get all products - Public
router.get("/", getProducts);

// Get one product - Public
router.get("/:id", getProductById);

// Update product - Admin only
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateProduct
);

// Delete product - Admin only
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteProduct
);

module.exports = router;
