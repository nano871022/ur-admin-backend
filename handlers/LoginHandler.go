package handlers

import (
    "net/http"
    "strings"
    "log"
    "ur-admin-backend/services"
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
    user := r.FormValue("user")
    uidUser := r.FormValue("uid")

    token, error := services.CreateToken(user, uidUser)

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
