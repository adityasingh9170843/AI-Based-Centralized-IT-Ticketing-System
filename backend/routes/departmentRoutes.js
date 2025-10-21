import express from "express";
import { addDepartment,getDepartments } from "../controllers/departmentController";

const router = express.Router();


router.post("/",addDepartment)
router.get("/",getDepartments)

export default router