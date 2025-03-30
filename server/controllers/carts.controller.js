import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import {
  ErrorApiResponse,
  SuccessApiResponse,
} from "../services/ApiResponse.service.js";

export const getCart = async (req, res) => {
  try {
    if (!req.user) throw new ErrorApiResponse(401, "Unauthorized access");

    const userCart = await Cart.findOne({ user: req.user._id });
    if (!userCart) throw new ErrorApiResponse(404, "Cart not found");
    let message = "";
    if (userCart.products.length === 0) {
      message = "Cart is empty";
    } else {
      message = "Cart not empty";
    }
    await userCart.populate("products.product");

    return res.status(200).json(new SuccessApiResponse(200, userCart, message));
  } catch (error) {
    console.log(`Error while getting cart: ${error.message}`);
    return res.status(error.statusCode).json(error.message);
  }
};

export const addToCart = async (req, res) => {
  try {
    if (!req.user) throw new ErrorApiResponse(401, "Unauthorized access");

    const { productId, quantity } = req.body;

    if (!productId) throw new ErrorApiResponse(400, "Product ID is required");
    if (!quantity) throw new ErrorApiResponse(400, "Quantity is required");

    const selectedProduct = await Product.findById(productId);
    if (!selectedProduct) throw new ErrorApiResponse(404, "Product not found");

    const userCart = await Cart.findOne({ user: req.user._id });
    if (!userCart) throw new ErrorApiResponse(404, "Cart not found");

    // Check if the product already exists in the cart
    const existingCartItem = userCart.products.find(
      (item) => item.product.toString() === productId
    );

    if (existingCartItem) {
      // Calculate the difference in quantity
      const quantityDifference = quantity - existingCartItem.quantity;

      // Update the stock based on the difference
      if (quantityDifference > 0) {
        // Increasing quantity in the cart, reduce stock
        if (selectedProduct.stock < quantityDifference) {
          throw new ErrorApiResponse(400, "Product stock is not enough");
        }
        await selectedProduct.updateOne({
          $inc: { stock: -quantityDifference },
        });
      } else if (quantityDifference < 0) {
        // Reducing quantity in the cart, increase stock
        await selectedProduct.updateOne({
          $inc: { stock: Math.abs(quantityDifference) },
        });
      }

      // Update the quantity in the cart
      existingCartItem.quantity = quantity;
    } else {
      // If the product is not in the cart, add it
      if (selectedProduct.stock < quantity) {
        throw new ErrorApiResponse(400, "Product stock is not enough");
      }
      userCart.products.push({ product: productId, quantity });
      await selectedProduct.updateOne({ $inc: { stock: -quantity } });
    }

    // Save the updated cart
    await userCart.save();
    await userCart.populate("products.product");

    return res
      .status(200)
      .json(
        new SuccessApiResponse(
          200,
          userCart,
          `Product added to cart successfully. There are ${userCart.products.length} items in the cart.`
        )
      );
  } catch (error) {
    console.log(`Error while adding to cart: ${error.message}`);
    return res.status(error.statusCode || 500).json(error.message);
  }
};

export const removeFromCart = async (req, res) => {
  try {
    if (!req.user) throw new ErrorApiResponse(401, "Unauthorized access");

    const { productId } = req.body;
    if (!productId) throw new ErrorApiResponse(400, "Product ID is required");

    const userCart = await Cart.findOne({ user: req.user._id });
    if (!userCart) throw new ErrorApiResponse(404, "Cart not found");

    userCart.products = userCart.products.filter(
      (item) => item.product.toString() !== productId
    );
    await userCart.save();
    await userCart.populate("products.product");

    return res
      .status(200)
      .json(
        new SuccessApiResponse(
          200,
          userCart,
          `Product removed from cart successfully. There are ${userCart.products.length} items in the cart.`
        )
      );
  } catch (error) {
    console.log(`Error while removing from cart: ${error.message}`);
    return res.status(error.statusCode).json(error.message);
  }
};

export const clearCart = async (req, res) => {
  try {
    if (!req.user) throw new ErrorApiResponse(401, "Unauthorized access");

    const userCart = await Cart.findOne({ user: req.user._id });
    if (!userCart) throw new ErrorApiResponse(404, "Cart not found");

    userCart.products = [];
    await userCart.save();
    await userCart.populate("products.product");

    return res
      .status(200)
      .json(new SuccessApiResponse(200, userCart, "Cart cleared successfully"));
  } catch (error) {
    console.log(`Error while clearing cart: ${error.message}`);
    return res.status(error.statusCode).json(error.message);
  }
};
