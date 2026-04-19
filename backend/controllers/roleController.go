package controllers

import (
	"fmt"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/reppo/goreact/database"
	"github.com/reppo/goreact/middlewares"
	"github.com/reppo/goreact/models"
	"gorm.io/gorm"
)

func AllRole(c *fiber.Ctx) error {
	if err := middlewares.IsAuthorized(c,"users");err != nil {
		return err
	}
	
	var roles []models.Role

	database.DB.Find(&roles)

	return c.JSON(roles)
}


func CreateRole(c *fiber.Ctx) error {

	if err := middlewares.IsAuthorized(c,"users");err != nil {
		return err
	}

	var roleDTo fiber.Map

	err:= c.BodyParser(&roleDTo)
	if err != nil {
		return err
	}

	list := roleDTo["permissions"].([]interface{})

	permission := make([]models.Permission,len(list))

	for i, permissionId := range list{
		id,_ := strconv.Atoi(permissionId.(string))

		permission[i] = models.Permission{
    			Model: gorm.Model{
        				ID: uint(id),
   				 },
			}
	}

	role := models.Role{
		Name: roleDTo["name"].(string),
		Permission: permission,
	}

	database.DB.Create(&role)

	return c.JSON(role)
}

func GetRole(c *fiber.Ctx) error {
	if err := middlewares.IsAuthorized(c,"users");err != nil {
		return err
	}
	id, _ := strconv.Atoi(c.Params("id"))

	var role models.Role
err := database.DB.Preload("Permission").First(&role, id).Error
    if err != nil {
        // این خط ارور اصلی دیتابیس را در کنسول Go چاپ می‌کند
        fmt.Println("GORM ACTUAL ERROR:", err.Error()) 
        
        return c.Status(404).JSON(fiber.Map{
            "message": "role not found",
            "error": err.Error(), // ارسال ارور به فرانت برای دیباگ
        })
    }
	return c.JSON(role)
	
}

type RoleDTO struct {
	Name        string `json:"name"`
	Permissions []uint `json:"permissions"`
}

func UpdateRole(c *fiber.Ctx) error {
	if err := middlewares.IsAuthorized(c,"users");err != nil {
		return err
	}


	id, _ := strconv.Atoi(c.Params("id"))

	var roleDto RoleDTO
	if err := c.BodyParser(&roleDto); err != nil {
		return err
	}

	var role models.Role
	if err := database.DB.First(&role, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"message": "role not found",
		})
	}

	permissions := make([]models.Permission, len(roleDto.Permissions))

	for i, pid := range roleDto.Permissions {
		permissions[i] = models.Permission{
			Model: gorm.Model{
				ID: pid,
			},
		}
	}

	role.Name = roleDto.Name
	database.DB.Save(&role)
	database.DB.Model(&role).Association("Permission").Replace(&permissions)

	return c.JSON(role)
}


func DeleteRole(c *fiber.Ctx) error {
	if err := middlewares.IsAuthorized(c,"users");err != nil {
		return err
	}

	id, _ := strconv.Atoi(c.Params("id"))

	var role models.Role

	if err := database.DB.First(&role, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"message": "role not found",
		})
	}

	database.DB.Delete(&role)

	return c.JSON(fiber.Map{
		"message": "role deleted successfully",
	})
}