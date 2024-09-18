package handlers

import (
    "net/http"
    "encoding/json"
    "ur-admin-backend/services"
)

func FirebaseDataHandler(w http.ResponseWriter, r *http.Request) {
    data, err := services.GetFirebaseData()
    if err != nil {
        http.Error(w, "Error obteniendo datos de Firebase", http.StatusInternalServerError)
        return
    }

    json.NewEncoder(w).Encode(data)
}