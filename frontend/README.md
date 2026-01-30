# 🎨 MoneyTrack - Frontend

> Modern, responsive frontend cho ứng dụng quản lý chi tiêu

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)

## ✨ Features

### 📝 Pages

- **Landing Page** - Hero, features, CTA
- **Authentication** - Login, Register, OAuth (Google/GitHub), Forgot/Reset Password
- **Dashboard** - Financial overview với charts, stats, recent transactions
- **Transactions** - CRUD, filters (type, date, search), pagination
- **Accounts** - Multi-account management (bank, cash, e-wallet)
- **Budgets** - Budget tracking với progress bars, alerts
- **Reports** - Monthly/yearly analysis, category breakdown
- **Settings** - Profile, security, preferences, theme

### 🎨 UI/UX

- ✅ Dark/Light mode với system preference detection
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Empty states với inline creation flows
- ✅ Modal forms với real-time validation
- ✅ Toast notifications
- ✅ Loading states & skeletons
- ✅ Error boundaries

### ⚡ Performance

- Server-side rendering (SSR)
- Static generation cho landing pages
- Image optimization (AVIF/WebP)
- Code splitting & lazy loading
- Optimized package imports (lucide-react, recharts)
- Gzip compression

### 🔒 Security

- Helmet security headers
- XSS protection
- CSRF protection
- Secure cookies (httpOnly, secure, sameSite)
- Content Security Policy

## 🏗️ Tech Stack

**Core:**

- **Next.js 16.1** - React framework với App Router
- **React 19.2** - UI library với React Compiler
- **TypeScript 5.0** - Type safety

**Styling:**

- **Tailwind CSS 4** - Utility-first CSS framework
- **CSS Variables** - Dark/light theme support

**Forms & Validation:**

- **React Hook Form 7.70** - Performant form handling
- **Zod 4.3** - Schema validation
- **@hookform/resolvers** - Integration layer

**Data Visualization:**

- **Recharts 3.6** - Chart library

**HTTP Client:**

- **Axios 1.13** - Promise-based HTTP client

**Icons & UI:**

- **Lucide React 0.562** - Icon library
- **React Hot Toast 2.6** - Toast notifications

**Fonts:**

- **Geist Sans & Mono** - Modern font families

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm hoặc yarn

### Installation

```bash
# Clone & navigate
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local với các giá trị thực tế

# Run development server
npm run dev
```

Ứng dụng sẽ chạy tại **http://localhost:3000**

## 🔧 Environment Variables

Tạo file `.env.local`:

```env
# Backend API URL (⚠️ phải có /api ở cuối)
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Site URL (for metadata, sitemap, SEO)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Environment
NODE_ENV=development

# Optional: Analytics
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Production (Vercel):**

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.up.railway.app/api
NEXT_PUBLIC_SITE_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

> ⚠️ **Quan trọng:** `NEXT_PUBLIC_API_URL` phải bao gồm `/api` ở cuối vì backend có global prefix `/api`

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Auth pages (login, register)
│   ├── dashboard/          # Protected dashboard pages
│   │   ├── page.tsx        # Dashboard home
│   │   ├── transactions/   # Transactions page
│   │   ├── accounts/       # Accounts page
│   │   ├── budgets/        # Budgets page
│   │   └── settings/       # Settings pages
│   ├── layout.tsx          # Root layout (providers)
│   ├── page.tsx            # Landing page
│   ├── globals.css         # Global styles
│   ├── manifest.ts         # PWA manifest
│   ├── sitemap.ts          # Sitemap generation
│   └── robots.ts           # Robots.txt
├── components/            # Reusable components
│   ├── layout/            # Header, Sidebar, Footer
│   ├── modals/            # Modal components
│   └── ui/                # UI components
├── contexts/              # React contexts
│   ├── AuthContext.tsx    # Auth state management
│   └── ThemeContext.tsx   # Theme (dark/light)
├── hooks/                 # Custom hooks
│   ├── useCurrency.ts     # Currency formatting
│   └── useDebounce.ts     # Debounce input
├── lib/                   # Utilities & API
│   ├── api.ts             # API client & endpoints
│   ├── api/               # API modules
│   ├── validations.ts     # Zod schemas
│   ├── cookies.ts         # Cookie helpers
│   └── logger.ts          # Logger utility
├── types/                 # TypeScript types
│   ├── index.ts           # Main types
│   └── dashboard.ts       # Dashboard types
├── public/                # Static assets
│   ├── icon-192.png       # PWA icon
│   └── icon-512.png       # PWA icon
├── next.config.ts         # Next.js config
├── tailwind.config.ts     # Tailwind config
└── tsconfig.json          # TypeScript config
```

## 🤖 Available Scripts

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)

# Production
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Check TypeScript types
```

## 🧭 Routes Overview

### Public Routes

- `/` - Landing page
- `/login` - Login page
- `/register` - Register page
- `/forgot-password` - Forgot password
- `/reset-password` - Reset password
- `/auth/callback` - OAuth callback handler

### Protected Routes (require authentication)

- `/dashboard` - Dashboard home
- `/dashboard/transactions` - Transactions management
- `/dashboard/accounts` - Accounts management
- `/dashboard/budgets` - Budgets management
- `/dashboard/reports` - Financial reports
- `/dashboard/profile` - User profile
- `/dashboard/settings` - User settings

## 📦 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Environment Variables trong Vercel Dashboard:**

1. Go to Project Settings → Environment Variables
2. Add các biến sau:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.up.railway.app/api
   NEXT_PUBLIC_SITE_URL=https://your-frontend.vercel.app
   NODE_ENV=production
   ```

> ⚠️ **Lưu ý:** `NEXT_PUBLIC_API_URL` phải có `/api` ở cuối

### Docker

```bash
# Build image
docker build -t moneytrack-frontend .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=your-api-url \
  -e NEXT_PUBLIC_SITE_URL=your-site-url \
  moneytrack-frontend
```

## 🔒 Security Features

- ✅ Content Security Policy (CSP)
- ✅ HTTP Strict Transport Security (HSTS)
- ✅ X-Frame-Options (clickjacking protection)
- ✅ X-Content-Type-Options (MIME sniffing)
- ✅ Referrer-Policy
- ✅ Permissions-Policy
- ✅ XSS Protection

## 🌐 SEO & PWA

### SEO

- ✅ Dynamic metadata (title, description)
- ✅ Open Graph tags
- ✅ Twitter Card
- ✅ Sitemap.xml (auto-generated)
- ✅ Robots.txt
- ✅ Canonical URLs

### PWA

- ✅ Web App Manifest
- ✅ Icons (192x192, 512x512)
- ✅ Install prompt
- ✅ Theme color

## 🐛 Troubleshooting

**Build errors:**

```bash
rm -rf .next
npm run build
```

**Hydration errors:**

- Check for mismatches between server/client HTML
- Avoid using `Date.now()` or random values in JSX
- Use `useEffect` for client-only code

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

<div align="center">
  Made with ❤️ by Nguyen Vo Hiep
</div>
