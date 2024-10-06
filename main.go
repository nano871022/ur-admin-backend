package main

import (
    "log"
    "net/http"
    "ur-admin-backend/handlers"
    "github.com/rs/cors"
)

func main() {
    r := http.NewServeMux()

    r.HandleFunc("/",func(w http.ResponseWriter, r *http.Request) {
      w.Header().Add("Content-Type","application/json")  
      w.Header().Add("Access-Control-Allow-Origin","*")
      w.Header().Add("Access-Control-Allow-Methods","POST, GET, OPTIONS, PUT, DELETE")
      w.Header().Add("Access-Control-Allow-Headers","Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, Access-Control-Allow-Origin")
      w.Write([]byte("{\"code\":200,\"detail\":\"Welcome\"}"))
    })
    r.HandleFunc("/api/login/validate", handlers.LoginHandler)
    r.HandleFunc("/api/login/create", handlers.CreateLoginHandler)
    r.HandleFunc("/api/send-fcm", handlers.FCMHandler)
    r.HandleFunc("/api/health", handlers.HealthHandler)
    r.HandleFunc("/api/firebase-data/", handlers.FirebaseDataHandler)
    
    c := cors.AllowAll()

    handler := c.Handler(r)

    log.Println("Servidor iniciado en :8080")
    log.Fatal(http.ListenAndServe(":8080", handler))
}

