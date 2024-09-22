package main

import (
    "log"
    "net/http"
    "ur-admin-backend/handlers"
)

func main() {
    http.HandleFunc("/login/validate", handlers.LoginHandler)
    http.HandleFunc("/login/create", handlers.CreateLoginHandler)
    http.HandleFunc("/send-fcm", handlers.FCMHandler)
    http.HandleFunc("/health", handlers.HealthHandler)
    http.HandleFunc("/firebase-data/", handlers.FirebaseDataHandler)

    log.Println("Servidor iniciado en :8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}
