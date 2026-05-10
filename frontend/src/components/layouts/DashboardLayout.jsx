import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../organisms/Sidebar';

const DashboardLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <main className="admin-main-content">
        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>
          ☰ Menu
        </button>
        <div className="animate-fade-in-up" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>
      
      {/* Overlay for mobile when sidebar is open */}
      {mobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)}></div>
      )}
    </div>
  );
};

export default DashboardLayout;
