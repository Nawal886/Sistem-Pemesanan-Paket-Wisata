import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paketService } from '../../services';
import Button from '../../components/atoms/Button';
import Badge from '../../components/atoms/Badge';
import Spinner from '../../components/atoms/Spinner';

const LandingPage = () => {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await paketService.getAll({ limit: 3 });
        if (res.data.success) {
          setFeatured(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        padding: '100px 20px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto' }}>
          <h1 className="animate-fade-in-up" style={{ fontSize: '4rem', fontWeight: '800', lineHeight: 1.1, marginBottom: '24px' }}>
            Jelajahi Dunia dengan <span className="gradient-text">Wanderlust</span>
          </h1>
          <p className="animate-fade-in-up" style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '40px', animationDelay: '0.1s' }}>
            Temukan paket wisata eksklusif dan ciptakan kenangan tak terlupakan bersama orang tersayang.
          </p>
          <div className="animate-fade-in-up" style={{ display: 'flex', gap: '16px', justifyContent: 'center', animationDelay: '0.2s' }}>
            <Button size="lg" onClick={() => navigate('/packages')}>Lihat Paket Wisata</Button>
            <Button size="lg" variant="secondary" onClick={() => navigate('/register')}>Daftar Sekarang</Button>
          </div>
        </div>

        {/* Decorative elements */}
        <div style={{
          position: 'absolute', top: '10%', left: '10%',
          width: '300px', height: '300px',
          background: 'var(--primary)',
          filter: 'blur(100px)', opacity: 0.2,
          borderRadius: '50%', zIndex: 0
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '10%',
          width: '250px', height: '250px',
          background: 'var(--accent)',
          filter: 'blur(100px)', opacity: 0.15,
          borderRadius: '50%', zIndex: 0
        }} />
      </section>

      {/* Featured Packages */}
      <section style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', margin: '0 0 8px' }}>Paket Populer</h2>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Destinasi favorit pilihan pelanggan kami</p>
          </div>
          <Button variant="ghost" onClick={() => navigate('/packages')}>Lihat Semua →</Button>
        </div>

        {loading ? <Spinner /> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {featured.map(paket => (
              <div key={paket.id} className="glass" style={{
                borderRadius: '20px', overflow: 'hidden',
                transition: 'transform 0.3s, box-shadow 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--glass-shadow)';
              }}
              onClick={() => navigate(`/packages/${paket.id}`)}
              >
                <div style={{ height: '200px', background: 'var(--bg-input)', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                    <Badge variant={paket.status}>{paket.status}</Badge>
                  </div>
                  <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                    <Badge variant="primary">{paket.kategori}</Badge>
                  </div>
                  {/* Dummy Image placeholder since we don't have actual images uploaded */}
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
                    {paket.kategori.includes('Pantai') ? '🏖️' : paket.kategori.includes('Gunung') ? '⛰️' : '🗺️'}
                  </div>
                </div>
                <div style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.4rem', margin: '0 0 12px', color: 'var(--text-primary)' }}>{paket.nama_paket}</h3>
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <span>⏱️ {paket.durasi} Hari</span>
                    <span>👥 Max {paket.max_peserta} Orang</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mulai dari</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--accent)' }}>
                        Rp {new Intl.NumberFormat('id-ID').format(paket.harga)}
                      </div>
                    </div>
                    <Button size="sm">Pesan</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default LandingPage;
