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
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    const statusLabels = {
      confirmed: 'Dikonfirmasi',
      completed: 'Selesai',
      cancelled: 'Dibatalkan',
    };

    if (!window.confirm(`Ubah status pesanan menjadi "${statusLabels[newStatus]}"?`)) return;

    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      await pemesananService.update(id, { ...data, status_pemesanan: newStatus });
      setData({ ...data, status_pemesanan: newStatus });
      setSuccess(`Status berhasil diubah menjadi "${statusLabels[newStatus]}"`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Gagal mengubah status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Spinner />;
  if (error && !data) return <div style={{ color: 'var(--danger)', padding: '20px' }}>Error: {error}</div>;
  if (!data) return <div>Data tidak ditemukan.</div>;

  // Determine which status transitions are available
  const statusActions = [];
  if (data.status_pemesanan === 'pending') {
    statusActions.push({ status: 'confirmed', label: '✅ Konfirmasi Pesanan', variant: 'primary' });
    statusActions.push({ status: 'cancelled', label: '❌ Tolak / Batalkan', variant: 'danger' });
  }
  if (data.status_pemesanan === 'confirmed') {
    statusActions.push({ status: 'completed', label: '🏁 Tandai Selesai', variant: 'primary' });
    statusActions.push({ status: 'cancelled', label: '❌ Batalkan', variant: 'danger' });
  }

  return (
    <div className="animate-fade-in">
      <Button variant="ghost" onClick={() => navigate('/admin/pemesanan')} style={{ marginBottom: '20px' }}>
        ← Kembali
      </Button>

      {/* Alerts */}
      {success && (
        <div style={{
          background: 'rgba(0, 217, 165, 0.1)',
          border: '1px solid rgba(0, 217, 165, 0.3)',
          color: 'var(--success)',
          padding: '14px 20px', borderRadius: '12px', marginBottom: '20px',
          display: 'flex', alignItems: 'center', gap: '10px'
        }}>
          ✅ {success}
        </div>
      )}
      {error && data && (
        <div style={{
          background: 'rgba(255, 77, 106, 0.1)',
          border: '1px solid rgba(255, 77, 106, 0.3)',
          color: 'var(--danger)',
          padding: '14px 20px', borderRadius: '12px', marginBottom: '20px',
        }}>
          {error}
        </div>
      )}

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

        {/* Status Action Buttons */}
        {statusActions.length > 0 && (
          <div style={{
            marginTop: '32px', paddingTop: '24px',
            borderTop: '1px solid var(--border)',
          }}>
            <h3 style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '1rem' }}>Kelola Status Pesanan</h3>
            <div style={{ display: 'flex', gap: '12px' }}>
              {statusActions.map(action => (
                <Button
                  key={action.status}
                  variant={action.variant}
                  onClick={() => handleStatusChange(action.status)}
                  loading={updating}
                  style={{ flex: 1 }}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Final status indicator */}
        {(data.status_pemesanan === 'completed' || data.status_pemesanan === 'cancelled') && (
          <div style={{
            marginTop: '32px', paddingTop: '24px',
            borderTop: '1px solid var(--border)',
            textAlign: 'center', padding: '24px',
            background: data.status_pemesanan === 'completed' ? 'rgba(0, 217, 165, 0.08)' : 'rgba(255, 77, 106, 0.08)',
            borderRadius: '16px',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>
              {data.status_pemesanan === 'completed' ? '🎉' : '🚫'}
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: data.status_pemesanan === 'completed' ? 'var(--success)' : 'var(--danger)' }}>
              {data.status_pemesanan === 'completed' ? 'Pesanan telah selesai' : 'Pesanan telah dibatalkan'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PemesananDetail;
