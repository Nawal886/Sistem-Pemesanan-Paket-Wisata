package repository

import (
	"fmt"
	"log"
	"math/rand"
	"paket-wisata-backend/model"
	"time"

	"gorm.io/gorm"
)

func SeedAll(db *gorm.DB) {
	rand.Seed(time.Now().UnixNano())

	// Seed Users (Admin + Customer)
	var countUser int64
	db.Model(&model.User{}).Count(&countUser)
	if countUser == 0 {
		log.Println("Seeding Users...")
		admin := model.User{
			Nama:    "Admin Wanderlust",
			Email:   "admin@wanderlust.com",
			Role:    "admin",
			Telepon: "081200000001",
			Alamat:  "Jakarta, Indonesia",
		}
		admin.HashPassword("admin123")

		customer := model.User{
			Nama:    "Budi Santoso",
			Email:   "budi@email.com",
			Role:    "customer",
			Telepon: "081234567890",
			Alamat:  "Bandung, Indonesia",
		}
		customer.HashPassword("customer123")

		db.Create(&admin)
		db.Create(&customer)
		log.Println("✅ Default users seeded (admin@wanderlust.com / admin123)")
	}

	// Seed Destinasi
	var countDestinasi int64
	db.Model(&model.Destinasi{}).Count(&countDestinasi)
	if countDestinasi == 0 {
		log.Println("Seeding Destinasi...")
		destinasis := []model.Destinasi{
			{NamaDestinasi: "Pantai Kuta", Provinsi: "Bali", Negara: "Indonesia", Deskripsi: "Pantai berpasir putih terkenal di Bali.", Rating: 4.5, Latitude: -8.718, Longitude: 115.169, Status: "aktif"},
			{NamaDestinasi: "Candi Borobudur", Provinsi: "Jawa Tengah", Negara: "Indonesia", Deskripsi: "Candi Buddha terbesar di dunia.", Rating: 4.8, Latitude: -7.607, Longitude: 110.203, Status: "aktif"},
			{NamaDestinasi: "Gunung Bromo", Provinsi: "Jawa Timur", Negara: "Indonesia", Deskripsi: "Gunung berapi aktif dengan pemandangan sunrise yang indah.", Rating: 4.7, Latitude: -7.942, Longitude: 112.953, Status: "aktif"},
			{NamaDestinasi: "Danau Toba", Provinsi: "Sumatera Utara", Negara: "Indonesia", Deskripsi: "Danau vulkanik terbesar di Asia Tenggara.", Rating: 4.6, Latitude: 2.633, Longitude: 98.900, Status: "aktif"},
			{NamaDestinasi: "Raja Ampat", Provinsi: "Papua Barat", Negara: "Indonesia", Deskripsi: "Surga bawah laut dengan keanekaragaman hayati tinggi.", Rating: 4.9, Latitude: -0.233, Longitude: 130.516, Status: "aktif"},
			{NamaDestinasi: "Taman Nasional Komodo", Provinsi: "Nusa Tenggara Timur", Negara: "Indonesia", Deskripsi: "Habitat asli komodo.", Rating: 4.8, Latitude: -8.533, Longitude: 119.483, Status: "aktif"},
			{NamaDestinasi: "Candi Prambanan", Provinsi: "DI Yogyakarta", Negara: "Indonesia", Deskripsi: "Candi Hindu terbesar di Indonesia.", Rating: 4.7, Latitude: -7.752, Longitude: 110.491, Status: "aktif"},
			{NamaDestinasi: "Kawah Putih", Provinsi: "Jawa Barat", Negara: "Indonesia", Deskripsi: "Kawah vulkanik berwarna putih kehijauan.", Rating: 4.5, Latitude: -7.166, Longitude: 107.400, Status: "aktif"},
			{NamaDestinasi: "Tana Toraja", Provinsi: "Sulawesi Selatan", Negara: "Indonesia", Deskripsi: "Daerah dengan budaya dan adat istiadat unik.", Rating: 4.6, Latitude: -2.966, Longitude: 119.866, Status: "aktif"},
			{NamaDestinasi: "Pulau Weh", Provinsi: "Aceh", Negara: "Indonesia", Deskripsi: "Pulau di ujung barat Indonesia yang terkenal dengan diving.", Rating: 4.7, Latitude: 5.833, Longitude: 95.333, Status: "aktif"},
		}
		db.Create(&destinasis)
	}

	// Seed Paket Wisata
	var countPaket int64
	db.Model(&model.PaketWisata{}).Count(&countPaket)
	if countPaket == 0 {
		log.Println("Seeding Paket Wisata...")
		pakets := []model.PaketWisata{
			{NamaPaket: "Eksplorasi Bali 3H2M", Kategori: "Pantai & Budaya", Deskripsi: "Nikmati keindahan pantai dan budaya Bali selama 3 hari.", Harga: 1500000, Durasi: 3, MaxPeserta: 20, Status: "aktif"},
			{NamaPaket: "Petualangan Bromo Midnight", Kategori: "Pegunungan", Deskripsi: "Melihat sunrise di Gunung Bromo dengan jeep.", Harga: 750000, Durasi: 1, MaxPeserta: 10, Status: "aktif"},
			{NamaPaket: "Tour Sejarah Yogyakarta", Kategori: "Budaya & Sejarah", Deskripsi: "Mengunjungi Candi Borobudur, Prambanan, dan Keraton.", Harga: 1200000, Durasi: 2, MaxPeserta: 15, Status: "aktif"},
			{NamaPaket: "Diving Raja Ampat", Kategori: "Bahari", Deskripsi: "Menyelam di surga bawah laut Raja Ampat.", Harga: 5000000, Durasi: 5, MaxPeserta: 8, Status: "aktif"},
			{NamaPaket: "Sailing Komodo 3H2M", Kategori: "Bahari & Satwa", Deskripsi: "Berlayar mengelilingi Taman Nasional Komodo.", Harga: 2500000, Durasi: 3, MaxPeserta: 12, Status: "aktif"},
			{NamaPaket: "Tour Danau Toba & Samosir", Kategori: "Alam", Deskripsi: "Menikmati keindahan Danau Toba dan kebudayaan Batak.", Harga: 1800000, Durasi: 3, MaxPeserta: 15, Status: "aktif"},
			{NamaPaket: "Jelajah Kawah Putih & Glamping", Kategori: "Alam", Deskripsi: "Wisata alam di Kawah Putih dan menginap di glamping Ciwidey.", Harga: 900000, Durasi: 2, MaxPeserta: 20, Status: "aktif"},
			{NamaPaket: "Wisata Budaya Tana Toraja", Kategori: "Budaya", Deskripsi: "Mengenal adat istiadat unik Tana Toraja.", Harga: 2200000, Durasi: 4, MaxPeserta: 10, Status: "aktif"},
			{NamaPaket: "Snorkeling Pulau Weh", Kategori: "Bahari", Deskripsi: "Menikmati pesona bawah laut di ujung barat Indonesia.", Harga: 1600000, Durasi: 3, MaxPeserta: 12, Status: "aktif"},
			{NamaPaket: "City Tour Bandung Raya", Kategori: "Kota & Kuliner", Deskripsi: "Berkeliling kota Bandung menikmati kuliner dan tempat hits.", Harga: 500000, Durasi: 1, MaxPeserta: 25, Status: "aktif"},
		}
		// Fix struct field ObjKultur -> removing it since it doesn't exist, recreating slice correctly
		pakets[2] = model.PaketWisata{NamaPaket: "Tour Sejarah Yogyakarta", Kategori: "Budaya & Sejarah", Deskripsi: "Mengunjungi Candi Borobudur, Prambanan, dan Keraton.", Harga: 1200000, Durasi: 2, MaxPeserta: 15, Status: "aktif"}
		db.Create(&pakets)
	}

	// Fetch packages to get their IDs for related tables
	var pakets []model.PaketWisata
	db.Find(&pakets)

	// Seed Pemesanan
	var countPemesanan int64
	db.Model(&model.Pemesanan{}).Count(&countPemesanan)
	if countPemesanan == 0 && len(pakets) > 0 {
		log.Println("Seeding Pemesanan...")
		var pemesanans []model.Pemesanan
		for i := 1; i <= 10; i++ {
			p := pakets[i%len(pakets)]
			peserta := rand.Intn(5) + 1
			pemesanans = append(pemesanans, model.Pemesanan{
				KodePemesanan:    fmt.Sprintf("WIS-2026-%04d", 1000+i),
				NamaPemesan:      fmt.Sprintf("Pelanggan %d", i),
				Email:            fmt.Sprintf("pelanggan%d@email.com", i),
				Telepon:          fmt.Sprintf("081234567%03d", i),
				PaketID:          p.ID,
				NamaPaket:        p.NamaPaket,
				TanggalBerangkat: time.Now().AddDate(0, 1, i),
				JumlahPeserta:    peserta,
				TotalHarga:       p.Harga * float64(peserta),
				StatusPemesanan:  []string{"pending", "confirmed", "completed"}[rand.Intn(3)],
				CatatanKhusus:    "Mohon dipersiapkan dengan baik.",
			})
		}
		db.Create(&pemesanans)
	}

	// Seed Ulasan
	var countUlasan int64
	db.Model(&model.Ulasan{}).Count(&countUlasan)
	if countUlasan == 0 && len(pakets) > 0 {
		log.Println("Seeding Ulasan...")
		var ulasans []model.Ulasan
		for i := 1; i <= 10; i++ {
			p := pakets[i%len(pakets)]
			ulasans = append(ulasans, model.Ulasan{
				PaketID:       p.ID,
				NamaPaket:     p.NamaPaket,
				NamaPengulas:  fmt.Sprintf("Turis %d", i),
				Email:         fmt.Sprintf("turis%d@email.com", i),
				Rating:        rand.Intn(2) + 4, // 4-5 stars
				Judul:         "Sangat Menyenangkan!",
				Komentar:      "Pengalaman liburan yang luar biasa dan sangat direkomendasikan.",
				TanggalWisata: time.Now().AddDate(0, -1, -i),
				Status:        []string{"pending", "approved"}[rand.Intn(2)],
			})
		}
		db.Create(&ulasans)
	}
}
