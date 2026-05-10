import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { destibasiService } from '../../services';
import Button from '../../components/atoms/Button';
import Input from '../../components/atoms/Input';
import Spinner from '../../components/atoms/Spinner';

const DestinasiForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    nama_destinasi: '',
    provinsi: '',
    negara: 'Indonesia',
    deskripsi: '',
    rating: 0,
    latitude: 0,
    longitude: 0,
    gambar: '',
    status: 'aktif'
  });

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      const fetchData = async () => {
        try {
          const res = await destibasiService.getById(id);
          if (res.data.success) {
            const d = res.data.data;
            setFormData({
              nama_destinasi: d.nama_destinasi || '',
              provinsi: d.provinsi || '',
              negara: d.negara || 'Indonesia',
              deskripsi: d.deskripsi || '',
              rating: d.rating || 0,
              latitude: d.latitude || 0,
              longitude: d.longitude || 0,
              gambar: d.gambar || '',
              status: d.status || 'aktif'
            });
          }
        } catch (err) {
          setError(err.message || 'Gagal memuat data destinasi');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
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
        rating: parseFloat(formData.rating) || 0,
        latitude: parseFloat(formData.latitude) || 0,
        longitude: parseFloat(formData.longitude) || 0,
      };

      if (isEdit) {
        await destibasiService.update(id, payload);
      } else {
        await destibasiService.create(payload);
      }
      navigate('/admin/destinasi');
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
        <Button variant="ghost" onClick={() => navigate('/admin/destinasi')}>← Kembali</Button>
        <h1 style={{ margin: 0 }}>{isEdit ? 'Edit Destinasi' : 'Tambah Destinasi Baru'}</h1>
      </div>

      {error && (
        <div style={{
          background: 'rgba(255, 77, 106, 0.15)',
          border: '1px solid rgba(255, 77, 106, 0.3)',
          color: 'var(--danger)',
          padding: '14px 20px', borderRadius: '12px', marginBottom: '24px'
        }}>
          {error}
        </div>
      )}

      <div className="glass" style={{ padding: '32px', borderRadius: '20px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Input
            label="Nama Destinasi"
            name="nama_destinasi"
            value={formData.nama_destinasi}
            onChange={handleChange}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <Input
              label="Provinsi"
              name="provinsi"
              value={formData.provinsi}
              onChange={handleChange}
              required
            />
            <Input
              label="Negara"
              name="negara"
              value={formData.negara}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
              Deskripsi
            </label>
            <textarea
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              rows={4}
              required
              placeholder="Deskripsikan destinasi ini..."
              style={{
                padding: '12px 14px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary)';
                e.target.style.boxShadow = '0 0 0 3px rgba(108, 99, 255, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <Input
              label="Rating (0-5)"
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
            />
            <Input
              label="Latitude"
              type="number"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
            />
            <Input
              label="Longitude"
              type="number"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
            />
          </div>

          <Input
            label="URL Gambar (opsional)"
            name="gambar"
            value={formData.gambar}
            onChange={handleChange}
            placeholder="https://..."
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={{
                padding: '10px 14px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
          </div>

          <div style={{
            display: 'flex', justifyContent: 'flex-end', gap: '12px',
            paddingTop: '16px', borderTop: '1px solid var(--border)'
          }}>
            <Button variant="ghost" onClick={() => navigate('/admin/destinasi')} type="button">Batal</Button>
            <Button variant="primary" type="submit" loading={saving}>
              {saving ? 'Menyimpan...' : isEdit ? '💾 Simpan Perubahan' : '➕ Tambah Destinasi'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DestinasiForm;
