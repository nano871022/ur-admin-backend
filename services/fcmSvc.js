const { getApp } = require('./realtimeDataSvc');
const { loadEnv } = require('../utils/loadEnv');

async function sendFCMMessage(msg) {
  console.log("=== SendFCMMessage Start");

  const messaging = getApp().messaging();

  let topic = "allUsers";
  try {
    topic = loadEnv('TOPIC');
  } catch (e) {}

  const message = {
    notification: {
      title: msg.notifications.title,
      body: msg.notifications.body,
    },
    data: {
      Title: msg.notifications.title,
      Body: msg.notifications.body,
    },
    topic: topic,
  };

  console.log("send message");
  try {
    const response = await messaging.send(message);
    console.log("=== SendFCMMessage End");
    return "Mensaje enviado: " + response;
  } catch (error) {
    console.error("Error enviando el mensaje FCM:", error);
    throw error;
  }
}

module.exports = { sendFCMMessage };
