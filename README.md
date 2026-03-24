# Apple Shop E-commerce

Full-stack e-commerce application for Apple products with separate backend (Node.js + Express + Prisma) and frontend (Next.js 14).

## 🚀 Features

### Backend (Node.js + Express + Prisma)
- **Authentication**: JWT-based with access/refresh tokens
- **Products**: CRUD with categories, images, stock management
- **Orders**: Full order lifecycle with status tracking
- **Reviews**: Product reviews with ratings
- **Payment**: Stripe integration (simulated for demo)
- **Upload**: Cloudinary for image storage
- **Admin**: Dashboard with stats and management tools

### Frontend (Next.js 14 + TypeScript)
- **Modern UI**: Tailwind CSS + shadcn/ui components
- **Dark Mode**: Theme switching support
- **Responsive**: Mobile-first design
- **State Management**: Zustand for cart and auth
- **Forms**: React Hook Form + Zod validation
- **API Integration**: Axios with interceptors

## 📋 Prerequisites

- Node.js >= 18
- Docker & Docker Compose (for PostgreSQL)
- npm or pnpm

## 🛠️ Setup Instructions

### 1. Clone and Setup

```bash
# Navigate to project directory
cd e-commerce

# Setup Backend
cd backend
cp .env.example .env
# Edit .env with your credentials

# Setup Frontend  
cd ../frontend
cp .env.example .env.local
# Edit .env.local with API URL
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Start PostgreSQL with Docker
docker-compose up -d

# Run Prisma migrations
npx prisma migrate dev

# Seed database with sample data
npm run db:seed

# Start development server
npm run dev
```

Backend will run on http://localhost:4000

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on http://localhost:3000

## 🔑 Test Accounts

After running the seed script:

- **Admin**: admin@shop.com / Admin123!
- **User**: john@example.com / User123!

## 📁 Project Structure

```
/e-commerce
├── /backend
│   ├── /src
│   │   ├── /config        # Database, Cloudinary, Stripe configs
│   │   ├── /middlewares    # Auth, validation, error handling
│   │   ├── /modules        # Feature modules (auth, products, etc.)
│   │   ├── /utils          # Helpers (JWT, pagination, etc.)
│   │   ├── /types          # TypeScript types
│   │   ├── app.ts          # Express app setup
│   │   └── server.ts       # Server entry point
│   ├── /prisma
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.ts         # Seed data
│   └── docker-compose.yml
│
├── /frontend
│   ├── /app
│   │   ├── /(auth)         # Login, Register pages
│   │   ├── /(shop)         # Shop pages (home, products, cart)
│   │   ├── /(account)      # User account pages
│   │   ├── /(admin)        # Admin dashboard
│   │   └── layout.tsx      # Root layout
│   ├── /components
│   │   ├── /layout         # Header, Footer
│   │   ├── /products       # ProductCard, filters
│   │   └── /ui             # Reusable UI components
│   ├── /store              # Zustand stores
│   ├── /lib                # Utilities, axios config
│   ├── /services           # API service functions
│   └── /types              # TypeScript types
│
└── README.md
```

## 🔌 API Endpoints

### Auth
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/logout` - Logout

### Products
- `GET /api/v1/products` - List products (with filters)
- `GET /api/v1/products/:slug` - Get product by slug
- `POST /api/v1/products` - Create product (Admin)
- `PUT /api/v1/products/:id` - Update product (Admin)
- `DELETE /api/v1/products/:id` - Delete product (Admin)

### Orders
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders` - Get user orders
- `GET /api/v1/orders/:id` - Get order details
- `GET /api/v1/orders/admin` - Get all orders (Admin)
- `PUT /api/v1/orders/admin/:id/status` - Update order status (Admin)

### Categories
- `GET /api/v1/categories` - List categories
- `GET /api/v1/categories/:slug` - Get category by slug
- `POST /api/v1/categories` - Create category (Admin)
- `PUT /api/v1/categories/:id` - Update category (Admin)
- `DELETE /api/v1/categories/:id` - Delete category (Admin)

### Reviews
- `GET /api/v1/products/:productId/reviews` - Get product reviews
- `POST /api/v1/products/:productId/reviews` - Create review
- `DELETE /api/v1/reviews/:id` - Delete review

### Upload
- `POST /api/v1/upload/image` - Upload single image (Admin)
- `POST /api/v1/upload/images` - Upload multiple images (Admin)

### Payment
- `POST /api/v1/payment/create-intent` - Create payment intent
- `POST /api/v1/payment/webhook` - Stripe webhook
- `POST /api/v1/payment/refund` - Process refund (Admin)

## 🎨 Design System

The frontend uses a consistent design system with:
- **Colors**: Primary (blue), secondary (gray), semantic colors
- **Typography**: Inter font family
- **Spacing**: Tailwind CSS spacing scale
- **Components**: Reusable UI components with variants
- **Dark Mode**: Full dark mode support

## 🔒 Security Features

- JWT authentication with refresh tokens
- Password hashing with bcryptjs
- Input validation with Zod
- CORS configuration
- Rate limiting ready
- SQL injection prevention (Prisma ORM)
- XSS protection

## 📦 Database Schema

The database includes the following models:
- **User**: Authentication and profile data
- **Product**: Product information with images
- **Category**: Product categories
- **Order**: Order information
- **OrderItem**: Individual items in orders
- **Review**: Product reviews and ratings
- **Address**: User shipping addresses

## 🚀 Deployment

### Backend Deployment
1. Set up PostgreSQL database
2. Configure environment variables
3. Run migrations: `npx prisma migrate deploy`
4. Start server: `npm start`

### Frontend Deployment
1. Build the application: `npm run build`
2. Start production server: `npm start`
3. Or deploy to Vercel/Netlify

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.