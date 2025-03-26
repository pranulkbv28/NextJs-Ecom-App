import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

dotenv.config({
  path: "./.env",
});

const app = express();
await connectDB();

app.use(express.json());
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.send("API is running...");
});

export default app;
