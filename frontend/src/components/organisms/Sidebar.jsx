import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../atoms/Button';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/paket', label: 'Paket Wisata', icon: '🧳' },
    { path: '/admin/destinasi', label: 'Destinasi', icon: '🗺️' },
    { path: '/admin/pemesanan', label: 'Pemesanan', icon: '🎫' },
    { path: '/admin/ulasan', label: 'Ulasan', icon: '⭐' },
  ];

  const renderMenuItem = (item, loc) => {
    const isActive = loc.pathname === item.path || (item.path !== '/admin/dashboard' && loc.pathname.startsWith(item.path));
    return (
      <NavLink
        key={item.path}
        to={item.path}
        style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '11px 16px',
          borderRadius: '12px',
          color: isActive ? '#fff' : 'var(--text-secondary)',
          background: isActive ? 'var(--gradient-primary)' : 'transparent',
          fontWeight: isActive ? '600' : '500',
          transition: 'all 0.2s',
          boxShadow: isActive ? '0 4px 15px rgba(108, 99, 255, 0.3)' : 'none',
          fontSize: '0.9rem',
        }}
        onClick={onClose}
      >
        <span style={{ fontSize: '1.15rem' }}>{item.icon}</span>
        {item.label}
      </NavLink>
    );
  };

  return (
    <aside className={`admin-sidebar ${isOpen ? 'mobile-open' : ''}`}>
      {/* Brand */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border)' }}>
        <h1 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.8rem' }}>🏝️</span>
          <span className="gradient-text">WisataKu Admin</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '8px 16px 4px' }}>
          Menu Utama
        </div>
        {menuItems.slice(0, 1).map(item => renderMenuItem(item, location))}

        <div style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '16px 16px 4px' }}>
          Kelola Data
        </div>
        {menuItems.slice(1).map(item => renderMenuItem(item, location))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
        <NavLink
          to="/"
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 14px', borderRadius: '10px',
            color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500',
            transition: 'all 0.2s', marginBottom: '10px',
            background: 'rgba(108, 99, 255, 0.05)',
            border: '1px solid var(--border)',
          }}
        >
          <span>🌐</span> Kembali ke Situs
        </NavLink>
        <Button 
          variant="ghost" 
          style={{ width: '100%', marginBottom: '12px', color: 'var(--danger)', borderColor: 'rgba(255, 77, 106, 0.3)' }}
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          🚪 Keluar
        </Button>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          © 2026 WisataKu
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
