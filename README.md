# ⚡ A Fitness Gym — Gym Website

A full-stack gym website built with **Node.js + Express** (backend) and **React + Vite** (frontend), featuring Razorpay payment integration.

## Project Structure

```
gym-website/
├── backend/          Node.js/Express API
│   ├── server.js     All routes: auth, member, admin, payments
│   └── .env.example  Environment variable template
└── frontend/         React + Vite app
    └── src/
        ├── pages/public/   Home, About, Classes, Pricing, Join
        ├── pages/member/   Dashboard, Profile, Membership (Razorpay)
        └── pages/admin/    Dashboard, Members, MemberDetail
```

## Quick Start

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env — add your Razorpay keys and JWT secret
npm start
# API runs at http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm run dev
# App runs at http://localhost:5173
```

## Environment Variables (backend/.env)

```
PORT=5000
JWT_SECRET=your_super_secret_key

# Get these from https://dashboard.razorpay.com
RAZORPAY_KEY_ID=rzp_test_XXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXX
```

## Demo Credentials

| Role   | Email                    | Password |
|--------|--------------------------|----------|
| Member | john@example.com         | john123  |
| Admin  | admin@apexfitness.com    | admin123 |

## Routes

### Public Website
| Path       | Page        |
|------------|-------------|
| `/`        | Home        |
| `/about`   | About Us    |
| `/classes` | Classes     |
| `/pricing` | Pricing     |
| `/join`    | Register    |

### Member Portal (login required)
| Path                  | Page               |
|-----------------------|--------------------|
| `/member/login`       | Member Login       |
| `/member/dashboard`   | Dashboard          |
| `/member/profile`     | Edit Profile       |
| `/member/membership`  | Buy/Renew Plan     |

### Admin Panel (admin login required)
| Path                     | Page            |
|--------------------------|-----------------|
| `/admin/login`           | Admin Login     |
| `/admin`                 | Dashboard       |
| `/admin/members`         | Members Table   |
| `/admin/members/:id`     | Member Detail   |

## Tech Stack

- **Frontend**: React 19, React Router v7, Axios, Vite
- **Backend**: Node.js, Express 5, JWT, bcryptjs, Razorpay SDK
- **Payments**: Razorpay (order creation + webhook verification)
- **Auth**: JWT Bearer tokens, role-based (member / admin)
- **Data**: In-memory store (swap with MongoDB/PostgreSQL for production)

## Production Notes

1. Replace in-memory store with a real database (MongoDB, PostgreSQL)
2. Set a strong `JWT_SECRET` in production
3. Use Razorpay live keys (not test keys) in production
4. Add HTTPS / reverse proxy (nginx)
5. Add rate limiting and input validation (consider `express-validator`, `express-rate-limit`)
