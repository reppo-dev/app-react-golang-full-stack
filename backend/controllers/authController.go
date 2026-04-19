package controllers

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
	"github.com/reppo/goreact/database"
	"github.com/reppo/goreact/models"
	"github.com/reppo/goreact/util"
)

func Register(c *fiber.Ctx) error {
	var data models.RegisterRequest

	if err := c.BodyParser(&data); err != nil {
    return err
	}

    if data.Password != data.PasswordConfirm {
        return c.Status(400).JSON(fiber.Map{
            "message": "passwords do not match",
        })
    }


	user := models.User{
		FirstName: data.FirstName,
		LastName: data.LastName,
		Email: data.Email,
		RoleID: 2,
	}

	user.SetPassword(data.Password)

	database.DB.Create(&user)



	token,err := util.GenerateJwt(user.ID)


	if err != nil {
		return  c.SendStatus(fiber.StatusInternalServerError)
	}
	cookie := fiber.Cookie{
		Name: "jwt",
		Value: token,
		Expires: time.Now().Add(time.Hour * 24),
		HTTPOnly: true,
	}

	c.Cookie(&cookie)


	return c.JSON(fiber.Map{
		"message":"success",
	})
}

func Login(c *fiber.Ctx) error {
	var data models.LoginRequest

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	var user models.User

	database.DB.Where("email = ?",data.Email).First(&user)

	if user.ID == 0 {
		return c.Status(404).JSON(fiber.Map{
			"message":"user not found",
		})
	}

	err := user.ComparePassword(data.Password)

	if err != nil {
		return  c.Status(400).JSON(fiber.Map{
			"message":"incorrect password",
		})
	}


	token,err := util.GenerateJwt(user.ID)


	if err != nil {
		return  c.SendStatus(fiber.StatusInternalServerError)
	}
	
	cookie := fiber.Cookie{
		Name: "jwt",
		Value: token,
		Expires: time.Now().Add(time.Hour * 24),
		HTTPOnly: true,
	}

	c.Cookie(&cookie)


	return c.JSON(fiber.Map{
		"message":"success",
	})
}

type Claims struct{
	jwt.StandardClaims
}

func User(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")

	    if cookie == "" {
        return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
            "message": "unauthenticated",
        })
    }

    id, err := util.ParseJwt(cookie)
    if err != nil {
        return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
            "message": "invalid or expired token",
        })
    }

    var user models.User
    result := database.DB.Preload("Role").First(&user, id)

    if result.Error != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
            "message": "user not found",
        })
    }

    return c.JSON(user)
}

func Logout(c *fiber.Ctx) error {
	cookie := fiber.Cookie{
		Name: "jwt",
		Value: "",
		Expires: time.Now().Add(-time.Hour),
		HTTPOnly: true,
	}

	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"message":"success",
	})
}

func UpdateInfo(c *fiber.Ctx) error {
	var data models.UpdateRequest

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	cookie := c.Cookies("jwt")

	id, err := util.ParseJwt(cookie)
	if err != nil {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	var user models.User

	database.DB.Where("id = ?", id).First(&user)

	user.FirstName = data.FirstName
	user.LastName = data.LastName
	user.Email = data.Email

	database.DB.Save(&user)

	return c.JSON(user)
}


func UpdatePassword(c *fiber.Ctx) error {
	var data models.UpdatePassword

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	if data.Password != data.PasswordConfirm {
		return c.Status(400).JSON(fiber.Map{
			"message": "passwords do not match",
		})
	}

	cookie := c.Cookies("jwt")
	id, _ := util.ParseJwt(cookie)

	var user models.User
	database.DB.Where("id = ?", id).First(&user)

	// Hash password
	user.SetPassword(data.Password)

	database.DB.Save(&user)

	return c.JSON(fiber.Map{
		"message": "success",
	})
}
