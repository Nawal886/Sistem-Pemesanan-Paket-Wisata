package model

import (
	"time"

	"golang.org/x/crypto/bcrypt"
)

// User represents a system user (admin or customer)
type User struct {
	ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	Nama      string    `gorm:"type:varchar(150);not null" json:"nama"`
	Email     string    `gorm:"type:varchar(150);uniqueIndex;not null" json:"email"`
	Password  string    `gorm:"type:varchar(255);not null" json:"-"` // hidden from JSON
	Role      string    `gorm:"type:varchar(20);not null;default:'customer'" json:"role"` // admin, customer
	Telepon   string    `gorm:"type:varchar(20)" json:"telepon"`
	Alamat    string    `gorm:"type:text" json:"alamat"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}

func (User) TableName() string {
	return "users"
}

// HashPassword hashes a plain text password using bcrypt
func (u *User) HashPassword(password string) error {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.Password = string(hash)
	return nil
}

// CheckPassword compares a plain text password against the stored hash
func (u *User) CheckPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
	return err == nil
}

// RegisterRequest is used for user registration validation
type RegisterRequest struct {
	Nama     string `json:"nama" validate:"required,min=3,max=150"`
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=6,max=100"`
	Telepon  string `json:"telepon" validate:"omitempty,min=10,max=20"`
	Alamat   string `json:"alamat"`
}

// LoginRequest is used for user login validation
type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

// LoginResponse is returned after successful login
type LoginResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}
