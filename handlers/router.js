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
  getVotesHandler,
  getCoefficientHandler,
  createSurveyHandler,
  restartSurveyHandler,
  closeVotesHandler
} = require('./assemblyHandler');


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
  
  // Assembly endpoints
  router.put('/api/assembly/create', createSurveyHandler);
  router.get('/api/assembly/all', getAllSurveysHandler);
  router.get('/api/assembly/votes', getVotesHandler);
  router.get('/api/assembly/attendees', getAttendeesHandler);
  router.get('/api/assembly/coefficient', getCoefficientHandler);
  router.post('/api/assembly/restart', restartSurveyHandler);
  router.post('/api/assembly/close', closeVotesHandler);

  return router;
}

module.exports = { newRouter };
