import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { paketService, ulasanService } from '../../services';
import Spinner from '../../components/atoms/Spinner';
import Badge from '../../components/atoms/Badge';
import StarRating from '../../components/atoms/StarRating';
import BookingForm from './BookingForm';
import { getPackageImage } from '../../utils/images';

const PublicPackageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paketRes, ulasanRes] = await Promise.all([
          paketService.getById(id),
          ulasanService.getAll({ paket_id: id, limit: 5 })
        ]);
        
        if (paketRes.data.success) setData(paketRes.data.data);
        if (ulasanRes.data.success) setReviews(ulasanRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}><Spinner /></div>;
  if (!data) return <div style={{ padding: '60px', textAlign: 'center' }}>Paket tidak ditemukan.</div>;

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate('/packages')} 
        style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        ← Kembali ke Daftar Paket
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px', alignItems: 'start' }}>
        {/* Left Column - Details */}
        <div>
          <div style={{ height: '400px', borderRadius: '24px', marginBottom: '32px', overflow: 'hidden', position: 'relative' }}>
            <img 
              src={getPackageImage(data.kategori)} 
              alt={data.nama_paket}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 50%)' }} />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <Badge variant="primary">{data.kategori}</Badge>
            <Badge variant="info">⏱️ {data.durasi} Hari</Badge>
            <Badge variant="warning">👥 Max {data.max_peserta} Orang</Badge>
          </div>

          <h1 className="gradient-text" style={{ fontSize: '3rem', margin: '0 0 24px', lineHeight: 1.2 }}>{data.nama_paket}</h1>
          
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--text-primary)' }}>Deskripsi</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.1rem' }}>{data.deskripsi}</p>
          </div>

          {/* Informasi Keberangkatan */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px', padding: '24px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <div>
              <h4 style={{ margin: '0 0 8px', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Jadwal Berangkat</h4>
              <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: '600' }}>🕒 {data.jadwal_berangkat || 'Tanyakan CS'}</p>
            </div>
            <div>
              <h4 style={{ margin: '0 0 8px', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Lokasi Berkumpul</h4>
              <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: '600' }}>📍 {data.lokasi_berangkat || 'Tanyakan CS'}</p>
            </div>
          </div>

          {/* Reviews Section */}
          <div style={{ marginTop: '60px', borderTop: '1px solid var(--border)', paddingTop: '40px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Ulasan Pelanggan</h3>
            
            {reviews.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>Belum ada ulasan untuk paket ini.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {reviews.map(review => (
                  <div key={review.id} style={{ padding: '20px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>{review.nama_pengulas}</strong>
                      <StarRating rating={review.rating} />
                    </div>
                    <h4 style={{ margin: '0 0 8px', color: 'var(--text-primary)' }}>{review.judul}</h4>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{review.komentar}</p>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '12px' }}>
                      {new Date(review.tanggal_wisata).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Booking Form */}
        <div style={{ position: 'sticky', top: '100px' }}>
          <BookingForm paketId={data.id} hargaPerPax={data.harga} />
        </div>
      </div>
    </div>
  );
};

export default PublicPackageDetail;
