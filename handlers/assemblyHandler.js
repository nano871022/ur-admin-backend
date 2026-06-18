const { getCoefficientData } = require('../services/assemblySvc');
const { checkLogin } = require('./loginHandler');

async function getCoefficient(req, res) {
  try {
    await checkLogin(req);

    const data = await getCoefficientData();

    res.status(200).json(data);
  } catch (error) {
    if (error.message.includes('Authorization') || error.message.includes('Token') || error.message.includes('Application')) {
      return res.status(401).send(error.message);
    }
    console.error('GetCoefficient Error:', error);
    res.status(500).json({ code: "500", error: error.message });
  }
}

module.exports = { getCoefficient };
