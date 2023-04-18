import express from "express";
// import controller
import {
  getUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getTabelUser,
} from "../controller/user.js";
//import middleware yang dibutuhkan
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";
import { uploadUser } from "../middleware/uploadFotoUser.js";
import logger from "../logs/logger.js";

const UserRoute = express.Router();

// membuat router, set middleware verifyUser dan adminOnly
UserRoute.get("/users", getUser);
UserRoute.get("/users/table", getTabelUser);
UserRoute.get("/users/:id", getUserById);
UserRoute.post("/users", uploadUser, createUser);
UserRoute.patch(
  "/users/:id",
  uploadUser,
  logger,
  updateUser,
  (error, req, res, next) => {
    return res.status(400).send({ msg: "Format Harus .jpg atau .png" });
  }
);
UserRoute.delete("/users/:id", verifyUser, logger, adminOnly, deleteUser);

export default UserRoute;
