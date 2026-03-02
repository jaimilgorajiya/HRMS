import express from "express";
import { login, logout, register, verifyUser, changePassword } from "../controllers/Auth.Controller.js";
import { verifyToken } from "../middleware/Auth.Middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verify", verifyToken, verifyUser);
router.post("/change-password", verifyToken, changePassword);

export default router;
