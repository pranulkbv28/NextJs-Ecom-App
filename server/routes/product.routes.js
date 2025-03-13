import express from "express";
import {
  getProducts,
  searchProducts,
  getProductById,
  createProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/create", createProduct);
router.get("/search", searchProducts);
router.get("/:id", getProductById);

export default router;
