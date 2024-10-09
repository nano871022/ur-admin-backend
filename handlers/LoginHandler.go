package handlers

import (
    "net/http"
    "strings"
    "encoding/json"
    "log"
    "ur-admin-backend/services"
    "ur-admin-backend/models"
    "fmt"
)

func LoginHandler(w http.ResponseWriter, r *http.Request) {
    if error := CheckLogin(r); error != nil {
        http.Error(w, error.Error(), http.StatusUnauthorized)    
        return
    }
    // Si el token es válido, enviar una respuesta exitosa
    w.WriteHeader(http.StatusOK)
    w.Write([]byte("Token is valid" ))
}

func CheckLogin(request *http.Request) (error){
    authHeader := request.Header.Get("Authorization")
    if authHeader == "" {
        return fmt.Errorf("Authorization token is missing - Bearer required")
    }

    tokenString := strings.TrimPrefix(authHeader, "Bearer ")

    _, err := services.VerifyToken(tokenString)
    if err != nil {
        
        return fmt.Errorf("Invalid Token")
    }

    application := request.Header.Get("Application")
    if application == "" {
        return fmt.Errorf("Authorization - Application required")
    }

    if( application != "ur-admin-site"){
        return fmt.Errorf("Invalid Application")
    }
    return nil
}

func CreateLoginHandler(w http.ResponseWriter, r *http.Request) {
    log.Println("== CreateLoginHandler")
    if r.Method == http.MethodOptions {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
        w.WriteHeader(http.StatusNoContent) // 204 No Content para OPTIONS
        return
    }

    EnableCors(&w)

    var msg models.Login
    if err := json.NewDecoder(r.Body).Decode(&msg); err != nil {
        http.Error(w, "Bad request", http.StatusBadRequest)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
    

    token, error := services.CreateToken(msg.Email, msg.Uid)


    if( error != nil){
        log.Println("Response with error: ", error)
        w.WriteHeader(http.StatusInternalServerError)
        http.Error(w, "{\"code\":\"500\",\"error:\":\""+error.Error()+"\"}", http.StatusInternalServerError)   
        return
    }
    if len(token) == 0{
        w.WriteHeader(http.StatusUnauthorized)
        w.Write([]byte("{\"code\":\"401\",\"description\":\"unAuthorization\"} " ))
    }else{
        // Si el token es válido, enviar una respuesta exitosa
        w.WriteHeader(http.StatusOK)
        w.Write([]byte("{\"token\":\""+token+"\"} " ))
    }
}
