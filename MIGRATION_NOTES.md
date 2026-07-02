# 📝 Migration Notes: In-Memory → MongoDB + Cloudinary

## What Changed

### Backend (`backend/server.js`)

| Component | Before | After |
|-----------|--------|-------|
| **Data Store** | Arrays in-memory | MongoDB collections |
| **Users** | `const users = [...]` | `User.findOne()`, `User.create()` |
| **Memberships** | `const memberships = [...]` | `Membership.find()`, `Membership.create()` |
| **Gallery** | `const gallery = [...]` + base64 | `GalleryItem` + Cloudinary URLs |
| **Database** | Lost on restart | Persists forever |

### New Files Created

```
backend/
├── db.js                    # MongoDB connection
├── cloudinary.js            # Cloudinary config + multer
└── models/
    ├── User.js              # User schema
    ├── Membership.js        # Membership schema
    └── GalleryItem.js       # Gallery item schema
```

### Frontend Changes

**Gallery Upload** (`frontend/src/pages/admin/Gallery.jsx`):
- **Before**: FileReader → base64 string → JSON POST
- **After**: FormData → Cloudinary API → CDN URL

File size limits:
- **Before**: 200MB per file (sent as base64 in JSON body)
- **After**: 100MB per file (Cloudinary free tier limit)

---

## Data Migration (First Deploy)

### Automatic Seeding

When the backend first connects to MongoDB, it automatically creates:

1. **Admin Account**
   - Email: `admin@afitnessgyam.com`
   - Password: `admin123` (hashed)

2. **Demo Member**
   - Email: `john@example.com`
   - Password: `john123` (hashed)
   - Premium membership (expires 2025-03-01)

**Location**: `backend/server.js` → `seedDatabase()` function

### Existing Users

Users registered locally before deployment are **lost** (in-memory arrays were never saved).

**To preserve them**: Manually recreate accounts after deployment or modify `seedDatabase()` to include them.

---

## Environment Variables

### New Required Variables

```env
# MongoDB Atlas (from cloud.mongodb.com)
MONGODB_URI=mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/gym-app

# Cloudinary (from cloudinary.com/console)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL (for CORS after Vercel deploy)
FRONTEND_URL=https://your-app.vercel.app
```

### Existing Variables (Still Used)

```env
JWT_SECRET=your_super_secret_jwt_key_here
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
```

---

## API Endpoints (No Changes)

All endpoints remain the same. Only the backend storage changed:

- `POST /api/auth/register` → Creates user in MongoDB
- `POST /api/auth/login` → Validates against MongoDB
- `POST /api/gallery` → Now accepts multipart FormData (not base64 JSON)
- `GET /api/gallery` → Returns Cloudinary URLs (not data URLs)
- etc.

---

## File Storage

### Gallery Files

**Before** (In-Memory):
```js
{
  id: 'gal-1',
  url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...'
}
```

**After** (Cloudinary):
```js
{
  _id: ObjectId(...),
  url: 'https://res.cloudinary.com/cloud-name/image/upload/v1720016400/gym-app/abc123.jpg',
  publicId: 'gym-app/abc123'
}
```

### File Deletion

When deleting a gallery item:
1. Delete from Cloudinary (using `publicId`)
2. Delete from MongoDB

Before you'd only delete from the in-memory array (file stays in memory until server restarts).

---

## Testing the Migration

After deploying to Render + Vercel:

```bash
# Test 1: Register new user
POST /api/auth/register
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
# Expected: User created in MongoDB, token returned

# Test 2: Login
POST /api/auth/login
{
  "email": "test@example.com",
  "password": "password123"
}
# Expected: JWT token returned (valid for 7 days)

# Test 3: Get profile
GET /api/member/profile
Headers: Authorization: Bearer <token>
# Expected: User data + memberships array from MongoDB

# Test 4: Upload to gallery
POST /api/gallery
Headers: 
  - Authorization: Bearer <admin-token>
  - Content-Type: multipart/form-data
Body:
  - file: <image file>
  - title: "Test Image"
  - type: "image"
# Expected: Item created in MongoDB, file on Cloudinary

# Test 5: Verify persistence
1. Create user on Day 1
2. Restart backend on Day 2
3. Login with same credentials
# Expected: User still exists (data persisted in MongoDB)
```

---

## Troubleshooting

### "MongoDB connection failed"
- MONGODB_URI is invalid or whitelist missing
- Fix: Verify URI format, add `0.0.0.0/0` in MongoDB Network Access

### "Cloudinary upload fails"
- Credentials are wrong
- Fix: Double-check cloud name, API key, API secret

### "Auth fails with 'Invalid token'"
- JWT_SECRET changed between requests
- Fix: Ensure JWT_SECRET is consistent in `.env`

### "Gallery images not loading"
- Cloudinary URL broken
- Fix: Check Cloudinary cloud name in URL matches env var

---

## Rollback (If Needed)

To revert to in-memory data:

1. Restore original `backend/server.js` from git history
2. Remove mongoose dependencies
3. Remove environment variables
4. Re-deploy

**Warning**: All MongoDB data will not be used. Deploy as a fresh in-memory instance.

---

## Performance Impact

### Latency

- **Before**: <10ms (in-memory)
- **After**: 50-200ms (MongoDB + network)

Acceptable for a demo. Production apps typically cache frequently accessed data.

### Database Limits

- **MongoDB Free (M0)**: 512MB storage, no cost
- **Cloudinary Free**: 25GB bandwidth/month, 25GB storage, no cost

Sufficient for a demo with 100s of members and 1000s of images.

---

## Next Steps

1. **Test thoroughly** on https://your-app.vercel.app
2. **Monitor logs** in Render + Vercel dashboards
3. **Gather feedback** from users
4. **Upgrade database** if needed (MongoDB → M2 $9/month)
5. **Enable backups** (MongoDB Atlas automated backups)

---

Done! Your app is now production-ready with real persistence. 🎉
