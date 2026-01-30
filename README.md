# 💰 MoneyTrack - Personal Expense Tracker

> Ứng dụng quản lý chi tiêu cá nhân hiện đại, an toàn và dễ sử dụng

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev/)
[![NestJS](https://img.shields.io/badge/NestJS-11.0-red?logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue?logo=postgresql)](https://www.postgresql.org/)

## ✨ Tính năng nổi bật

### 🔐 Xác thực & Bảo mật

- OAuth 2.0 (Google, Facebook) + Email/Password
- JWT tokens với refresh mechanism
- Row Level Security (RLS) trên database
- Helmet security headers + CORS protection
- Rate limiting: 10 requests/60s

### 📊 Quản lý tài chính

- **Dashboard**: Tổng quan tài chính real-time với charts
- **Giao dịch**: CRUD transactions với filters, pagination, search
- **Tài khoản**: Multi-account support (bank, cash, e-wallet)
- **Ngân sách**: Budget tracking với alerts tự động
- **Báo cáo**: Monthly/yearly reports, category breakdown

### 🎨 Trải nghiệm người dùng

- Dark/Light mode tự động
- Responsive design (mobile-first)
- Empty states với inline creation flows
- Real-time validation với Zod
- Toast notifications
- PWA support (offline-ready)

### ⚡ Hiệu năng

- Database views optimized (70% faster queries)
- 20 strategic indexes
- Response caching (5min TTL)
- Gzip compression
- Image optimization (AVIF/WebP)
- Code splitting & lazy loading

## 🏗️ Kiến trúc

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   Frontend      │──────│    Backend      │──────│   Database      │
│   Next.js 16    │ HTTP │   NestJS 11     │ RLS  │  PostgreSQL     │
│   React 19      │ API  │   + Guards      │      │  + Supabase     │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

### Tech Stack

**Frontend:**

- Next.js 16.1 (App Router) - React framework with SSR
- React 19.2 - UI library
- TypeScript 5.0 - Type safety
- Tailwind CSS 4 - Utility-first CSS
- React Hook Form + Zod - Form validation
- Recharts - Data visualization
- Axios - HTTP client

**Backend:**

- NestJS 11.0 - Node.js framework
- Supabase Client 2.90 - PostgreSQL client
- Helmet - Security headers
- Compression - Gzip compression
- Cache Manager - Response caching
- Throttler - Rate limiting

**Database:**

- PostgreSQL 15+ (via Supabase)
- 8 tables + 4 optimized views
- 20 performance indexes
- Row Level Security (RLS)
- Audit logging
- Automatic triggers

## 🚀 Quick Start

### Yêu cầu

- Node.js 20+ và npm/yarn
- Supabase account (free tier)
- Git

### 1️⃣ Clone repository

```bash
git clone <repository-url>
cd expense-tracker
```

### 2️⃣ Cài đặt dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 3️⃣ Cấu hình môi trường

**Frontend** - Tạo `frontend/.env.local`:

```env
# API URL phải bao gồm /api ở cuối
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Backend** - Tạo `backend/.env`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Frontend URL (không có /api)
FRONTEND_URL=http://localhost:3000
PORT=3001
NODE_ENV=development
```

> 💡 Lấy credentials từ Supabase Dashboard → Project Settings → API

### 4️⃣ Setup Database

1. Vào **Supabase Dashboard → SQL Editor**
2. Chạy các file theo thứ tự:

```sql
-- 1. Schema (tables, RLS, functions, triggers)
database/01_schema.sql

-- 2. Views (optimized queries)
database/02_views.sql

-- 3. Indexes (performance)
database/03_indexes.sql
```

📖 Chi tiết: [database/README.md](database/README.md)

### 5️⃣ Chạy ứng dụng

```bash
# Terminal 1 - Backend
cd backend
npm run start:dev
# → http://localhost:3001

# Terminal 2 - Frontend
cd frontend
npm run dev
# → http://localhost:3000
```

### 6️⃣ Verify

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api
- Tạo tài khoản mới và test features

## 🐛 Troubleshooting

**Database connection error:**

- Kiểm tra Supabase credentials trong `.env`
- Verify RLS policies đã được enable
- Check network firewall settings

**Build errors:**

```bash
# Clear cache và reinstall
rm -rf node_modules package-lock.json
npm install
```

**Port conflicts:**

```bash
# Kill processes on ports
npx kill-port 3000 3001
```

## 🧰 Available Scripts

### Frontend

```bash
npm run dev          # Development server (localhost:3000)
npm run build        # Production build
npm start            # Start production server
npm run lint         # Run ESLint
```

### Backend

```bash
npm run start:dev    # Development with watch mode
npm run start:prod   # Production server
npm run build        # Build for production
npm run test         # Run unit tests
npm run test:e2e     # Run E2E tests
npm run lint         # Run ESLint + fix
```

## 📦 Deployment

### Frontend (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```

**Environment Variables (Vercel Dashboard):**

```env
# ⚠️ CHÚ Ý: API_URL phải có /api ở cuối
NEXT_PUBLIC_API_URL=https://your-backend-url.up.railway.app/api
NEXT_PUBLIC_SITE_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

### Backend (Railway/Render)

```bash
# Build
cd backend
npm run build

# Start
npm run start:prod
```

**Environment Variables (Railway/Render Dashboard):**

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ⚠️ CHÚ Ý: FRONTEND_URL không có /api
FRONTEND_URL=https://your-frontend.vercel.app
PORT=3001
NODE_ENV=production
```

### Database (Supabase)

- Database đã hosted trên Supabase
- Chỉ cần run SQL scripts qua SQL Editor
- RLS policies tự động protect data

## 📖 Documentation

- **[Frontend README](frontend/README.md)** - Frontend architecture & setup
- **[Backend README](backend/README.md)** - API endpoints & modules
- **[Database README](database/README.md)** - Schema, views, indexes

## 🔒 Security

- ✅ JWT authentication with refresh tokens
- ✅ Row Level Security (RLS) on all tables
- ✅ Helmet security headers
- ✅ CORS protection
- ✅ Rate limiting (10 req/60s)
- ✅ Input validation with Zod
- ✅ SQL injection protection via Supabase client
- ✅ XSS protection
- ✅ Audit logging

## 👥 Authors

- **Nguyen Vo Hiep** - Initial work

## 🙏 Acknowledgments

- Next.js team for amazing React framework
- NestJS team for powerful Node.js framework
- Supabase for database hosting
- Open source community

---

<div align="center">
  Made with ❤️ by Nguyen Vo Hiep
</div>

## 📞 Support

For issues and questions:

- 🐛 [GitHub Issues](https://github.com/nvhiep1811)
- 📧 Email: 2270701.hiep@student.iuh.edu.vn

---

<div align="center">
  <strong>⭐ Star this repo if you find it helpful!</strong>
</div>
