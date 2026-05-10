package model

import (
	"time"
)

// PaketWisata represents a tourism package
type PaketWisata struct {
	ID         uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	NamaPaket  string    `gorm:"type:varchar(150);not null" json:"nama_paket"`
	Kategori   string    `gorm:"type:varchar(100);not null" json:"kategori"`
	Deskripsi  string    `gorm:"type:text;not null" json:"deskripsi"`
	Harga      float64   `gorm:"type:decimal(15,2);not null" json:"harga"`
	Durasi     int       `gorm:"not null" json:"durasi"` // in days
	MaxPeserta int       `gorm:"not null" json:"max_peserta"`
	Status     string    `gorm:"type:varchar(20);not null;default:'aktif'" json:"status"` // aktif, nonaktif
	Thumbnail  string    `gorm:"type:text" json:"thumbnail"`
	CreatedAt  time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt  time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}

func (PaketWisata) TableName() string {
	return "paket_wisata"
}

// PaketRequest is used for create/update validation
type PaketRequest struct {
	NamaPaket  string  `json:"nama_paket" validate:"required,min=3,max=150"`
	Kategori   string  `json:"kategori" validate:"required,min=3,max=100"`
	Deskripsi  string  `json:"deskripsi" validate:"required,min=10"`
	Harga      float64 `json:"harga" validate:"required,min=0"`
	Durasi     int     `json:"durasi" validate:"required,min=1"`
	MaxPeserta int     `json:"max_peserta" validate:"required,min=1"`
	Status     string  `json:"status" validate:"required,oneof=aktif nonaktif"`
	Thumbnail  string  `json:"thumbnail"`
}
