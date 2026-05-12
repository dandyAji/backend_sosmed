import express from "express";
import AuthRouter from "./routes/auth.route.js";
import UserRouter from "./routes/user.route.js";
import FollowRouter from "./routes/follow.route.js";
import FeedRouter from "./routes/feed.route.js";
import commentRouter from "./routes/comment.route.js";

const app = express();
const port = 3000;

// untuk parsing application/json
app.use(express.json());

app.use("/api/auth", AuthRouter);
app.use("/api/user", UserRouter);
app.use("/api/follow", FollowRouter);
app.use("/api/feed", FeedRouter);
app.use("/api/comment", commentRouter);

app.listen(port, () => {
  console.log(`Server berjalan di port http://localhost:${port}/`);
});
