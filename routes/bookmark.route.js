import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { toggleSave, CheckSavedFeed } from "../controllers/bookmark.controller.js";

const BookmarkRouter = express.Router();

BookmarkRouter.post("/:postId", authMiddleware, toggleSave);
BookmarkRouter.get("/:postId", authMiddleware, CheckSavedFeed);

export default BookmarkRouter;
