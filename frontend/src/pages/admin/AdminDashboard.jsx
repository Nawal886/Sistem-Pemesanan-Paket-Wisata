import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { paketService, pemesananService, destibasiService, ulasanService } from '../../services';
import Spinner from '../../components/atoms/Spinner';
import Badge from '../../components/atoms/Badge';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [paketRes, pemesananRes, destinasiRes, ulasanRes] = await Promise.all([
          paketService.getAll({ limit: 100 }),
          pemesananService.getAll({ limit: 100 }),
          destibasiService.getAll({ limit: 100 }),
          ulasanService.getAll({ limit: 100 }),
        ]);

        const paketData = paketRes.data.data || [];
        const pemesananData = pemesananRes.data.data || [];
        const destinasiData = destinasiRes.data.data || [];
        const ulasanData = ulasanRes.data.data || [];

        const totalRevenue = pemesananData
          .filter(p => p.status_pemesanan === 'confirmed' || p.status_pemesanan === 'completed')
          .reduce((sum, p) => sum + (p.total_harga || 0), 0);

        const pendingCount = pemesananData.filter(p => p.status_pemesanan === 'pending').length;

        setStats({
          totalPaket: paketData.length,
          totalDestinasi: destinasiData.length,
          totalPemesanan: pemesananData.length,
          totalUlasan: ulasanData.length,
          totalRevenue,
          pendingCount,
          confirmedCount: pemesananData.filter(p => p.status_pemesanan === 'confirmed').length,
          completedCount: pemesananData.filter(p => p.status_pemesanan === 'completed').length,
        });

        // Group by month
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
        const monthlyCounts = new Array(12).fill(0);
        pemesananData.forEach(p => {
          if (p.tanggal_berangkat) {
            const date = new Date(p.tanggal_berangkat);
            monthlyCounts[date.getMonth()]++;
          }
        });
        const maxCount = Math.max(...monthlyCounts, 1);
        setChartData(months.map((m, i) => ({ month: m, count: monthlyCounts[i], height: (monthlyCounts[i] / maxCount) * 100 })));

        setRecentOrders(pemesananData.slice(0, 5));
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <div style={{ padding: '60px' }}><Spinner /></div>;

  const statCards = [
    { label: 'Total Paket', value: stats.totalPaket, icon: '🧳', color: 'var(--primary)', bg: 'rgba(108, 99, 255, 0.15)', path: '/admin/paket' },
    { label: 'Total Destinasi', value: stats.totalDestinasi, icon: '🗺️', color: 'var(--info)', bg: 'rgba(67, 203, 255, 0.15)', path: '/admin/destinasi' },
    { label: 'Total Pemesanan', value: stats.totalPemesanan, icon: '🎫', color: 'var(--success)', bg: 'rgba(0, 217, 165, 0.15)', path: '/admin/pemesanan' },
    { label: 'Total Ulasan', value: stats.totalUlasan, icon: '⭐', color: 'var(--warning)', bg: 'rgba(255, 182, 72, 0.15)', path: '/admin/ulasan' },
  ];

  return (
    <div className="animate-fade-in-up">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ margin: '0 0 8px' }}>Dashboard</h1>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Selamat datang di panel admin WisataKu.</p>
      </div>

      {/* Stat Cards */}
      <div className="admin-grid-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="glass"
            onClick={() => navigate(card.path)}
            style={{
              padding: '24px', borderRadius: '20px', cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--glass-shadow)'; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px',
                background: card.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                {card.icon}
              </div>
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: '800', color: card.color, marginBottom: '4px' }}>
              {card.value}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* Revenue & Status Summary */}
      <div className="admin-grid-2">
        <div className="glass" style={{ padding: '28px', borderRadius: '20px' }}>
          <h3 style={{ margin: '0 0 24px', color: 'var(--text-secondary)', fontSize: '1rem' }}>Ringkasan Pendapatan</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '8px' }}>
            <span className="gradient-text">Rp {new Intl.NumberFormat('id-ID').format(stats.totalRevenue)}</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Dari pesanan terkonfirmasi & selesai
          </div>
        </div>

        <div className="glass" style={{ padding: '28px', borderRadius: '20px' }}>
          <h3 style={{ margin: '0 0 24px', color: 'var(--text-secondary)', fontSize: '1rem' }}>Status Pemesanan</h3>
          <div className="admin-status-grid">
            <StatusItem label="Pending" count={stats.pendingCount} color="var(--warning)" />
            <StatusItem label="Confirmed" count={stats.confirmedCount} color="var(--info)" />
            <StatusItem label="Completed" count={stats.completedCount} color="var(--success)" />
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="glass" style={{ padding: '28px', borderRadius: '20px', display: 'flex', flexDirection: 'column', marginBottom: '32px' }}>
        <h3 style={{ margin: '0 0 24px', color: 'var(--text-secondary)', fontSize: '1rem' }}>Trend Pemesanan (Bulan Rame)</h3>
        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '8px', paddingBottom: '20px', borderBottom: '1px solid var(--border)', height: '140px' }}>
            {chartData.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', opacity: d.count > 0 ? 1 : 0 }}>{d.count}</div>
                <div style={{ 
                  width: '100%', 
                  height: `${Math.max(d.height, 2)}%`, 
                  background: d.height > 80 ? 'var(--gradient-secondary)' : 'var(--gradient-primary)', 
                  borderRadius: '6px',
                  transition: 'height 1s ease-out'
                }} />
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{d.month}</div>
              </div>
            ))}
          </div>
      </div>

      {/* Recent Orders Table */}
      <div className="glass" style={{ padding: '28px', borderRadius: '20px', overflow: 'hidden', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1rem' }}>Pesanan Terbaru</h3>
            <span onClick={() => navigate('/admin/pemesanan')} style={{ color: 'var(--primary-light)', fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem' }}>Lihat →</span>
          </div>

        {recentOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Belum ada pemesanan.
          </div>
        ) : (
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Kode', 'Pemesan', 'Paket', 'Total', 'Status'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr
                  key={order.id}
                  style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'background 0.2s' }}
                  onClick={() => navigate(`/admin/pemesanan/${order.id}`)}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(108, 99, 255, 0.05)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontWeight: '600' }}>{order.kode_pemesanan}</td>
                  <td style={{ padding: '14px 16px' }}>{order.nama_pemesan}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--primary-light)' }}>{order.nama_paket}</td>
                  <td style={{ padding: '14px 16px', fontWeight: '600' }}>Rp {new Intl.NumberFormat('id-ID').format(order.total_harga)}</td>
                  <td style={{ padding: '14px 16px' }}><Badge variant={order.status_pemesanan}>{order.status_pemesanan}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
};

const StatusItem = ({ label, count, color }) => (
  <div style={{ flex: 1, textAlign: 'center', padding: '16px', background: 'var(--bg-input)', borderRadius: '14px' }}>
    <div style={{ fontSize: '1.8rem', fontWeight: '800', color, marginBottom: '4px' }}>{count}</div>
    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500' }}>{label}</div>
  </div>
);

export default AdminDashboard;
