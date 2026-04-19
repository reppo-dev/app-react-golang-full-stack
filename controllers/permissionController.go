package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/reppo/goreact/database"
	"github.com/reppo/goreact/models"
)

func AllPermission(c *fiber.Ctx) error {
	var permission []models.Permission

	database.DB.Find(&permission)

	return c.JSON(permission)
}