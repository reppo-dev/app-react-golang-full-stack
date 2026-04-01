package database

import (
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Connect() {
	dsn := "host=localhost user=postgres password=13802002 dbname=myapp port=5432 sslmode=disable"

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("Could not connect to the database")
	}
	fmt.Println(db)
}