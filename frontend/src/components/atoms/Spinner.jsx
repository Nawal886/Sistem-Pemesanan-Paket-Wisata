import React from 'react';

const Spinner = ({ size = 40, message = 'Memuat data...' }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: '16px', padding: '60px 20px',
  }}>
    <div style={{
      width: size, height: size,
      border: '3px solid rgba(108,99,255,0.2)',
      borderTopColor: 'var(--primary)',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{message}</p>
  </div>
);

export default Spinner;
