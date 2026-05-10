import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pemesananService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/atoms/Input';
import Button from '../../components/atoms/Button';

const BookingForm = ({ paketId, hargaPerPax }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama_pemesan: user?.nama || '',
    email: user?.email || '',
    telepon: user?.telepon || '',
    tanggal_berangkat: '',
    jumlah_peserta: 1,
    catatan_khusus: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        paket_id: parseInt(paketId),
        jumlah_peserta: parseInt(formData.jumlah_peserta)
      };

      const res = await pemesananService.create(payload);
      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => navigate('/my-bookings'), 2000);
      }
    } catch (err) {
      setError(err.message || 'Gagal membuat pesanan');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', background: 'rgba(0, 217, 165, 0.1)', borderRadius: '16px', border: '1px solid rgba(0, 217, 165, 0.3)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎉</div>
        <h3 style={{ color: 'var(--success)', margin: '0 0 8px' }}>Pemesanan Berhasil!</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Mengalihkan ke halaman pesanan Anda...</p>
      </div>
    );
  }

  return (
    <div className="glass" style={{ padding: '32px', borderRadius: '24px' }}>
      <h3 style={{ margin: '0 0 24px', fontSize: '1.5rem', color: 'var(--text-primary)' }}>Pesan Paket Ini</h3>
      
      {error && <div style={{ color: 'var(--danger)', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Input
          label="Nama Lengkap"
          value={formData.nama_pemesan}
          onChange={e => setFormData({...formData, nama_pemesan: e.target.value})}
          required
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            required
          />
          <Input
            label="No. Telepon"
            value={formData.telepon}
            onChange={e => setFormData({...formData, telepon: e.target.value})}
            required
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Input
            label="Tanggal Berangkat"
            type="date"
            value={formData.tanggal_berangkat}
            onChange={e => setFormData({...formData, tanggal_berangkat: e.target.value})}
            required
            style={{ colorScheme: 'dark' }}
          />
          <Input
            label="Jumlah Peserta"
            type="number"
            min="1"
            value={formData.jumlah_peserta}
            onChange={e => setFormData({...formData, jumlah_peserta: e.target.value})}
            required
          />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Catatan Khusus (Opsional)</label>
          <textarea
            value={formData.catatan_khusus}
            onChange={e => setFormData({...formData, catatan_khusus: e.target.value})}
            rows="3"
            style={{
              padding: '12px', background: 'var(--bg-input)', border: '1px solid var(--border)',
              borderRadius: '10px', color: 'var(--text-primary)', outline: 'none'
            }}
          />
        </div>

        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Pembayaran</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent)' }}>
              Rp {new Intl.NumberFormat('id-ID').format(hargaPerPax * (formData.jumlah_peserta || 1))}
            </div>
          </div>
          <Button type="submit" size="lg" loading={loading}>
            {user ? 'Pesan Sekarang' : 'Login untuk Memesan'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
