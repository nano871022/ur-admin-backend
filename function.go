package main

import (
	"net/http"
	"ur-admin-backend/handlers"
)

// Handler is the entry point for the Cloud Function
func Handler(w http.ResponseWriter, r *http.Request) {
	handlers.NewRouter().ServeHTTP(w, r)
}
