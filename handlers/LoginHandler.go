package handlers

import (
    "net/http"
    "strings"
    "ur-admin-backend/services"
)

func LoginHandler(w http.ResponseWriter, r *http.Request) {
    authHeader := r.Header.Get("Authorization")
    if authHeader == "" {
        http.Error(w, "Falta el token de autorización", http.StatusUnauthorized)
        return
    }

    tokenString := strings.TrimPrefix(authHeader, "Bearer ")

    _, err := services.VerifyToken(tokenString)
    if err != nil {
        http.Error(w, "Token inválido", http.StatusUnauthorized)
        return
    }

    // Si el token es válido, enviar una respuesta exitosa
    w.WriteHeader(http.StatusOK)
    w.Write([]byte("Login exitoso " ))
}

func CreateLoginHandler(w http.ResponseWriter, r *http.Request) {
    user := r.FormValue("user")
    uidUser := r.FormValue("uid")

    token, error := services.CreateToken(user, uidUser)

    if( error != nil){
        http.Error(w, error.Error(), http.StatusUnauthorized)   
        return
    }

    // Si el token es válido, enviar una respuesta exitosa
    w.WriteHeader(http.StatusOK)
    w.Write([]byte("{\"token\":\""+token+"\"} " ))
}
