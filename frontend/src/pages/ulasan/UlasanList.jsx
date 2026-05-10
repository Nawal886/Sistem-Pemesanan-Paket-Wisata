import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ulasanService } from '../../services';
import DataTable from '../../components/organisms/DataTable';
import Pagination from '../../components/molecules/Pagination';
import SearchBar from '../../components/molecules/SearchBar';
import Badge from '../../components/atoms/Badge';
import StarRating from '../../components/atoms/StarRating';

const UlasanList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ page: 1, total: 0, pages: 0 });
  const [search, setSearch] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  const fetchUlasan = async () => {
    setLoading(true);
    try {
      const res = await ulasanService.getAll({ page: meta.page, search: activeSearch });
      if (res.data.success) {
        setData(res.data.data || []);
        if (res.data.meta) setMeta(res.data.meta);
      }
    } catch (err) {
      console.error('Error fetching ulasan:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUlasan();
  }, [meta.page, activeSearch]);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setActiveSearch(search);
      setMeta({ ...meta, page: 1 });
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Paket Wisata', accessor: 'nama_paket' },
    { header: 'Pengulas', accessor: 'nama_pengulas', render: (row) => <strong>{row.nama_pengulas}</strong> },
    { header: 'Rating', accessor: 'rating', render: (row) => <StarRating rating={row.rating} /> },
    { header: 'Judul', accessor: 'judul' },
    { header: 'Status', accessor: 'status', render: (row) => <Badge variant={row.status}>{row.status}</Badge> },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: '0 0 8px 0' }}>Ulasan Pelanggan</h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Moderasi dan pantau feedback dari pelanggan.</p>
        </div>
      </div>

      <div className="glass" style={{ padding: '24px', borderRadius: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <SearchBar 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Cari pengulas atau judul..."
          />
        </div>

        <DataTable 
          columns={columns} 
          data={data} 
          loading={loading} 
          onRowClick={(row) => navigate(`/ulasan/${row.id}`)}
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

export default UlasanList;
