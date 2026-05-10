import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../atoms/Button';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { path: '/admin/paket', label: 'Paket Wisata', icon: '🧳' },
    { path: '/admin/destinasi', label: 'Destinasi', icon: '🗺️' },
    { path: '/admin/pemesanan', label: 'Pemesanan', icon: '🎫' },
    { path: '/admin/ulasan', label: 'Ulasan', icon: '⭐' },
  ];

  return (
    <aside style={{
      width: '260px',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)',
      height: '100vh',
      position: 'fixed',
      left: 0, top: 0,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 10,
    }}>
      <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border)' }}>
        <h1 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.8rem' }}>🏝️</span>
          <span className="gradient-text">WisataKu Admin</span>
        </h1>
      </div>

      <nav style={{ flex: 1, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {menuItems.map(item => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                background: isActive ? 'var(--gradient-primary)' : 'transparent',
                fontWeight: isActive ? '600' : '500',
                transition: 'all 0.2s',
                boxShadow: isActive ? '0 4px 15px rgba(108, 99, 255, 0.3)' : 'none',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div style={{ padding: '20px', borderTop: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <Button 
          variant="ghost" 
          style={{ width: '100%', marginBottom: '16px', color: 'var(--danger)', borderColor: 'rgba(255, 77, 106, 0.3)' }}
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          Keluar (Log Out)
        </Button>
        © 2026 UTS Pemrograman III<br/>
        Admin Dashboard
      </div>
    </aside>
  );
};

export default Sidebar;
