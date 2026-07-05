import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Classes from './pages/public/Classes';
import Pricing from './pages/public/Pricing';
import Membership from './pages/public/Membership';
import Trainers from './pages/public/Trainers';
import Contact from './pages/public/Contact';
import Join from './pages/public/Join';
import PublicGallery from './pages/public/Gallery';

// Member Pages
import MemberLogin from './pages/member/Login';
import MemberDashboard from './pages/member/Dashboard';
import MemberProfile from './pages/member/Profile';
import MemberMembership from './pages/member/Membership';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminMembers from './pages/admin/Members';
import AdminMemberDetail from './pages/admin/MemberDetail';
import AdminApprovals from './pages/admin/Approvals';
import AdminGallery from './pages/admin/Gallery';

function MemberRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner" />;
  if (!user || user.role !== 'member') return <Navigate to="/member/login" />;
  return children;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner" />;
  if (!user || user.role !== 'admin') return <Navigate to="/admin/login" />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/trainers" element={<Trainers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/gallery" element={<PublicGallery />} />
          <Route path="/join" element={<Join />} />

          <Route path="/member/login" element={<MemberLogin />} />
          <Route path="/member/dashboard" element={<MemberRoute><MemberDashboard /></MemberRoute>} />
          <Route path="/member/profile" element={<MemberRoute><MemberProfile /></MemberRoute>} />
          <Route path="/member/membership" element={<MemberRoute><MemberMembership /></MemberRoute>} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/members" element={<AdminRoute><AdminMembers /></AdminRoute>} />
          <Route path="/admin/members/:id" element={<AdminRoute><AdminMemberDetail /></AdminRoute>} />
          <Route path="/admin/approvals" element={<AdminRoute><AdminApprovals /></AdminRoute>} />
          <Route path="/admin/gallery" element={<AdminRoute><AdminGallery /></AdminRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
