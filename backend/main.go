package main

import (
	"log"
	"paket-wisata-backend/config"
	"paket-wisata-backend/repository"
	"paket-wisata-backend/model"
	"paket-wisata-backend/router"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("⚠️  No .env file found, using environment variables")
	}

	// Load config
	cfg := config.Load()

	// Connect to database
	config.Connect(cfg)

	// Auto-migrate tables
	if err := config.DB.AutoMigrate(
		&model.PaketWisata{},
		&model.Destinasi{},
		&model.Pemesanan{},
		&model.Ulasan{},
	); err != nil {
		log.Fatalf("❌ Auto migration failed: %v", err)
	}
	log.Println("✅ Auto migration completed")

	// Seed dummy data
	repository.SeedAll(config.DB)

	// Create Fiber app
	app := fiber.New(fiber.Config{
		AppName:      "Sistem Pemesanan Paket Wisata API v1.0.0",
		ErrorHandler: customErrorHandler,
	})

	// Register middleware
	app.Use(cors.New())
	app.Use(logger.New())

	// Register routes
	router.SetupRoutes(app, config.DB)

	// 404 handler
	app.Use(func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"success": false,
			"message": "Endpoint tidak ditemukan",
		})
	})

	// Start server
	log.Println("🚀 Server running on http://localhost:8080")
	if err := app.Listen(":8080"); err != nil {
		log.Fatalf("❌ Server failed to start: %v", err)
	}
}

// customErrorHandler handles unrecoverable fiber errors
func customErrorHandler(c *fiber.Ctx, err error) error {
	code := fiber.StatusInternalServerError
	if e, ok := err.(*fiber.Error); ok {
		code = e.Code
	}
	return c.Status(code).JSON(fiber.Map{
		"success": false,
		"message": err.Error(),
	})
}
