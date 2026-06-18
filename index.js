const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const { newRouter } = require('./handlers/router');

admin.initializeApp();

const app = express();
app.use(newRouter());

exports.Handler = functions.https.onRequest(app);
