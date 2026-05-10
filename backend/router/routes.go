package router

import (
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
	"paket-wisata-backend/handler"
	"paket-wisata-backend/repository"
)

// SetupRoutes registers all API routes
func SetupRoutes(app *fiber.App, db *gorm.DB) {
	// Initialize Repositories
	destinasiRepo := repository.NewDestinasiRepository(db)
	pemesananRepo := repository.NewPemesananRepository(db)
	ulasanRepo := repository.NewUlasanRepository(db)

	// Initialize Handlers
	destinasiHandler := handler.NewDestinasiHandler(destinasiRepo)
	pemesananHandler := handler.NewPemesananHandler(pemesananRepo)
	ulasanHandler := handler.NewUlasanHandler(ulasanRepo)

	api := app.Group("/api")

	api.Get("/health", func(c *fiber.Ctx) error {
		return handler.JSONResponse(c, fiber.StatusOK, "Sistem Pemesanan Paket Wisata API is running", fiber.Map{"version": "1.0.0"}, "")
	})

	// Paket Wisata routes
	paket := api.Group("/paket")
	paket.Get("/", handler.GetAllPaket)
	paket.Get("/:id", handler.GetPaketByID)
	paket.Post("/", handler.CreatePaket)
	paket.Put("/:id", handler.UpdatePaket)
	paket.Delete("/:id", handler.DeletePaket)

	// Destinasi routes
	destinasi := api.Group("/destinasi")
	destinasi.Get("/", destinasiHandler.GetAllDestinasi)
	destinasi.Get("/:id", destinasiHandler.GetDestinasiByID)
	destinasi.Post("/", destinasiHandler.CreateDestinasi)
	destinasi.Put("/:id", destinasiHandler.UpdateDestinasi)
	destinasi.Delete("/:id", destinasiHandler.DeleteDestinasi)

	// Pemesanan routes
	pemesanan := api.Group("/pemesanan")
	pemesanan.Get("/", pemesananHandler.GetAllPemesanan)
	pemesanan.Get("/:id", pemesananHandler.GetPemesananByID)
	pemesanan.Post("/", pemesananHandler.CreatePemesanan)
	pemesanan.Put("/:id", pemesananHandler.UpdatePemesanan)
	pemesanan.Delete("/:id", pemesananHandler.DeletePemesanan)

	// Ulasan routes
	ulasan := api.Group("/ulasan")
	ulasan.Get("/", ulasanHandler.GetAllUlasan)
	ulasan.Get("/:id", ulasanHandler.GetUlasanByID)
	ulasan.Post("/", ulasanHandler.CreateUlasan)
	ulasan.Put("/:id", ulasanHandler.UpdateUlasan)
	ulasan.Delete("/:id", ulasanHandler.DeleteUlasan)
}
