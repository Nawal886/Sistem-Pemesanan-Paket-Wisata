package model

import (
	"time"
)

// Pemesanan represents a booking order
type Pemesanan struct {
	ID               uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	KodePemesanan    string    `gorm:"type:varchar(20);uniqueIndex;not null" json:"kode_pemesanan"`
	NamaPemesan      string    `gorm:"type:varchar(150);not null" json:"nama_pemesan"`
	Email            string    `gorm:"type:varchar(150);not null" json:"email"`
	Telepon          string    `gorm:"type:varchar(20);not null" json:"telepon"`
	PaketID          uint      `gorm:"not null" json:"paket_id"`
	NamaPaket        string    `gorm:"type:varchar(150)" json:"nama_paket"`
	TanggalBerangkat time.Time `gorm:"not null" json:"tanggal_berangkat"`
	JumlahPeserta    int       `gorm:"not null" json:"jumlah_peserta"`
	TotalHarga       float64   `gorm:"type:decimal(15,2);not null" json:"total_harga"`
	StatusPemesanan  string    `gorm:"type:varchar(30);not null;default:'pending'" json:"status_pemesanan"` // pending, confirmed, cancelled, completed
	CatatanKhusus    string    `gorm:"type:text" json:"catatan_khusus"`
	CreatedAt        time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt        time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}

func (Pemesanan) TableName() string {
	return "pemesanan"
}

// PemesananRequest is used for create/update validation
type PemesananRequest struct {
	NamaPemesan      string `json:"nama_pemesan" validate:"required,min=3,max=150"`
	Email            string `json:"email" validate:"required,email"`
	Telepon          string `json:"telepon" validate:"required,min=10,max=20"`
	PaketID          uint   `json:"paket_id" validate:"required,min=1"`
	TanggalBerangkat string `json:"tanggal_berangkat" validate:"required"`
	JumlahPeserta    int    `json:"jumlah_peserta" validate:"required,min=1"`
	CatatanKhusus    string `json:"catatan_khusus"`
	StatusPemesanan  string `json:"status_pemesanan" validate:"omitempty,oneof=pending confirmed cancelled completed"`
}
