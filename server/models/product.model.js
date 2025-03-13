import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  stock: Number,
  description: String,
  imageUrl: String,
});

const Product = mongoose.model("Product", ProductSchema);

export default Product;
