package handlers

import (
    "net/http"
    "encoding/json"
    "ur-admin-backend/models"
    "ur-admin-backend/services"
)

func FCMHandler(w http.ResponseWriter, r *http.Request){
    var msg models.FCMMessage
    if err := json.NewDecoder(r.Body).Decode(&msg); err != nil {
        http.Error(w, "Bad request", http.StatusBadRequest)
        return
    }

    response, err := services.SendFCMMessage(msg)
    if err != nil {
        http.Error(w, "Error enviando mensaje", http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusOK)
    w.Write([]byte("Mensaje enviado con éxito: " + response))
}