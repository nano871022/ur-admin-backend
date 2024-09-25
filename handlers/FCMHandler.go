package handlers

import (
    "net/http"
    "encoding/json"
    "ur-admin-backend/models"
    "ur-admin-backend/services"
    "strings"
)

func FCMHandler(w http.ResponseWriter, r *http.Request){
    if err := CheckLogin(r); err != nil {
      http.Error(w, err.Error(), http.StatusUnauthorized)   
        return
    }
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
    if strings.Contains(response, "enviado") == false {
        w.WriteHeader(http.StatusInternalServerError)
        w.Write([]byte("{\"code\":500, \"error\":\"message not sent\"}"))
        return
    }
    w.WriteHeader(http.StatusOK)
    w.Write([]byte("{\"code\":200, \"description\":\""+ response+"\"}"))
}