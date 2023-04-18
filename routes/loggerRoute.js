import express from "express";
import { getLogger } from "../controller/log.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";
import logger from "../logs/logger.js";

const LoggerRoute = express.Router();

LoggerRoute.get("/logger", verifyUser, logger, getLogger);

export default LoggerRoute;
