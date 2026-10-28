
const Product = require("../models/product");

// CREATE PRODUCT
const createProduct = async (req, res) => {
  try {
    const { name, description, category, price, stock } = req.body;

    if (!name || !description || !category || price === undefined) {
      return res.status(400).json({
        message: "Name, description, category and price are required"
      });
    }

    const product = await Product.create({
      name,
      description,
      category,
      price,
      stock
    });

    res.status(201).json({
      message: "Product created successfully",
      product
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create product",
      error: error.message
    });
  }
};

// GET ALL PRODUCTS

const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sort
    } = req.query;

    const filter = {};

    // Search by product name
    if (search) {
      filter.name = {
        $regex: search,
        $options: "i"
      };
    }

    // Filter by category
    if (category) {
      filter.category = {
        $regex: `^${category}$`,
        $options: "i"
      };
    }

    // Filter by price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};

      if (minPrice !== undefined) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice !== undefined) {
        filter.price.$lte = Number(maxPrice);
      }

      if (
        (minPrice !== undefined && !Number.isFinite(Number(minPrice))) ||
        (maxPrice !== undefined && !Number.isFinite(Number(maxPrice))) ||
        (minPrice !== undefined && Number(minPrice) < 0) ||
        (maxPrice !== undefined && Number(maxPrice) < 0) ||
        (minPrice !== undefined && maxPrice !== undefined &&
          Number(minPrice) > Number(maxPrice))
      ) {
        return res.status(400).json({
          message: "Invalid price range"
        });
      }
    }

    // Sort products by price
    let sortOption = {};

    if (sort === "price_asc") {
      sortOption.price = 1;
    } else if (sort === "price_desc") {
      sortOption.price = -1;
    } else if (sort === "name_asc") {
      sortOption.name = 1;
    } else if (sort === "name_desc") {
      sortOption.name = -1;
    }

    const products = await Product.find(filter).sort(sortOption);

    res.status(200).json({
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message
    });
  }
};

// GET SINGLE PRODUCT
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json({ product });
  } catch (error) {
    res.status(400).json({
      message: "Invalid product ID or request failed"
    });
  }
};

// UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update product",
      error: error.message
    });
  }
};

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json({
      message: "Product deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete product",
      error: error.message
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
