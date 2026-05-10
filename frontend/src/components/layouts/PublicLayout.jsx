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

        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link to="/packages" style={{ color: 'var(--text-primary)', fontWeight: '500', padding: '8px 14px', borderRadius: '8px', transition: 'background 0.2s' }}
            onMouseEnter={e => e.target.style.background = 'rgba(108, 99, 255, 0.1)'}
            onMouseLeave={e => e.target.style.background = 'transparent'}
          >Paket Wisata</Link>

          {user ? (
            <>
              {isCustomer && (
                <Link to="/my-bookings" style={{ color: 'var(--text-primary)', fontWeight: '500', padding: '8px 14px', borderRadius: '8px', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.target.style.background = 'rgba(108, 99, 255, 0.1)'}
                  onMouseLeave={e => e.target.style.background = 'transparent'}
                >Pesanan Saya</Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin/dashboard" style={{ color: 'var(--accent)', fontWeight: '600', padding: '8px 14px', borderRadius: '8px', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.target.style.background = 'rgba(67, 203, 255, 0.1)'}
                  onMouseLeave={e => e.target.style.background = 'transparent'}
                >🛡️ Admin Panel</Link>
              )}

              <div style={{ width: '1px', height: '24px', background: 'var(--border)', margin: '0 4px' }} />

              <Link to="/profile" style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '6px 14px 6px 6px', borderRadius: '50px',
                background: 'rgba(108, 99, 255, 0.1)',
                border: '1px solid var(--border)',
                transition: 'all 0.2s', textDecoration: 'none',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'rgba(108, 99, 255, 0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'rgba(108, 99, 255, 0.1)'; }}
              >
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: 'var(--gradient-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.85rem', fontWeight: '700', color: '#fff',
                }}>
                  {user.nama?.charAt(0)?.toUpperCase()}
                </div>
                <span style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.9rem' }}>{user.nama?.split(' ')[0]}</span>
              </Link>

              <Button variant="ghost" size="sm" onClick={() => { logout(); navigate('/'); }}
                style={{ color: 'var(--danger)', borderColor: 'rgba(255, 77, 106, 0.3)' }}
              >
                Keluar
              </Button>
            </>
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
        padding: '60px 40px 20px', 
        background: 'var(--bg-card)',
        borderTop: '1px solid var(--border)',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '40px' }}>
          <div>
            <div style={{ marginBottom: '16px', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🏝️</span>
              <span className="gradient-text" style={{ fontWeight: '800' }}>WisataKu</span>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.6' }}>Platform pemesanan paket wisata terpercaya untuk pengalaman liburan yang tak terlupakan di seluruh Indonesia.</p>
          </div>
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '1.1rem' }}>Layanan</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li><Link to="/packages" style={{ transition: 'color 0.2s' }}>Paket Wisata</Link></li>
              <li><Link to="/packages" style={{ transition: 'color 0.2s' }}>Destinasi Populer</Link></li>
              <li><Link to="/login" style={{ transition: 'color 0.2s' }}>Cara Memesan</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '1.1rem' }}>Perusahaan</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li><span style={{ cursor: 'pointer', transition: 'color 0.2s' }}>Tentang Kami</span></li>
              <li><span style={{ cursor: 'pointer', transition: 'color 0.2s' }}>Hubungi Kami</span></li>
              <li><span style={{ cursor: 'pointer', transition: 'color 0.2s' }}>Syarat & Ketentuan</span></li>
              <li><span style={{ cursor: 'pointer', transition: 'color 0.2s' }}>Kebijakan Privasi</span></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '1.1rem' }}>Kontak</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text-muted)' }}>
              <li>📍 Jl. Pariwisata No. 123, Jakarta</li>
              <li>📞 +62 812 3456 7890</li>
              <li>✉️ info@wisataku.com</li>
            </ul>
          </div>
        </div>
        <div style={{ textAlign: 'center', paddingTop: '20px', borderTop: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <p>© 2026 UTS Pemrograman III. Hak Cipta Dilindungi.</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
