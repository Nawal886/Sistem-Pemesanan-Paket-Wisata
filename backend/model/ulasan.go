package model

import (
	"time"
)

// Ulasan represents a customer review
type Ulasan struct {
	ID            uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	PaketID       uint      `gorm:"not null" json:"paket_id"`
	NamaPaket     string    `gorm:"type:varchar(150)" json:"nama_paket"`
	NamaPengulas  string    `gorm:"type:varchar(150);not null" json:"nama_pengulas"`
	Email         string    `gorm:"type:varchar(150);not null" json:"email"`
	Rating        int       `gorm:"not null" json:"rating"` // 1-5
	Judul         string    `gorm:"type:varchar(200);not null" json:"judul"`
	Komentar      string    `gorm:"type:text;not null" json:"komentar"`
	TanggalWisata time.Time `gorm:"not null" json:"tanggal_wisata"`
	Status        string    `gorm:"type:varchar(20);not null;default:'pending'" json:"status"` // pending, approved, rejected
	CreatedAt     time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt     time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}

func (Ulasan) TableName() string {
	return "ulasan"
}

// UlasanRequest is used for create/update validation
type UlasanRequest struct {
	PaketID       uint   `json:"paket_id" validate:"required,min=1"`
	NamaPengulas  string `json:"nama_pengulas" validate:"required,min=3,max=150"`
	Email         string `json:"email" validate:"required,email"`
	Rating        int    `json:"rating" validate:"required,min=1,max=5"`
	Judul         string `json:"judul" validate:"required,min=5,max=200"`
	Komentar      string `json:"komentar" validate:"required,min=10"`
	TanggalWisata string `json:"tanggal_wisata" validate:"required"`
	Status        string `json:"status" validate:"omitempty,oneof=pending approved rejected"`
}
