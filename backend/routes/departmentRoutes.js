import express from "express";
import { addDepartment,getDepartments } from "../controllers/departmentController.js";
import { verifyToken,authorizeRoles } from "../middleware/authMiddleware.js";
const router = express.Router();


router.post("/",verifyToken,authorizeRoles("admin"),addDepartment)
router.get("/",getDepartments)

export default router