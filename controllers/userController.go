package controllers

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/reppo/goreact/database"
	"github.com/reppo/goreact/middlewares"
	"github.com/reppo/goreact/models"
)

func AllUsers(c *fiber.Ctx) error {

	if err := middlewares.IsAuthorized(c,"users");err != nil {
		return err
	}

	page, _ := strconv.Atoi(c.Query("page", "1"))

	return c.JSON(models.Paginate(database.DB,&models.User{},page))
}

func CreateUser(c *fiber.Ctx) error {
		if err := middlewares.IsAuthorized(c,"users");err != nil {
		return err
	}

	var user models.User

	err:= c.BodyParser(&user)
	if err != nil {
		return err
	}
 
	user.SetPassword(user.Password)

	database.DB.Create(&user)

	return  c.JSON(user)
}

func GetUser(c *fiber.Ctx) error {
		if err := middlewares.IsAuthorized(c,"users");err != nil {
		return err
	}

	id, _ := strconv.Atoi(c.Params("id"))

	var user models.User

	database.DB.Preload("Role").First(&user, id)

	return c.JSON(user)
	
}

func UpdateUser(c *fiber.Ctx) error {
		if err := middlewares.IsAuthorized(c,"users");err != nil {
		return err
	}


	id, _ := strconv.Atoi(c.Params("id"))

	var user models.User

	if err := database.DB.First(&user, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"message": "user not found",
		})
	}

	var data models.UpdateRequest

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	user.FirstName = data.FirstName
	user.LastName = data.LastName
	user.Email = data.Email
	user.RoleID = data.RoleID

	database.DB.Save(&user)

	return c.JSON(user)
}

func Delete(c *fiber.Ctx) error {
		if err := middlewares.IsAuthorized(c,"users");err != nil {
		return err
	}

	id, _ := strconv.Atoi(c.Params("id"))

	var user models.User

	if err := database.DB.First(&user, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"message": "user not found",
		})
	}

	database.DB.Unscoped().Delete(&user)

	return c.JSON(fiber.Map{
		"message": "user deleted successfully",
	})
}