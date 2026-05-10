package config

import (
	"os"
)

type Config struct {
	DatabaseURL string
}

func Load() *Config {
	return &Config{
		DatabaseURL: getEnv("SUPABASE_DSN", "postgresql://postgres:postgres@localhost:5432/postgres"),
	}
}

func getEnv(key, fallback string) string {
	if val, ok := os.LookupEnv(key); ok && val != "" {
		return val
	}
	return fallback
}
