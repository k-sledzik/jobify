package main

import (
	"net/http"

	api "github.com/k-sledzik/jobify/jobify-shared"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

// @BasePath /
// @Summary Home Page
// @Description Welcome to the Jobify Auth Service home page
// @Tags auth
// @Accept json
// @Produce json
// @Success 200 {string} string "Welcome to Jobify Auth Service!"
// @Router /home [get]
func home(c echo.Context) error {
	return c.String(http.StatusOK, "Welcome to Jobify Auth Service!")
}

func main() {
	e := echo.New()
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000"},
	}))
	e.GET("/home", home)
	api.RegisterApiSpecRoute(e, &api.ApiSpecOptions{
		ServiceName: "auth",
	})
	e.Logger.Fatal(e.Start(":8080"))
}
