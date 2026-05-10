package repository

import (
	"gorm.io/gorm"
	"paket-wisata-backend/model"
)

type UlasanRepository struct {
	DB *gorm.DB
}

func NewUlasanRepository(db *gorm.DB) *UlasanRepository {
	return &UlasanRepository{DB: db}
}

func (r *UlasanRepository) FindAll(paketId int, limit, offset int) ([]model.Ulasan, int64, error) {
	var ulasan []model.Ulasan
	var total int64
	query := r.DB.Model(&model.Ulasan{})

	if paketId > 0 {
		query = query.Where("paket_id = ?", paketId)
	}

	query.Count(&total)
	err := query.Order("created_at DESC").Limit(limit).Offset(offset).Find(&ulasan).Error
	return ulasan, total, err
}

func (r *UlasanRepository) FindByID(id int) (model.Ulasan, error) {
	var ulasan model.Ulasan
	err := r.DB.First(&ulasan, id).Error
	return ulasan, err
}

func (r *UlasanRepository) Create(ulasan *model.Ulasan) error {
	return r.DB.Create(ulasan).Error
}

func (r *UlasanRepository) Update(ulasan *model.Ulasan) error {
	return r.DB.Save(ulasan).Error
}

func (r *UlasanRepository) Delete(ulasan *model.Ulasan) error {
	return r.DB.Delete(ulasan).Error
}
