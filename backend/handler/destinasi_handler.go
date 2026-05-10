package handler

import (
	"github.com/gofiber/fiber/v2"
	"paket-wisata-backend/model"
	"paket-wisata-backend/repository"
	"strconv"
)

type DestinasiHandler struct {
	Repo *repository.DestinasiRepository
}

func NewDestinasiHandler(repo *repository.DestinasiRepository) *DestinasiHandler {
	return &DestinasiHandler{Repo: repo}
}

func (h *DestinasiHandler) GetAllDestinasi(c *fiber.Ctx) error {
	status := c.Query("status")
	provinsi := c.Query("provinsi")
	search := c.Query("search")

	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}
	offset := (page - 1) * limit

	destinasi, total, err := h.Repo.FindAll(status, provinsi, search, limit, offset)
	if err != nil {
		return JSONResponse(c, fiber.StatusInternalServerError, "Gagal mengambil data destinasi", nil, err.Error())
	}

	meta := fiber.Map{
		"total": total,
		"page":  page,
		"limit": limit,
		"pages": (total + int64(limit) - 1) / int64(limit),
	}
	return JSONResponseWithMeta(c, fiber.StatusOK, "Data destinasi berhasil diambil", destinasi, meta, "")
}

func (h *DestinasiHandler) GetDestinasiByID(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil || id <= 0 {
		return JSONResponse(c, fiber.StatusBadRequest, "ID tidak valid", nil, "Invalid ID")
	}

	destinasi, err := h.Repo.FindByID(id)
	if err != nil {
		return JSONResponse(c, fiber.StatusNotFound, "Destinasi tidak ditemukan", nil, err.Error())
	}
	return JSONResponse(c, fiber.StatusOK, "Data destinasi ditemukan", destinasi, "")
}

func (h *DestinasiHandler) CreateDestinasi(c *fiber.Ctx) error {
	req := new(model.DestinasiRequest)
	if err := c.BodyParser(req); err != nil {
		return JSONResponse(c, fiber.StatusBadRequest, "Format request tidak valid", nil, err.Error())
	}
	if err := validate.Struct(req); err != nil {
		return JSONResponse(c, fiber.StatusBadRequest, "Validasi gagal", formatValidationErrors(err), err.Error())
	}

	destinasi := model.Destinasi{
		NamaDestinasi: req.NamaDestinasi,
		Provinsi:      req.Provinsi,
		Negara:        req.Negara,
		Deskripsi:     req.Deskripsi,
		Rating:        req.Rating,
		Latitude:      req.Latitude,
		Longitude:     req.Longitude,
		Gambar:        req.Gambar,
		Status:        req.Status,
	}

	if err := h.Repo.Create(&destinasi); err != nil {
		return JSONResponse(c, fiber.StatusInternalServerError, "Gagal menyimpan destinasi", nil, err.Error())
	}
	return JSONResponse(c, fiber.StatusCreated, "Destinasi berhasil ditambahkan", destinasi, "")
}

func (h *DestinasiHandler) UpdateDestinasi(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil || id <= 0 {
		return JSONResponse(c, fiber.StatusBadRequest, "ID tidak valid", nil, "Invalid ID")
	}

	destinasi, err := h.Repo.FindByID(id)
	if err != nil {
		return JSONResponse(c, fiber.StatusNotFound, "Destinasi tidak ditemukan", nil, err.Error())
	}

	req := new(model.DestinasiRequest)
	if err := c.BodyParser(req); err != nil {
		return JSONResponse(c, fiber.StatusBadRequest, "Format request tidak valid", nil, err.Error())
	}
	if err := validate.Struct(req); err != nil {
		return JSONResponse(c, fiber.StatusBadRequest, "Validasi gagal", formatValidationErrors(err), err.Error())
	}

	destinasi.NamaDestinasi = req.NamaDestinasi
	destinasi.Provinsi = req.Provinsi
	destinasi.Negara = req.Negara
	destinasi.Deskripsi = req.Deskripsi
	destinasi.Rating = req.Rating
	destinasi.Latitude = req.Latitude
	destinasi.Longitude = req.Longitude
	destinasi.Gambar = req.Gambar
	destinasi.Status = req.Status

	if err := h.Repo.Update(&destinasi); err != nil {
		return JSONResponse(c, fiber.StatusInternalServerError, "Gagal memperbarui destinasi", nil, err.Error())
	}
	return JSONResponse(c, fiber.StatusOK, "Destinasi berhasil diperbarui", destinasi, "")
}

func (h *DestinasiHandler) DeleteDestinasi(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil || id <= 0 {
		return JSONResponse(c, fiber.StatusBadRequest, "ID tidak valid", nil, "Invalid ID")
	}

	destinasi, err := h.Repo.FindByID(id)
	if err != nil {
		return JSONResponse(c, fiber.StatusNotFound, "Destinasi tidak ditemukan", nil, err.Error())
	}

	if err := h.Repo.Delete(&destinasi); err != nil {
		return JSONResponse(c, fiber.StatusInternalServerError, "Gagal menghapus destinasi", nil, err.Error())
	}
	return JSONResponse(c, fiber.StatusOK, "Destinasi berhasil dihapus", nil, "")
}
