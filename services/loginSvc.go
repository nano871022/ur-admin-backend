package services

import (
    //"context"
    "firebase.google.com/go/v4/auth"
    "log"
    //"google.golang.org/api/option"
)

func VerifyToken(tokenString string) (*auth.Token, error) {
    log.Println("=== VerifyToken Start")
    /*
    opt := option.WithCredentialsFile("path_to_your_firebase_credentials.json")
    app, err := firebase.NewApp(context.Background(), nil, opt)
    if err != nil {
        log.Fatalf("Error inicializando la app de Firebase: %v", err)
    }

    client, err := app.Auth(context.Background())
    if err != nil {
        return nil, err
    }

    token, err := client.VerifyIDToken(context.Background(), tokenString)
    if err != nil {
        return nil, err
    }
    */
    return nil, nil // token, nil
}

func CreateToken(email string, uidUser string) (string, error) {
    log.Println("=== CreateToken Start")
    _, error := ValidateUser(email, uidUser)
    if error != nil {
        return "TOKEN-GENERATE-AND-SAVE-TO-CHECK-IT", nil
    }
    return "", error
}
