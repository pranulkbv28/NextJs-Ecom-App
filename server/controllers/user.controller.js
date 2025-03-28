import User from "../models/user.model.js";
import { cookieOptions } from "../constants.js";
import {
  ErrorApiResponse,
  SuccessApiResponse,
} from "../services/ApiResponse.service.js";
import fieldValidations from "../services/fieldValidations.service.js";
import Cart from "../models/cart.model.js";

export const createUser = async (req, res) => {
  /**
   * Get User details from body
   * Check for empty fields
   * Check if user already exists
   * Create new user
   * Hash password andd generate token
   * Send response and keep token in cookie
   */
  try {
    const { name, email, password, address } = req.body;
    const validateFields = fieldValidations({ name, email, password, address });
    if (!validateFields)
      throw new ErrorApiResponse(400, "Please fill all fields");

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new ErrorApiResponse(400, "User already exists");

    const newUser = await User.create({
      address: address,
      name: name,
      email: email,
      password: await User.hashPassword(password),
    });
    // newUser.password = await User.hashPassword(password);
    newUser.cart = await Cart.create({ user: newUser._id, products: [] });
    await newUser.save();

    const token = newUser.generateAuthToken();

    const createdUser = await User.findById(newUser._id).select("-password");

    return res
      .status(201)
      .cookie("token", token, cookieOptions)
      .json(
        new SuccessApiResponse(201, createdUser, "User created successfully")
      );
  } catch (error) {
    console.log(`Error while creating user: ${error.message}`);
    return res.status(400).json(error);
  }
};

export const loginUser = async (req, res) => {
  /**
   * Get User details from body
   * Check for empty fields
   * Check if user exists
   * Check if password is correct
   * Generate token and send response
   * Keep token in cookie
   */
  try {
    const { email, password } = req.body;
    const validateFields = fieldValidations({ email, password });
    if (!validateFields)
      throw new ErrorApiResponse(400, "Please fill all fields");

    const existingUser = await User.findOne({ email });
    if (!existingUser) throw new ErrorApiResponse(400, "Invalid credentials");

    const isPasswordCorrect = await existingUser.comparePassword(password);
    if (!isPasswordCorrect)
      throw new ErrorApiResponse(400, "Invalid credentials");

    const token = existingUser.generateAuthToken();

    const loggedInUser = await User.findById(existingUser._id).select(
      "-password"
    );

    return res
      .status(200)
      .cookie("token", token, cookieOptions)
      .json(
        new SuccessApiResponse(200, loggedInUser, "User logged in successfully")
      );
  } catch (error) {
    console.log(`Error while logging in user: ${error.message}`);
    return res.status(400).json(error);
  }
};

export const logoutUser = async (req, res) => {
  /**
   * Get user details from request
   * Clear cookie and send response
   * logout user
   */
  try {
    if (!req.user) throw new ErrorApiResponse(401, "Unauthorized");

    return res
      .status(200)
      .clearCookie("token")
      .json(new SuccessApiResponse(200, {}, "User logged out successfully"));
  } catch (error) {
    console.log(`Error while logging out user: ${error.message}`);
    return res.status(400).json(error);
  }
};

export const getUserProfile = async (req, res) => {
  /**
   * Get user details from request
   * Send response with user details
   */
  try {
    if (!req.user) throw new ErrorApiResponse(401, "Unauthorized");

    return res
      .status(200)
      .json(
        new SuccessApiResponse(200, { user: req.user }, "User profile fetched")
      );
  } catch (error) {
    console.log(`Error while getting user profile: ${error.message}`);
    return res.status(error.statusCode).json(error.message);
  }
};
