import express from "express";
import { loginUser, registerUser, getUserData } from "../controllers/userController.js";
import authenticateToken from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/me", authenticateToken, getUserData);

export default userRouter;
