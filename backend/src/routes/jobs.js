import express from "express";
import pool from "../libs/db.js";
import client from "../libs/elasticsearch.js";
import verifyToken from "../middlewares/authMiddleware.js";

const router = express.Router();

// POST /api/jobs
router.post("/", verifyToken, async (req, res) => {
    try {
        const { title, description, skills_required, location } = req.body;
        const recruiterId = req.user.id;

        // Lưu vào MySQL
        const [result] = await pool.query(
            "INSERT INTO jobs (title, description, skills_required, location, recruiterId) VALUES (?, ?, ?, ?, ?)",
            [title, description, skills_required, location, recruiterId]
        );
        const jobId = result.insertId;

        // Index vào Elasticsearch
        await client.index({
            index: "jobs",
            document: { id: jobId, title, description, skills_required, location }
        });

        res.status(201).json({ message: "Job đã được đăng thành công" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
