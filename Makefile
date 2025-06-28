.PHONY: docs dev build

OUTPUT_DIR=../bin
DOCS_DIR=../api-docs
SWAG_BIN=~/go/bin/swag
SWAGGER_OUTPUT_TYPES=json

ifndef API_INSTANCE_NAME
$(error API_INSTANCE_NAME is not set. Please define it in your service Makefile)
endif

docs:
	@echo "Generating API documentation..."
	$(SWAG_BIN) init --output $(DOCS_DIR) --outputTypes $(SWAGGER_OUTPUT_TYPES) --instanceName $(API_INSTANCE_NAME) --parseDependency --parseInternal
	@echo "API documentation generated in $(DOCS_DIR)"

dev: docs
	@echo "Starting development server..."
	go run main.go

build: docs
	@echo "Building Jobify Auth service..."
	go build -o $(OUTPUT_DIR)/jobify-auth main.go
	@echo "Build complete. Executable: $(OUTPUT_DIR)/jobify-auth"