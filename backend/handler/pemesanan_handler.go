package handler

import (
	"fmt"
	"math/rand"
	"paket-wisata-backend/model"
	"paket-wisata-backend/repository"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
)

type PemesananHandler struct {
	Repo *repository.PemesananRepository
}

func NewPemesananHandler(repo *repository.PemesananRepository) *PemesananHandler {
	return &PemesananHandler{Repo: repo}
}

func generateKodePemesanan() string {
	return fmt.Sprintf("WIS-%d-%04d", time.Now().Year(), rand.Intn(9000)+1000)
}

func (h *PemesananHandler) GetAllPemesanan(c *fiber.Ctx) error {
	status := c.Query("status")
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

	pemesanan, total, err := h.Repo.FindAll(status, search, limit, offset)
	if err != nil {
		return JSONResponse(c, fiber.StatusInternalServerError, "Gagal mengambil data pemesanan", nil, err.Error())
	}

	meta := fiber.Map{
		"total": total,
		"page":  page,
		"limit": limit,
		"pages": (total + int64(limit) - 1) / int64(limit),
	}
	return JSONResponseWithMeta(c, fiber.StatusOK, "Data pemesanan berhasil diambil", pemesanan, meta, "")
}

func (h *PemesananHandler) GetPemesananByID(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil || id <= 0 {
		return JSONResponse(c, fiber.StatusBadRequest, "ID tidak valid", nil, "Invalid ID")
	}

	pemesanan, err := h.Repo.FindByID(id)
	if err != nil {
		return JSONResponse(c, fiber.StatusNotFound, "Pemesanan tidak ditemukan", nil, err.Error())
	}
	return JSONResponse(c, fiber.StatusOK, "Data pemesanan ditemukan", pemesanan, "")
}

func (h *PemesananHandler) CreatePemesanan(c *fiber.Ctx) error {
	req := new(model.PemesananRequest)
	if err := c.BodyParser(req); err != nil {
		return JSONResponse(c, fiber.StatusBadRequest, "Format request tidak valid", nil, err.Error())
	}

	if err := validate.Struct(req); err != nil {
		return JSONResponse(c, fiber.StatusBadRequest, "Validasi gagal", formatValidationErrors(err), err.Error())
	}

	tanggalBerangkat, err := time.Parse("2006-01-02", req.TanggalBerangkat)
	if err != nil {
		return JSONResponse(c, fiber.StatusBadRequest, "Format tanggal tidak valid", nil, err.Error())
	}

	paket, err := h.Repo.GetPaketByID(req.PaketID)
	if err != nil {
		return JSONResponse(c, fiber.StatusBadRequest, "Paket wisata tidak ditemukan", nil, err.Error())
	}

	statusPemesanan := "pending"
	if req.StatusPemesanan != "" {
		statusPemesanan = req.StatusPemesanan
	}

	pemesanan := model.Pemesanan{
		KodePemesanan:    generateKodePemesanan(),
		NamaPemesan:      req.NamaPemesan,
		Email:            req.Email,
		Telepon:          req.Telepon,
		PaketID:          req.PaketID,
		NamaPaket:        paket.NamaPaket,
		TanggalBerangkat: tanggalBerangkat,
		JumlahPeserta:    req.JumlahPeserta,
		TotalHarga:       paket.Harga * float64(req.JumlahPeserta),
		StatusPemesanan:  statusPemesanan,
		CatatanKhusus:    req.CatatanKhusus,
	}

	if err := h.Repo.Create(&pemesanan); err != nil {
		return JSONResponse(c, fiber.StatusInternalServerError, "Gagal menyimpan pemesanan", nil, err.Error())
	}
	return JSONResponse(c, fiber.StatusCreated, "Pemesanan berhasil dibuat", pemesanan, "")
}

func (h *PemesananHandler) UpdatePemesanan(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil || id <= 0 {
		return JSONResponse(c, fiber.StatusBadRequest, "ID tidak valid", nil, "Invalid ID")
	}

	pemesanan, err := h.Repo.FindByID(id)
	if err != nil {
		return JSONResponse(c, fiber.StatusNotFound, "Pemesanan tidak ditemukan", nil, err.Error())
	}

	req := new(model.PemesananRequest)
	if err := c.BodyParser(req); err != nil {
		return JSONResponse(c, fiber.StatusBadRequest, "Format request tidak valid", nil, err.Error())
	}

	if err := validate.Struct(req); err != nil {
		return JSONResponse(c, fiber.StatusBadRequest, "Validasi gagal", formatValidationErrors(err), err.Error())
	}

	tanggalBerangkat, err := time.Parse("2006-01-02", req.TanggalBerangkat)
	if err == nil {
		pemesanan.TanggalBerangkat = tanggalBerangkat
	}

	pemesanan.NamaPemesan = req.NamaPemesan
	pemesanan.Email = req.Email
	pemesanan.Telepon = req.Telepon
	pemesanan.JumlahPeserta = req.JumlahPeserta
	pemesanan.CatatanKhusus = req.CatatanKhusus
	if req.StatusPemesanan != "" {
		pemesanan.StatusPemesanan = req.StatusPemesanan
	}

	if err := h.Repo.Update(&pemesanan); err != nil {
		return JSONResponse(c, fiber.StatusInternalServerError, "Gagal memperbarui pemesanan", nil, err.Error())
	}
	return JSONResponse(c, fiber.StatusOK, "Pemesanan berhasil diperbarui", pemesanan, "")
}

func (h *PemesananHandler) DeletePemesanan(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil || id <= 0 {
		return JSONResponse(c, fiber.StatusBadRequest, "ID tidak valid", nil, "Invalid ID")
	}

	pemesanan, err := h.Repo.FindByID(id)
	if err != nil {
		return JSONResponse(c, fiber.StatusNotFound, "Pemesanan tidak ditemukan", nil, err.Error())
	}

	if err := h.Repo.Delete(&pemesanan); err != nil {
		return JSONResponse(c, fiber.StatusInternalServerError, "Gagal menghapus pemesanan", nil, err.Error())
	}
	return JSONResponse(c, fiber.StatusOK, "Pemesanan berhasil dihapus", nil, "")
}
