export const createCompanyTable = async (db) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS companies (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      website VARCHAR(255),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await db.query(sql);
  console.log("✅ Bảng 'companies' đã sẵn sàng!");
};
