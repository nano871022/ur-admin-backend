package models

import (
  "github.com/golang-jwt/jwt"   
)

type Token struct {
    jwt.StandardClaims
    UserID string `json:"user_id"`
    Role   string `json:"role"`
}