import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layouts/DashboardLayout';

import PaketList from './pages/paket/PaketList';
import PaketDetail from './pages/paket/PaketDetail';
import DestinasiList from './pages/destinasi/DestinasiList';
import DestinasiDetail from './pages/destinasi/DestinasiDetail';
import PemesananList from './pages/pemesanan/PemesananList';
import PemesananDetail from './pages/pemesanan/PemesananDetail';
import UlasanList from './pages/ulasan/UlasanList';
import UlasanDetail from './pages/ulasan/UlasanDetail';

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/paket" replace />} />
        
        <Route path="paket" element={<PaketList />} />
        <Route path="paket/:id" element={<PaketDetail />} />
        
        <Route path="destinasi" element={<DestinasiList />} />
        <Route path="destinasi/:id" element={<DestinasiDetail />} />
        
        <Route path="pemesanan" element={<PemesananList />} />
        <Route path="pemesanan/:id" element={<PemesananDetail />} />
        
        <Route path="ulasan" element={<UlasanList />} />
        <Route path="ulasan/:id" element={<UlasanDetail />} />
      </Route>
    </Routes>
  );
}

export default App;
