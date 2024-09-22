package utils

import (
	"github.com/joho/godotenv"	
	"log"
	"fmt"
	"os"
)

func LoadEnv(key string) (string, error){
	err := godotenv.Load()
	if err != nil {
		log.Printf("Error loading .env file")
		return "", fmt.Errorf("Error with variables to load")
	}
	value := os.Getenv(key)
	if(len(value) == 0){
		return "", fmt.Errorf(key," Variable not found")
	}
	return value, nil
}