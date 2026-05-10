package handler

import (
	"paket-wisata-backend/model"
	"paket-wisata-backend/repository"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
)

type UlasanHandler struct {
	Repo *repository.UlasanRepository
}

func NewUlasanHandler(repo *repository.UlasanRepository) *UlasanHandler {
	return &UlasanHandler{Repo: repo}
}

func (h *UlasanHandler) GetAllUlasan(c *fiber.Ctx) error {
	paketId, _ := strconv.Atoi(c.Query("paket_id", "0"))

	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}
	offset := (page - 1) * limit

	ulasan, total, err := h.Repo.FindAll(paketId, limit, offset)
	if err != nil {
		return JSONResponse(c, fiber.StatusInternalServerError, "Gagal mengambil data ulasan", nil, err.Error())
	}

	meta := fiber.Map{
		"total": total,
		"page":  page,
		"limit": limit,
		"pages": (total + int64(limit) - 1) / int64(limit),
	}
	return JSONResponseWithMeta(c, fiber.StatusOK, "Data ulasan berhasil diambil", ulasan, meta, "")
}

func (h *UlasanHandler) GetUlasanByID(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil || id <= 0 {
		return JSONResponse(c, fiber.StatusBadRequest, "ID tidak valid", nil, "Invalid ID")
	}

	ulasan, err := h.Repo.FindByID(id)
	if err != nil {
		return JSONResponse(c, fiber.StatusNotFound, "Ulasan tidak ditemukan", nil, err.Error())
	}
	return JSONResponse(c, fiber.StatusOK, "Data ulasan ditemukan", ulasan, "")
}

func (h *UlasanHandler) CreateUlasan(c *fiber.Ctx) error {
	req := new(model.UlasanRequest)
	if err := c.BodyParser(req); err != nil {
		return JSONResponse(c, fiber.StatusBadRequest, "Format request tidak valid", nil, err.Error())
	}

	if err := validate.Struct(req); err != nil {
		return JSONResponse(c, fiber.StatusBadRequest, "Validasi gagal", formatValidationErrors(err), err.Error())
	}

	tanggalWisata, _ := time.Parse("2006-01-02", req.TanggalWisata)

	ulasan := model.Ulasan{
		PaketID:       req.PaketID,
		NamaPengulas:  req.NamaPengulas,
		Email:         req.Email,
		Rating:        req.Rating,
		Judul:         req.Judul,
		Komentar:      req.Komentar,
		TanggalWisata: tanggalWisata,
		Status:        req.Status,
	}
	if ulasan.Status == "" {
		ulasan.Status = "pending"
	}

	if err := h.Repo.Create(&ulasan); err != nil {
		return JSONResponse(c, fiber.StatusInternalServerError, "Gagal menyimpan ulasan", nil, err.Error())
	}
	return JSONResponse(c, fiber.StatusCreated, "Ulasan berhasil ditambahkan", ulasan, "")
}

func (h *UlasanHandler) UpdateUlasan(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil || id <= 0 {
		return JSONResponse(c, fiber.StatusBadRequest, "ID tidak valid", nil, "Invalid ID")
	}

	ulasan, err := h.Repo.FindByID(id)
	if err != nil {
		return JSONResponse(c, fiber.StatusNotFound, "Ulasan tidak ditemukan", nil, err.Error())
	}

	req := new(model.UlasanRequest)
	if err := c.BodyParser(req); err != nil {
		return JSONResponse(c, fiber.StatusBadRequest, "Format request tidak valid", nil, err.Error())
	}

	if err := validate.Struct(req); err != nil {
		return JSONResponse(c, fiber.StatusBadRequest, "Validasi gagal", formatValidationErrors(err), err.Error())
	}

	ulasan.Rating = req.Rating
	ulasan.Komentar = req.Komentar
	ulasan.NamaPengulas = req.NamaPengulas
	ulasan.Email = req.Email
	ulasan.Judul = req.Judul
	ulasan.Status = req.Status
	
	if t, err := time.Parse("2006-01-02", req.TanggalWisata); err == nil {
		ulasan.TanggalWisata = t
	}

	if err := h.Repo.Update(&ulasan); err != nil {
		return JSONResponse(c, fiber.StatusInternalServerError, "Gagal memperbarui ulasan", nil, err.Error())
	}
	return JSONResponse(c, fiber.StatusOK, "Ulasan berhasil diperbarui", ulasan, "")
}

func (h *UlasanHandler) DeleteUlasan(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil || id <= 0 {
		return JSONResponse(c, fiber.StatusBadRequest, "ID tidak valid", nil, "Invalid ID")
	}

	ulasan, err := h.Repo.FindByID(id)
	if err != nil {
		return JSONResponse(c, fiber.StatusNotFound, "Ulasan tidak ditemukan", nil, err.Error())
	}

	if err := h.Repo.Delete(&ulasan); err != nil {
		return JSONResponse(c, fiber.StatusInternalServerError, "Gagal menghapus ulasan", nil, err.Error())
	}
	return JSONResponse(c, fiber.StatusOK, "Ulasan berhasil dihapus", nil, "")
}
