
const Order = require("../models/order");
const Product = require("../models/product");

// CREATE ORDER
const createOrder = async (req, res) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        message: "At least one product is required"
      });
    }

    let totalAmount = 0;
    const orderProducts = [];

    for (const item of products) {
      if (!item.product || !Number.isInteger(item.quantity) ||
          item.quantity < 1) {
        return res.status(400).json({
          message: "Each product needs a valid product ID and quantity"
        });
      }

      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          message: `Product not found: ${item.product}`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`
        });
      }

      totalAmount += product.price * item.quantity;

      orderProducts.push({
        product: product._id,
        quantity: item.quantity
      });
    }

    // Reduce stock only after all products pass validation
    for (const item of orderProducts) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          stock: -item.quantity
        }
      });
    }

    const order = await Order.create({
      user: req.user._id,
      products: orderProducts,
      totalAmount
    });

    res.status(201).json({
      message: "Order created successfully",
      order
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create order",
      error: error.message
    });
  }
};

// GET LOGGED-IN USER'S ORDERS
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id
    }).populate("products.product", "name price");

    res.status(200).json({
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message
    });
  }
};

// GET ALL ORDERS - ADMIN ONLY
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("products.product", "name price");

    res.status(200).json({
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch all orders",
      error: error.message
    });
  }
};

// UPDATE ORDER STATUS - ADMIN ONLY
const updateOrderStatus = async (req, res) => {
  try {
    const allowedStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled"
    ];

    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status"
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    res.status(200).json({
      message: "Order status updated successfully",
      order
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update order status",
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
};
