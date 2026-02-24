const { getFirebaseData } = require('../services/realtimeDataSvc');
const { checkLogin } = require('./loginHandler');

async function firebaseDataHandler(req, res) {
  try {
    await checkLogin(req);

    const tokenName = req.params.tokenName;

    console.log(`=== FirebaseDataHandler: tokenName: ${tokenName}`);

    const data = await getFirebaseData(tokenName);

    res.status(200).json({ code: 200, value: data });
  } catch (error) {
    if (error.message.includes('Authorization') || error.message.includes('Token') || error.message.includes('Application')) {
      return res.status(401).send(error.message);
    }
    console.error('Firebase Data Error:', error);
    res.status(500).json({ code: "500", error: error.message });
  }
}

module.exports = { firebaseDataHandler };
