const { getAllSurveys, createSurvey } = require('../services/assemblySvc');
const { checkLogin } = require('./loginHandler');

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

/**
 * Handler for PUT /api/assembly/create
 * Initializes and persists a new survey question.
 */
async function createSurveyHandler(req, res) {
  try {
    await checkLogin(req);

    console.log('=== createSurveyHandler');
    const { question, options } = req.body;

    if (!question || !options || !Array.isArray(options)) {
      return res.status(400).json({ code: "400", error: "Missing required fields: question and options (array)" });
    }

    const newSurvey = await createSurvey(question, options);

    res.status(201).json(newSurvey);
  } catch (error) {
    if (error.message.includes('Authorization') || error.message.includes('Token') || error.message.includes('Application')) {
      return res.status(401).send(error.message);
    }
    console.error('createSurveyHandler Error:', error);
    res.status(500).json({ code: "500", error: error.message });
  }
}

module.exports = { getAllSurveysHandler, createSurveyHandler };
