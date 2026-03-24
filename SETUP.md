# 🛠️ Hướng dẫn Setup Apple Shop E-commerce

## 📋 Yêu cầu hệ thống

- Node.js >= 18
- npm hoặc pnpm
- Trình duyệt web

## 🚀 Cách chạy dự án

### 1. Backend Setup

```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt dependencies
npm install

# Tạo file .env (đã có sẵn)
# File .env đã được cấu hình với SQLite database

# Generate Prisma client
npx prisma generate

# Tạo database và tables
npx prisma migrate dev --name init

# Seed dữ liệu mẫu
npm run db:seed

# Start backend server
npm run dev
```

Backend sẽ chạy trên: **http://localhost:4000**

### 2. Frontend Setup

```bash
# Mở terminal mới, di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install

# Start frontend server
npm run dev
```

Frontend sẽ chạy trên: **http://localhost:3000**

## 🔧 Cấu hình Environment Variables

### Backend (.env)
```env
# Database (SQLite - đã cấu hình sẵn)
DATABASE_URL="file:./dev.db"

# JWT Secrets (tự tạo)
JWT_ACCESS_SECRET=apple-shop-access-secret-2024
JWT_REFRESH_SECRET=apple-shop-refresh-secret-2024
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# Cloudinary (tùy chọn - để upload ảnh)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Stripe (tùy chọn - để thanh toán)
STRIPE_SECRET_KEY=sk_test_your-stripe-secret
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Server
PORT=4000
CLIENT_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable
```

## 👥 Test Accounts

Sau khi chạy `npm run db:seed`, bạn có các tài khoản:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@shop.com | Admin123! |
| User | john@example.com | User123! |
| User | jane@example.com | User123! |
| User | bob@example.com | User123! |

## 🗄️ Database Schema

### Models:
- **User**: Người dùng (admin/user)
- **Product**: Sản phẩm
- **Category**: Danh mục
- **Order**: Đơn hàng
- **OrderItem**: Chi tiết đơn hàng
- **Review**: Đánh giá
- **Address**: Địa chỉ giao hàng

### Seed Data:
- 6 Categories (iPhone, MacBook, iPad, Apple Watch, AirPods, Accessories)
- 21 Products (Apple products với giá)
- 4 Users (1 admin + 3 users)
- 10 Orders (mẫu)
- Reviews (cho delivered orders)

## 🛒 Tính năng

### Frontend:
- ✅ Trang chủ với hero, categories, featured products
- ✅ Danh sách sản phẩm với filters, search, pagination
- ✅ Chi tiết sản phẩm với reviews
- ✅ Giỏ hàng (lưu local storage)
- ✅ Checkout flow
- ✅ Tài khoản người dùng (profile, orders, addresses)
- ✅ Admin dashboard (quản lý products, orders)
- ✅ Dark mode
- ✅ Responsive design

### Backend:
- ✅ JWT Authentication (access + refresh tokens)
- ✅ CRUD Products, Categories, Orders, Reviews
- ✅ File upload (Cloudinary - optional)
- ✅ Payment integration (Stripe - optional)
- ✅ Pagination, filtering, sorting
- ✅ Admin APIs

## 🔌 API Endpoints

### Auth
- `POST /api/v1/auth/register` - Đăng ký
- `POST /api/v1/auth/login` - Đăng nhập
- `POST /api/v1/auth/refresh-token` - Refresh token
- `GET /api/v1/auth/me` - Lấy thông tin user
- `POST /api/v1/auth/logout` - Đăng xuất

### Products
- `GET /api/v1/products` - Lấy danh sách sản phẩm
- `GET /api/v1/products/:slug` - Lấy chi tiết sản phẩm
- `POST /api/v1/products` - Tạo sản phẩm (Admin)
- `PUT /api/v1/products/:id` - Cập nhật sản phẩm (Admin)
- `DELETE /api/v1/products/:id` - Xóa sản phẩm (Admin)

### Orders
- `POST /api/v1/orders` - Tạo đơn hàng
- `GET /api/v1/orders` - Lấy đơn hàng của user
- `GET /api/v1/orders/:id` - Lấy chi tiết đơn hàng
- `GET /api/v1/orders/admin` - Lấy tất cả đơn hàng (Admin)
- `PUT /api/v1/orders/admin/:id/status` - Cập nhật trạng thái (Admin)

### Categories
- `GET /api/v1/categories` - Lấy danh sách categories
- `GET /api/v1/categories/:slug` - Lấy chi tiết category

### Reviews
- `GET /api/v1/products/:productId/reviews` - Lấy reviews
- `POST /api/v1/products/:productId/reviews` - Tạo review
- `DELETE /api/v1/reviews/:id` - Xóa review

## 🎨 Frontend Routes

### Public:
- `/` - Trang chủ
- `/products` - Danh sách sản phẩm
- `/products/:slug` - Chi tiết sản phẩm
- `/cart` - Giỏ hàng

### Auth:
- `/login` - Đăng nhập
- `/register` - Đăng ký

### User (cần đăng nhập):
- `/account` - Hồ sơ
- `/account/orders` - Đơn hàng
- `/account/addresses` - Địa chỉ
- `/checkout` - Thanh toán

### Admin:
- `/admin` - Dashboard
- `/admin/products` - Quản lý sản phẩm
- `/admin/orders` - Quản lý đơn hàng

## 🐛 Troubleshooting

### Lỗi: "Cannot find module"
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

### Lỗi: "Database is locked"
```bash
# Dừng server, xóa database và migrate lại
rm backend/prisma/dev.db
npx prisma migrate dev --name init
npm run db:seed
```

### Lỗi: "Port already in use"
```bash
# Tìm process đang dùng port và kill
# Windows:
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:4000 | xargs kill -9
```

## 📝 Ghi chú

- Database SQLite được lưu tại `backend/prisma/dev.db`
- Seed data đã bao gồm sản phẩm Apple mẫu
- Admin có thể thêm/sửa/xóa sản phẩm
- User có thể đặt hàng, đánh giá sản phẩm
- Project đã sẵn sàng để deploy lên production

## 🚀 Deploy (Optional)

### Backend:
- Đổi SQLite sang PostgreSQL
- Deploy lên Railway, Render, hoặc VPS

### Frontend:
- Deploy lên Vercel
- Cập nhật `NEXT_PUBLIC_API_URL` thành production URL