import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ulasanService } from '../../services';
import Input from '../../components/atoms/Input';
import Button from '../../components/atoms/Button';
import StarRating from '../../components/atoms/StarRating';

const ReviewForm = () => {
  const { paketId } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    rating: 5,
    judul: '',
    komentar: '',
    tanggal_wisata: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        paket_id: parseInt(paketId),
        rating: parseInt(formData.rating)
      };

      const res = await ulasanService.create(payload);
      if (res.data.success) {
        navigate(`/packages/${paketId}`);
      }
    } catch (err) {
      setError(err.message || 'Gagal mengirim ulasan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '60px 20px', maxWidth: '600px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate('/my-bookings')} 
        style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        ← Kembali ke Pesanan Saya
      </button>

      <div className="glass" style={{ padding: '40px', borderRadius: '24px' }}>
        <h2 style={{ fontSize: '2rem', margin: '0 0 8px' }}>Bagikan Pengalaman Anda</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Ulasan Anda sangat berarti bagi kami dan pelanggan lainnya.</p>

        {error && <div style={{ color: 'var(--danger)', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-secondary)' }}>
              Rating
            </label>
            <div style={{ display: 'flex', gap: '12px', fontSize: '2rem', cursor: 'pointer' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <span 
                  key={star}
                  onClick={() => setFormData({...formData, rating: star})}
                  style={{ color: star <= formData.rating ? '#FFD700' : 'var(--border)' }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <Input
            label="Tanggal Wisata"
            type="date"
            value={formData.tanggal_wisata}
            onChange={e => setFormData({...formData, tanggal_wisata: e.target.value})}
            required
            style={{ colorScheme: 'dark' }}
          />

          <Input
            label="Judul Ulasan"
            placeholder="Singkat dan jelas, misal: Liburan yang menyenangkan!"
            value={formData.judul}
            onChange={e => setFormData({...formData, judul: e.target.value})}
            required
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
              Komentar Lengkap
            </label>
            <textarea
              value={formData.komentar}
              onChange={e => setFormData({...formData, komentar: e.target.value})}
              rows="5"
              required
              placeholder="Ceritakan pengalaman Anda selama mengikuti paket wisata ini..."
              style={{
                padding: '16px', background: 'var(--bg-input)', border: '1px solid var(--border)',
                borderRadius: '12px', color: 'var(--text-primary)', outline: 'none',
                fontFamily: 'inherit', fontSize: '1rem', resize: 'vertical'
              }}
            />
          </div>

          <Button type="submit" size="lg" loading={loading} style={{ marginTop: '12px' }}>
            Kirim Ulasan
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
