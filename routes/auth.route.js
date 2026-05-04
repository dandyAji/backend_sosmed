import express from "express";
import { GetUser, RegisterUser, LoginUser } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const AuthRouter = express.Router();

AuthRouter.post("/register", RegisterUser);
AuthRouter.post("/login", LoginUser);
AuthRouter.get("/me", authMiddleware, GetUser);

export default AuthRouter;
