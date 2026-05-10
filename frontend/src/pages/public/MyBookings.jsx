import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pemesananService } from '../../services';
import Spinner from '../../components/atoms/Spinner';
import Badge from '../../components/atoms/Badge';
import Button from '../../components/atoms/Button';

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await pemesananService.getMyPemesanan();
        if (res.data.success) {
          setBookings(res.data.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Riwayat Pesanan</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Pantau status pemesanan paket wisata Anda di sini.</p>

      {loading ? <Spinner /> : bookings.length === 0 ? (
        <div className="glass" style={{ padding: '60px', textAlign: 'center', borderRadius: '24px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎫</div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Belum ada pesanan</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Anda belum melakukan pemesanan paket wisata apapun.</p>
          <Button onClick={() => navigate('/packages')}>Cari Paket Wisata</Button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {bookings.map(booking => (
            <div key={booking.id} className="glass" style={{ padding: '24px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{booking.kode_pemesanan}</span>
                  <Badge variant={booking.status_pemesanan}>{booking.status_pemesanan}</Badge>
                </div>
                <h3 style={{ fontSize: '1.4rem', margin: '0 0 12px', color: 'var(--text-primary)' }}>{booking.nama_paket}</h3>
                <div style={{ display: 'flex', gap: '24px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <div>📅 Berangkat: {new Date(booking.tanggal_berangkat).toLocaleDateString('id-ID')}</div>
                  <div>👥 {booking.jumlah_peserta} Peserta</div>
                  <div>🗓️ Dipesan: {new Date(booking.created_at).toLocaleDateString('id-ID')}</div>
                </div>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Pembayaran</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--accent)', marginBottom: '12px' }}>
                  Rp {new Intl.NumberFormat('id-ID').format(booking.total_harga)}
                </div>
                {booking.status_pemesanan === 'completed' && (
                  <Button size="sm" variant="secondary" onClick={() => navigate(`/reviews/new/${booking.paket_id}`)}>
                    Tulis Ulasan
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
