import express from "express";
import pool from "../libs/db.js";
import verifyToken from "../middlewares/auth.js";

const router = express.Router();

// GET /users/me
// Phải chạy qua verifyToken trước
router.get("/me", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // Lấy ID từ token đã giải mã

    const [users] = await pool.query(
      "SELECT id, name, email, role, createdAt FROM users WHERE id = ?",
      [userId],
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /users/:id
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const targetId = req.params.id; // Lấy ID từ URL

    const [users] = await pool.query(
      "SELECT id, name, email, role, createdAt FROM users WHERE id = ?",
      [targetId],
    );

    // Xử lý "Not found"
    if (users.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
