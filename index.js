
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/dbConnection");

const {
  protect,
  authorizeRoles
} = require("./middleware/authMiddleware");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Authentication routes
const authRoutes = require("./routes/authenticationRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userProfileRoutes = require("./routes/userProfileRoutes");
const errorHandler = require("./middleware/errorHandler");
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/profiles", userProfileRoutes);
app.use(errorHandler);
// Home route
app.get("/", (req, res) => {
  res.send("E-Commerce Backend is running!");
});

// Protected route: logged-in users
app.get("/api/auth/me", protect, (req, res) => {
  res.json({
    message: "Authentication successful",
    user: req.user
  });
});

// Admin-only route
app.get(
  "/api/admin",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({
      message: "Welcome, Admin!"
    });
  }
);

// Start server after database connection
const startServer = async () => {
  try {
    await connectDB();

    app.listen(process.env.PORT || 5000, () => {
      console.log(
        `Server running on port ${process.env.PORT || 5000}`
      );
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
  }
};

startServer();
