import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ulasanService } from '../../services';
import Spinner from '../../components/atoms/Spinner';
import Badge from '../../components/atoms/Badge';
import Button from '../../components/atoms/Button';
import StarRating from '../../components/atoms/StarRating';

const UlasanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await ulasanService.getById(id);
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        setError(err.message || 'Gagal memuat data');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <Spinner />;
  if (error) return <div style={{ color: 'var(--danger)', padding: '20px' }}>Error: {error}</div>;
  if (!data) return <div>Data tidak ditemukan.</div>;

  return (
    <div className="animate-fade-in">
      <Button variant="ghost" onClick={() => navigate('/ulasan')} style={{ marginBottom: '20px' }}>
        ← Kembali
      </Button>

      <div className="glass" style={{ padding: '32px', borderRadius: '16px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <StarRating rating={data.rating} />
              <span style={{ fontWeight: 'bold' }}>{data.rating}/5</span>
            </div>
            <h1 style={{ margin: '0 0 12px 0', fontSize: '1.8rem' }}>"{data.judul}"</h1>
            <Badge variant={data.status}>{data.status === 'pending' ? 'Menunggu Moderasi' : data.status}</Badge>
          </div>
        </div>

        <div style={{ background: 'var(--bg-input)', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
          <p style={{ margin: 0, fontSize: '1.1rem', lineHeight: '1.8', fontStyle: 'italic', color: 'var(--text-primary)' }}>
            {data.komentar}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pengulas</div>
            <div style={{ fontWeight: '600', color: 'var(--primary-light)' }}>{data.nama_pengulas}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{data.email}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Paket Wisata</div>
            <div style={{ fontWeight: '600' }}>{data.nama_paket}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>Tanggal Wisata</div>
            <div>{new Date(data.tanggal_wisata).toLocaleDateString('id-ID')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UlasanDetail;
