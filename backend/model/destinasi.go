package model

import (
	"time"
)

// Destinasi represents a travel destination
type Destinasi struct {
	ID            uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	NamaDestinasi string    `gorm:"type:varchar(150);not null" json:"nama_destinasi"`
	Provinsi      string    `gorm:"type:varchar(100);not null" json:"provinsi"`
	Negara        string    `gorm:"type:varchar(100);not null;default:'Indonesia'" json:"negara"`
	Deskripsi     string    `gorm:"type:text;not null" json:"deskripsi"`
	Rating        float64   `gorm:"type:decimal(3,2);default:0" json:"rating"`
	Latitude      float64   `gorm:"type:decimal(10,7)" json:"latitude"`
	Longitude     float64   `gorm:"type:decimal(10,7)" json:"longitude"`
	Gambar        string    `gorm:"type:text" json:"gambar"`
	Status        string    `gorm:"type:varchar(20);not null;default:'aktif'" json:"status"` // aktif, nonaktif
	CreatedAt     time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt     time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}

func (Destinasi) TableName() string {
	return "destinasi"
}

// DestinasiRequest is used for create/update validation
type DestinasiRequest struct {
	NamaDestinasi string  `json:"nama_destinasi" validate:"required,min=3,max=150"`
	Provinsi      string  `json:"provinsi" validate:"required,min=3,max=100"`
	Negara        string  `json:"negara" validate:"required,min=2,max=100"`
	Deskripsi     string  `json:"deskripsi" validate:"required,min=10"`
	Rating        float64 `json:"rating" validate:"min=0,max=5"`
	Latitude      float64 `json:"latitude"`
	Longitude     float64 `json:"longitude"`
	Gambar        string  `json:"gambar"`
	Status        string  `json:"status" validate:"required,oneof=aktif nonaktif"`
}
