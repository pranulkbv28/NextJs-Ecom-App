import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectMongoDB, sequelize } from "./config/db.js";
import authRoute from "./routes/auth.routes.js";

dotenv.config({
  path: "./.env",
});

console.log("This is soemthing: ", process.env.MONGO_URI);
console.log("DB Connection Details:");
console.log("MongoDB URI:", process.env.MONGO_URI);
console.log("Host:", process.env.SQL_HOST);
console.log("Port:", process.env.SQL_PORT);
console.log("User:", process.env.SQL_USER);
console.log("Database:", process.env.SQL_DATABASE);
console.log("Password:", process.env.SQL_PASSWORD ? "******" : "NOT SET");

const app = express();

await connectMongoDB();
sequelize.sync().then(() => {
  console.log("Postgres connection SUCCESS");
});

// const corsOptions = {};
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);

app.get("/", (_req, res) => {
  res.send("Hello World");
});

export default app;
