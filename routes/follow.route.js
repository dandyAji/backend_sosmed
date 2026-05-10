import express from "express";
import { followUserAccount, unfollowUserAccount, getLimitUser } from "../controllers/follow.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const followRouter = express.Router();

followRouter.post("/", authMiddleware, followUserAccount);
followRouter.delete("/:unfollowUserId", authMiddleware, unfollowUserAccount);
followRouter.get("/user", authMiddleware, getLimitUser);

export default followRouter;
