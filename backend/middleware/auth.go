package middleware

import (
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

// JWTClaims defines the structure of JWT token claims
type JWTClaims struct {
	UserID uint   `json:"user_id"`
	Email  string `json:"email"`
	Role   string `json:"role"`
	Nama   string `json:"nama"`
	jwt.RegisteredClaims
}

// GetJWTSecret returns the JWT secret
func GetJWTSecret() string {
	return "wisataku-secret-key-2026"
}

// GenerateToken creates a new JWT token for a user
func GenerateToken(userID uint, email, role, nama string) (string, error) {
	claims := JWTClaims{
		UserID: userID,
		Email:  email,
		Role:   role,
		Nama:   nama,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(GetJWTSecret()))
}

// AuthRequired middleware checks for a valid JWT token
func AuthRequired() fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"success": false,
				"message": "Token autentikasi diperlukan",
			})
		}

		// Extract token from "Bearer <token>"
		tokenParts := strings.Split(authHeader, " ")
		if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"success": false,
				"message": "Format token tidak valid. Gunakan: Bearer <token>",
			})
		}

		tokenString := tokenParts[1]
		claims := &JWTClaims{}

		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return []byte(GetJWTSecret()), nil
		})

		if err != nil || !token.Valid {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"success": false,
				"message": "Token tidak valid atau sudah kadaluarsa",
			})
		}

		// Store user info in context locals
		c.Locals("userID", claims.UserID)
		c.Locals("userEmail", claims.Email)
		c.Locals("userRole", claims.Role)
		c.Locals("userName", claims.Nama)

		return c.Next()
	}
}

// AdminOnly middleware checks if the authenticated user is an admin
func AdminOnly() fiber.Handler {
	return func(c *fiber.Ctx) error {
		role, ok := c.Locals("userRole").(string)
		if !ok || role != "admin" {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"success": false,
				"message": "Akses ditolak. Hanya admin yang diizinkan.",
			})
		}
		return c.Next()
	}
}
