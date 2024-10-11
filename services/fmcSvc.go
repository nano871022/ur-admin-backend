package services

import (
   "context"
   "firebase.google.com/go/v4"
   "firebase.google.com/go/v4/messaging"
   "log"
   "google.golang.org/api/option"
   "ur-admin-backend/models"
   "ur-admin-backend/utils"
   
)


func SendFCMMessage(msg models.FCMMessage)(string,error){
   log.Printf("=== SendFCMMessage Start")
   
   
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
   
   topic, error := utils.LoadEnv("TOPIC")
   if error != nil {
        topic = "allUsers"
   }

   // Definir el mensaje a enviar
   message := &messaging.Message{
      Notification: &messaging.Notification{
         Title: msg.Notification.Title,
         Body:  msg.Notification.Body,
      },
      Data: map[string]string{
         "Title": msg.Notification.Title,
         "Body":  msg.Notification.Body,
      },
      Topic: topic, // Reemplazar con el token del dispositivo al que se enviará la notificación
   }
   log.Printf("send message")
   // Enviar la notificación
   response, err := client.Send(context.Background(), message)
   if err != nil {
      log.Fatalf("Error enviando el mensaje FCM: %v\n", err)
   }
   log.Printf("=== SendFCMMessage End")
   // Mostrar la respuesta
   
   return "Mensaje enviado: "+response, nil
}
