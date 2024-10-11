package models

type FCMMessage struct {
   Notification BodyFCMMessage `json:"notifications"`
   To           string          `json:"to"`
}

type BodyFCMMessage struct {
    Title   string `json:"title"`
    Body    string `json:"body"`
    Token   string `json:"token"`
}