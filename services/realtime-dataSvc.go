package services

import (
    "context"
    "firebase.google.com/go/v4"
    "google.golang.org/api/option"
    "log"
    "ur-admin-backend/utils"
    "fmt"
    "ur-admin-backend/models"
    "time"
    "strconv"
)

var cacheRealtime *models.Cache = models.NewCache()

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

   if value, ok := cacheRealtime.Get(tokenName); ok {
    log.Println("=== GetFirebaseData Cache ",tokenName)
     return value.(string), nil   
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
        return "", err
    }

    if len(data) > 0  {
        cacheValue, err := utils.LoadEnv("CACHE_TIME_DATA")
        if(err == nil){
            cacheTime, error := strconv.Atoi(cacheValue)
            if error == nil {
                cacheRealtime.Set(tokenName, data, time.Hour*time.Duration(cacheTime))
            }
        }
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

   key := fmt.Sprintf("%s-%s",email,uuidUser)

    if value, ok := cacheRealtime.Get(key); ok {
    log.Println("=== ValidateUser Cache ",key)
     return value.(bool) , nil   
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
        if email == email && uidUser == uuidUser {
            cacheValue, err := utils.LoadEnv("CACHE_TIME_USER")
            if(err == nil){
                cacheTime, error := strconv.Atoi(cacheValue)
                if error == nil {
                    cacheRealtime.Set(key, true, time.Hour*time.Duration(cacheTime))
                }
            }
            return true, nil
        }
    }
    cacheValue,err := utils.LoadEnv("CACHE_TIME_USER_FALSE")
    if(err == nil){
        cacheTime, error := strconv.Atoi(cacheValue)
        if error == nil {
            cacheRealtime.Set(key, false, time.Hour*time.Duration(cacheTime))
        }
    }
    return false , nil
}



