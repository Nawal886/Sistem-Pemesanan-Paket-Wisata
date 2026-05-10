import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../organisms/Sidebar';

const DashboardLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{
        flex: 1,
        marginLeft: '260px',
        padding: '32px 40px',
        maxWidth: '100%',
      }}>
        <div className="animate-fade-in-up" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
