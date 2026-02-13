function healthHandler(req, res) {
  res.status(200).send('Aplicación funcionando correctamente');
}

module.exports = { healthHandler };
