# Gym Web App - Database Structure Analysis

## Overview
- **Database Type**: PostgreSQL
- **ORM**: Prisma (v5.22.0)
- **Total Tables**: 3
- **Data Access Pattern**: RESTful API with Express.js
- **Authentication**: JWT (7-day expiry)
- **Payment Integration**: Razorpay

---

## Database Tables & Schema

### 1. **User Table**
**Purpose**: Stores user account information and authentication credentials

#### Columns:
| Column | Type | Constraints | Purpose |
|--------|------|-----------|---------|
| id | String (CUID) | PRIMARY KEY | Unique user identifier |
| name | String | NOT NULL | Full name of the user |
| email | String | UNIQUE, NOT NULL | Email address (unique constraint) |
| password | String | NOT NULL | Hashed password (bcryptjs) |
| role | String | DEFAULT: 'member' | User role: 'admin' or 'member' |
| phone | String | OPTIONAL | Contact phone number |
| dob | String | OPTIONAL | Date of birth (ISO format) |
| gender | String | OPTIONAL | Gender information |
| address | String | OPTIONAL | Physical address |
| memberships | Relation | ONE-TO-MANY | List of membership records |
| createdAt | DateTime | DEFAULT: NOW() | Account creation timestamp |
| updatedAt | DateTime | AUTO-UPDATE | Last update timestamp |

#### Indexes:
- **UNIQUE**: `User_email_key` - Enforces email uniqueness
- **INDEX**: `User_email_idx` - Optimizes email lookups (login queries)
- **INDEX**: `User_role_idx` - Optimizes role-based queries (admin/member filtering)

#### Relationships:
- **One-to-Many**: Users have multiple Memberships (onDelete: Cascade)

#### Sample Data:
- Admin user: admin@afitnessgyam.com (seeded by default)
- Demo member: john@example.com (seeded by default)

---

### 2. **Membership Table**
**Purpose**: Tracks gym membership plans, payment records, and subscription status

#### Columns:
| Column | Type | Constraints | Purpose |
|--------|------|-----------|---------|
| id | String (CUID) | PRIMARY KEY | Unique membership identifier |
| userId | String | FOREIGN KEY (NOT NULL) | Reference to User table |
| user | Relation | ONE-TO-ONE (inverse) | Link to associated User |
| plan | String | NOT NULL | Membership plan type: 'Basic', 'Standard', or 'Premium' |
| status | String | DEFAULT: 'active' | Current status: 'active' or 'expired' |
| startDate | String | NOT NULL | Membership start date (ISO format: YYYY-MM-DD) |
| endDate | String | NOT NULL | Membership expiration date (ISO format: YYYY-MM-DD) |
| amount | Integer | NOT NULL | Amount paid in paise (₹ * 100) |
| paymentId | String | OPTIONAL | Razorpay payment transaction ID |
| orderId | String | OPTIONAL | Razorpay order ID |
| createdAt | DateTime | DEFAULT: NOW() | Record creation timestamp |
| updatedAt | DateTime | AUTO-UPDATE | Last update timestamp |

#### Indexes:
- **INDEX**: `Membership_userId_idx` - Optimizes member lookup by user ID
- **INDEX**: `Membership_status_idx` - Optimizes active/expired membership queries

#### Foreign Key:
- **User Relationship**: `userId` → `User.id` (ON DELETE CASCADE)
  - Deleting a user automatically deletes all their memberships

#### Plan Pricing:
```
Plan      Amount (paise)  Duration      Days
Basic     100,000         1 Month       30
Standard  280,000         3 Months      90
Premium   500,000         6 Months      180
```

#### Status Values:
- `active`: Currently valid membership
- `expired`: Past membership or manually deactivated

#### Relationships:
- **Many-to-One**: Each membership belongs to one User
- **One-to-Many (inverse)**: A user has multiple memberships over time

---

### 3. **GalleryItem Table**
**Purpose**: Stores gallery content (images and videos) with binary file data stored directly in the database

