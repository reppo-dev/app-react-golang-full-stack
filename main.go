package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/reppo/goreact/database"
)

func main() {
	database.Connect()
	app := fiber.New()

	app.Get("/",func (c *fiber.Ctx) error {
		return c.SendString("Hello, world!")
	})

	app.Listen(":8000")
}