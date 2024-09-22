package handlers

import (
    "net/http"
    "encoding/json"
    "ur-admin-backend/services"
    "log"
)

func FirebaseDataHandler(w http.ResponseWriter, r *http.Request) {
    if err := CheckLogin(r); err != nil {
        http.Error(w, err.Error(), http.StatusUnauthorized)   
        return
    }

    tokenName := r.URL.Path[len("/firebase-data/"):]

    log.Printf("=== FirebaseDataHandler: tokenName: %s", tokenName)

    data, err := services.GetFirebaseData(tokenName)
    if err != nil {
        http.Error(w, "{\"code\":\"500\",\"error\":\""+err.Error()+"\"}", http.StatusInternalServerError)
        return
    }

    json.NewEncoder(w).Encode(data)
}