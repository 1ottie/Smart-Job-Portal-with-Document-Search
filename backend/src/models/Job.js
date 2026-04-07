export const createJobTable = async (db) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS jobs (
      id VARCHAR(255) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      requirements TEXT,
      salaryMin INT,
      salaryMax INT,
      location VARCHAR(255),
      jobType VARCHAR(100),
      experienceLevel VARCHAR(100),
      companyId VARCHAR(255) NOT NULL,
      createdBy VARCHAR(255) NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE CASCADE,
      FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE
    );
  `;
  await db.query(sql);
  console.log("✅ Bảng 'jobs' đã sẵn sàng!");
};
