const express = require('express');
const cors = require('cors');
const { loginHandler, createLoginHandler } = require('./loginHandler');
const { fcmHandler } = require('./fcmHandler');
const { healthHandler } = require('./healthHandler');
const { firebaseDataHandler } = require('./firebaseDatabaseHandler');
const { activeUserStatsHandler } = require('./bigqueryHandler');
const {
  getAttendeesHandler,
  getAllSurveysHandler,
  getCoefficientHandler
} = require('./assemblyHandler');
const { getAllSurveysHandler } = require('./assemblyHandler');

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
  router.get('/api/stats/active-users', activeUserStatsHandler);
  router.get('/api/assembly/all', getAllSurveysHandler);

  // Assembly endpoints
  router.get('/api/assembly/all', getAllSurveysHandler);
  router.get('/api/assembly/attendees', getAttendeesHandler);
  router.get('/api/assembly/coefficient', getCoefficientHandler);

  return router;
}

module.exports = { newRouter };
