import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";
import verifyToken from "../middlewares/authMiddleware.js";
import { isRecruiter } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Tạo job bắt buộc phải là Recruiter
router.post("/", verifyToken, isRecruiter, createJob);

// Lấy danh sách job (Public)
router.get("/", getJobs);

// Lấy chi tiết 1 job (Public - Mọi người đều có thể xem chi tiết job)
router.get("/:id", getJobById);

// Cập nhật job (Cần token + Phải là Recruiter)
router.put("/:id", verifyToken, isRecruiter, updateJob);

// Xoá job (Cần token + Phải là Recruiter)
router.delete("/:id", verifyToken, isRecruiter, deleteJob);

export default router;
