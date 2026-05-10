import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { destibasiService } from '../../services';
import DataTable from '../../components/organisms/DataTable';
import Pagination from '../../components/molecules/Pagination';
import SearchBar from '../../components/molecules/SearchBar';
import Badge from '../../components/atoms/Badge';
import StarRating from '../../components/atoms/StarRating';

const DestinasiList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ page: 1, total: 0, pages: 0 });
  const [search, setSearch] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  const fetchDestinasi = async () => {
    setLoading(true);
    try {
      const res = await destibasiService.getAll({ page: meta.page, search: activeSearch });
      if (res.data.success) {
        setData(res.data.data || []);
        if (res.data.meta) setMeta(res.data.meta);
      }
    } catch (err) {
      console.error('Error fetching destinasi:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinasi();
  }, [meta.page, activeSearch]);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setActiveSearch(search);
      setMeta({ ...meta, page: 1 });
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nama Destinasi', accessor: 'nama_destinasi', render: (row) => <strong style={{color: 'var(--primary-light)'}}>{row.nama_destinasi}</strong> },
    { header: 'Provinsi', accessor: 'provinsi' },
    { header: 'Negara', accessor: 'negara' },
    { header: 'Rating', accessor: 'rating', render: (row) => <div style={{display:'flex', alignItems:'center', gap:'8px'}}><StarRating rating={Math.round(row.rating)} /> <span style={{fontSize:'0.8rem'}}>{row.rating}</span></div> },
    { header: 'Status', accessor: 'status', render: (row) => <Badge variant={row.status}>{row.status}</Badge> },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: '0 0 8px 0' }}>Destinasi Wisata</h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Eksplorasi destinasi wisata unggulan.</p>
        </div>
      </div>

      <div className="glass" style={{ padding: '24px', borderRadius: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <SearchBar 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Cari destinasi..."
          />
        </div>

        <DataTable 
          columns={columns} 
          data={data} 
          loading={loading} 
          onRowClick={(row) => navigate(`/destinasi/${row.id}`)}
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

export default DestinasiList;
