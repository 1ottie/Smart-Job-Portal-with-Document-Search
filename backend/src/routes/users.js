import express from "express";
import { getMe, getUserById } from "../controllers/userController.js";
import verifyToken from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/me", verifyToken, getMe);
router.get("/:id", verifyToken, getUserById);

export default router;
