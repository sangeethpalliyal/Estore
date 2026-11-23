import jwt from "jsonwebtoken";
import User from "../models/userModals.js";
import asyncHandler from "./asyncHandler.js";

const authenticate = asyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECERT);
      req.user = await User.findById(decoded.userId).select("-password");
      next(); // <-- ADD THIS LINE!
    } catch (error) {
      res.status(401);
      throw new Error("Not autherized,token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not autherized,No token");
  }
});

const autherizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send("Not autherized as admin");
  }
};

export { authenticate, autherizeAdmin };
