import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import DashboardLayout from './components/layouts/DashboardLayout';
import PublicLayout from './components/layouts/PublicLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import BrowsePackages from './pages/public/BrowsePackages';
import PublicPackageDetail from './pages/public/PublicPackageDetail';
import MyBookings from './pages/public/MyBookings';
import ReviewForm from './pages/public/ReviewForm';
import ProfilePage from './pages/public/ProfilePage';

// Admin Pages
import PaketList from './pages/paket/PaketList';
import PaketDetail from './pages/paket/PaketDetail';
import PaketForm from './pages/paket/PaketForm';
import DestinasiList from './pages/destinasi/DestinasiList';
import DestinasiDetail from './pages/destinasi/DestinasiDetail';
import PemesananList from './pages/pemesanan/PemesananList';
import PemesananDetail from './pages/pemesanan/PemesananDetail';
import UlasanList from './pages/ulasan/UlasanList';
import UlasanDetail from './pages/ulasan/UlasanDetail';

// Protected Route Guard
const ProtectedAdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return null;
  if (!user || !isAdmin) return <Navigate to="/login" replace />;
  return children;
};

const ProtectedCustomerRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <Routes>
      {/* Public & Customer Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/packages" element={<BrowsePackages />} />
        <Route path="/packages/:id" element={<PublicPackageDetail />} />
        
        {/* Customer Only */}
        <Route 
          path="/my-bookings" 
          element={
            <ProtectedCustomerRoute>
              <MyBookings />
            </ProtectedCustomerRoute>
          } 
        />
        <Route 
          path="/reviews/new/:paketId" 
          element={
            <ProtectedCustomerRoute>
              <ReviewForm />
            </ProtectedCustomerRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedCustomerRoute>
              <ProfilePage />
            </ProtectedCustomerRoute>
          } 
        />
      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Admin Dashboard Routes */}
      <Route 
        path="/admin" 
        element={
          <ProtectedAdminRoute>
            <DashboardLayout />
          </ProtectedAdminRoute>
        }
      >
        <Route index element={<Navigate to="paket" replace />} />
        
        <Route path="paket" element={<PaketList />} />
        <Route path="paket/new" element={<PaketForm />} />
        <Route path="paket/edit/:id" element={<PaketForm />} />
        <Route path="paket/:id" element={<PaketDetail />} />
        
        <Route path="destinasi" element={<DestinasiList />} />
        <Route path="destinasi/:id" element={<DestinasiDetail />} />
        
        <Route path="pemesanan" element={<PemesananList />} />
        <Route path="pemesanan/:id" element={<PemesananDetail />} />
        
        <Route path="ulasan" element={<UlasanList />} />
        <Route path="ulasan/:id" element={<UlasanDetail />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
