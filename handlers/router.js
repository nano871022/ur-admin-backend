const express = require('express');
const cors = require('cors');
const { loginHandler, createLoginHandler } = require('./loginHandler');
const { fcmHandler } = require('./fcmHandler');
const { healthHandler } = require('./healthHandler');
const { firebaseDataHandler } = require('./firebaseDatabaseHandler');

function newRouter() {
  const router = express.Router();

  router.use(cors());
  router.use(express.json());

  router.get('/', (req, res) => {
    res.json({ code: 200, detail: "Welcome" });
  });

  router.post('/api/login/validate', loginHandler);
  router.post('/api/login/create', createLoginHandler);
  router.post('/api/send-fcm', fcmHandler);
  router.get('/api/health', healthHandler);
  router.get('/api/firebase-data/:tokenName', firebaseDataHandler);

  return router;
}

module.exports = { newRouter };
