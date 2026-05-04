import express from "express";
import { getUserByUsername, getSearchUser } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/search", getSearchUser);
userRouter.get("/:username", getUserByUsername);
userRouter.put("/:username", getUserByUsername);

export default userRouter;
