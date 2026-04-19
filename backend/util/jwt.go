package util

import (
	"os"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt"
)

type Claims struct {
	Id uint `json:"id"`
	jwt.StandardClaims
}

func GenerateJwt(userId uint) (string, error) {
	claims := jwt.StandardClaims{

		Issuer:    strconv.Itoa(int(userId)),
		ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("SECRET_KEY")))
}

func ParseJwt(cookie string) (string, error) {
	token, err := jwt.ParseWithClaims(cookie, &jwt.StandardClaims{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("SECRET_KEY")), nil
	})

	if err != nil || !token.Valid {
		return "", err
	}

	claims := token.Claims.(*jwt.StandardClaims)

	// برگرداندن Issuer که همان ID به صورت رشته است
	return claims.Issuer, nil
}