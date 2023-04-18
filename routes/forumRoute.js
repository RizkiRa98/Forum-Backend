import express from "express";
// import controller
import {
  getForum,
  getForumById,
  createForum,
  updateForum,
  deleteForum,
  getTableForum,
} from "../controller/forum.js";
//import middleware verifyUser agar hanya yang sudah login bisa akses
//import middleware adminOnly agar hanya admin yang bisa akses
//import middleware logger
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";
import { uploadForum } from "../middleware/uploadIconForum.js";
import logger from "../logs/logger.js";
const ForumRoute = express.Router();

// membuat router
ForumRoute.get("/forums", getForum);
ForumRoute.get("/forums/table", getTableForum);
ForumRoute.get("/forum/:id", getForumById);
ForumRoute.post(
  "/forum",
  uploadForum,
  verifyUser,
  logger,
  adminOnly,
  createForum
);
ForumRoute.patch(
  "/forum/:id",
  uploadForum,
  verifyUser,
  logger,
  adminOnly,
  updateForum
);
ForumRoute.delete("/forum/:id", verifyUser, logger, adminOnly, deleteForum);

export default ForumRoute;
