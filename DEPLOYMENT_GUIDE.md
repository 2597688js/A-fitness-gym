# 🚀 Deployment Guide - Gym Web App to Vercel + Render

## Overview

This guide will help you deploy the full-stack gym web app to production using:
- **Frontend**: Vercel (React/Vite)
- **Backend**: Render.com (Node.js/Express)
- **Database**: MongoDB Atlas (Free M0 cluster)
- **File Storage**: Cloudinary (25GB free tier)

**Total Cost**: FREE ✅

---

## Phase 1: Set Up Cloud Services (One-Time Setup)

### 1.1 MongoDB Atlas Setup

1. Go to https://cloud.mongodb.com
2. Sign up with Google or GitHub
3. Create a new project
4. Click **Build a Cluster** → Select **Shared** (free tier)
5. Choose a region closest to you → **Create Cluster**
6. Wait 2-3 minutes for cluster to be created
7. Click **Connect** button
8. Choose **Drivers** (not Shell)
9. Copy the connection string that looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
10. Go to **Network Access** tab → **Add IP Address** → Add `0.0.0.0/0` (allows any IP)
11. **Save** the connection string somewhere safe

### 1.2 Cloudinary Setup

1. Go to https://cloudinary.com
2. Sign up with email
3. Go to **Dashboard**
4. Copy these values:
   - **Cloud Name** (shown at the top)
   - **API Key** (in Account section)
   - **API Secret** (also in Account section)
5. Save all three values

### 1.3 GitHub Setup

1. Go to https://github.com
2. Create a new repository (e.g., `gym-web-app`)
3. Push your code:
   ```bash
   cd ~/1.jana\ files/3.MyMacProjects/gym-web-app
   git init
   git add .
   git commit -m "Initial commit - gym web app"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/gym-web-app.git
   git push -u origin main
   ```

### 1.4 Render Account Setup

1. Go to https://render.com
2. Sign up with GitHub (recommended - auto-connects)
3. Authorize access to your GitHub account

### 1.5 Vercel Account Setup

1. Go to https://vercel.com
2. Sign up with GitHub (recommended)
3. Authorize access to your GitHub account

---

## Phase 2: Deploy Backend to Render

### Step 1: Create a Web Service on Render

1. Go to https://render.com/dashboard
2. Click **New +** → **Web Service**
3. Select your GitHub repository
4. Configure settings:
   - **Name**: `gym-api` (or any name you like)
   - **Environment**: `Node`
   - **Region**: Choose one close to you
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Node Version**: `20`

### Step 2: Add Environment Variables

Click **Environment** and add these variables:

```
JWT_SECRET=your_super_secret_jwt_key_here
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/gym-app
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=https://your-app.vercel.app (UPDATE AFTER VERCEL DEPLOY)
```

**Important**: Replace placeholders with actual values from Phase 1 and Phase 3 step 5.

### Step 3: Deploy

1. Click **Deploy Web Service**
2. Wait for deployment (2-3 minutes)
3. Once status shows **Live** ✅, copy the URL (e.g., `https://gym-api.onrender.com`)
4. **Save this URL** - you'll need it for Vercel

### Troubleshooting Backend Deployment

If deployment fails:
1. Click the **Logs** tab to see error messages
2. Common issues:
   - Missing environment variables → add them in Environment section
   - MongoDB connection string invalid → verify MongoDB URI is correct
   - Cloudinary keys wrong → double-check the values

---

## Phase 3: Deploy Frontend to Vercel

### Step 1: Import Project

1. Go to https://vercel.com/dashboard
2. Click **Add New...** → **Project**
3. Select your GitHub repository
4. Click **Import**

### Step 2: Configure Project

1. **Project Name**: `gym-app` (or your preferred name)
2. **Framework Preset**: Vite (should auto-detect)
3. **Root Directory**: `frontend`

### Step 3: Build Settings

Vercel should auto-detect these, but verify:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm ci`

### Step 4: Add Environment Variables

Click **Environment Variables** and add:

```
VITE_API_URL=https://gym-api.onrender.com
```

(Replace with your actual Render backend URL from Phase 2 step 3)

### Step 5: Deploy

1. Click **Deploy**
2. Wait for deployment (1-2 minutes)
3. Once complete, you'll see **Production** with a green checkmark ✅
4. Click on the URL to open your live app
5. **Copy your Vercel URL** (e.g., `https://gym-app.vercel.app`)

