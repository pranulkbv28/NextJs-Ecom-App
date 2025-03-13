import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import cookieOptions from "../constants/cookieOptions.js";
import Cart from "../models/cart.model.js";

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });
    const cart = await Cart.create({ userId: user.id, items: [] });
    user.card = cart.id;
    await user.save();
    // console.log(user);
    const registeredUser = { id: user.id, email: user.email };
    res.status(201).json({ message: "User registered", registeredUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const loggedInUser = { id: user.id, email: user.email };

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res
      .cookie("token", token, cookieOptions)
      .json({ loggedInUser, token, message: "User logged in" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    if (!req.user) {
      throw new Error("You are not logged in. Please log in to continue.");
    }

    return res
      .clearCookie("token", cookieOptions)
      .json({ message: "User logged out" });
  } catch (error) {
    return res.status(400).json({ "Error while logging out": error.message });
  }
};
