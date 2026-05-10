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
  const [printingTicket, setPrintingTicket] = useState(null);

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

  const handlePrint = (booking) => {
    setPrintingTicket(booking);
    setTimeout(() => {
      window.print();
      // Optional: don't clear immediately so they can see the ticket, but let's clear it on close.
    }, 100);
  };

  if (printingTicket) {
    return (
      <div style={{ padding: '40px', background: '#fff', color: '#000', minHeight: '100vh', fontFamily: 'monospace' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', border: '2px dashed #ccc', padding: '40px', borderRadius: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #000', paddingBottom: '20px', marginBottom: '20px' }}>
            <div>
              <h1 style={{ margin: '0 0 8px', fontSize: '2rem' }}>🏝️ WisataKu</h1>
              <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>E-TICKET / BOARDING PASS</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1rem', color: '#666' }}>KODE BOOKING</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{printingTicket.kode_pemesanan}</div>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
            <div>
              <p style={{ margin: '0 0 4px', color: '#666' }}>Nama Pemesan</p>
              <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{printingTicket.nama_pemesan}</h3>
            </div>
            <div>
              <p style={{ margin: '0 0 4px', color: '#666' }}>Paket Wisata</p>
              <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{printingTicket.nama_paket}</h3>
            </div>
            <div>
              <p style={{ margin: '0 0 4px', color: '#666' }}>Tanggal Keberangkatan</p>
              <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{new Date(printingTicket.tanggal_berangkat).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
            </div>
            <div>
              <p style={{ margin: '0 0 4px', color: '#666' }}>Jumlah Peserta</p>
              <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{printingTicket.jumlah_peserta} Orang</h3>
            </div>
          </div>

          <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>TOTAL PEMBAYARAN</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Rp {new Intl.NumberFormat('id-ID').format(printingTicket.total_harga)}</div>
          </div>
          <div style={{ marginTop: '10px', textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>
            *STATUS: LUNAS ({printingTicket.status_pemesanan.toUpperCase()})
          </div>

          <div className="no-print" style={{ marginTop: '40px', textAlign: 'center' }}>
            <Button onClick={() => setPrintingTicket(null)}>Tutup Tampilan Cetak</Button>
          </div>
        </div>
        <style>
          {`
            @media print {
              body { background: #fff; }
              .no-print { display: none !important; }
              header, footer, aside { display: none !important; }
              .glass { box-shadow: none !important; border: 1px solid #ccc; }
            }
          `}
        </style>
      </div>
    );
  }

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
                  <Button size="sm" variant="secondary" onClick={() => navigate(`/reviews/new/${booking.paket_id}`)} style={{ marginLeft: '8px' }}>
                    Tulis Ulasan
                  </Button>
                )}
                {(booking.status_pemesanan === 'confirmed' || booking.status_pemesanan === 'completed') && (
                  <Button size="sm" variant="primary" style={{ marginLeft: '8px' }} onClick={() => handlePrint(booking)}>
                    🖨️ Cetak Tiket
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
