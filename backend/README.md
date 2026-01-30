# 🚀 MoneyTrack - Backend API

> RESTful API backend cho ứng dụng quản lý chi tiêu, xây dựng bằng NestJS

[![NestJS](https://img.shields.io/badge/NestJS-11.0-red?logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue?logo=postgresql)](https://www.postgresql.org/)

## ✨ Features

### 🔐 Authentication & Security

- JWT tokens với refresh mechanism
- OAuth 2.0 support (Google, GitHub)
- Password hashing với bcrypt
- Email verification & reset password
- AuthGuard protection cho protected routes

### 📊 API Modules

**Authentication (`/api/auth`)**

- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `POST /check-email` - Check email existence
- `POST /forgot-password` - Request reset password
- `POST /reset-password` - Reset password

**Profiles (`/api/profiles`)**

- `GET /me` - Get current user profile
- `PATCH /` - Update profile
- `PATCH /preferences` - Update preferences
- `POST /change-password` - Change password

**Accounts (`/api/accounts`)**

- `GET /` - List accounts (với soft delete filter)
- `GET /:id` - Get account details
- `POST /` - Create new account
- `PATCH /:id` - Update account
- `DELETE /:id` - Soft delete account

**Transactions (`/api/transactions`)**

- `GET /` - List transactions (filters: type, date, search, pagination)
- `GET /:id` - Get transaction details
- `POST /` - Create transaction
- `PATCH /:id` - Update transaction
- `DELETE /:id` - Soft delete transaction

**Budgets (`/api/budgets`)**

- `GET /` - List budgets
- `GET /status` - Get budget status (spent, remaining, percentage)
- `GET /:id` - Get budget details
- `POST /` - Create budget
- `PATCH /:id` - Update budget
- `DELETE /:id` - Delete budget

**Categories (`/api/categories`)**

- `GET /` - List categories (income/expense)
- `POST /` - Create custom category

**Dashboard (`/api/dashboard`)**

- `GET /stats` - Financial statistics (netWorth, currentMonth, categorySpending, monthlyCashflow)

**Recurring Rules (`/api/recurring-rules`)**

- `GET /` - List recurring rules
- `POST /` - Create recurring rule
- `DELETE /:id` - Delete recurring rule

**Alerts (`/api/alerts`)**

- `GET /` - List alerts
- `PATCH /:id/read` - Mark alert as read

### 🛡️ Security Features

- ✅ Helmet security headers
- ✅ CORS protection
- ✅ Rate limiting (10 requests/60s)
- ✅ Input validation với class-validator
- ✅ SQL injection protection (Supabase RLS)
- ✅ XSS protection
- ✅ Throttling

### ⚡ Performance

- ✅ Response caching (5min TTL)
- ✅ Gzip compression
- ✅ Database connection pooling
- ✅ Optimized queries với database views

## 🏗️ Architecture

```
backend/
├── src/
│   ├── auth/                  # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── dto/
│   ├── accounts/              # Accounts module
│   ├── transactions/          # Transactions module
│   ├── budgets/               # Budgets module
│   ├── categories/            # Categories module
│   ├── profiles/              # Profiles module
│   ├── dashboard/             # Dashboard module
│   ├── recurring-rules/       # Recurring rules module
│   ├── alerts/                # Alerts module
│   ├── common/                # Shared utilities
│   │   ├── guards/            # Auth guards
│   │   ├── filters/           # Exception filters
│   │   ├── services/          # Base services
│   │   └── config/            # Configuration
│   ├── app.module.ts          # Root module
│   └── main.ts                # Entry point
├── test/                      # E2E tests
└── nest-cli.json              # NestJS config
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+ (via Supabase)
- npm hoặc yarn

### Installation

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env với credentials thực tế
```

### Configuration

Tạo file `.env`:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# CORS & Email Redirects (⚠️ không có /api ở cuối)
FRONTEND_URL=http://localhost:3000

# Server
PORT=3001
NODE_ENV=development
```

**Production:**

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
FRONTEND_URL=https://your-frontend.vercel.app
PORT=3001
NODE_ENV=production
```

> 🔑 Lấy credentials từ: Supabase Dashboard → Project Settings → API
> ⚠️ **Quan trọng:** `FRONTEND_URL` dùng cho CORS và email redirects, không được có `/api`

### Running the API

```bash
# Development
npm run start:dev
# → http://localhost:3001

# Production build
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

## 🧪 Testing

````bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

## 📦 Deployment

### Railway / Render (Recommended)

1. **Connect Git Repository**
2. **Set Environment Variables:**
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   FRONTEND_URL=https://your-frontend.vercel.app
   PORT=3001
   NODE_ENV=production
   ```

   > ⚠️ **Lưu ý:** `FRONTEND_URL` không có `/api` ở cuối (dùng cho CORS + email redirects)

3. **Build Command:** `npm run build`
4. **Start Command:** `npm run start:prod`
5. **Health Check:** `GET /api` (should return 404 but server running)

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "run", "start:prod"]
````

```bash
# Build & run
docker build -t moneytrack-backend .
docker run -p 3001:3001 --env-file .env moneytrack-backend
```

## 🐛 Troubleshooting

**Database connection error:**

- Verify Supabase credentials trong `.env`
- Test: `curl $SUPABASE_URL`

**Port conflicts:**

```bash
npx kill-port 3001
```

**Module errors:**

```bash
rm -rf dist node_modules
npm install && npm run build
```

## 📚 Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

<div align="center">
  Made with ❤️ by Nguyen Vo Hiep
</div>
