import express from "express";
import { addToCart, removeFromCart, getCart, updateCart } from "../controllers/cartController.js";
import authenticateToken from "../middleware/auth.js";

const cartRouter = express.Router();

cartRouter.post("/add", authenticateToken, addToCart);    
cartRouter.post("/remove", authenticateToken, removeFromCart);  
cartRouter.get("/get", authenticateToken, getCart); 
cartRouter.post("/update", authenticateToken, updateCart); 

export default cartRouter;
