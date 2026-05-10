import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services';
import Button from '../../components/atoms/Button';
import Input from '../../components/atoms/Input';
import Badge from '../../components/atoms/Badge';
import Spinner from '../../components/atoms/Spinner';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({
    nama: '',
    telepon: '',
    alamat: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authService.getProfile();
        if (res.data.success) {
          setProfileData(res.data.data);
          setFormData({
            nama: res.data.data.nama || '',
            telepon: res.data.data.telepon || '',
            alamat: res.data.data.alamat || ''
          });
        }
      } catch (err) {
        setError(err.message || 'Gagal memuat profil');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await authService.updateProfile(formData);
      if (res.data.success) {
        setProfileData(res.data.data);
        updateUser(res.data.data);
        setSuccess('Profil berhasil diperbarui!');
        setIsEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Gagal memperbarui profil');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      nama: profileData.nama || '',
      telepon: profileData.telepon || '',
      alamat: profileData.alamat || ''
    });
    setIsEditing(false);
    setError('');
  };

  if (loading) return <div style={{ padding: '60px' }}><Spinner /></div>;

  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }} className="animate-fade-in-up">
        <div style={{
          width: '100px', height: '100px',
          borderRadius: '50%',
          background: 'var(--gradient-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
          fontSize: '2.8rem',
          boxShadow: '0 8px 30px rgba(108, 99, 255, 0.4)',
        }}>
          {profileData?.nama?.charAt(0)?.toUpperCase() || '👤'}
        </div>
        <h1 className="gradient-text" style={{ fontSize: '2.5rem', margin: '0 0 8px' }}>
          {profileData?.nama}
        </h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '12px' }}>
          <Badge variant={profileData?.role === 'admin' ? 'primary' : 'info'}>
            {profileData?.role === 'admin' ? '🛡️ Admin' : '👤 Customer'}
          </Badge>
        </div>
      </div>

      {/* Alerts */}
      {success && (
        <div style={{
          background: 'rgba(0, 217, 165, 0.1)',
          border: '1px solid rgba(0, 217, 165, 0.3)',
          color: 'var(--success)',
          padding: '14px 20px', borderRadius: '12px', marginBottom: '24px',
          display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem'
        }}>
          ✅ {success}
        </div>
      )}
      {error && (
        <div style={{
          background: 'rgba(255, 77, 106, 0.1)',
          border: '1px solid rgba(255, 77, 106, 0.3)',
          color: 'var(--danger)',
          padding: '14px 20px', borderRadius: '12px', marginBottom: '24px',
          fontSize: '0.95rem'
        }}>
          {error}
        </div>
      )}

      {/* Profile Card */}
      <div className="glass animate-fade-in-up" style={{
        padding: '32px', borderRadius: '24px',
        animationDelay: '0.1s',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '28px', paddingBottom: '20px',
          borderBottom: '1px solid var(--border)'
        }}>
          <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Informasi Profil</h2>
          {!isEditing && (
            <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
              ✏️ Edit Profil
            </Button>
          )}
        </div>

        {isEditing ? (
          /* Edit Mode */
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Input
              label="Nama Lengkap"
              value={formData.nama}
              onChange={handleChange('nama')}
              icon="👤"
              placeholder="Masukkan nama lengkap"
            />

            <div style={{
              display: 'flex', flexDirection: 'column', gap: '6px'
            }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
                Email
              </label>
              <div style={{
                padding: '10px 14px',
                background: 'rgba(108, 99, 255, 0.05)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                color: 'var(--text-muted)',
                fontSize: '0.9rem',
                cursor: 'not-allowed',
              }}>
                🔒 {profileData?.email}
                <span style={{ fontSize: '0.75rem', marginLeft: '8px', opacity: 0.7 }}>
                  (tidak dapat diubah)
                </span>
              </div>
            </div>

            <Input
              label="No. Telepon"
              value={formData.telepon}
              onChange={handleChange('telepon')}
              icon="📱"
              placeholder="0812xxxxxxxx"
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
                Alamat
              </label>
              <textarea
                value={formData.alamat}
                onChange={handleChange('alamat')}
                rows={3}
                placeholder="Masukkan alamat lengkap"
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

            <div style={{
              display: 'flex', justifyContent: 'flex-end', gap: '12px',
              paddingTop: '16px', borderTop: '1px solid var(--border)'
            }}>
              <Button variant="ghost" onClick={handleCancel} type="button">
                Batal
              </Button>
              <Button variant="primary" type="submit" loading={saving}>
                {saving ? 'Menyimpan...' : '💾 Simpan Perubahan'}
              </Button>
            </div>
          </form>
        ) : (
          /* View Mode */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <InfoRow icon="👤" label="Nama Lengkap" value={profileData?.nama} />
            <InfoRow icon="✉️" label="Email" value={profileData?.email} />
            <InfoRow icon="📱" label="No. Telepon" value={profileData?.telepon || '—'} />
            <InfoRow icon="🏠" label="Alamat" value={profileData?.alamat || '—'} />
            <InfoRow icon="📅" label="Bergabung Sejak" value={
              profileData?.created_at
                ? new Date(profileData.created_at).toLocaleDateString('id-ID', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                  })
                : '—'
            } />
          </div>
        )}
      </div>
    </div>
  );
};

/* Helper component for displaying profile info rows */
const InfoRow = ({ icon, label, value }) => (
  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
    <div style={{
      width: '44px', height: '44px', minWidth: '44px',
      borderRadius: '12px',
      background: 'rgba(108, 99, 255, 0.1)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '1.2rem',
    }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: '600', letterSpacing: '0.03em' }}>
        {label}
      </div>
      <div style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: '500' }}>
        {value}
      </div>
    </div>
  </div>
);

export default ProfilePage;
