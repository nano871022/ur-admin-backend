package main

import (
   "context"
   "firebase.google.com/go/v4"
   "firebase.google.com/go/v4/messaging"
   "fmt"
   "log"
   //"os"
   "google.golang.org/api/option"
)

func main() {
   // Cargar las credenciales de Firebase desde el archivo JSON
   opt := option.WithCredentialsFile("./resources/credentials/credentials.json")

   // Inicializar la app de Firebase
   app, err := firebase.NewApp(context.Background(), nil, opt)
   if err != nil {
      log.Fatalf("Error inicializando Firebase App: %v\n", err)
   }

   // Obtener el cliente de FCM
   client, err := app.Messaging(context.Background())
   if err != nil {
      log.Fatalf("Error obteniendo cliente de FCM: %v\n", err)
   }

   // Definir el mensaje a enviar
   message := &messaging.Message{
      Notification: &messaging.Notification{
         Title: "Hola desde FCM",
         Body:  "Este es un mensaje de prueba",
      },
      Topic: "allUsers", // Reemplazar con el token del dispositivo al que se enviará la notificación
   }

   // Enviar la notificación
   response, err := client.Send(context.Background(), message)
   if err != nil {
      log.Fatalf("Error enviando el mensaje FCM: %v\n", err)
   }

   // Mostrar la respuesta
   fmt.Printf("Mensaje enviado: %s\n", response)
}
