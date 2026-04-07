import { v4 as uuidv4 } from "uuid";
import pool from "../libs/db.js";

// 1. TẠO JOB MỚI
export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salaryMin,
      salaryMax,
      location,
      jobType,
      experienceLevel,
      companyId,
    } = req.body;

    // Người tạo job chính là người đang đăng nhập (lấy từ token)
    const createdBy = req.user.id;

    if (!title || !description || !companyId) {
      return res.status(400).json({
        message: "Thiếu thông tin bắt buộc (title, description, companyId)",
      });
    }

    // (Tùy chọn) Có thể check xem companyId có thực sự tồn tại trong bảng companies không trước khi insert

    const jobId = uuidv4();
    const sql = `
      INSERT INTO jobs 
      (id, title, description, requirements, salaryMin, salaryMax, location, jobType, experienceLevel, companyId, createdBy) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.query(sql, [
      jobId,
      title,
      description,
      requirements || null,
      salaryMin || null,
      salaryMax || null,
      location || null,
      jobType || null,
      experienceLevel || null,
      companyId,
      createdBy,
    ]);

    // Ghi chú cho tương lai: Index dữ liệu vào Elasticsearch ở vị trí này!

    res.status(201).json({ message: "Tạo công việc thành công", jobId });
  } catch (error) {
    console.error("Lỗi tạo job:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 2. LẤY DANH SÁCH JOB (Có phân trang)
export const getJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const sql = "SELECT * FROM jobs ORDER BY createdAt DESC LIMIT ? OFFSET ?";
    const [data] = await pool.query(sql, [limit, offset]);

    // Lấy tổng số lượng job để Frontend làm nút bấm phân trang (1, 2, 3...)
    const [[{ total }]] = await pool.query(
      "SELECT COUNT(*) as total FROM jobs",
    );

    res.status(200).json({ data, total, page, limit });
  } catch (error) {
    console.error("Lỗi lấy danh sách job:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 3. LẤY CHI TIẾT 1 CÔNG VIỆC
export const getJobById = async (req, res) => {
  try {
    const targetId = req.params.id;
    const [jobs] = await pool.query("SELECT * FROM jobs WHERE id = ?", [
      targetId,
    ]);

    if (jobs.length === 0) {
      return res
        .status(404)
        .json({ message: "Not found: Không tìm thấy công việc này" });
    }

    res.status(200).json({ job: jobs[0] });
  } catch (error) {
    console.error("Lỗi lấy chi tiết job:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 4. CẬP NHẬT CÔNG VIỆC
export const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id; // Lấy ID của người đang request từ Token

    // Kiểm tra xem job có tồn tại không và ai là người tạo
    const [jobs] = await pool.query("SELECT createdBy FROM jobs WHERE id = ?", [
      jobId,
    ]);
    if (jobs.length === 0) {
      return res
        .status(404)
        .json({ message: "Not found: Không tìm thấy công việc" });
    }

    // CHỐT CHẶN BẢO MẬT: Phải là chính chủ mới được sửa
    if (jobs[0].createdBy !== userId) {
      return res.status(403).json({
        message: "Forbidden: Bạn không có quyền sửa công việc của người khác",
      });
    }

    const {
      title,
      description,
      requirements,
      salaryMin,
      salaryMax,
      location,
      jobType,
      experienceLevel,
    } = req.body;

    // Kỹ thuật tạo câu lệnh UPDATE động (chỉ cập nhật những trường người dùng gửi lên)
    const updates = [];
    const values = [];

    if (title) {
      updates.push("title = ?");
      values.push(title);
    }
    if (description) {
      updates.push("description = ?");
      values.push(description);
    }
    if (requirements !== undefined) {
      updates.push("requirements = ?");
      values.push(requirements);
    }
    if (salaryMin !== undefined) {
      updates.push("salaryMin = ?");
      values.push(salaryMin);
    }
    if (salaryMax !== undefined) {
      updates.push("salaryMax = ?");
      values.push(salaryMax);
    }
    if (location !== undefined) {
      updates.push("location = ?");
      values.push(location);
    }
    if (jobType !== undefined) {
      updates.push("jobType = ?");
      values.push(jobType);
    }
    if (experienceLevel !== undefined) {
      updates.push("experienceLevel = ?");
      values.push(experienceLevel);
    }

    if (updates.length === 0) {
      return res
        .status(400)
        .json({ message: "Không có dữ liệu nào được gửi lên để cập nhật" });
    }

    // Đẩy jobId vào cuối mảng values cho điều kiện WHERE
    values.push(jobId);

    const sql = `UPDATE jobs SET ${updates.join(", ")} WHERE id = ?`;
    await pool.query(sql, values);

    // Ghi chú cho tương lai: Gọi hàm Re-index Elasticsearch ở đây!

    res.status(200).json({ message: "Cập nhật công việc thành công!" });
  } catch (error) {
    console.error("Lỗi cập nhật job:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 5. XOÁ CÔNG VIỆC
export const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;

    // Kiểm tra tồn tại và quyền sở hữu
    const [jobs] = await pool.query("SELECT createdBy FROM jobs WHERE id = ?", [
      jobId,
    ]);
    if (jobs.length === 0) {
      return res
        .status(404)
        .json({ message: "Not found: Không tìm thấy công việc" });
    }

    if (jobs[0].createdBy !== userId) {
      return res.status(403).json({
        message: "Forbidden: Bạn không có quyền xoá công việc của người khác",
      });
    }

    await pool.query("DELETE FROM jobs WHERE id = ?", [jobId]);

    // Ghi chú cho tương lai: Gọi hàm Xoá khỏi Elasticsearch ở đây!

    res.status(200).json({ message: "Đã xoá công việc thành công" });
  } catch (error) {
    console.error("Lỗi xoá job:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
