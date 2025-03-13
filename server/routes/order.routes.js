import express from "express";
import { checkout } from "../controllers/order.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/checkout", verifyJWT, checkout);

export default router;
