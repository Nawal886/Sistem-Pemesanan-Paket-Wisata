package handler

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

var validate = validator.New()

func JSONResponse(c *fiber.Ctx, statusCode int, message string, data interface{}, errorMsg interface{}) error {
	response := fiber.Map{
		"success": statusCode >= 200 && statusCode < 300,
		"message": message,
	}
	if data != nil {
		response["data"] = data
	}
	if errorMsg != nil && errorMsg != "" {
		response["error"] = errorMsg
	}
	return c.Status(statusCode).JSON(response)
}

func JSONResponseWithMeta(c *fiber.Ctx, statusCode int, message string, data interface{}, meta interface{}, errorMsg interface{}) error {
	response := fiber.Map{
		"success": statusCode >= 200 && statusCode < 300,
		"message": message,
	}
	if data != nil {
		response["data"] = data
	}
	if meta != nil {
		response["meta"] = meta
	}
	if errorMsg != nil && errorMsg != "" {
		response["error"] = errorMsg
	}
	return c.Status(statusCode).JSON(response)
}

func formatValidationErrors(err error) interface{} {
	var errors []string
	if errs, ok := err.(validator.ValidationErrors); ok {
		for _, e := range errs {
			errors = append(errors, e.Field()+" is "+e.Tag())
		}
	} else {
		errors = append(errors, err.Error())
	}
	return errors
}
