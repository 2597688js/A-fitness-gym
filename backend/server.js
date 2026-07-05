import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { prisma } from './lib/prisma.js';
import { upload, cloudinary } from './cloudinary.js';
import multer from 'multer';
import { transcodeVideoToH264, isVideoFile } from './lib/transcoding.js';

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    process.env.FRONTEND_URL,
  ].filter(Boolean),
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const JWT_SECRET = process.env.JWT_SECRET || 'gym_jwt_secret_key_2024';

// ─── Middleware ───────────────────────────────────────────────────────────────
const authenticate = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(auth.slice(7), JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  next();
};

// ─── Seed Database ────────────────────────────────────────────────────────────
async function seedDatabase() {
  try {
    const adminExists = await prisma.user.findUnique({
      where: { email: 'admin@afitnessgyam.com' }
    });

    if (!adminExists) {
      await prisma.user.create({
        data: {
          name: 'Amit Hussain',
          email: 'admin@afitnessgyam.com',
          password: await bcrypt.hash('admin123', 10),
          role: 'admin',
          phone: '9999999999',
        },
      });
      console.log('✅ Admin seeded');
    }

    const memberExists = await prisma.user.findUnique({
      where: { email: 'john@example.com' }
    });

    if (!memberExists) {
      const member = await prisma.user.create({
        data: {
          name: 'John Doe',
          email: 'john@example.com',
          password: await bcrypt.hash('john123', 10),
          role: 'member',
          phone: '9876543210',
          address: '123 Fitness Street, Mumbai',
          dob: '1990-05-15',
          gender: 'Male',
        },
      });

      const start = new Date('2024-03-01');
      const end = new Date('2025-03-01');

      await prisma.membership.create({
        data: {
          userId: member.id,
          plan: 'Premium',
          status: 'active',
          startDate: start.toISOString().split('T')[0],
          endDate: end.toISOString().split('T')[0],
          amount: 1200000,
        },
      });
      console.log('✅ Demo member seeded');
    }
  } catch (err) {
    console.error('Seed error:', err.message);
  }
}

// ─── Auth Routes ──────────────────────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, dob, gender, address } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(409).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        dob,
        gender,
        address,
        password: hashed,
        role: 'member',
      },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Member Routes ────────────────────────────────────────────────────────────
