# Gym Web App - Database Structure Analysis

## Overview
- **Database Type**: PostgreSQL
- **ORM**: Prisma (v5.22.0)
- **Total Tables**: 4
- **Data Access Pattern**: RESTful API with Express.js
- **Authentication**: JWT (7-day expiry)
- **Payment Model**: Offline with admin approval (no online payments)

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
- **One-to-Many**: Users have multiple MembershipRequests (onDelete: Cascade)

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
- `active`: Currently valid membership (approved by admin)
- `expired`: Past membership or manually deactivated

#### Relationships:
- **Many-to-One**: Each membership belongs to one User
- **One-to-Many (inverse)**: A user has multiple memberships over time

---

### 3. **MembershipRequest Table**
**Purpose**: Tracks pending membership requests awaiting admin review and approval

#### Columns:
| Column | Type | Constraints | Purpose |
|--------|------|-----------|---------|
| id | String (CUID) | PRIMARY KEY | Unique request identifier |
| userId | String | FOREIGN KEY (NOT NULL) | Reference to User table |
| user | Relation | ONE-TO-ONE (inverse) | Link to associated User |
| plan | String | NOT NULL | Requested plan: 'Basic', 'Standard', or 'Premium' |
| paid | Boolean | DEFAULT: false | Payment status (Paid/Unpaid) |
| paymentDate | String | OPTIONAL | When payment was made (ISO format: YYYY-MM-DD) |
| computedStartDate | String | OPTIONAL | Calculated membership start date |
| computedEndDate | String | OPTIONAL | Calculated membership expiry date |
| amount | Integer | NOT NULL | Amount in paise (may differ from plan default if admin edited) |
| status | Enum | DEFAULT: PENDING | RequestStatus: PENDING, APPROVED, or REJECTED |
| adminNote | String | OPTIONAL | Rejection reason or admin comment |
| reviewedBy | String | OPTIONAL | Admin User ID who reviewed the request |
| reviewedAt | DateTime | OPTIONAL | Timestamp of admin review |
| resultingMembershipId | String | OPTIONAL | ID of the Membership created upon approval |
| createdAt | DateTime | DEFAULT: NOW() | Request submission timestamp |
| updatedAt | DateTime | AUTO-UPDATE | Last update timestamp |

#### Indexes:
- **INDEX**: `MembershipRequest_userId_idx` - Optimizes lookup by member
- **INDEX**: `MembershipRequest_status_idx` - Optimizes admin queue filtering
- **COMPOSITE INDEX**: `MembershipRequest_userId_status_idx` - Optimizes "find pending for user"

#### Foreign Key:
- **User Relationship**: `userId` → `User.id` (ON DELETE CASCADE)
  - Deleting a user automatically deletes all their pending requests

#### Status Values (Enum):
- `PENDING`: Awaiting admin review (member can edit)
- `APPROVED`: Approved by admin; Membership record created
- `REJECTED`: Rejected by admin; may include adminNote explaining why

#### Workflow:
1. **PENDING** → Member submits/edits request (one per user); dates only computed if paid=true
2. **APPROVED** → Admin approves; system deactivates prior memberships and creates new active Membership
3. **REJECTED** → Admin rejects with optional note; member sees note in dashboard and can resubmit

#### Relationships:
- **Many-to-One**: Each request belongs to one User
- **One-to-One (audit)**: resultingMembershipId points to the Membership created on approval (not a formal FK)

---

### 4. **GalleryItem Table**
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

### Migration 3: Offline Payments + Admin Approval (add_membership_requests_remove_razorpay_fields)
**Date**: July 5, 2026
**Changes**:
- Added `RequestStatus` enum: PENDING, APPROVED, REJECTED
- Created `MembershipRequest` table for pending membership submissions
- Dropped `paymentId` column from Membership (Razorpay artifact)
- Dropped `orderId` column from Membership (Razorpay artifact)
- Added back-relation `membershipRequests` to User model
- **Business Logic Change**: Replaced online payments with offline submission + admin approval workflow

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
| GET | `/api/member/membership-request` | Get member's latest request (any status) | MembershipRequest |
| POST | `/api/member/membership-request` | Submit/update pending membership request | MembershipRequest |

### Membership Request Routes (Member)
| Method | Endpoint | Operation | Tables Used |
|--------|----------|-----------|-------------|
| GET | `/api/member/membership-request` | Fetch latest request | MembershipRequest |
| POST | `/api/member/membership-request` | Submit or edit pending request (upsert) | MembershipRequest |

### Admin Membership Request Routes (Admin Only)
| Method | Endpoint | Operation | Tables Used |
|--------|----------|-----------|-------------|
| GET | `/api/admin/membership-requests?status=PENDING\|APPROVED\|REJECTED\|all` | List requests (filterable) | MembershipRequest, User |
| PATCH | `/api/admin/membership-requests/:id` | Edit pending request (stays PENDING) | MembershipRequest |
| POST | `/api/admin/membership-requests/:id/approve` | Approve request and create Membership | MembershipRequest, Membership |
| POST | `/api/admin/membership-requests/:id/reject` | Reject request with optional note | MembershipRequest |

### Admin Routes (Admin Only)
| Method | Endpoint | Operation | Tables Used |
|--------|----------|-----------|-------------|
| GET | `/api/admin/members` | List all members | User, Membership |
| GET | `/api/admin/members/:id` | Get member details + latest request | User, Membership, MembershipRequest |
| DELETE | `/api/admin/members/:id` | Remove member | User (cascades to Membership, MembershipRequest) |
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
- **Approval Workflow**: MembershipRequest intermediary ensures all submissions are admin-reviewed before becoming effective

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
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Optional Variables
- `CLOUDINARY_*`: No longer used (migrated to database storage)
- `BACKEND_URL`: For gallery file serving (defaults to http://localhost:3000)

### Removed Variables (No Longer Used)
- `RAZORPAY_KEY_ID`: Online payments removed
- `RAZORPAY_KEY_SECRET`: Online payments removed

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
**Schema Version**: Migration add_membership_requests_remove_razorpay_fields (3 migrations total)  
**Payment Model**: Offline with admin approval (replaces Razorpay)
