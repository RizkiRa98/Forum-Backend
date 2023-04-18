import express from "express";
// import controller
import {
  getComment,
  createComment,
  updateComment,
  deleteComment,
  jmlhComment,
  jmlhCommentForPost,
  getCommentById,
} from "../controller/comment.js";

//import middleware verifyUser agar hanya yang sudah login bisa akses
//import middleware adminOnly agar hanya admin yang bisa akses
//import middleware logger
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";
import logger from "../logs/logger.js";

const CommentRoute = express.Router();

// membuat router
CommentRoute.get("/post/:id/comment", getComment);
CommentRoute.get("/post/:idPost/comment/:id", getCommentById);
CommentRoute.post("/post/:id/comment", verifyUser, logger, createComment);
CommentRoute.patch(
  "/post/:idPost/comment/:id",
  verifyUser,
  logger,
  updateComment
);
CommentRoute.delete(
  "/post/:idPost/comment/:id",
  verifyUser,
  logger,
  deleteComment
);
CommentRoute.get("/post/:id/jumlahComment/", jmlhComment);
CommentRoute.get("/post/:id/jumlahCommentForPost/", jmlhCommentForPost);

export default CommentRoute;
