# Online Shop API

Framework Node.js/Express dùng chung cho nhóm, có kết nối MySQL và CRUD cho đối tượng `products`.

## Chạy dự án

1. Sao chép `.env.example` thành `.env` và điền thông tin MySQL.
2. Chạy `sql/schema.sql` trong MySQL.
3. Cài dependency và khởi động:

```bash
npm install
npm start
```

## API CRUD

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| GET | `/api/products` | Lấy danh sách |
| GET | `/api/products/:id` | Lấy một sản phẩm |
| POST | `/api/products` | Thêm sản phẩm |
| PUT | `/api/products/:id` | Cập nhật sản phẩm |
| DELETE | `/api/products/:id` | Xóa sản phẩm |

Body của `POST` và `PUT` gồm `category_id`, `name`, `price`, `quantity`; `description`, `image` và `status` là tùy chọn.
`status` nhận một trong hai giá trị `active` hoặc `inactive`.

CRUD đang sử dụng đúng cấu trúc bảng `products` trong [`sql/schema.sql`](sql/schema.sql), bao gồm quan hệ khóa ngoại với bảng `categories`.

## Minh chứng nộp bài

Thêm ảnh chụp màn hình chạy `.devcontainer`, kết nối CSDL và các request CRUD vào `docs/screenshots/`, sau đó chèn ảnh vào README theo mẫu:

```markdown
![Kết nối CSDL](docs/screenshots/database.png)
![CRUD products](docs/screenshots/crud-products.png)
```
