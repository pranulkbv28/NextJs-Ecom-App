import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
} from "../controllers/cart.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/add", verifyJWT, addToCart);
router.get("/", verifyJWT, getCart);
router.delete("/:id", verifyJWT, removeFromCart);

export default router;
