package controllers

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/reppo/goreact/database"
	"github.com/reppo/goreact/middlewares"
	"github.com/reppo/goreact/models"
)

func AllProduct(c *fiber.Ctx) error {
	page, _ := strconv.Atoi(c.Query("page", "1"))

	return c.JSON(models.Paginate(database.DB,&models.Product{},page))
}

func CreateProduct(c *fiber.Ctx) error {
	if err := middlewares.IsAuthorized(c,"users");err != nil {
		return err
	}
	var product models.Product

	err := c.BodyParser(&product)
	if err != nil {
		return err
	}

	database.DB.Create(&product)

	return c.JSON(product)
}

func GetProduct(c *fiber.Ctx) error {
	id, _ := strconv.Atoi(c.Params("id"))

	var user models.User

	database.DB.First(&user, id)

	return c.JSON(user)

}

func UpdateProduct(c *fiber.Ctx) error {
	if err := middlewares.IsAuthorized(c,"users");err != nil {
		return err
	}

	id, _ := strconv.Atoi(c.Params("id"))


	var Product models.Product

	if err := database.DB.First(&Product, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"message": "user not found",
		})
	}

	var data models.UpdateProduct

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	Product.Title = data.Title
	Product.Description = data.Description
	Product.Image = data.Image
	Product.Price = data.Price

	database.DB.Save(&Product)

	return c.JSON(Product)
}

func DeleteProduct(c *fiber.Ctx) error {
	if err := middlewares.IsAuthorized(c,"users");err != nil {
		return err
	}
	
	id, _ := strconv.Atoi(c.Params("id"))

	var product models.Product

	if err := database.DB.First(&product, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"message": "product not found",
		})
	}

	database.DB.Unscoped().Delete(&product)

	return c.JSON(fiber.Map{
		"message": "product deleted successfully",
	})
}