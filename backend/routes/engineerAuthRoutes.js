import express from "express";
import { loginEngineer, logoutEngineer, meEngineer, registerEngineer } from "../controllers/engineerAuthController.js";
import { authorizeRoles, protectEngineer, verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", verifyToken,authorizeRoles("admin", "engineer"), registerEngineer);
router.post("/login", loginEngineer);
router.post("/logout", logoutEngineer);
router.get("/me", protectEngineer, meEngineer);

export default router;
