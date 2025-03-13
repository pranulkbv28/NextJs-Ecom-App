import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import Cart from "../models/cart.model.js";
// import Product from "../models/product.model.js";

// POST /api/cart/checkout - Convert cart to order
export const checkout = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "User ID required" });

    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ error: "Cart is empty" });

    // Calculate total amount
    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.productId.price * item.quantity,
      0
    );

    // Create Order
    const order = await Order.create({ userId, totalAmount });

    // Create Order Items
    for (let item of cart.items) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price,
      });
    }

    // Clear the cart after checkout
    await Cart.deleteOne({ userId });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
