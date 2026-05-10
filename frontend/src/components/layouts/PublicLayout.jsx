import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../atoms/Button';

const PublicLayout = () => {
  const { user, logout, isCustomer } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="glass" style={{
        position: 'sticky', top: 0, zIndex: 50,
        padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid var(--border)'
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.8rem' }}>🏝️</span>
          <span className="gradient-text" style={{ fontSize: '1.4rem', fontWeight: '800' }}>WisataKu</span>
        </Link>

        <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link to="/packages" style={{ color: 'var(--text-primary)', fontWeight: '500' }}>Paket Wisata</Link>
          <Link to="/destinations" style={{ color: 'var(--text-primary)', fontWeight: '500' }}>Destinasi</Link>
          
          <div style={{ width: '1px', height: '24px', background: 'var(--border)', margin: '0 8px' }} />

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Link to="/profile" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                Halo, <strong style={{ color: 'var(--primary-light)' }}>{user.nama}</strong>
              </Link>
              <Link to="/profile" style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                Profil
              </Link>
              {isCustomer && (
                <Link to="/my-bookings" style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                  Pesanan Saya
                </Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin/paket" style={{ color: 'var(--accent)', fontWeight: '600' }}>
                  Admin Panel
                </Link>
              )}
              <Button variant="ghost" size="sm" onClick={() => { logout(); navigate('/'); }}>
                Keluar
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="ghost" onClick={() => navigate('/login')}>Masuk</Button>
              <Button variant="primary" onClick={() => navigate('/register')}>Daftar</Button>
            </div>
          )}
        </nav>
      </header>

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <footer style={{
        padding: '40px', textAlign: 'center',
        borderTop: '1px solid var(--border)',
        color: 'var(--text-muted)'
      }}>
        <div style={{ marginBottom: '16px', fontSize: '1.5rem' }}>🏝️ WisataKu</div>
        <p>© 2026 UTS Pemrograman III. Hak Cipta Dilindungi.</p>
      </footer>
    </div>
  );
};

export default PublicLayout;
