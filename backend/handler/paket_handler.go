package handler

import (

	"paket-wisata-backend/config"
	"paket-wisata-backend/model"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

// GetAllPaket godoc - GET /api/paket
func GetAllPaket(c *fiber.Ctx) error {
	var pakets []model.PaketWisata

	query := config.DB

	// Filter by status if provided
	if status := c.Query("status"); status != "" {
		query = query.Where("status = ?", status)
	}

	// Filter by kategori if provided
	if kategori := c.Query("kategori"); kategori != "" {
		query = query.Where("kategori ILIKE ?", "%"+kategori+"%")
	}

	// Search by name
	if search := c.Query("search"); search != "" {
		query = query.Where("nama_paket ILIKE ?", "%"+search+"%")
	}

	// Pagination
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}
	offset := (page - 1) * limit

	var total int64
	query.Model(&model.PaketWisata{}).Count(&total)

	if err := query.Order("created_at DESC").Limit(limit).Offset(offset).Find(&pakets).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Gagal mengambil data paket wisata",
			"error":   err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Data paket wisata berhasil diambil",
		"data":    pakets,
		"meta": fiber.Map{
			"total": total,
			"page":  page,
			"limit": limit,
			"pages": (total + int64(limit) - 1) / int64(limit),
		},
	})
}

// GetPaketByID godoc - GET /api/paket/:id
func GetPaketByID(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil || id <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "ID tidak valid, harus berupa angka positif",
		})
	}

	var paket model.PaketWisata
	if err := config.DB.First(&paket, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"success": false,
			"message": "Paket wisata tidak ditemukan",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Data paket wisata ditemukan",
		"data":    paket,
	})
}

// CreatePaket godoc - POST /api/paket
func CreatePaket(c *fiber.Ctx) error {
	req := new(model.PaketRequest)
	if err := c.BodyParser(req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Format request tidak valid",
			"error":   err.Error(),
		})
	}

	if err := validate.Struct(req); err != nil {
		errors := formatValidationErrors(err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Validasi gagal",
			"errors":  errors,
		})
	}

	paket := model.PaketWisata{
		NamaPaket:  req.NamaPaket,
		Kategori:   req.Kategori,
		Deskripsi:  req.Deskripsi,
		Harga:      req.Harga,
		Durasi:     req.Durasi,
		MaxPeserta: req.MaxPeserta,
		Status:          req.Status,
		Thumbnail:       req.Thumbnail,
		JadwalBerangkat: req.JadwalBerangkat,
		LokasiBerangkat: req.LokasiBerangkat,
	}

	if err := config.DB.Create(&paket).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Gagal menyimpan paket wisata",
			"error":   err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": true,
		"message": "Paket wisata berhasil ditambahkan",
		"data":    paket,
	})
}

// UpdatePaket godoc - PUT /api/paket/:id
func UpdatePaket(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil || id <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "ID tidak valid",
		})
	}

	var paket model.PaketWisata
	if err := config.DB.First(&paket, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"success": false,
			"message": "Paket wisata tidak ditemukan",
		})
	}

	req := new(model.PaketRequest)
	if err := c.BodyParser(req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Format request tidak valid",
			"error":   err.Error(),
		})
	}

	if err := validate.Struct(req); err != nil {
		errors := formatValidationErrors(err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Validasi gagal",
			"errors":  errors,
		})
	}

	paket.NamaPaket = req.NamaPaket
	paket.Kategori = req.Kategori
	paket.Deskripsi = req.Deskripsi
	paket.Harga = req.Harga
	paket.Durasi = req.Durasi
	paket.MaxPeserta = req.MaxPeserta
	paket.Status = req.Status
	paket.Thumbnail = req.Thumbnail
	paket.JadwalBerangkat = req.JadwalBerangkat
	paket.LokasiBerangkat = req.LokasiBerangkat

	if err := config.DB.Save(&paket).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Gagal memperbarui paket wisata",
			"error":   err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Paket wisata berhasil diperbarui",
		"data":    paket,
	})
}

// DeletePaket godoc - DELETE /api/paket/:id
func DeletePaket(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil || id <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "ID tidak valid",
		})
	}

	var paket model.PaketWisata
	if err := config.DB.First(&paket, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"success": false,
			"message": "Paket wisata tidak ditemukan",
		})
	}

	if err := config.DB.Delete(&paket).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Gagal menghapus paket wisata",
			"error":   err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Paket wisata berhasil dihapus",
	})
}


