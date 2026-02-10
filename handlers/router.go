package handlers

import (
    "net/http"
    "github.com/rs/cors"
)

func NewRouter() http.Handler {
    mux := http.NewServeMux()

    mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
      w.Header().Add("Content-Type", "application/json")
      w.Header().Add("Access-Control-Allow-Origin", "*")
      w.Header().Add("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
      w.Header().Add("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, Access-Control-Allow-Origin")
      w.Write([]byte("{\"code\":200,\"detail\":\"Welcome\"}"))
    })
    mux.HandleFunc("/api/login/validate", LoginHandler)
    mux.HandleFunc("/api/login/create", CreateLoginHandler)
    mux.HandleFunc("/api/send-fcm", FCMHandler)
    mux.HandleFunc("/api/health", HealthHandler)
    mux.HandleFunc("/api/firebase-data/", FirebaseDataHandler)

    c := cors.AllowAll()
    return c.Handler(mux)
}
