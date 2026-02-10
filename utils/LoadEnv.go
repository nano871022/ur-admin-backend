package utils

import (
	"github.com/joho/godotenv"	
	"fmt"
	"os"
)

func LoadEnv(key string) (string, error){
	_ = godotenv.Load()
	value := os.Getenv(key)
	if(len(value) == 0){
		return "", fmt.Errorf("%s variable not found", key)
	}
	return value, nil
}
