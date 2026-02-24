const express = require('express');
const { newRouter } = require('./handlers/router');
const { loadEnv } = require('./utils/loadEnv');

const app = express();
app.use(newRouter());

let port = 8080;
try {
  port = loadEnv('PORT');
} catch (e) {
}

app.listen(port, () => {
  console.log(`Servidor iniciado en :${port}`);
});
