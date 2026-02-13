const { createToken, verifyToken } = require('../services/loginSvc');

async function checkLogin(req) {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    throw new Error('Authorization token is missing - Bearer required');
  }

  const tokenString = authHeader.replace('Bearer ', '');
  const isValid = await verifyToken(tokenString);
  if (!isValid) {
    throw new Error('Invalid Token');
  }

  const application = req.get('Application');
  if (!application) {
    throw new Error('Authorization - Application required');
  }

  if (application !== 'ur-admin-site') {
    throw new Error('Invalid Application');
  }
}

async function loginHandler(req, res) {
  try {
    await checkLogin(req);
    res.status(200).send('Token is valid');
  } catch (error) {
    res.status(401).send(error.message);
  }
}

async function createLoginHandler(req, res) {
  console.log('== CreateLoginHandler');

  const { email, uid } = req.body;
  if (!email || !uid) {
    return res.status(400).send('Bad request');
  }

  try {
    const token = await createToken(email, uid);

    if (!token) {
      return res.status(401).json({ code: "401", description: "unAuthorization" });
    }

    res.status(200).json({ token: token });
  } catch (error) {
    console.error('Response with error: ', error);
    res.status(500).json({ code: "500", error: error.message });
  }
}

module.exports = { loginHandler, createLoginHandler, checkLogin };
