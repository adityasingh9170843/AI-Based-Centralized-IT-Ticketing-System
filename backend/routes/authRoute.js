import express from "express";
import { logout, register } from "../controllers/authController.js";   
import { login } from "../controllers/authController.js";
import { verify } from "jsonwebtoken";
import { verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register",register)
router.post("/login",login)
router.post("/logout",logout)
router.get('/profile',verifyToken,getUserProfile)

export default router