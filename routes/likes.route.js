import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { likeFeedUser, CheckLikeUser } from "../controllers/like.controller.js";

const LikesRouter = express.Router();

LikesRouter.post("/:postId", authMiddleware, likeFeedUser);
LikesRouter.get("/:postId", authMiddleware, CheckLikeUser);

export default LikesRouter;
