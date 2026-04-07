import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";
import { isRecruiter } from "../middlewares/roleMiddleware.js";
import {
  createCompany,
  getCompanies,
} from "../controllers/companyController.js"; // Import Đầu bếp

const router = express.Router();

// Route giờ chỉ còn 1 dòng ngắn gọn thế này!
router.post("/", verifyToken, isRecruiter, createCompany);
router.get("/", getCompanies);

export default router;
