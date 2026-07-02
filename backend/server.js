import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { prisma } from './lib/prisma.js';
import { upload, cloudinary } from './cloudinary.js';

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    process.env.FRONTEND_URL,
  ].filter(Boolean),
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const JWT_SECRET = process.env.JWT_SECRET || 'gym_jwt_secret_key_2024';

// ─── Razorpay ─────────────────────────────────────────────────────────────────
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_KEY_SECRET',
});

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
          paymentId: 'pay_mock_001',
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

// ─── Payment / Razorpay Routes ────────────────────────────────────────────────
const PLANS = {
  Basic:    { amount: 100000,  label: 'Basic',    duration: '1 Month',  durationDays: 30  },
  Standard: { amount: 280000,  label: 'Standard', duration: '3 Months', durationDays: 90  },
  Premium:  { amount: 500000,  label: 'Premium',  duration: '6 Months', durationDays: 180 },
};

app.post('/api/payment/create-order', authenticate, async (req, res) => {
  try {
    const { plan } = req.body;
    const planData = PLANS[plan];
    if (!planData) return res.status(400).json({ error: 'Invalid plan' });

    const order = await razorpay.orders.create({
      amount: planData.amount,
      currency: 'INR',
      receipt: `receipt_${uuidv4().slice(0, 8)}`,
      notes: { userId: req.user.id, plan },
    });

    res.json({ order, key: process.env.RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID', planData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/payment/verify', authenticate, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET || 'YOUR_KEY_SECRET';

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSig = crypto.createHmac('sha256', secret).update(body).digest('hex');

    if (expectedSig !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment verification failed' });
    }

    const planData = PLANS[plan];
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + planData.durationDays * 86400000);

    // Deactivate old memberships
    await prisma.membership.updateMany(
      { where: { userId: req.user.id } },
      { data: { status: 'expired' } }
    );

    const membership = await prisma.membership.create({
      data: {
        userId: req.user.id,
        plan,
        status: 'active',
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        amount: planData.amount,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      },
    });

    res.json({ success: true, membership });
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
      include: { memberships: true },
    });

    if (!user) return res.status(404).json({ error: 'Member not found' });

    const { password, ...safe } = user;
    res.json(safe);
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
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/gallery', authenticate, adminOnly, upload.single('file'), async (req, res) => {
  try {
    const { title, description, type } = req.body;

    if (!title || !type) {
      return res.status(400).json({ error: 'Missing required fields: title and type' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const item = await prisma.galleryItem.create({
      data: {
        title,
        description: description || '',
        type,
        url: req.file.secure_url,
        publicId: req.file.public_id,
      },
    });

    res.json(item);
  } catch (err) {
    console.error('Gallery upload error:', err);
    res.status(500).json({ error: 'Upload failed: ' + err.message });
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
