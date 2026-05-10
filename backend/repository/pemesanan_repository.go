package repository

import (
	"gorm.io/gorm"
	"paket-wisata-backend/model"
)

type PemesananRepository struct {
	DB *gorm.DB
}

func NewPemesananRepository(db *gorm.DB) *PemesananRepository {
	return &PemesananRepository{DB: db}
}

func (r *PemesananRepository) FindAll(status, search string, limit, offset int) ([]model.Pemesanan, int64, error) {
	var pemesanan []model.Pemesanan
	var total int64
	query := r.DB.Model(&model.Pemesanan{})

	if status != "" {
		query = query.Where("status_pemesanan = ?", status)
	}
	if search != "" {
		query = query.Where("nama_pemesan ILIKE ? OR kode_pemesanan ILIKE ? OR email ILIKE ?", "%"+search+"%", "%"+search+"%", "%"+search+"%")
	}

	query.Count(&total)
	err := query.Order("created_at DESC").Limit(limit).Offset(offset).Find(&pemesanan).Error
	return pemesanan, total, err
}

func (r *PemesananRepository) FindByID(id int) (model.Pemesanan, error) {
	var pemesanan model.Pemesanan
	err := r.DB.First(&pemesanan, id).Error
	return pemesanan, err
}

func (r *PemesananRepository) Create(pemesanan *model.Pemesanan) error {
	return r.DB.Create(pemesanan).Error
}

func (r *PemesananRepository) Update(pemesanan *model.Pemesanan) error {
	return r.DB.Save(pemesanan).Error
}

func (r *PemesananRepository) Delete(pemesanan *model.Pemesanan) error {
	return r.DB.Delete(pemesanan).Error
}

func (r *PemesananRepository) GetPaketByID(id uint) (model.PaketWisata, error) {
	var paket model.PaketWisata
	err := r.DB.First(&paket, id).Error
	return paket, err
}
