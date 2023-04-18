import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import SequelizeStore from "connect-session-sequelize";
import cookieParser from "cookie-parser";
import logger from "./logs/logger.js";
//import sync modal
import db from "./config/db.js";

//import routes
import PostRoute from "./routes/postRoute.js";
import ForumRoute from "./routes/forumRoute.js";
import UserRoute from "./routes/userRoute.js";
import CommentRoute from "./routes/commentRoute.js";
import LoginRoute from "./routes/authRoute.js";
import LoggerRoute from "./routes/loggerRoute.js";

dotenv.config();

const app = express();

// sync database
// (async () => {
//   await db.sync();
// })();

//middleware untuk akses Front End
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

// Static Images Folder
app.use("/public/Images/user", express.static("./public/Images/user"));
app.use("/public/Images/post", express.static("./public/Images/post"));
app.use("/public/Images/forum", express.static("./public/Images/forum"));
app.use(
  "/public/default_photo.jpg",
  express.static("./public/default_photo.jpg")
);
app.use(
  "/public/default_icon.png",
  express.static("./public/default_icon.png")
);

//Middleware untuk menerima data dalam bentuk JSON
app.use(cookieParser());
app.use(express.json());
// Call Middleware Logger

app.use(LoginRoute);
app.use(LoggerRoute);
app.use(PostRoute);
app.use(CommentRoute);
app.use(ForumRoute);
app.use(logger);
app.use(UserRoute);

//sync store session dengan database
// store.sync();

app.listen(process.env.APP_PORT, () => {
  console.log("Server berjalan");
});
