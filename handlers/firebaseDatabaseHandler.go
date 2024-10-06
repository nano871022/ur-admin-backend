package handlers

import (
    "net/http"
    "ur-admin-backend/services"
    "log"
)

func FirebaseDataHandler(w http.ResponseWriter, r *http.Request) {
    if err := CheckLogin(r); err != nil {
        http.Error(w, err.Error(), http.StatusUnauthorized)   
        return
    }

    tokenName := r.URL.Path[len("/api/firebase-data/"):]

    log.Printf("=== FirebaseDataHandler: tokenName: %s", tokenName)

    data, err := services.GetFirebaseData(tokenName)
    if err != nil {
        http.Error(w, "{\"code\":\"500\",\"error\":\""+err.Error()+"\"}", http.StatusInternalServerError)
        return
    }

    response := "{\"code\":200,\"value\":\""+data+"\"}"

    w.WriteHeader(http.StatusOK)
    w.Write([]byte(response))
}