import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { paketService } from '../../services';
import Spinner from '../../components/atoms/Spinner';
import Badge from '../../components/atoms/Badge';
import Button from '../../components/atoms/Button';

const PaketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await paketService.getById(id);
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
      <Button variant="ghost" onClick={() => navigate('/admin/paket')} style={{ marginBottom: '20px' }}>
        ← Kembali
      </Button>

      <div className="glass" style={{ padding: '32px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h1 style={{ margin: '0 0 12px 0', fontSize: '2rem' }} className="gradient-text">{data.nama_paket}</h1>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Badge variant="primary">{data.kategori}</Badge>
              <Badge variant={data.status}>{data.status}</Badge>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Harga</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--accent)' }}>
              Rp {new Intl.NumberFormat('id-ID').format(data.harga)}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
          <div>
            <h3 style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>Informasi Detail</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Durasi</div>
                <div style={{ fontWeight: '500' }}>{data.durasi} Hari</div>
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Maksimal Peserta</div>
                <div style={{ fontWeight: '500' }}>{data.max_peserta} Orang</div>
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tanggal Dibuat</div>
                <div style={{ fontWeight: '500' }}>{new Date(data.created_at).toLocaleString('id-ID')}</div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>Deskripsi</h3>
            <p style={{ lineHeight: '1.8', color: 'var(--text-primary)' }}>
              {data.deskripsi || 'Tidak ada deskripsi.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaketDetail;
