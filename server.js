import express from "express";
import AuthRouter from "./routes/auth.route.js";
import UserRouter from "./routes/user.route.js";

const app = express();
const port = 3000;

// untuk parsing application/json
app.use(express.json());

app.use("/api/auth", AuthRouter);
app.use("/api/user", UserRouter);

app.listen(port, () => {
  console.log(`Server berjalan di port http://localhost:${port}/`);
});
