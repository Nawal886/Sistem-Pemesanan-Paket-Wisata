import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/atoms/Input';
import Button from '../../components/atoms/Button';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authService.login(formData);
      if (res.data.success) {
        login(res.data.data.token, res.data.data.user);
        if (res.data.data.user.role === 'admin') {
          navigate('/admin/paket');
        } else {
          navigate('/packages');
        }
      }
    } catch (err) {
      setError(err.message || 'Login gagal. Silakan periksa email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass animate-fade-in-up" style={{
        width: '100%', maxWidth: '420px',
        padding: '40px 32px',
        borderRadius: '24px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 8px' }}>🏝️</h1>
          <h2 className="gradient-text" style={{ fontSize: '1.8rem', margin: 0 }}>Selamat Datang</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0' }}>Masuk untuk merencanakan liburanmu</p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(255, 77, 106, 0.15)',
            border: '1px solid rgba(255, 77, 106, 0.3)',
            color: 'var(--danger)',
            padding: '12px 16px', borderRadius: '12px',
            marginBottom: '24px', fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Input
            label="Email"
            type="email"
            placeholder="Masukkan email Anda"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            icon="✉️"
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="Masukkan password Anda"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            icon="🔒"
            required
          />

          <Button type="submit" variant="primary" loading={loading} style={{ marginTop: '8px' }}>
            Masuk Sekarang
          </Button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Belum punya akun? <Link to="/register" style={{ color: 'var(--accent)', fontWeight: '600' }}>Daftar di sini</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
