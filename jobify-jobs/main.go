package main

import (
	"net/http"

	api "github.com/k-sledzik/jobify/jobify-shared"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

// @Summary Jobs Service
// @Description Welcome to the Jobify Jobs Service home page
// @Tags jobs
// @Accept json
// @Produce json
// @Success 200 {string} string "Welcome to Jobify Jobs Service!"
// @Router /jobs [get]
func jobs(c echo.Context) error {
	return c.String(http.StatusOK, "Welcome to Jobify Jobs Service!")
}

func main() {
	e := echo.New()
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000"},
	}))
	e.GET("/jobs", jobs)
	api.RegisterApiSpecRoute(e, &api.ApiSpecOptions{
		ServiceName: "jobs",
	})
	e.Logger.Fatal(e.Start(":8081"))
}
