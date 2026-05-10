import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { paketService } from '../../services';
import DataTable from '../../components/organisms/DataTable';
import Pagination from '../../components/molecules/Pagination';
import SearchBar from '../../components/molecules/SearchBar';
import Badge from '../../components/atoms/Badge';
import Button from '../../components/atoms/Button';

const PaketList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ page: 1, total: 0, pages: 0 });
  const [search, setSearch] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  const fetchPaket = async () => {
    setLoading(true);
    try {
      const res = await paketService.getAll({ page: meta.page, search: activeSearch });
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

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Apakah Anda yakin ingin menghapus paket ini?')) {
      try {
        await paketService.delete(id);
        fetchPaket();
      } catch (err) {
        alert(err.message || 'Gagal menghapus paket');
      }
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nama Paket', accessor: 'nama_paket', render: (row) => <strong style={{color: 'var(--accent)'}}>{row.nama_paket}</strong> },
    { header: 'Kategori', accessor: 'kategori' },
    { header: 'Harga (Rp)', accessor: 'harga', render: (row) => new Intl.NumberFormat('id-ID').format(row.harga) },
    { header: 'Durasi', accessor: 'durasi', render: (row) => `${row.durasi} Hari` },
    { header: 'Status', accessor: 'status', render: (row) => <Badge variant={row.status}>{row.status}</Badge> },
    { 
      header: 'Aksi', 
      accessor: 'id',
      render: (row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); navigate(`/admin/paket/edit/${row.id}`); }}>Edit</Button>
          <Button size="sm" variant="danger" onClick={(e) => handleDelete(row.id, e)}>Hapus</Button>
        </div>
      )
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: '0 0 8px 0' }}>Manajemen Paket Wisata</h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Kelola data paket wisata yang tersedia untuk pelanggan.</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/admin/paket/new')}>+ Tambah Paket</Button>
      </div>

      <div className="glass" style={{ padding: '24px', borderRadius: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <SearchBar 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Cari nama paket (Tekan Enter)..."
          />
        </div>

        <DataTable 
          columns={columns} 
          data={data} 
          loading={loading} 
          onRowClick={(row) => navigate(`/admin/paket/${row.id}`)}
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

export default PaketList;
