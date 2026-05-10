import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { paketService } from '../../services';
import SearchBar from '../../components/molecules/SearchBar';
import Pagination from '../../components/molecules/Pagination';
import Spinner from '../../components/atoms/Spinner';
import Badge from '../../components/atoms/Badge';
import Button from '../../components/atoms/Button';
import { getPackageImage } from '../../utils/images';

const BrowsePackages = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ page: 1, total: 0, pages: 0 });
  const [search, setSearch] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  const fetchPaket = async () => {
    setLoading(true);
    try {
      const res = await paketService.getAll({ page: meta.page, search: activeSearch, status: 'aktif' });
      if (res.data.success) {
        setData(res.data.data || []);
        if (res.data.meta) setMeta(res.data.meta);
      }
    } catch (err) {
      console.error('Error fetching paket:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaket();
  }, [meta.page, activeSearch]);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setActiveSearch(search);
      setMeta({ ...meta, page: 1 });
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 className="gradient-text" style={{ fontSize: '3rem', margin: '0 0 16px' }}>Pilih Petualanganmu</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 32px' }}>
          Beragam pilihan paket wisata menarik telah kami siapkan khusus untuk Anda.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <SearchBar 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Cari destinasi atau nama paket..."
          />
        </div>
      </div>

      {loading ? <Spinner /> : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
            {data.map(paket => (
              <div key={paket.id} className="glass" style={{
                borderRadius: '20px', overflow: 'hidden',
                transition: 'transform 0.3s, box-shadow 0.3s',
              }}>
                <div style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
                  <img 
                    src={getPackageImage(paket.kategori)} 
                    alt={paket.nama_paket}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.1)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)' }} />
                  <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 2 }}>
                    <Badge variant="primary" style={{ background: 'rgba(10, 11, 30, 0.85)', backdropFilter: 'blur(4px)' }}>{paket.kategori}</Badge>
                  </div>
                </div>
                <div style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.4rem', margin: '0 0 12px', color: 'var(--text-primary)' }}>{paket.nama_paket}</h3>
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <span>⏱️ {paket.durasi} Hari</span>
                    <span>👥 Max {paket.max_peserta} Org</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {paket.deskripsi}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mulai dari</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--accent)' }}>
                        Rp {new Intl.NumberFormat('id-ID').format(paket.harga)}
                      </div>
                    </div>
                    <Button onClick={() => navigate(`/packages/${paket.id}`)}>Detail</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {data.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
              Tidak ada paket wisata yang sesuai dengan pencarian Anda.
            </div>
          )}

          {data.length > 0 && (
            <Pagination 
              page={meta.page} 
              totalPages={meta.pages} 
              onPageChange={(p) => setMeta({ ...meta, page: p })} 
            />
          )}
        </>
      )}
    </div>
  );
};

export default BrowsePackages;
