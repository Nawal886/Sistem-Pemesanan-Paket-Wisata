import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pemesananService } from '../../services';
import Spinner from '../../components/atoms/Spinner';
import Badge from '../../components/atoms/Badge';
import Button from '../../components/atoms/Button';

const PemesananDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await pemesananService.getById(id);
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
      <Button variant="ghost" onClick={() => navigate('/pemesanan')} style={{ marginBottom: '20px' }}>
        ← Kembali
      </Button>

      <div className="glass" style={{ padding: '32px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', borderBottom: '1px solid var(--border)', paddingBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Kode Pemesanan</div>
            <h1 style={{ margin: '0 0 12px 0', fontSize: '2rem', fontFamily: 'monospace' }} className="gradient-text">{data.kode_pemesanan}</h1>
            <Badge variant={data.status_pemesanan}>{data.status_pemesanan}</Badge>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Pembayaran</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>
              Rp {new Intl.NumberFormat('id-ID').format(data.total_harga)}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          <div>
            <h3 style={{ color: 'var(--text-secondary)', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Data Pelanggan</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Nama Pemesan</div>
                <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{data.nama_pemesan}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Email</div>
                <div style={{ fontWeight: '500' }}>{data.email}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Nomor Telepon</div>
                <div style={{ fontWeight: '500' }}>{data.telepon}</div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 style={{ color: 'var(--text-secondary)', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Detail Perjalanan</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Paket Wisata</div>
                <div style={{ fontWeight: '600', color: 'var(--primary-light)' }}>{data.nama_paket}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tanggal Berangkat</div>
                  <div style={{ fontWeight: '500' }}>{new Date(data.tanggal_berangkat).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Jumlah Peserta</div>
                  <div style={{ fontWeight: '500' }}>{data.jumlah_peserta} Orang</div>
                </div>
              </div>
              {data.catatan_khusus && (
                <div style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: '12px', marginTop: '8px' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Catatan Khusus:</div>
                  <div style={{ fontStyle: 'italic' }}>"{data.catatan_khusus}"</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PemesananDetail;
