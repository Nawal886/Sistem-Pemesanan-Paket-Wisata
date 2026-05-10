import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { paketService, destibasiService } from '../../services';
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [destinasiList, setDestinasiList] = useState([]);

  useEffect(() => {
    const fetchInitData = async () => {
      try {
        const destRes = await destibasiService.getAll({ limit: 100 });
        if (destRes.data.success) {
          setDestinasiList(destRes.data.data || []);
        }

        if (isEdit) {
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
        } else {
          // If not edit and destinasi is available, set first as default if needed
          // But it's better to let them select or set empty string
        }
      } catch (err) {
        setError(err.message || 'Gagal memuat data');
      } finally {
        setLoading(false);
      }
    };
    fetchInitData();
  }, [id, isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleHargaChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    setFormData({ ...formData, harga: rawValue });
  };

  const formatRupiah = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('id-ID').format(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    try {
      const payload = {
        ...formData,
        harga: parseFloat(formData.harga) || 0,
        durasi: parseInt(formData.durasi) || 0,
        max_peserta: parseInt(formData.max_peserta) || 0
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Destinasi (Nama Paket)</label>
            <select 
              name="nama_paket"
              value={formData.nama_paket} 
              onChange={handleChange}
              style={{ padding: '12px', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              required 
            >
              <option value="" disabled>-- Pilih Destinasi --</option>
              {destinasiList.map(d => (
                <option key={d.id} value={d.nama_destinasi}>{d.nama_destinasi} ({d.provinsi})</option>
              ))}
              {isEdit && !destinasiList.find(d => d.nama_destinasi === formData.nama_paket) && (
                 <option value={formData.nama_paket}>{formData.nama_paket} (Lainnya)</option>
              )}
            </select>
          </div>

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
              type="text"
              name="harga"
              value={formatRupiah(formData.harga)} 
              onChange={handleHargaChange} 
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
