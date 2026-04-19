package database

import (
	"github.com/reppo/goreact/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	dsn := "host=localhost user=postgres password=13802002 dbname=myapp port=5432 sslmode=disable"

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	
	if err != nil {
		panic("Could not connect to the database")
	}

	DB = db

	db.AutoMigrate(&models.User{},&models.Role{},&models.Permission{},&models.Product{},&models.Order{},&models.OrderItem{})
}
