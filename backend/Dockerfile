FROM golang:1.25-alpine
RUN apk add --no-cache git
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod tidy
COPY . .
RUN go build -o server .
EXPOSE 8080
CMD ["./server"]