#### Columns:
| Column | Type | Constraints | Purpose |
|--------|------|-----------|---------|
| id | String (CUID) | PRIMARY KEY | Unique gallery item identifier |
| title | String | NOT NULL | Display name for the gallery item |
| description | String | OPTIONAL | Additional text description |
| type | String | NOT NULL | Content type: 'image' or 'video' |
| mimeType | String | NOT NULL | MIME type (e.g., 'image/jpeg', 'video/mp4') |
| data | Bytes (BYTEA) | NOT NULL | Binary file content stored in PostgreSQL |
| fileSize | Integer | NOT NULL | Original file size in bytes |
| createdAt | DateTime | DEFAULT: NOW() | Upload timestamp |
| updatedAt | DateTime | AUTO-UPDATE | Last update timestamp |

#### Indexes:
- **INDEX**: `GalleryItem_type_idx` - Optimizes filtering by content type (image vs. video)

#### Relationships:
- None (standalone table)

#### Features:
- **Direct Binary Storage**: Files stored as BYTEA in PostgreSQL (no external CDN required)
- **File Size Limit**: 200MB per file
- **Video Transcoding**: Auto-transcodes non-MP4 videos to H.264 MP4 format
- **Stream Support**: Implements HTTP range requests for video seeking/streaming
- **CORS Enabled**: Cross-origin access for media playback

#### MIME Types Supported:
- **Images**: image/jpeg, image/png, image/webp, etc.
- **Videos**: video/mp4 (post-transcode), video/quicktime, video/x-msvideo, etc.

---

## Database Migrations

### Migration 1: Initial Schema (20260702090511_init)
**Date**: July 2, 2026
**Changes**:
- Created `User` table with authentication fields
- Created `Membership` table with subscription tracking
- Created `GalleryItem` table with URL-based storage (Cloudinary)
- Set up all foreign keys and indexes

### Migration 2: Binary File Storage (20260702092204_add_bytea_storage)
**Date**: July 2, 2026
**Changes**:
- Removed `url` column (Cloudinary URL reference)
- Removed `publicId` column (Cloudinary public ID)
- Added `data` column (BYTEA) for direct file storage
- Added `fileSize` column (Integer) for file size tracking
- Added `mimeType` column (String) for MIME type tracking
- **Schema Change**: Migrated from cloud storage to database storage

---

## API Endpoints & Database Operations

### Authentication Routes
| Method | Endpoint | Operation | Tables Used |
|--------|----------|-----------|-------------|
| POST | `/api/auth/register` | Create new user | User |
| POST | `/api/auth/login` | Verify credentials | User |

### Member Routes (Authenticated)
| Method | Endpoint | Operation | Tables Used |
|--------|----------|-----------|-------------|
| GET | `/api/member/profile` | Fetch user + memberships | User, Membership |
| PUT | `/api/member/profile` | Update profile | User |
| GET | `/api/member/memberships` | List user's memberships | Membership |

### Payment Routes (Authenticated)
| Method | Endpoint | Operation | Tables Used |
|--------|----------|-----------|-------------|
| POST | `/api/payment/create-order` | Create Razorpay order | (External) |
| POST | `/api/payment/verify` | Verify payment & create membership | Membership |

### Admin Routes (Admin Only)
| Method | Endpoint | Operation | Tables Used |
|--------|----------|-----------|-------------|
| GET | `/api/admin/members` | List all members | User, Membership |
| GET | `/api/admin/members/:id` | Get member details | User, Membership |
| DELETE | `/api/admin/members/:id` | Remove member | User (cascades to Membership) |
| GET | `/api/admin/stats` | Get statistics | User, Membership |

### Gallery Routes
| Method | Endpoint | Operation | Tables Used |
|--------|----------|-----------|-------------|
| GET | `/api/gallery` | List gallery items | GalleryItem |
| POST | `/api/gallery` | Upload media (admin only) | GalleryItem |
| GET | `/api/gallery/:id/file` | Stream media file | GalleryItem |

---

## Key Features & Configurations

