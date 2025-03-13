import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true, min: 1, default: 1 },
    },
  ],
});

const Cart = mongoose.model("Cart", CartSchema);

export default Cart;
