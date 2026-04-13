import express from "express";
import pool from "../libs/db.js";
import client from "../libs/elasticsearch.js";
import verifyToken from "../middlewares/auth.js";

const router = express.Router();

// POST /api/cv
router.post("/", verifyToken, async (req, res) => {
    try {
        const { skills, experience, education, location } = req.body;
        const candidateId = req.user.id;

        // Lưu vào MySQL
        await pool.query(
            "INSERT INTO candidates (userId, skills, experience, education, location) VALUES (?, ?, ?, ?, ?)",
            [candidateId, skills, experience, education, location]
        );

        // Index vào Elasticsearch
        await client.index({
            index: "candidates",
            document: { id: candidateId, skills, experience, education, location }
        });

        res.status(201).json({ message: "CV đã được nộp thành công" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
