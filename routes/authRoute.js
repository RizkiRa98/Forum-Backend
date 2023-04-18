import express from "express";
import { login, logout, userLogin } from "../controller/auth.js";
import { refreshToken } from "../controller/refreshToken.js";
import { verifyToken } from "../middleware/verifyToken.js";

const LoginRoute = express.Router();

// LoginRoute.get("/userLogin", userLogin);
LoginRoute.get("/userLogin", verifyToken, userLogin);
LoginRoute.post("/login", login);
LoginRoute.delete("/logout", logout);
LoginRoute.get("/token", refreshToken);

export default LoginRoute;
