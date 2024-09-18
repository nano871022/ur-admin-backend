package models

type FCMMessage struct {
    Title   string `json:"title"`
    Body    string `json:"body"`
    Token   string `json:"token"`
}