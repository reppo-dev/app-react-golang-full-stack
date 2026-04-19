package controllers

import (
	"encoding/csv"
	"os"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/reppo/goreact/database"
	"github.com/reppo/goreact/models"
)

func AllOrders(c *fiber.Ctx) error {
	page, _ := strconv.Atoi(c.Query("page", "1"))

	query := database.DB.Preload("OrderItem")

	return c.JSON(models.Paginate(query, &models.Order{}, page))
}

func Export(c *fiber.Ctx) error {
	filePath := "./csv/orders.csv"

	if err := CreateFile(filePath);err!=nil {
		return err
	}

	return c.Download(filePath)
}

func CreateFile(filePath string) error {
	file,err := os.Create(filePath)

	if err != nil {
		return err
	}

	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	var orders []models.Order

	database.DB.Preload("OrderItems").Find(&orders)

	writer.Write([]string{
		"ID","Name","Email","Product Title","Price","Quantity",
	})

	for _, order := range orders {
		data := []string{
			strconv.Itoa(int(order.ID)), order.FirstName + " " + order.LastName,order.Email,"","","",
		}
		if err := writer.Write(data); err != nil {
			return err
		}

		for _ , orderItem:= range order.OrderItem {
			data := []string{
				"","","",orderItem.ProductTitle,strconv.Itoa(int(orderItem.Price)),strconv.Itoa(int(orderItem.Quantity)),
			}

			if err := writer.Write(data); err != nil {
				return nil
			}
		}
	}
	return nil
}

type Sales struct {
	Date string `json:"date"`
	Sum  float64 `json:"sum"`
}

func Chart(c *fiber.Ctx) error {
	var sales []Sales

	database.DB.Raw(`
    	SELECT TO_CHAR(o.created_at, 'YYYY-MM-DD') as date,
           SUM(oi.price * oi.quantity) as sum
    	FROM orders o
    	JOIN order_items oi on o.id = oi.order_id
    	GROUP BY 1
   		ORDER BY 1
	`).Scan(&sales)

	return c.JSON(sales)
}
