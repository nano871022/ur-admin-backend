package services

import (
    "context"
    "firebase.google.com/go/v4"
    "google.golang.org/api/option"
    "log"
)

func GetFirebaseData() (map[string]interface{}, error) {
    log.Println("=== GetFirebaseData Start")
    /*
    app, err := initializeFirebaseApp()
    if err != nil {
        return nil, err
    }

    client, err := app.Database(context.Background())
    if err != nil {
        return nil, err
    }

    ref := client.NewRef("path/to/data")
    var data map[string]interface{}
    if err := ref.Get(context.Background(), &data); err != nil {
        return nil, err
    }
*/
    return nil, nil //data, nil
}

func ValidateUser(email string, uuidUser string) (bool, error){
   opt := option.WithCredentialsFile("./resources/credentials/credentials.json")

   app, err := firebase.NewApp(context.Background(), &firebase.Config{
     DatabaseURL: "https://torressansebastian-default-rtdb.firebaseio.com/",
   }, opt)
   if err != nil {
      log.Fatalf("Error inicializando Firebase App: %v\n", err)
   }

    client, err := app.Database(context.Background())
        if err != nil {
                log.Fatalf("error getting database client: %v\n", err)
        }   
    ref := client.NewRef("/users")
    var data map[string]interface{}
    if err := ref.Get(context.Background(), &data); err != nil {
        return false, err
    }
    log.Println(data)

    return false , nil
}



