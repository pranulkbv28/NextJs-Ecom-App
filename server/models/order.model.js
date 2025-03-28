import { model, Schema } from "mongoose";

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["creditCard", "debitCard", "paypal", "cod"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "unpaid",
    },
    trackingNumber: {
      type: String,
      unique: true,
    },
    trackingUrl: {
      type: String,
    },
    deliveryDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Order = model("Order", orderSchema);

export default Order;
