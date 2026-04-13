
import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import cvRoutes from "./routes/cv.js";
import jobRoutes from "./routes/jobs.js";
import searchRoutes from "./routes/searchRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Gắn các routers vào các endpoint tương ứng
app.use("/api/auth", authRoutes); // Các api đăng ký/đăng nhập sẽ nằm ở /api/auth/signup, /api/auth/signin, /api/auth/signout
app.use("/api/users", userRoutes); // Các api user sẽ nằm ở /api/users/me, /api/users/:id
app.use("/api/cv", cvRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/search", searchRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
