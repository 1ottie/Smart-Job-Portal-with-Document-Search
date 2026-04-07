import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import pool from "../libs/db.js";

const SECRET_KEY = process.env.JWT_SECRET || "fallback_secret_key";

export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }

    const validRoles = ["candidate", "recruiter"];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ message: "Role không hợp lệ" });
    }

    const [existingUsers] = await pool.query(
      "SELECT email FROM users WHERE email = ?",
      [email],
    );
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "Email tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const userRole = role || "candidate";

    await pool.query(
      "INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)",
      [userId, name, email, hashedPassword, userRole],
    );

    const token = jwt.sign({ id: userId, email, role: userRole }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res
      .status(201)
      .json({ user: { id: userId, name, email, role: userRole }, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Thiếu email hoặc password" });
    }

    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (users.length === 0) {
      return res.status(401).json({ message: "Sai email/password" });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Sai email/password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: "1h" },
    );
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const signout = (req, res) => {
  try {
    res.status(200).json({
      message: "Đăng xuất thành công. Vui lòng xoá token ở phía Client.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
