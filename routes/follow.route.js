import express from "express";
import { followUserAccount, unfollowUserAccount, getLimitUser, isFollowUser } from "../controllers/follow.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const followRouter = express.Router();

followRouter.post("/", authMiddleware, followUserAccount);
followRouter.delete("/:unfollowUserId", authMiddleware, unfollowUserAccount);
followRouter.get("/user", authMiddleware, getLimitUser);
followRouter.get("/user/:followUserId", authMiddleware, isFollowUser);

export default followRouter;
