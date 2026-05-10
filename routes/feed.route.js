import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import { CreateFeed, ReadAllFeeds, detailFeed, deleteFeed } from "../controllers/feed.controller.js";

const FeedRouter = express.Router();

FeedRouter.post("/", authMiddleware, upload.single("image"), CreateFeed);
FeedRouter.get("/", authMiddleware, ReadAllFeeds);
FeedRouter.get("/:id", authMiddleware, detailFeed);
FeedRouter.delete("/:id", authMiddleware, deleteFeed);

export default FeedRouter;
