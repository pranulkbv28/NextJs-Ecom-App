import { model, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    address: {
      type: String,
      trim: true,
    },
    cart: {
      type: Schema.Types.ObjectId,
      ref: "Cart",
    },
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = function () {
  const payload = {
    _id: this._id,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
};

userSchema.methods.comparePassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

userSchema.statics.hashPassword = async function (password) {
  return await bcryptjs.hash(password, 10);
};

const User = model("User", userSchema);

export default User;
