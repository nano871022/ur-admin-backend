const { Cache } = require('../models/cache');
const { loadEnv } = require('../utils/loadEnv');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const cacheRealtime = new Cache();

let app;

function getApp() {
  if (!app) {
    const credentialsPath = loadEnv('credentials');
    const databaseURL = loadEnv('urldbfirebase');

    let serviceAccount;
    // Resolve path from root
    const absolutePath = path.isAbsolute(credentialsPath)
      ? credentialsPath
      : path.join(process.cwd(), credentialsPath);

    if (fs.existsSync(absolutePath)) {
        serviceAccount = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
    } else {
        console.warn(`Credentials file not found at ${absolutePath}, attempting to initialize with default credentials.`);
    }

    const config = {
      databaseURL: databaseURL
    };
    if (serviceAccount) {
        config.credential = admin.credential.cert(serviceAccount);
    }

    app = admin.initializeApp(config);
  }
  return app;
}

async function getFirebaseData(tokenName) {
  console.log("=== GetFirebaseData Start ", tokenName);

  const cached = cacheRealtime.get(tokenName);
  if (cached) {
    console.log("=== GetFirebaseData Cache ", tokenName);
    return cached;
  }

  const db = getApp().database();
  const ref = db.ref("/" + tokenName);
  const snapshot = await ref.once('value');
  const data = snapshot.val();

  if (data) {
    let cacheTime = 1; // Default
    try {
      cacheTime = parseInt(loadEnv('CACHE_TIME_DATA'));
    } catch (e) {}

    cacheRealtime.set(tokenName, data, cacheTime * 60 * 60 * 1000); // Hours to ms
    return data;
  }

  throw new Error(`Not found token ${tokenName}`);
}

async function validateUser(email, uidUser) {
  const key = `${email}-${uidUser}`;
  const cached = cacheRealtime.get(key);
  if (cached !== null) {
    console.log("=== ValidateUser Cache ", key);
    return cached;
  }

  const db = getApp().database();
  const ref = db.ref("/users");

  // Use Firebase queries for efficiency
  const snapshot = await ref.orderByChild('email').equalTo(email).once('value');
  const data = snapshot.val();

  if (data) {
    const users = Object.values(data);
    for (const element of users) {
      if (element && element.email === email && element.uidUser === uidUser) {
        let cacheTime = 1;
        try {
          cacheTime = parseInt(loadEnv('CACHE_TIME_USER'));
        } catch (e) {}
        cacheRealtime.set(key, true, cacheTime * 60 * 60 * 1000);
        return true;
      }
    }
  }

  let cacheTimeFalse = 1;
  try {
    cacheTimeFalse = parseInt(loadEnv('CACHE_TIME_USER_FALSE'));
  } catch (e) {}
  cacheRealtime.set(key, false, cacheTimeFalse * 60 * 60 * 1000);
  return false;
}

module.exports = { getFirebaseData, validateUser, getApp };
