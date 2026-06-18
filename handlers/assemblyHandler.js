const { getAttendeesMetrics, getAllSurveys } = require('../services/assemblySvc');
const { checkLogin } = require('./loginHandler');

/**
 * Handler for GET /api/assembly/attendees
 */
async function getAttendeesHandler(req, res) {
  try {
    await checkLogin(req);

    console.log('=== getAttendeesHandler: Fetching attendance metrics');
    const metrics = await getAttendeesMetrics();

    res.status(200).json(metrics);
  } catch (error) {
    if (error.message.includes('Authorization') || error.message.includes('Token') || error.message.includes('Application')) {
      return res.status(401).send(error.message);
    }
    console.error('Assembly Attendees Error:', error);
    res.status(500).json({ code: "500", error: error.message });
  }
}

/**
 * Handler for GET /api/assembly/all
 * Lists all current and past surveys.
 */
async function getAllSurveysHandler(req, res) {
  try {
    await checkLogin(req);

    console.log('=== getAllSurveysHandler');
    const surveys = await getAllSurveys();

    res.status(200).json(surveys);
  } catch (error) {
    if (error.message.includes('Authorization') || error.message.includes('Token') || error.message.includes('Application')) {
      return res.status(401).send(error.message);
    }
    console.error('getAllSurveysHandler Error:', error);
    res.status(500).json({ code: "500", error: error.message });
  }
}

module.exports = { getAttendeesHandler, getAllSurveysHandler };
