import User from "../models/user.model.js";
import { cookieOptions } from "../constants.js";
import {
  ErrorApiResponse,
  SuccessApiResponse,
} from "../services/ApiResponse.service.js";
import fieldValidations from "../services/fieldValidations.service.js";

export const createUser = async (req, res) => {
  /*
   * Get User details from body
   * Check for empty fields
   * Check if user already exists
   * Create new user
   * Hash password andd generate token
   * Send response and keep token in cookie
   */

  try {
    const { name, email, password } = req.body;
    const emptyField = fieldValidations({ name, email, password });
    if (emptyField) throw new ErrorApiResponse(400, emptyField);

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new ErrorApiResponse(400, "User already exists");

    const newUser = new User({ name, email, password });
    newUser.password = await User.hashPassword(password);
    await newUser.save();

    const token = newUser.generateAuthToken();

    const createdUser = await User.findById(newUser._id).select("-password");
    // res.cookie("token", token, cookieOptions);

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