### 1. **Data Validation & Security**
- **Password Hashing**: bcryptjs (10 salt rounds)
- **JWT Authentication**: 7-day token expiry
- **Email Uniqueness**: Enforced at database level
- **Admin Authorization**: Role-based access control

### 2. **Cascading Deletes**
- **User Deletion**: Automatically deletes all associated memberships
- **Ensures Data Integrity**: No orphaned membership records

### 3. **Membership Management**
- **Status Tracking**: Distinguishes active vs. expired memberships
- **Date Tracking**: Tracks subscription periods (start/end dates)
- **Payment Tracking**: Links Razorpay transaction IDs for audit trail

### 4. **File Storage**
- **In-Database Storage**: Binary files stored directly in PostgreSQL BYTEA
- **Automatic Transcoding**: Videos converted to H.264 MP4 for broad compatibility
- **Streaming Support**: HTTP range requests for video seeking
- **File Metadata**: Tracks MIME type and file size for client-side handling

### 5. **Performance Optimizations**
- **Strategic Indexing**: Indexes on frequently searched columns:
  - Email (fast login lookups)
  - Role (admin queries)
  - User ID in Membership (member profile lookups)
  - Status (active membership queries)
  - Type (gallery filtering)

### 6. **Database Connection**
- **ORM**: Prisma Client (auto-generates type-safe queries)
- **Connection**: Environment variable `DATABASE_URL` (PostgreSQL connection string)
- **Logging**: Warnings and errors only (production-ready)
- **Connection Pooling**: Handled by Prisma Client connection manager

---

## Environment Configuration

### Required Variables
```env
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public
JWT_SECRET=your_random_secret_key
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Optional Variables
- `CLOUDINARY_*`: No longer used (migrated to database storage)
- `BACKEND_URL`: For gallery file serving (defaults to http://localhost:3000)

---

## Database Statistics & Capacity

### Growth Projections
- **User Growth**: Unlimited (indexed on email/role)
- **Membership Records**: N users × ~1-12 memberships/year per user
- **Gallery Items**: Manageable with 200MB file limit per item
  - Estimated: ~100-1000 items (5-200GB depending on content mix)

### Performance Considerations
- **Large Result Sets**: Admin endpoints paginate large member lists
- **Media Streaming**: Range requests prevent full file load into memory
- **Database Size**: Monitor BYTEA column in GalleryItem for growth

---

## Seeded Data (Development)

### Admin Account
- **Email**: admin@afitnessgyam.com
- **Password**: admin123 (hashed)
- **Role**: admin
- **Phone**: 9999999999

### Demo Member
- **Email**: john@example.com
- **Password**: john123 (hashed)
- **Role**: member
- **Phone**: 9876543210
- **Address**: 123 Fitness Street, Mumbai
- **DOB**: 1990-05-15
- **Gender**: Male
- **Membership**: Premium (₹5000/6 months)
- **Status**: active
- **Period**: March 1, 2024 - March 1, 2025

---

## Migration & Deployment

### Running Migrations
```bash
npx prisma migrate deploy          # Apply pending migrations
npx prisma migrate dev --name <name> # Create new migration in dev
npx prisma generate               # Generate Prisma Client
```

### Database Reset (Development Only)
```bash
npx prisma migrate reset          # Drops & recreates schema, re-seeds
```

### Prisma Studio (GUI Viewer)
```bash
npx prisma studio                 # Opens localhost:5555 for data visualization
```

---

## Notes & Recommendations

1. **Backup Strategy**: Regular PostgreSQL backups recommended for production
2. **BYTEA Storage**: Monitor database size; consider external CDN for high-volume galleries
3. **Indexing**: Current indexes sufficient for small-medium scale (< 100K users)
4. **Query Optimization**: Consider pagination for admin member lists if > 10K members
5. **Audit Trail**: Consider adding audit logs for membership changes/payment transactions
6. **Soft Deletes**: Consider implementing soft deletes instead of hard deletes for membership retention

---

**Last Updated**: July 5, 2026  
**Database Version**: PostgreSQL (via Prisma v5.22.0)  
**Schema Version**: Migration 20260702092204 (2 migrations total)
