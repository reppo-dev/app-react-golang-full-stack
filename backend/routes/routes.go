package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/reppo/goreact/controllers"
	"github.com/reppo/goreact/middlewares"
)

func Setup(app *fiber.App) {
	app.Post("/api/register",controllers.Register)
	app.Post("/api/login",controllers.Login)

	app.Use(middlewares.IsAuthenticated)

	app.Get("/api/user",controllers.User)
	app.Post("/api/logout",controllers.Logout)

	app.Get("/api/users",controllers.AllUsers)
	app.Post("/api/users",controllers.CreateUser)
	app.Get("/api/users/:id",controllers.GetUser)
	app.Put("/api/users/:id",controllers.UpdateUser)
	app.Delete("/api/users/:id",controllers.Delete)
	app.Put("/api/user/info",controllers.UpdateInfo)
	app.Put("/api/user/password",controllers.UpdatePassword)

	app.Get("/api/roles",controllers.AllRole)
	app.Post("/api/roles",controllers.CreateRole)
	app.Get("/api/roles/:id",controllers.GetRole)
	app.Put("/api/roles/:id",controllers.UpdateRole)
	app.Delete("/api/roles/:id",controllers.DeleteRole)

	app.Get("/api/products",controllers.AllProduct)
	app.Post("/api/products",controllers.CreateProduct)
	app.Get("/api/products/:id",controllers.GetProduct)
	app.Put("/api/products/:id",controllers.UpdateProduct)
	app.Delete("/api/products/:id",controllers.DeleteProduct)

	app.Get("/api/permission",controllers.AllPermission)

	app.Post("/api/uploads",controllers.Upload)
	app.Static("/api/uploads","./uploads")

	app.Get("/api/orders",controllers.AllOrders)
	app.Post("/api/export",controllers.Export)
	app.Get("/api/chart",controllers.Chart)
}
