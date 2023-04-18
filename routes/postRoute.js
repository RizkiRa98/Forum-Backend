import express from "express";
// import controller
import {
  getPost,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getPostByForumId,
} from "../controller/post.js";
import { createLike } from "../controller/like.js";
//import middleware verifyUser agar hanya yang sudah login bisa akses
//import middleware adminOnly agar hanya admin yang bisa akses
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";
import { uploadPost } from "../middleware/uploadFotoPost.js";
import { verifyToken } from "../middleware/verifyToken.js";
import logger from "../logs/logger.js";

const PostRoute = express.Router();

// membuat router
PostRoute.get("/listPost", getPost);
PostRoute.get("/forum/show/:id", getPostByForumId);
PostRoute.get("/forum/post/:idForum/showPost/:id", getPostById);
PostRoute.post(
  "/post",
  verifyUser,
  logger,
  uploadPost,
  createPost,
  (error, req, res, next) => {
    return res.status(400).send({ msg: "Format Harus .jpg .png atau .gif" });
  }
);
PostRoute.patch(
  "/post/:id",
  verifyUser,
  logger,
  uploadPost,
  updatePost,
  (error, req, res, next) => {
    return res.status(400).send({ msg: "Format Harus .jpg .png atau .gif" });
  }
);
PostRoute.delete("/post/:id", verifyUser, logger, deletePost);
PostRoute.post("/likes", verifyUser, logger, createLike);
PostRoute.post("/:idForum/likes", verifyUser, logger, createLike);

export default PostRoute;
