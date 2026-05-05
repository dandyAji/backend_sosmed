import express from "express";
import { getUserByUsername, getSearchUser, updateUser } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const userRouter = express.Router();

userRouter.get("/search", getSearchUser);
userRouter.get("/:username", getUserByUsername);
userRouter.put("/update-user", authMiddleware, updateUser);

export default userRouter;
