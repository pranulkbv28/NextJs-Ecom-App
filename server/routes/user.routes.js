import express from "express";
import verifyToken from "../middlewares/user.middleware.js";
import {
  createUser,
  getUserProfile,
  loginUser,
  logoutUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/profile", verifyToken, getUserProfile);
router.post("/logout", verifyToken, logoutUser);

export default router;
