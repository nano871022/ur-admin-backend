package services

import (
    //"context"
    //"firebase.google.com/go/v4/auth"
    "log"
    //"google.golang.org/api/option"
    "ur-admin-backend/models"
    "github.com/golang-jwt/jwt"
    "time"
    "fmt"
    "ur-admin-backend/utils"
)

func VerifyToken(tokenString string) (bool, error) {
    log.Println("=== VerifyToken Start")
    secret, err := utils.LoadEnv("secret")
    if err != nil {
        return false, err
    }
    token, err := jwt.ParseWithClaims(tokenString, &models.Token{}, func(token *jwt.Token) (interface{}, error) {
        return []byte(secret), nil
    })
    if err != nil {
        return false, err
    }

    if _, ok := token.Claims.(*models.Token); ok && token.Valid {
        return true, nil
    }

    return false , fmt.Errorf("Invalid token")
}

func CreateToken(email string, uidUser string) (string, error) {
    log.Println("=== CreateToken Start")
    isValid, error := ValidateUser(email, uidUser)

    if error != nil  {
        return "", error
    }
    if(isValid == true) {
        return createToken(uidUser)
    }
    return "", nil
}

func createToken(userId string) (string, error){
    secret, error := utils.LoadEnv("secret")
    if error != nil {
        return "", error   
    }
    claims := models.Token {
        StandardClaims: jwt.StandardClaims{
         ExpiresAt: time.Now().Add(time.Minute * 5).Unix(),   
        },
        UserID: userId,
        Role: "user",
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    ss, err := token.SignedString([]byte(secret))
    if err != nil {
        return "", err
    }
    return ss, nil
}
