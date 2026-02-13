const functions = require('firebase-functions');
const express = require('express');
const { newRouter } = require('./handlers/router');

const app = express();
app.use(newRouter());

exports.Handler = functions.https.onRequest(app);