app.get('/api/member/profile', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { memberships: { orderBy: { createdAt: 'desc' } } },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const { password, ...safe } = user;
    res.json(safe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/member/profile', authenticate, async (req, res) => {
  try {
    const { name, phone, address, dob, gender, password } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (dob) updateData.dob = dob;
    if (gender) updateData.gender = gender;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
    });

    const { password: _, ...safe } = user;
    res.json(safe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/member/memberships', authenticate, async (req, res) => {
  try {
    const ms = await prisma.membership.findMany({
      where: { userId: req.user.id },
    });
    res.json(ms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Membership Plans ─────────────────────────────────────────────────────────
const PLANS = {
  Basic:    { amount: 100000,  label: 'Basic',    duration: '1 Month',  durationDays: 30  },
  Standard: { amount: 280000,  label: 'Standard', duration: '3 Months', durationDays: 90  },
  Premium:  { amount: 500000,  label: 'Premium',  duration: '6 Months', durationDays: 180 },
};

function computeMembershipDates(plan, paid, paymentDate) {
  const planData = PLANS[plan];
  if (!planData) return { error: 'Invalid plan' };
  if (!paid || !paymentDate) return { startDate: null, endDate: null, amount: planData.amount };
  const start = new Date(`${paymentDate}T00:00:00.000Z`);
  if (isNaN(start.getTime())) return { error: 'Invalid paymentDate' };
  const end = new Date(start.getTime() + planData.durationDays * 86400000);
  return { startDate: start.toISOString().split('T')[0], endDate: end.toISOString().split('T')[0], amount: planData.amount };
}

// ─── Member Membership Request Routes ──────────────────────────────────────────
app.get('/api/member/membership-request', authenticate, async (req, res) => {
  try {
    const request = await prisma.membershipRequest.findFirst({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(request || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/member/membership-request', authenticate, async (req, res) => {
  try {
    const { plan, paid, paymentDate } = req.body;
    if (!plan) return res.status(400).json({ error: 'Plan is required' });

    if (!PLANS[plan]) return res.status(400).json({ error: 'Invalid plan' });

    if (paid && !paymentDate) {
      return res.status(400).json({ error: 'Payment date is required when marking as Paid' });
    }

    const computed = computeMembershipDates(plan, paid, paymentDate);
    if (computed.error) return res.status(400).json({ error: computed.error });

    const existing = await prisma.membershipRequest.findFirst({
      where: { userId: req.user.id, status: 'PENDING' },
    });

    if (existing) {
      const updated = await prisma.membershipRequest.update({
        where: { id: existing.id },
        data: {
          plan,
          paid: paid || false,
          paymentDate: paid ? paymentDate : null,
          computedStartDate: computed.startDate,
          computedEndDate: computed.endDate,
          amount: computed.amount,
        },
      });
      res.json(updated);
    } else {
      const created = await prisma.membershipRequest.create({
        data: {
          userId: req.user.id,
          plan,
          paid: paid || false,
          paymentDate: paid ? paymentDate : null,
          computedStartDate: computed.startDate,
          computedEndDate: computed.endDate,
          amount: computed.amount,
          status: 'PENDING',
        },
      });
      res.status(201).json(created);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Admin Membership Request Routes ───────────────────────────────────────────
app.get('/api/admin/membership-requests', authenticate, adminOnly, async (req, res) => {
  try {
    const { status } = req.query;
    const statusFilter = status === 'all' ? undefined : (status || 'PENDING');

    const where = statusFilter ? { status: statusFilter } : {};

    const requests = await prisma.membershipRequest.findMany({
      where,
      include: { user: { select: { id: true, name: true, email: true, phone: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/admin/membership-requests/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { plan, paid, paymentDate, amount } = req.body;

    const request = await prisma.membershipRequest.findUnique({ where: { id } });
    if (!request) return res.status(404).json({ error: 'Request not found' });
    if (request.status !== 'PENDING') return res.status(409).json({ error: 'Cannot edit a resolved request' });

    const finalPlan = plan || request.plan;
    const finalPaid = paid !== undefined ? paid : request.paid;
    const finalPaymentDate = paymentDate !== undefined ? paymentDate : request.paymentDate;

    const computed = computeMembershipDates(finalPlan, finalPaid, finalPaymentDate);
    if (computed.error) return res.status(400).json({ error: computed.error });

    const updated = await prisma.membershipRequest.update({
      where: { id },
      data: {
        plan: finalPlan,
        paid: finalPaid,
        paymentDate: finalPaymentDate,
        computedStartDate: computed.startDate,
        computedEndDate: computed.endDate,
        amount: amount !== undefined ? amount : computed.amount,
      },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/membership-requests/:id/approve', authenticate, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { plan, paid, paymentDate, amount } = req.body;

    const request = await prisma.membershipRequest.findUnique({ where: { id } });
    if (!request) return res.status(404).json({ error: 'Request not found' });
    if (request.status !== 'PENDING') return res.status(409).json({ error: 'Cannot approve a resolved request' });

    const finalPlan = plan !== undefined ? plan : request.plan;
    const finalPaid = paid !== undefined ? paid : request.paid;
    const finalPaymentDate = paymentDate !== undefined ? paymentDate : request.paymentDate;

    if (finalPaid !== true || !finalPaymentDate) {
      return res.status(400).json({ error: 'Cannot approve: payment must be marked Paid with a valid payment date.' });
    }

    const computed = computeMembershipDates(finalPlan, finalPaid, finalPaymentDate);
    if (computed.error) return res.status(400).json({ error: computed.error });

    const finalAmount = amount !== undefined ? amount : computed.amount;

    const result = await prisma.$transaction(async (tx) => {
      const activeMemberships = await tx.membership.findMany({
        where: { userId: request.userId, status: 'active' },
      });

      for (const m of activeMemberships) {
        await tx.membership.update({
          where: { id: m.id },
          data: { status: 'expired' },
        });
      }

      const membership = await tx.membership.create({
        data: {
          userId: request.userId,
          plan: finalPlan,
          status: 'active',
          startDate: computed.startDate,
          endDate: computed.endDate,
          amount: finalAmount,
        },
      });

      const updatedRequest = await tx.membershipRequest.update({
        where: { id },
        data: {
          plan: finalPlan,
          paid: true,
          paymentDate: finalPaymentDate,
          computedStartDate: computed.startDate,
          computedEndDate: computed.endDate,
          amount: finalAmount,
          status: 'APPROVED',
          reviewedBy: req.user.id,
          reviewedAt: new Date(),
          resultingMembershipId: membership.id,
        },
      });

      return { request: updatedRequest, membership };
    });

    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/membership-requests/:id/reject', authenticate, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    const request = await prisma.membershipRequest.findUnique({ where: { id } });
    if (!request) return res.status(404).json({ error: 'Request not found' });
    if (request.status !== 'PENDING') return res.status(409).json({ error: 'Cannot reject a resolved request' });

    const updated = await prisma.membershipRequest.update({
      where: { id },
      data: {
        status: 'REJECTED',
        adminNote: note || null,
        reviewedBy: req.user.id,
        reviewedAt: new Date(),
      },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Admin Routes ─────────────────────────────────────────────────────────────
app.get('/api/admin/members', authenticate, adminOnly, async (req, res) => {
  try {
    const members = await prisma.user.findMany({
      where: { role: 'member' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        dob: true,
        gender: true,
        createdAt: true,
        memberships: { orderBy: { createdAt: 'desc' } },
      },
    });

    const membersWithData = members.map((member) => ({
      ...member,
      activeMembership: member.memberships.find(m => m.status === 'active') || null,
      totalMemberships: member.memberships.length,
    }));

    res.json(membersWithData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/members/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        memberships: true,
        membershipRequests: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });

    if (!user) return res.status(404).json({ error: 'Member not found' });

    const { password, ...safe } = user;
    const latestRequest = user.membershipRequests?.[0] || null;
    res.json({ ...safe, latestRequest });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/members/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
    });

    if (!user || user.role !== 'member') {
      return res.status(404).json({ error: 'Member not found' });
    }

    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/stats', authenticate, adminOnly, async (req, res) => {
  try {
    const members = await prisma.user.findMany({ where: { role: 'member' } });
    const active = await prisma.membership.findMany({ where: { status: 'active' } });
    const allMemberships = await prisma.membership.findMany({});
    const revenue = allMemberships.reduce((sum, m) => sum + (m.amount || 0), 0);

    res.json({
      totalMembers: members.length,
      activeMembers: active.length,
      totalRevenue: revenue,
      recentMembers: members.slice(-5).reverse(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Gallery Routes ───────────────────────────────────────────────────────────
app.get('/api/gallery', async (req, res) => {
  try {
    const items = await prisma.galleryItem.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        mimeType: true,
        fileSize: true,
        createdAt: true,
      },
    });
    // Add URL for each item so frontend can display it
    const itemsWithUrls = items.map(item => ({
      ...item,
      url: `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/gallery/${item.id}/file`,
    }));
    res.json(itemsWithUrls);
  } catch (err) {
    console.error('Gallery fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
});

app.post('/api/gallery', authenticate, adminOnly, multer({ storage: multer.memoryStorage() }).single('file'), async (req, res) => {
  try {
    const { title, description, type } = req.body;

    if (!title || !type) {
      return res.status(400).json({ error: 'Missing required fields: title and type' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const maxSize = 200 * 1024 * 1024; // 200MB limit for large video files
    if (req.file.size > maxSize) {
      return res.status(400).json({ error: 'File too large. Maximum 200MB allowed.' });
    }

    let finalBuffer = req.file.buffer;
    let finalMimeType = req.file.mimetype;
    let finalFileSize = req.file.size;

    // Auto-transcode videos to H.264 MP4
    if (type === 'video' && isVideoFile(req.file.mimetype)) {
      try {
        console.log(`🎬 Transcoding video: ${title}`);
        const startTime = Date.now();

        finalBuffer = await transcodeVideoToH264(req.file.buffer, req.file.mimetype);
        finalMimeType = 'video/mp4';
        finalFileSize = finalBuffer.length;

        const duration = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`✅ Transcode complete (${duration}s)`);
        console.log(`   Original: ${(req.file.size / 1024 / 1024).toFixed(2)}MB`);
        console.log(`   Transcoded: ${(finalFileSize / 1024 / 1024).toFixed(2)}MB`);
      } catch (transErr) {
        console.error('⚠️ Transcode failed, using original file:', transErr.message);
        // Fall back to original if transcode fails
      }
    }

    const item = await prisma.galleryItem.create({
      data: {
        title,
        description: description || '',
        type,
        mimeType: finalMimeType,
        data: finalBuffer,
        fileSize: finalFileSize,
      },
    });

    res.json({
      id: item.id,
      title: item.title,
      description: item.description,
      type: item.type,
      mimeType: item.mimeType,
      fileSize: item.fileSize,
      createdAt: item.createdAt,
      url: `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/gallery/${item.id}/file`,
    });
  } catch (err) {
    console.error('Gallery upload error:', err);
    res.status(500).json({ error: 'Upload failed: ' + err.message });
  }
});


app.get('/api/gallery/:id/file', async (req, res) => {
  try {
    const item = await prisma.galleryItem.findUnique({
      where: { id: req.params.id },
    });

    if (!item) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }

    const fileSize = item.data.length;
    const range = req.headers.range;

    // Determine correct MIME type for video files
    let contentType = item.mimeType || 'video/mp4';
    if (item.type === 'video' && !contentType.startsWith('video/')) {
      contentType = 'video/mp4';
    }

    // Set CORS and streaming headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${item.title}"`);
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Vary', 'Origin');

    if (range) {
      // Handle range requests for video seeking
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Content-Length': chunksize,
      });
      res.end(item.data.slice(start, end + 1));
    } else {
      res.setHeader('Content-Length', fileSize);
      res.end(item.data);
    }
  } catch (err) {
    console.error('Gallery download error:', err);
    res.status(500).json({ error: 'Failed to download file' });
  }
});

app.delete('/api/gallery/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const item = await prisma.galleryItem.findUnique({
      where: { id: req.params.id },
    });

    if (!item) return res.status(404).json({ error: 'Gallery item not found' });

    if (item.publicId) {
      await cloudinary.uploader.destroy(item.publicId, {
        resource_type: item.type === 'video' ? 'video' : 'image',
      });
    }

    await prisma.galleryItem.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connected');

    // Seed database
    await seedDatabase();

    // Start server
    app.listen(PORT, () => {
      console.log(`🏋️ A Fitness Gym API running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