### Step 6: Update Render Backend CORS

1. Go back to Render dashboard
2. Open your `gym-api` service
3. Go to **Environment** → Edit `FRONTEND_URL`
4. Set it to your Vercel URL: `https://gym-app.vercel.app`
5. Click **Save**
6. Render will auto-redeploy (~2 minutes)

---

## Phase 4: Verify Everything Works

Open your Vercel URL and test:

### Public Pages
- ✅ Home page loads
- ✅ About, Classes, Pricing, Gallery pages work
- ✅ Navigation is responsive

### Member Features
- ✅ Registration works (`/join`)
- ✅ Login works (`/member/login`)
- ✅ Can see dashboard with persistent data
- ✅ Can update profile
- ✅ Profile changes persist (reload page → data stays)

### Admin Features
- ✅ Admin login works (`/admin/login`)
- ✅ Can see all members
- ✅ Can upload images/videos to gallery
- ✅ Uploads appear with `https://res.cloudinary.com/...` URLs
- ✅ Can delete gallery items

### Data Persistence
- ✅ Register a user → Refresh page → User still logged in
- ✅ Create a user → Admin see it in members list
- ✅ Restart Render backend → All data still there (persisted in MongoDB)

---

## Demo Credentials

Once deployed, test with these accounts:

**Member Account**
- Email: `john@example.com`
- Password: `john123`

**Admin Account**
- Email: `admin@afitnessgyam.com`
- Password: `admin123`

Or create new accounts via `/join` page.

---

## Monitoring & Troubleshooting

### Check Backend Status
1. Go to Render dashboard
2. Click your `gym-api` service
3. Look at **Logs** tab for any errors
4. If service spun down (after 15 min inactivity), it auto-restarts when accessed (30s cold start)

### Check Frontend Status
1. Go to Vercel dashboard
2. Click your project
3. **Deployments** tab shows build/deploy status
4. **Function Logs** shows any runtime errors

### Common Issues

**"Cannot POST /api/gallery"**
- Backend URL in `.env.production` is wrong
- Fix: Update `VITE_API_URL` in Vercel env vars

**"Gallery upload fails"**
- Cloudinary credentials wrong
- Fix: Verify keys in Render environment variables

**"Login fails with 401"**
- JWT_SECRET mismatch or missing
- Fix: Ensure JWT_SECRET is set in Render env vars

**"Data disappears after restart"**
- MongoDB not connected
- Fix: Verify MONGODB_URI is correct

---

## Next Steps (Optional)

### 1. Custom Domain
- Vercel & Render both support custom domains
- Go to project settings → Domains → add your domain

### 2. Upgrade Database (if needed)
- MongoDB Atlas free tier: 512MB storage
- Upgrade to paid if you exceed 512MB

### 3. Upgrade File Storage
- Cloudinary free tier: 25GB bandwidth/month
- Upgrade to paid if you exceed limits

### 4. Real Razorpay Keys
- Replace test keys with live keys for real payments
- Current setup uses Razorpay sandbox (safe for testing)

---

## Useful Links

- Render Dashboard: https://render.com/dashboard
- Vercel Dashboard: https://vercel.com/dashboard
- MongoDB Atlas: https://cloud.mongodb.com
- Cloudinary Dashboard: https://cloudinary.com/console
- GitHub: https://github.com

---

## Support

If you encounter issues:

1. **Check logs** in Render/Vercel dashboards
2. **Verify environment variables** are set correctly
3. **Ensure MongoDB whitelist** includes `0.0.0.0/0`
4. **Check GitHub commits** are synced (Render/Vercel pull latest automatically)

---

## Summary

You now have a fully deployed, production-ready gym web app with:
- ✅ Persistent database (MongoDB)
- ✅ Cloud file storage (Cloudinary)
- ✅ Global CDN for frontend (Vercel)
- ✅ Scalable backend (Render)
- ✅ Zero maintenance (all services auto-scale)
- ✅ Free tier (up to reasonable usage)

**Total Deployment Time**: ~30 minutes  
**Cost**: $0 (free tier)

🎉 **Done! Your gym app is now live!**
