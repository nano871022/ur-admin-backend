package services

import (
    "context"
    "firebase.google.com/go/v4"
    "google.golang.org/api/option"
    "log"
    "ur-admin-backend/utils"
    "fmt"
)

func GetFirebaseData(tokenName string) (string, error) {
    log.Println("=== GetFirebaseData Start ",tokenName)
   path, error := utils.LoadEnv("credentials")
   if error != nil {
      return "", error
   }
   opt := option.WithCredentialsFile(path)

   url, error := utils.LoadEnv("urldbfirebase")
   if error != nil {
        return "", error   
   }

   app, err := firebase.NewApp(context.Background(), &firebase.Config{
     DatabaseURL: url,
   }, opt)
   if err != nil {
      log.Fatalf("init Firebase App: %v\n", err)
   }

    client, err := app.Database(context.Background())
        if err != nil {
                log.Fatalf("getting database client: %v\n", err)
        }   
    ref := client.NewRef("/"+tokenName)
    var data string
    if err := ref.Get(context.Background(), &data); err != nil {
        log.Printf("getting data: /{{"+tokenName+"}} %v\n", err)
        return "", err
    }

    if len(data) > 0  {
        return data, nil
    }
    
    return "", fmt.Errorf("Not found token %s", tokenName) 
}

func ValidateUser(email string, uuidUser string) (bool, error){
   path, error := utils.LoadEnv("credentials")
   if error != nil {
      return false, error
   }
   opt := option.WithCredentialsFile(path)

   url, error := utils.LoadEnv("urldbfirebase")
   if error != nil {
        return false, error   
   }
   app, err := firebase.NewApp(context.Background(), &firebase.Config{
     DatabaseURL: url,
   }, opt)
   if err != nil {
      log.Fatalf("Error inicializando Firebase App: %v\n", err)
   }

    client, err := app.Database(context.Background())
        if err != nil {
                log.Fatalf("error getting database client: %v\n", err)
        }   
    ref := client.NewRef("/users")
    var data []interface{}
    if err := ref.Get(context.Background(), &data); err != nil {
        log.Printf("error getting data: %v\n", err)
        return false, err
    }
    for _, element := range data {
        email := element.(map[string]interface {})["email"]
        uidUser := element.(map[string]interface {})["uidUser"]
        log.Println("email: ",email,"\nuidUser: ",uidUser)
        if email == email && uidUser == uuidUser {
            return true, nil
        }
    }
    return false , nil
}



