package handler

import (
	"paket-wisata-backend/middleware"
	"paket-wisata-backend/model"
	"paket-wisata-backend/repository"

	"github.com/gofiber/fiber/v2"
)

type AuthHandler struct {
	Repo *repository.UserRepository
}

func NewAuthHandler(repo *repository.UserRepository) *AuthHandler {
	return &AuthHandler{Repo: repo}
}

// Register handles new customer registration
func (h *AuthHandler) Register(c *fiber.Ctx) error {
	req := new(model.RegisterRequest)
	if err := c.BodyParser(req); err != nil {
		return JSONResponse(c, fiber.StatusBadRequest, "Format request tidak valid", nil, err.Error())
	}

	if err := validate.Struct(req); err != nil {
		return JSONResponse(c, fiber.StatusBadRequest, "Validasi gagal", formatValidationErrors(err), err.Error())
	}

	// Check if email already exists
	if h.Repo.EmailExists(req.Email) {
		return JSONResponse(c, fiber.StatusConflict, "Email sudah terdaftar", nil, "Email already registered")
	}

	user := model.User{
		Nama:    req.Nama,
		Email:   req.Email,
		Role:    "customer",
		Telepon: req.Telepon,
		Alamat:  req.Alamat,
	}

	// Hash password
	if err := user.HashPassword(req.Password); err != nil {
		return JSONResponse(c, fiber.StatusInternalServerError, "Gagal memproses password", nil, err.Error())
	}

	if err := h.Repo.Create(&user); err != nil {
		return JSONResponse(c, fiber.StatusInternalServerError, "Gagal mendaftarkan pengguna", nil, err.Error())
	}

	// Generate JWT token
	token, err := middleware.GenerateToken(user.ID, user.Email, user.Role, user.Nama)
	if err != nil {
		return JSONResponse(c, fiber.StatusInternalServerError, "Gagal membuat token", nil, err.Error())
	}

	return JSONResponse(c, fiber.StatusCreated, "Registrasi berhasil", model.LoginResponse{
		Token: token,
		User:  user,
	}, "")
}

// Login handles user authentication
func (h *AuthHandler) Login(c *fiber.Ctx) error {
	req := new(model.LoginRequest)
	if err := c.BodyParser(req); err != nil {
		return JSONResponse(c, fiber.StatusBadRequest, "Format request tidak valid", nil, err.Error())
	}

	if err := validate.Struct(req); err != nil {
		return JSONResponse(c, fiber.StatusBadRequest, "Validasi gagal", formatValidationErrors(err), err.Error())
	}

	// Find user by email
	user, err := h.Repo.FindByEmail(req.Email)
	if err != nil {
		return JSONResponse(c, fiber.StatusUnauthorized, "Email atau password salah", nil, "Invalid credentials")
	}

	// Check password
	if !user.CheckPassword(req.Password) {
		return JSONResponse(c, fiber.StatusUnauthorized, "Email atau password salah", nil, "Invalid credentials")
	}

	// Generate JWT token
	token, err := middleware.GenerateToken(user.ID, user.Email, user.Role, user.Nama)
	if err != nil {
		return JSONResponse(c, fiber.StatusInternalServerError, "Gagal membuat token", nil, err.Error())
	}

	return JSONResponse(c, fiber.StatusOK, "Login berhasil", model.LoginResponse{
		Token: token,
		User:  *user,
	}, "")
}

// GetProfile returns the authenticated user's profile
func (h *AuthHandler) GetProfile(c *fiber.Ctx) error {
	userID, ok := c.Locals("userID").(uint)
	if !ok {
		return JSONResponse(c, fiber.StatusUnauthorized, "Tidak terautentikasi", nil, "Unauthorized")
	}

	user, err := h.Repo.FindByID(userID)
	if err != nil {
		return JSONResponse(c, fiber.StatusNotFound, "Pengguna tidak ditemukan", nil, err.Error())
	}

	return JSONResponse(c, fiber.StatusOK, "Profil pengguna", user, "")
}

// UpdateProfile updates the authenticated user's profile
func (h *AuthHandler) UpdateProfile(c *fiber.Ctx) error {
	userID, ok := c.Locals("userID").(uint)
	if !ok {
		return JSONResponse(c, fiber.StatusUnauthorized, "Tidak terautentikasi", nil, "Unauthorized")
	}

	req := new(model.UpdateProfileRequest)
	if err := c.BodyParser(req); err != nil {
		return JSONResponse(c, fiber.StatusBadRequest, "Format request tidak valid", nil, err.Error())
	}

	if err := validate.Struct(req); err != nil {
		errors := formatValidationErrors(err)
		return JSONResponse(c, fiber.StatusBadRequest, "Validasi gagal", errors, err.Error())
	}

	user, err := h.Repo.FindByID(userID)
	if err != nil {
		return JSONResponse(c, fiber.StatusNotFound, "Pengguna tidak ditemukan", nil, err.Error())
	}

	user.Nama = req.Nama
	user.Telepon = req.Telepon
	user.Alamat = req.Alamat

	if err := h.Repo.Update(user); err != nil {
		return JSONResponse(c, fiber.StatusInternalServerError, "Gagal memperbarui profil", nil, err.Error())
	}

	return JSONResponse(c, fiber.StatusOK, "Profil berhasil diperbarui", user, "")
}
