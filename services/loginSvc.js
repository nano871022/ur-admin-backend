const jwt = require('jsonwebtoken');
const { loadEnv } = require('../utils/loadEnv');
const { Cache } = require('../models/cache');
const { validateUser } = require('./realtimeDataSvc');

const cacheLogin = new Cache();

async function verifyToken(tokenString) {
  console.log("=== VerifyToken Start");
  try {
    const secret = loadEnv('APP_SECRET');
    const decoded = jwt.verify(tokenString, secret);
    return !!decoded;
  } catch (err) {
    return false;
  }
}

async function createToken(email, uidUser) {
  console.log("=== CreateToken Start");
  const isValid = await validateUser(email, uidUser);
  if (!isValid) {
    return "";
  }

  const cachedToken = cacheLogin.get(uidUser);
  if (cachedToken) {
    const isValidCache = await verifyToken(cachedToken);
    if (isValidCache) {
      console.log("=== Token from cache");
      return cachedToken;
    }
  }

  return await generateAndCacheToken(uidUser);
}

async function generateAndCacheToken(userId) {
  const secret = loadEnv('APP_SECRET');

  let lifeTimeMinutes = 10;
  try {
    lifeTimeMinutes = parseInt(loadEnv('CACHE_TIME_TOKEN_LIFE'));
  } catch (e) {}

  const payload = {
    user_id: userId,
    role: "user"
  };

  const token = jwt.sign(payload, secret, { expiresIn: `${lifeTimeMinutes}m` });

  let refreshTimeMinutes = 10;
  try {
    refreshTimeMinutes = parseInt(loadEnv('CACHE_TIME_TOKEN_REFRESH'));
  } catch (e) {}

  cacheLogin.set(userId, token, refreshTimeMinutes * 60 * 1000);

  return token;
}

module.exports = { verifyToken, createToken };
