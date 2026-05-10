package repository

import (
	"gorm.io/gorm"
	"paket-wisata-backend/model"
)

type DestinasiRepository struct {
	DB *gorm.DB
}

func NewDestinasiRepository(db *gorm.DB) *DestinasiRepository {
	return &DestinasiRepository{DB: db}
}

func (r *DestinasiRepository) FindAll(status, provinsi, search string, limit, offset int) ([]model.Destinasi, int64, error) {
	var destinasi []model.Destinasi
	var total int64
	query := r.DB.Model(&model.Destinasi{})

	if status != "" {
		query = query.Where("status = ?", status)
	}
	if provinsi != "" {
		query = query.Where("provinsi ILIKE ?", "%"+provinsi+"%")
	}
	if search != "" {
		query = query.Where("nama_destinasi ILIKE ? OR provinsi ILIKE ?", "%"+search+"%", "%"+search+"%")
	}

	query.Count(&total)
	err := query.Order("created_at DESC").Limit(limit).Offset(offset).Find(&destinasi).Error
	return destinasi, total, err
}

func (r *DestinasiRepository) FindByID(id int) (model.Destinasi, error) {
	var destinasi model.Destinasi
	err := r.DB.First(&destinasi, id).Error
	return destinasi, err
}

func (r *DestinasiRepository) Create(destinasi *model.Destinasi) error {
	return r.DB.Create(destinasi).Error
}

func (r *DestinasiRepository) Update(destinasi *model.Destinasi) error {
	return r.DB.Save(destinasi).Error
}

func (r *DestinasiRepository) Delete(destinasi *model.Destinasi) error {
	return r.DB.Delete(destinasi).Error
}
