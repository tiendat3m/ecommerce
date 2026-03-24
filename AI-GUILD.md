Tên shop: [apple-shop]
Loại sản phẩm: Các sản phẩm liên quan đến apple
Database: [PostgreSQL / SQLite cho đơn giản]
Payment: [Stripe / bỏ qua payment trước]

Build a full-stack e-commerce application with COMPLETELY SEPARATE backend and frontend folders.
Root structure:
/ecommerce-app
  /backend    ← Node.js + Express + Prisma (REST API)
  /frontend   ← Next.js 14 (App Router, consume API)

---

## 📁 BACKEND STRUCTURE (/backend)

Tech stack:
- Node.js + Express.js + TypeScript
- Prisma ORM + PostgreSQL
- JWT (access token 15m + refresh token 7d)
- bcryptjs, cookie-parser, cors
- Zod (validation), multer + Cloudinary (upload)
- Stripe (payment webhook)
- Docker Compose (PostgreSQL)

Folder structure:
/backend
  /src
    /config
      db.ts           # Prisma client
      cloudinary.ts
      stripe.ts
      env.ts          # Zod env validation
    /middlewares
      auth.ts          # verifyToken, requireAdmin
      validate.ts      # Zod middleware
      errorHandler.ts
      upload.ts        # multer config
    /modules
      /auth
        auth.routes.ts
        auth.controller.ts
        auth.service.ts
        auth.schema.ts   # Zod schemas
      /users
        users.routes.ts
        users.controller.ts
        users.service.ts
      /products
        products.routes.ts
        products.controller.ts
        products.service.ts
        products.schema.ts
      /categories
        categories.routes.ts
        categories.controller.ts
        categories.service.ts
      /orders
        orders.routes.ts
        orders.controller.ts
        orders.service.ts
      /reviews
        reviews.routes.ts
        reviews.controller.ts
        reviews.service.ts
      /payment
        payment.routes.ts
        payment.controller.ts
        payment.service.ts
      /upload
        upload.routes.ts
        upload.controller.ts
    /utils
      jwt.ts
      pagination.ts
      apiResponse.ts   # { success, data, message, meta }
      asyncHandler.ts
    /types
      express.d.ts     # extend Request with user
      index.ts
    app.ts
    server.ts
  /prisma
    schema.prisma
    seed.ts
  .env.example
  docker-compose.yml
  package.json
  tsconfig.json

---

## 🗄️ PRISMA SCHEMA

model User {
  id           String    @id @default(cuid())
  name         String
  email        String    @unique
  password     String?
  role         Role      @default(USER)
  avatar       String?
  refreshToken String?
  orders       Order[]
  reviews      Review[]
  addresses    Address[]
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

model Address {
  id         String  @id @default(cuid())
  user       User    @relation(fields: [userId], references: [id])
  userId     String
  fullName   String
  phone      String
  street     String
  city       String
  province   String
  isDefault  Boolean @default(false)
}

model Product {
  id           String      @id @default(cuid())
  name         String
  slug         String      @unique
  description  String
  price        Float
  comparePrice Float?
  stock        Int         @default(0)
  images       String[]
  categoryId   String
  category     Category    @relation(fields: [categoryId], references: [id])
  tags         String[]
  featured     Boolean     @default(false)
  isActive     Boolean     @default(true)
  orderItems   OrderItem[]
  reviews      Review[]
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
}

model Category {
  id       String    @id @default(cuid())
  name     String
  slug     String    @unique
  image    String?
  products Product[]
}

model Order {
  id              String      @id @default(cuid())
  userId          String
  user            User        @relation(fields: [userId], references: [id])
  items           OrderItem[]
  status          OrderStatus @default(PENDING)
  total           Float
  shippingAddress Json
  paymentIntent   String?
  paymentStatus   PaymentStatus @default(UNPAID)
  note            String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id])
  productId String
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int
  price     Float
  snapshot  Json    # lưu tên, ảnh product tại thời điểm mua
}

