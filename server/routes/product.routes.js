import express from "express";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/product.controller.js";
import verifyToken from "../middlewares/user.middleware.js";

const router = express.Router();

router.post("/add", verifyToken, addProduct);
router.get("/", verifyToken, getAllProducts);
router.get("/:id", verifyToken, getProductById);
router.patch("/:id", verifyToken, updateProduct);
router.delete("/:id", verifyToken, deleteProduct);

export default router;
