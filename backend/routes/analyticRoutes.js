import express from "express";


const router = express.Router();

router.get("/",getAnalytics);

export default router