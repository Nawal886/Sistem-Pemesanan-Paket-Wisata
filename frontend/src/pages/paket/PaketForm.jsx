import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { paketService } from '../../services';
import Button from '../../components/atoms/Button';
import Input from '../../components/atoms/Input';
import Spinner from '../../components/atoms/Spinner';

const PaketForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    nama_paket: '',
    deskripsi: '',
    harga: '',
    durasi: '',
    max_peserta: '',
    kategori: '',
    status: 'aktif'
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      const fetchDetail = async () => {
        try {
          const res = await paketService.getById(id);
          if (res.data.success) {
            const data = res.data.data;
            setFormData({
              nama_paket: data.nama_paket || '',
              deskripsi: data.deskripsi || '',
              harga: data.harga || '',
              durasi: data.durasi || '',
              max_peserta: data.max_peserta || '',
              kategori: data.kategori || '',
              status: data.status || 'aktif'
            });
          }
        } catch (err) {
          setError(err.message || 'Gagal memuat data');
        } finally {
          setLoading(false);
        }
      };
      fetchDetail();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    try {
      const payload = {
        ...formData,
        harga: parseFloat(formData.harga),
        durasi: parseInt(formData.durasi),
        max_peserta: parseInt(formData.max_peserta)
      };

      if (isEdit) {
        await paketService.update(id, payload);
      } else {
        await paketService.create(payload);
      }
      navigate('/admin/paket');
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="animate-fade-in-up" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', gap: '16px' }}>
        <Button variant="ghost" onClick={() => navigate('/admin/paket')}>← Kembali</Button>
        <h1 style={{ margin: 0 }}>{isEdit ? 'Edit Paket Wisata' : 'Tambah Paket Wisata'}</h1>
      </div>

      <div className="glass" style={{ padding: '32px', borderRadius: '16px' }}>
        {error && (
          <div style={{ padding: '16px', background: 'rgba(255, 77, 106, 0.1)', color: 'var(--danger)', borderRadius: '8px', marginBottom: '24px' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Input 
            label="Nama Paket" 
            name="nama_paket"
            value={formData.nama_paket} 
            onChange={handleChange} 
            required 
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Deskripsi</label>
            <textarea 
              name="deskripsi"
              value={formData.deskripsi} 
              onChange={handleChange} 
              rows={4}
              style={{ padding: '12px', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              required 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <Input 
              label="Harga (Rp)" 
              type="number"
              name="harga"
              value={formData.harga} 
              onChange={handleChange} 
              required 
            />
            <Input 
              label="Durasi (Hari)" 
              type="number"
              name="durasi"
              value={formData.durasi} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <Input 
              label="Maksimal Peserta" 
              type="number"
              name="max_peserta"
              value={formData.max_peserta} 
              onChange={handleChange} 
              required 
            />
            <Input 
              label="Kategori (Misal: Pantai, Gunung)" 
              name="kategori"
              value={formData.kategori} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Status</label>
            <select 
              name="status" 
              value={formData.status} 
              onChange={handleChange}
              style={{ padding: '12px', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            >
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <Button type="submit" variant="primary" loading={saving}>
              {saving ? 'Menyimpan...' : 'Simpan Paket'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaketForm;
