import express from "express";
import { createUser, getUsers, getUser, updateUser, deleteUser, getNextEmployeeId } from "../controllers/User.Controller.js";
import { verifyToken, isAdmin } from "../middleware/Auth.Middleware.js";
import upload from "../middleware/Upload.Middleware.js";

const router = express.Router();

router.post("/create", verifyToken, isAdmin, createUser);
router.post("/add-employee", verifyToken, isAdmin, upload.single('profilePhoto'), createUser);
router.get("/", verifyToken, isAdmin, getUsers);
router.get("/next-id", verifyToken, isAdmin, getNextEmployeeId);
router.get("/:id", verifyToken, isAdmin, getUser);
router.put("/:id", verifyToken, isAdmin, upload.single('profilePhoto'), updateUser);
router.delete("/:id", verifyToken, isAdmin, deleteUser);

export default router;
