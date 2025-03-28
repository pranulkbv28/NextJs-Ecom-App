import Product from "../models/product.model.js";
import {
  ErrorApiResponse,
  SuccessApiResponse,
} from "../services/ApiResponse.service.js";
import fieldValidations from "../services/fieldValidations.service.js";

export const addProduct = async (req, res) => {
  /**
   * Get Product details from body
   * Check for empty fields
   * Check if product already exists
   * Create new product
   * Send response
   */
  try {
    if (!req.user) throw new ErrorApiResponse(401, "Unauthorized access");

    const { name, description, price, category, stock, image } = req.body;
    const validateFields = fieldValidations({
      name,
      description,
      price,
      category,
      stock,
    });
    if (!validateFields)
      throw new ErrorApiResponse(400, "Please fill all fields");

    const isProduct = await Product.findOne({ name });
    if (isProduct) throw new ErrorApiResponse(400, "Product already exists");

    const newProduct = await Product.create({
      name,
      description,
      price,
      category,
      stock,
    });

    if (image) newProduct.image = image;
    await newProduct.save();

    return res
      .status(201)
      .json(
        new SuccessApiResponse(201, newProduct, "Product created successfully")
      );
  } catch (error) {
    console.log(`Error while adding a product: ${error.message}`);
    return res.status(error.statusCode).json(error.message);
  }
};

export const updateProduct = async (req, res) => {
  /**
   * Get Product ID from params
   * Check if product exists
   * Update product details
   * Send response
   */
  try {
    if (!req.user) throw new ErrorApiResponse(401, "Unauthorized access");

    const { id } = req.params;
    const { name, description, price, category, stock, image } = req.body;

    const product = await Product.findById(id);
    if (!product) throw new ErrorApiResponse(404, "Product not found");

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.stock = stock || product.stock;
    if (image) product.image = image;

    await product.save();

    return res
      .status(200)
      .json(
        new SuccessApiResponse(200, product, "Product updated successfully")
      );
  } catch (error) {
    console.log(`Error while updating product: ${error.message}`);
    return res.status(error.statusCode).json(error.message);
  }
};

export const getProductById = async (req, res) => {
  /**
   * Get Product ID from params
   * Check if product exists
   * Send response with product details
   */
  try {
    if (!req.user) throw new ErrorApiResponse(401, "Unauthorized access");

    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) throw new ErrorApiResponse(404, "Product not found");

    return res
      .status(200)
      .json(new SuccessApiResponse(200, product, "Product found successfully"));
  } catch (error) {
    console.log(`Error while getting product by ID: ${error.message}`);
    return res.status(error.statusCode).json(error.message);
  }
};

export const getAllProducts = async (req, res) => {
  /**
   * Get all products from database
   * Send response with all products
   */
  try {
    if (!req.user) throw new ErrorApiResponse(401, "Unauthorized access");

    const products = await Product.find({});
    if (!products) throw new ErrorApiResponse(404, "No products found");

    return res
      .status(200)
      .json(
        new SuccessApiResponse(200, products, "Products found successfully")
      );
  } catch (error) {
    console.log(`Error while getting all products: ${error.message}`);
    return res.status(error.statusCode).json(error.message);
  }
};

export const deleteProduct = async (req, res) => {
  /**
   * Get Product ID from params
   * Check if product exists
   * Delete product
   * Send response
   */
  try {
    if (!req.user) throw new ErrorApiResponse(401, "Unauthorized access");

    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) throw new ErrorApiResponse(404, "Product not found");

    await product.remove();

    return res
      .status(200)
      .json(new SuccessApiResponse(200, {}, "Product deleted successfully"));
  } catch (error) {
    console.log(`Error while deleting product: ${error.message}`);
    return res.status(error.statusCode).json(error.message);
  }
};
