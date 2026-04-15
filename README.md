Sửa file .env.example -> .env và điền tài khoản MySQL vào.

Điền tài khoản MySQL vào file db.js và init-db.js

Vào thư mục backend, gõ lệnh npm install multer bullmq pdf2json để cài đặt các thư viện cần thiết

Gõ npm run db:init để tạo database

Tải Docker về máy ở link sau: https://www.docker.com/

Bật Docker.exe trên máy lên

Vào backend, gõ npm install @elastic/elasticsearch@8.15.0

Ở thư mục chính của project gõ: docker compose up -d

Vào backend, gõ node seed-es.cjs (Chỉ cần gõ 1 lần duy nhất khi mới clone project về)

Gõ npm run dev để khởi động backend

Tạo terminal mới, gõ lệnh node .\src\workers\cvWorker.js để khởi động bullmq

Tạo terminal mới, vào thư mục frontend gõ lệnh npm install để cài đặt các thư viện cần thiết

Gõ npm run dev để khởi động frontend.

Cài đặt extension OpenAPI (Swagger) Editor sau đó dùng file swagger.yaml để test API
