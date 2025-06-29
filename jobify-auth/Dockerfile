FROM golang:1.24.4-alpine AS builder
ARG SERVICE_NAME
RUN apk add --no-cache make
WORKDIR /app/$SERVICE_NAME
COPY ./Makefile ../Makefile
COPY ./$SERVICE_NAME/go.mod ./$SERVICE_NAME/go.sum ./
RUN go mod download
COPY ./$SERVICE_NAME .
RUN go install github.com/swaggo/swag/cmd/swag@latest
RUN make docs
RUN go build -o $SERVICE_NAME main.go

FROM alpine:latest
ARG SERVICE_NAME
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/$SERVICE_NAME/$SERVICE_NAME /app/$SERVICE_NAME/*.json ./
CMD ["sh", "-c", "./$SERVICE_NAME"]