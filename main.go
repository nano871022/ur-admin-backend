package main

import (
    "log"
    "net/http"
    "ur-admin-backend/handlers"
    "ur-admin-backend/utils"
)

func main() {
    handler := handlers.NewRouter()
    
    value, err := utils.LoadEnv("PORT")
    if err != nil {
        log.Println("Servidor iniciado en :8080")
        log.Fatal(http.ListenAndServe(":8080", handler))    
    } else {
        log.Println("Servidor iniciado en :" + value)
        log.Fatal(http.ListenAndServe(":" + value, handler))
    }
}
