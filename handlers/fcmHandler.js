const { sendFCMMessage } = require('../services/fcmSvc');
const { checkLogin } = require('./loginHandler');

async function fcmHandler(req, res) {
  try {
    await checkLogin(req);

    const msg = req.body;
    if (!msg || !msg.notifications) {
      return res.status(400).send('Bad request');
    }

    const response = await sendFCMMessage(msg);
    if (!response.includes('enviado')) {
      return res.status(500).json({ code: 500, error: 'message not sent' });
    }

    res.status(200).json({ code: 200, description: response });
  } catch (error) {
    if (error.message.includes('Authorization') || error.message.includes('Token') || error.message.includes('Application')) {
      return res.status(401).send(error.message);
    }
    console.error('FCM Error:', error);
    res.status(500).json({ code: 500, error: 'Error enviando mensaje' });
  }
}

module.exports = { fcmHandler };
