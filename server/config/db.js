import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connection SUCCESS: ", connection.connection.name);
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
};

console.log("DB Connection Details:");
console.log("MongoDB URI:", process.env.MONGO_URI);
console.log("Host:", process.env.SQL_HOST);
console.log("Port:", process.env.SQL_PORT);
console.log("User:", process.env.SQL_USER);
console.log("Database:", process.env.SQL_DATABASE);
console.log("Password:", process.env.SQL_PASSWORD ? "******" : "NOT SET"); // Mask password for security

// const sequelize = new Sequelize(
//   process.env.SQL_DATABASE,
//   process.env.SQL_USER || "postgres", // Ensure correct username
//   `${process.env.SQL_PASSWORD}`,
//   {
//     host: process.env.SQL_HOST,
//     port: process.env.SQL_PORT, // Add port explicitly
//     dialect: "postgres",
//     logging: false,
//   }
// );

export { connectMongoDB };
