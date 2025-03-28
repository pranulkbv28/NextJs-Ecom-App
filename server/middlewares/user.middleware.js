import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ErrorApiResponse } from "../services/ApiResponse.service.js";

const verifyToken = async (req, res, next) => {
  try {
    const token =
      req.cookies.token || req.headers["Authorization"]?.split(" ")[1];
    if (!token) throw new ErrorApiResponse(401, "Unauthorized");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id).select("-password");
    if (!user) throw new ErrorApiResponse(401, "Unauthorized");

    req.user = user;
    next();
  } catch (error) {
    console.log(`Error while verifying token: ${error.message}`);
    return res.status(401).json({ message: "Unauthorized", error: error });
  }
};

export default verifyToken;
