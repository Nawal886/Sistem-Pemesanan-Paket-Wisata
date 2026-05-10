package router

import (
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
	"paket-wisata-backend/handler"
	"paket-wisata-backend/middleware"
	"paket-wisata-backend/repository"
)

// SetupRoutes registers all API routes
func SetupRoutes(app *fiber.App, db *gorm.DB) {
	// Initialize Repositories
	userRepo := repository.NewUserRepository(db)
	destinasiRepo := repository.NewDestinasiRepository(db)
	pemesananRepo := repository.NewPemesananRepository(db)
	ulasanRepo := repository.NewUlasanRepository(db)

	// Initialize Handlers
	authHandler := handler.NewAuthHandler(userRepo)
	destinasiHandler := handler.NewDestinasiHandler(destinasiRepo)
	pemesananHandler := handler.NewPemesananHandler(pemesananRepo)
	ulasanHandler := handler.NewUlasanHandler(ulasanRepo)

	api := app.Group("/api")

	api.Get("/health", func(c *fiber.Ctx) error {
		return handler.JSONResponse(c, fiber.StatusOK, "WisataKu API is running", fiber.Map{"version": "2.0.0"}, "")
	})

	// ==========================================
	// Auth routes (Public)
	// ==========================================
	auth := api.Group("/auth")
	auth.Post("/register", authHandler.Register)
	auth.Post("/login", authHandler.Login)
	auth.Get("/profile", middleware.AuthRequired(), authHandler.GetProfile)

	// ==========================================
	// Paket Wisata routes
	// ==========================================
	paket := api.Group("/paket")
	// Public: anyone can browse packages
	paket.Get("/", handler.GetAllPaket)
	paket.Get("/:id", handler.GetPaketByID)
	// Admin only: create, update, delete
	paket.Post("/", middleware.AuthRequired(), middleware.AdminOnly(), handler.CreatePaket)
	paket.Put("/:id", middleware.AuthRequired(), middleware.AdminOnly(), handler.UpdatePaket)
	paket.Delete("/:id", middleware.AuthRequired(), middleware.AdminOnly(), handler.DeletePaket)

	// ==========================================
	// Destinasi routes
	// ==========================================
	destinasi := api.Group("/destinasi")
	// Public: anyone can browse destinations
	destinasi.Get("/", destinasiHandler.GetAllDestinasi)
	destinasi.Get("/:id", destinasiHandler.GetDestinasiByID)
	// Admin only: create, update, delete
	destinasi.Post("/", middleware.AuthRequired(), middleware.AdminOnly(), destinasiHandler.CreateDestinasi)
	destinasi.Put("/:id", middleware.AuthRequired(), middleware.AdminOnly(), destinasiHandler.UpdateDestinasi)
	destinasi.Delete("/:id", middleware.AuthRequired(), middleware.AdminOnly(), destinasiHandler.DeleteDestinasi)

	// ==========================================
	// Pemesanan routes
	// ==========================================
	pemesanan := api.Group("/pemesanan")
	// Admin: get all bookings
	pemesanan.Get("/", middleware.AuthRequired(), pemesananHandler.GetAllPemesanan)
	pemesanan.Get("/:id", middleware.AuthRequired(), pemesananHandler.GetPemesananByID)
	// Authenticated: customer can create bookings
	pemesanan.Post("/", middleware.AuthRequired(), pemesananHandler.CreatePemesanan)
	// Admin only: update, delete
	pemesanan.Put("/:id", middleware.AuthRequired(), middleware.AdminOnly(), pemesananHandler.UpdatePemesanan)
	pemesanan.Delete("/:id", middleware.AuthRequired(), middleware.AdminOnly(), pemesananHandler.DeletePemesanan)

	// Customer: get own bookings
	api.Get("/my/pemesanan", middleware.AuthRequired(), pemesananHandler.GetMyPemesanan)

	// ==========================================
	// Ulasan routes
	// ==========================================
	ulasan := api.Group("/ulasan")
	// Public: anyone can read reviews
	ulasan.Get("/", ulasanHandler.GetAllUlasan)
	ulasan.Get("/:id", ulasanHandler.GetUlasanByID)
	// Authenticated: customer can create reviews
	ulasan.Post("/", middleware.AuthRequired(), ulasanHandler.CreateUlasan)
	// Admin only: update, delete
	ulasan.Put("/:id", middleware.AuthRequired(), middleware.AdminOnly(), ulasanHandler.UpdateUlasan)
	ulasan.Delete("/:id", middleware.AuthRequired(), middleware.AdminOnly(), ulasanHandler.DeleteUlasan)
}
