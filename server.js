import express from "express";
import AuthRouter from "./routes/auth.route.js";
import UserRouter from "./routes/user.route.js";
import FollowRouter from "./routes/follow.route.js";
import FeedRouter from "./routes/feed.route.js";
import commentRouter from "./routes/comment.route.js";
import LikesRouter from "./routes/likes.route.js";
import BookmarkRouter from "./routes/bookmark.route.js";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());

// untuk parsing application/json
app.use(express.json());

app.use("/api/auth", AuthRouter);
app.use("/api/user", UserRouter);
app.use("/api/follow", FollowRouter);
app.use("/api/feed", FeedRouter);
app.use("/api/comment", commentRouter);
app.use("/api/like", LikesRouter);
app.use("/api/bookmark", BookmarkRouter);

app.listen(port, () => {
  console.log(`Server berjalan di port http://localhost:${port}/`);
});
