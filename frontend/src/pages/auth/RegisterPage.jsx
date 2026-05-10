import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/atoms/Input';
import Button from '../../components/atoms/Button';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    nama: '', email: '', password: '', telepon: '', alamat: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authService.register(formData);
      if (res.data.success) {
        login(res.data.data.token, res.data.data.user);
        navigate('/packages');
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.join(', '));
      } else {
        setError(err.message || 'Registrasi gagal. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px'
    }}>
      <div className="glass animate-fade-in-up" style={{
        width: '100%', maxWidth: '480px',
        padding: '40px 32px',
        borderRadius: '24px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 8px' }}>🚀</h1>
          <h2 className="gradient-text" style={{ fontSize: '1.8rem', margin: 0 }}>Daftar Akun Baru</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0' }}>Bergabung untuk kemudahan pemesanan paket wisata</p>
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
            label="Nama Lengkap"
            placeholder="Masukkan nama lengkap"
            value={formData.nama}
            onChange={(e) => setFormData({...formData, nama: e.target.value})}
            icon="👤"
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="nama@email.com"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            icon="✉️"
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="Minimal 6 karakter"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            icon="🔒"
            required
          />
          <Input
            label="Telepon"
            placeholder="0812xxxx"
            value={formData.telepon}
            onChange={(e) => setFormData({...formData, telepon: e.target.value})}
            icon="📱"
          />
          <Input
            label="Alamat"
            placeholder="Masukkan alamat Anda"
            value={formData.alamat}
            onChange={(e) => setFormData({...formData, alamat: e.target.value})}
            icon="🏠"
          />

          <Button type="submit" variant="primary" loading={loading} style={{ marginTop: '8px' }}>
            Daftar Sekarang
          </Button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Sudah punya akun? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: '600' }}>Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
