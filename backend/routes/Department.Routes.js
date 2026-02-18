import express from "express";
import { createDepartment, getDepartments, updateDepartment, deleteDepartment } from "../controllers/Department.Controller.js";
import { verifyToken, isAdmin } from "../middleware/Auth.Middleware.js";

const router = express.Router();

router.post("/create", verifyToken, isAdmin, createDepartment);
router.get("/", verifyToken, getDepartments);
router.put("/:id", verifyToken, isAdmin, updateDepartment);
router.delete("/:id", verifyToken, isAdmin, deleteDepartment);

export default router;
