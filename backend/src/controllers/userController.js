import pool from "../libs/db.js";

export const getMe = async (req, res) => {
  try {
    const userId = req.user.id;
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
};

export const getUserById = async (req, res) => {
  try {
    const targetId = req.params.id;
    const [users] = await pool.query(
      "SELECT id, name, email, role, createdAt FROM users WHERE id = ?",
      [targetId],
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
