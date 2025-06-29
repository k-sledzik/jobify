.PHONY: docs dev build

OUTPUT_DIR=../bin
DOCS_DIR=./
SWAGGER_OUTPUT_TYPES=json

ifndef API_INSTANCE_NAME
$(error API_INSTANCE_NAME is not set. Please define it in your service Makefile)
endif

docs:
	@echo "Generating API documentation..."
	swag init --output $(DOCS_DIR) --outputTypes $(SWAGGER_OUTPUT_TYPES) --instanceName $(API_INSTANCE_NAME) --parseDependency --parseInternal
	@echo "API documentation generated in $(DOCS_DIR)"