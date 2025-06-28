package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
)

const ApiSpecHttpRoute = "api/spec"

type ApiSpecOptions struct {
	ServiceName string
}

func serveApiSpecFile(c echo.Context, apiSpecPath string) error {
	data, err := os.ReadFile(apiSpecPath)

	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": fmt.Sprintf("API specification file not found: %s", apiSpecPath),
		})
	}

	var jsonData any

	if err := json.Unmarshal(data, &jsonData); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": fmt.Sprintf("Failed to parse API specification: %s", err),
		})
	}

	return c.JSON(http.StatusOK, jsonData)
}

func RegisterApiSpecRoute(e *echo.Echo, opts *ApiSpecOptions) {
	if opts == nil {
		opts = &ApiSpecOptions{
			ServiceName: "",
		}
	}

	apiSpecPath := fmt.Sprintf("../api-docs/jobify-%s_swagger.json", opts.ServiceName)

	e.GET(ApiSpecHttpRoute, func(c echo.Context) error {
		return serveApiSpecFile(c, apiSpecPath)
	})
}
