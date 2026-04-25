package database

import (
	"fmt"
	"os"

	"github.com/reppo/goreact/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	dbName  := os.Getenv("DB_DATABASE")
	username := os.Getenv("DB_USERNAME")
	password := os.Getenv("DB_PASSWORD")

		// dsn := "host=localhots user=postgres password=****** dbname=myapp port=5432 sslmode=disable" for localhots

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		host, username, password, dbName, port)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	
	if err != nil {
		panic("Could not connect to the database")
	}

	DB = db

	db.AutoMigrate(&models.User{},&models.Role{},&models.Permission{},&models.Product{},&models.Order{},&models.OrderItem{})
}
