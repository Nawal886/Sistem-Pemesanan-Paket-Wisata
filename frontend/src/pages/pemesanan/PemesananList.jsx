import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pemesananService } from '../../services';
import DataTable from '../../components/organisms/DataTable';
import Pagination from '../../components/molecules/Pagination';
import SearchBar from '../../components/molecules/SearchBar';
import Badge from '../../components/atoms/Badge';

const PemesananList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ page: 1, total: 0, pages: 0 });
  const [search, setSearch] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  const fetchPemesanan = async () => {
    setLoading(true);
    try {
      const res = await pemesananService.getAll({ page: meta.page, search: activeSearch });
      if (res.data.success) {
        setData(res.data.data || []);
        if (res.data.meta) setMeta(res.data.meta);
      }
    } catch (err) {
      console.error('Error fetching pemesanan:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPemesanan();
  }, [meta.page, activeSearch]);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setActiveSearch(search);
      setMeta({ ...meta, page: 1 });
    }
  };

  const columns = [
    { header: 'Kode', accessor: 'kode_pemesanan', render: (row) => <span style={{fontFamily: 'monospace', fontWeight: 'bold'}}>{row.kode_pemesanan}</span> },
    { header: 'Nama Pemesan', accessor: 'nama_pemesan' },
    { header: 'Paket', accessor: 'nama_paket' },
    { header: 'Tanggal', accessor: 'tanggal_berangkat', render: (row) => new Date(row.tanggal_berangkat).toLocaleDateString('id-ID') },
    { header: 'Total (Rp)', accessor: 'total_harga', render: (row) => new Intl.NumberFormat('id-ID').format(row.total_harga) },
    { header: 'Status', accessor: 'status_pemesanan', render: (row) => <Badge variant={row.status_pemesanan}>{row.status_pemesanan}</Badge> },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: '0 0 8px 0' }}>Data Pemesanan</h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Pantau transaksi dan pemesanan paket wisata.</p>
        </div>
      </div>

      <div className="glass" style={{ padding: '24px', borderRadius: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <SearchBar 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Cari kode/nama pemesan..."
          />
        </div>

        <DataTable 
          columns={columns} 
          data={data} 
          loading={loading} 
          onRowClick={(row) => navigate(`/pemesanan/${row.id}`)}
        />
        
        {!loading && data.length > 0 && (
          <Pagination 
            page={meta.page} 
            totalPages={meta.pages} 
            onPageChange={(p) => setMeta({ ...meta, page: p })} 
          />
        )}
      </div>
    </div>
  );
};

export default PemesananList;