model Review {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  productId String
  product   Product  @relation(fields: [productId], references: [id])
  rating    Int      # 1-5
  comment   String?
  createdAt DateTime @default(now())
  @@unique([userId, productId])
}

enum Role          { USER ADMIN }
enum OrderStatus   { PENDING PROCESSING SHIPPED DELIVERED CANCELLED }
enum PaymentStatus { UNPAID PAID REFUNDED }

---

## 🔌 API ENDPOINTS (Backend)

Base URL: http://localhost:4000/api/v1

### Auth
POST   /auth/register
POST   /auth/login
POST   /auth/logout
POST   /auth/refresh-token
GET    /auth/me

### Users (Admin)
GET    /users               ?page&limit&search
GET    /users/:id
PUT    /users/:id
DELETE /users/:id
PUT    /users/:id/role

### Products
GET    /products            ?page&limit&category&search&sort&minPrice&maxPrice&featured
GET    /products/:slug
POST   /products            [ADMIN]
PUT    /products/:id        [ADMIN]
DELETE /products/:id        [ADMIN]

### Categories
GET    /categories
GET    /categories/:slug
POST   /categories          [ADMIN]
PUT    /categories/:id      [ADMIN]
DELETE /categories/:id      [ADMIN]

### Orders
GET    /orders              (user's own orders)
GET    /orders/:id
POST   /orders
GET    /admin/orders        [ADMIN] ?page&limit&status
PUT    /admin/orders/:id/status  [ADMIN]

### Reviews
GET    /products/:productId/reviews
POST   /products/:productId/reviews  [AUTH]
DELETE /reviews/:id         [AUTH/ADMIN]

### Upload
POST   /upload/image        [ADMIN] → returns { url }
POST   /upload/images       [ADMIN] → returns { urls[] }

### Payment
POST   /payment/create-intent
POST   /payment/webhook     (Stripe webhook)

### Dashboard (Admin)
GET    /admin/stats         → { revenue, orders, users, products }
GET    /admin/revenue-chart → monthly revenue last 12 months

---

## 🔐 AUTH FLOW (JWT)

- Login → trả về accessToken (15 phút) trong body + refreshToken (7 ngày) trong httpOnly cookie
- Mọi request private → gửi Authorization: Bearer <accessToken>
- accessToken hết hạn → gọi POST /auth/refresh-token → nhận accessToken mới
- Logout → xóa refreshToken trong DB + clear cookie

---

## 📁 FRONTEND STRUCTURE (/frontend)

Tech stack:
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- TanStack Query v5 (server state)
- Zustand (cart, auth client state)
- Axios instance (auto refresh token, interceptors)
- React Hook Form + Zod
- Framer Motion
- next-themes (dark mode)
- sonner (toast)

Folder structure:
/frontend
  /app
    /(auth)
      /login/page.tsx
      /register/page.tsx
      /forgot-password/page.tsx
    /(shop)
      /layout.tsx            # Header + Footer
      /page.tsx              # Homepage
      /products/page.tsx     # Listing + filter
      /products/[slug]/page.tsx
      /cart/page.tsx
      /checkout/page.tsx
      /checkout/success/page.tsx
    /(account)
      /account/layout.tsx    # Sidebar account
      /account/profile/page.tsx
      /account/orders/page.tsx
      /account/orders/[id]/page.tsx
      /account/addresses/page.tsx
    /(admin)
      /admin/layout.tsx      # Admin sidebar
      /admin/page.tsx        # Dashboard
      /admin/products/page.tsx
      /admin/products/new/page.tsx
      /admin/products/[id]/edit/page.tsx
      /admin/orders/page.tsx
      /admin/orders/[id]/page.tsx
      /admin/users/page.tsx
      /admin/categories/page.tsx
    /api/                    # Next.js route (chỉ dùng cho revalidate nếu cần)
    /layout.tsx
    /not-found.tsx
    /error.tsx
  /components
    /layout
      Header.tsx             # Nav, search, cart icon, user menu
      Footer.tsx
      MobileNav.tsx
    /ui/                     # shadcn components
    /products
      ProductCard.tsx
      ProductGrid.tsx
      ProductFilter.tsx      # sidebar filter
      ProductSort.tsx
      ProductGallery.tsx
      ProductReviews.tsx
      AddToCartButton.tsx
      WishlistButton.tsx
    /cart
      CartDrawer.tsx         # slide-over
      CartItem.tsx
      CartSummary.tsx
    /checkout
      CheckoutForm.tsx
      AddressForm.tsx
      PaymentForm.tsx        # Stripe Elements
      OrderSummary.tsx
    /admin
      Sidebar.tsx
      DataTable.tsx          # reusable table với sort/filter
      StatsCard.tsx
      RevenueChart.tsx
      ProductForm.tsx
      OrderStatusBadge.tsx
    /common
      Pagination.tsx
      SearchBar.tsx
      ImageUpload.tsx
      ConfirmDialog.tsx
      EmptyState.tsx
      LoadingSpinner.tsx
      SkeletonCard.tsx
  /hooks
    useCart.ts
    useAuth.ts
    useProducts.ts
    useOrders.ts
    useDebounce.ts
  /lib
    axios.ts                 # axios instance + interceptors
    queryClient.ts
    stripe.ts                # loadStripe
    utils.ts                 # cn, formatPrice, formatDate
  /services                  # API call functions
    auth.service.ts
    products.service.ts
    orders.service.ts
    users.service.ts
    upload.service.ts
  /store
    cartStore.ts             # Zustand
    authStore.ts             # Zustand
  /types
    index.ts                 # Product, User, Order, etc.
  /validations
    auth.schema.ts
    checkout.schema.ts
    product.schema.ts
  /constants
    index.ts                 # routes, query keys
  .env.example
  package.json
  next.config.ts
  tailwind.config.ts

---

## 🔄 AXIOS INTERCEPTOR (frontend/lib/axios.ts)

- Request interceptor: tự động đính kèm Authorization: Bearer <token> từ store
- Response interceptor: nếu nhận 401 → tự gọi /auth/refresh-token → retry request gốc
- Nếu refresh thất bại → logout + redirect /login

---

## 🌐 ENVIRONMENT VARIABLES

### Backend (.env)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecommerce
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
CLIENT_URL=http://localhost:3000
PORT=4000

### Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...

---

## 🌱 SEED DATA

Tạo prisma/seed.ts với:
- 1 admin: admin@shop.com / Admin123!
- 3 users thường với orders mẫu
- 6 categories: Electronics, Clothing, Books, Sports, Home, Beauty
- 30 products với đầy đủ data (hình từ Unsplash API)
- 10 orders với nhiều status khác nhau
- Reviews cho sản phẩm

---

## 📋 DELIVERABLES

Tạo đầy đủ:
1. /backend — Express API hoàn chỉnh, chạy được
2. /frontend — Next.js app hoàn chỉnh, consume backend API
3. /backend/docker-compose.yml
4. /backend/prisma/seed.ts
5. README.md ở root với hướng dẫn:
   - Prerequisites
   - Setup backend (npm install, env, docker, migrate, seed, dev)
   - Setup frontend (npm install, env, dev)
   - API documentation link hoặc tóm tắt

---

Bắt đầu theo thứ tự:
1. Backend: Prisma schema + migrations
2. Backend: Auth module (register/login/refresh/me)
3. Backend: Products, Categories, Orders, Reviews modules
4. Backend: Payment + Upload
5. Backend: Admin routes + seed data
6. Frontend: axios setup + types + stores
7. Frontend: Auth pages + protected routes
8. Frontend: Shop pages (home, listing, detail)
9. Frontend: Cart + Checkout + Payment
10. Frontend: Account pages
11. Frontend: Admin dashboard

Bắt đầu từ bước 1 ngay bây giờ.