import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paketService } from '../../services';
import Button from '../../components/atoms/Button';
import Badge from '../../components/atoms/Badge';
import Spinner from '../../components/atoms/Spinner';
import { getPackageImage } from '../../utils/images';

const LandingPage = () => {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await paketService.getAll({ limit: 10 });
        if (res.data.success) {
          const allPackages = res.data.data || [];
          setFeatured(allPackages.filter(p => p.status === 'aktif').slice(0, 3));
          setComingSoon(allPackages.filter(p => p.status === 'nonaktif').slice(0, 3));
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
        padding: '140px 20px 120px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Hero Background Image */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: 'url(/images/hero.png)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.2,
        }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to bottom, var(--bg-primary) 0%, transparent 30%, transparent 70%, var(--bg-primary) 100%)' }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto' }}>
          <h1 className="animate-fade-in-up" style={{ fontSize: '4rem', fontWeight: '800', lineHeight: 1.1, marginBottom: '24px', textShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>
            Jelajahi Dunia dengan <span className="gradient-text">WisataKu</span>
          </h1>
          <p className="animate-fade-in-up" style={{ fontSize: '1.2rem', color: '#FFFFFF', marginBottom: '40px', animationDelay: '0.1s', textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}>
            Temukan paket wisata eksklusif dan ciptakan kenangan tak terlupakan bersama orang tersayang.
          </p>
          <div className="animate-fade-in-up" style={{ display: 'flex', gap: '16px', justifyContent: 'center', animationDelay: '0.2s' }}>
            <Button size="lg" onClick={() => navigate('/packages')}>Lihat Paket Wisata</Button>
            <Button size="lg" variant="secondary" onClick={() => navigate('/register')}>Daftar Sekarang</Button>
          </div>
        </div>
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
                <div style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
                  <img 
                    src={getPackageImage(paket.kategori)} 
                    alt={paket.nama_paket}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.1)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)' }} />
                  <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 2 }}>
                    <Badge variant={paket.status} style={{ background: 'rgba(10, 11, 30, 0.85)', backdropFilter: 'blur(4px)' }}>{paket.status}</Badge>
                  </div>
                  <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 2 }}>
                    <Badge variant="primary" style={{ background: 'rgba(10, 11, 30, 0.85)', backdropFilter: 'blur(4px)' }}>{paket.kategori}</Badge>
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

      {/* Coming Soon Packages */}
      {!loading && comingSoon.length > 0 && (
        <section style={{ padding: '20px 20px 80px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2.5rem', margin: '0 0 8px' }}>🚀 Segera Hadir</h2>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Nantikan paket liburan eksklusif kami selanjutnya</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {comingSoon.map(paket => (
              <div key={paket.id} className="glass" style={{
                borderRadius: '20px', overflow: 'hidden',
                opacity: 0.7, filter: 'grayscale(50%)',
                position: 'relative'
              }}>
                <div style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
                  <img 
                    src={getPackageImage(paket.kategori)} 
                    alt={paket.nama_paket}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(10, 11, 30, 0.6)' }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(8px)', padding: '10px 20px', borderRadius: '50px', fontWeight: 'bold', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
                      Mendatang
                    </div>
                  </div>
                </div>
                <div style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.4rem', margin: '0 0 12px', color: 'var(--text-primary)' }}>{paket.nama_paket}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {paket.deskripsi}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section style={{ padding: '80px 20px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.5rem', margin: '0 0 16px' }}>Mengapa Memilih Kami?</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>Kami memberikan pengalaman liburan terbaik dengan layanan profesional, fasilitas eksklusif, dan harga yang transparan.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            {[
              { icon: '🌟', title: 'Fasilitas Eksklusif', desc: 'Nikmati layanan premium mulai dari penginapan bintang 5 hingga transportasi VIP pribadi.' },
              { icon: '🛡️', title: 'Aman & Terpercaya', desc: 'Perjalanan Anda dilindungi asuransi perjalanan penuh dan panduan wisata berlisensi resmi.' },
              { icon: '💸', title: 'Harga Transparan', desc: 'Tidak ada biaya tersembunyi. Harga yang Anda lihat adalah harga final yang Anda bayarkan.' },
            ].map((feature, i) => (
              <div key={i} className="glass" style={{ padding: '40px 32px', borderRadius: '24px', textAlign: 'center', transition: 'transform 0.3s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ fontSize: '3rem', marginBottom: '24px' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '16px', color: 'var(--text-primary)' }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '100px 20px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', margin: '0 0 16px' }}>Apa Kata Mereka?</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '60px' }}>Ribuan pelanggan telah mempercayakan liburan mereka bersama WisataKu.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', textAlign: 'left' }}>
          {[
            { name: 'Budi Santoso', rating: 5, review: 'Pengalaman luar biasa! Tour guide sangat ramah dan tempat menginapnya sangat bersih. Sangat direkomendasikan.', paket: 'Trip Bali 4 Hari' },
            { name: 'Siti Aminah', rating: 5, review: 'Liburan keluarga jadi sangat praktis dan tidak pusing mikirin itinerary. Harga juga sangat sepadan dengan fasilitas.', paket: 'Eksplorasi Labuan Bajo' },
            { name: 'Andi Wijaya', rating: 4, review: 'Proses pemesanan mudah dan respon admin sangat cepat. Transportasinya juga sangat nyaman selama perjalanan darat.', paket: 'Bromo Sunrise Tour' },
          ].map((testi, i) => (
            <div key={i} className="glass" style={{ padding: '32px', borderRadius: '20px' }}>
              <div className="stars" style={{ marginBottom: '16px' }}>
                {Array(5).fill(0).map((_, idx) => (
                  <span key={idx} className={idx < testi.rating ? 'star' : 'star-empty'}>★</span>
                ))}
              </div>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '24px', fontStyle: 'italic' }}>"{testi.review}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {testi.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{testi.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Peserta {testi.paket}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
