const assemblySvc = require('../services/assemblySvc');
const { checkLogin } = require('./loginHandler');

/**
 * Handler for GET /api/assembly/attendees
 */
async function getAttendeesHandler(req, res) {
  try {
    await checkLogin(req);

    console.log('=== getAttendeesHandler: Fetching attendance metrics');
    const metrics = await assemblySvc.getAttendeesMetrics();

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
    const surveys = await assemblySvc.getAllSurveys();

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
 * Handler for GET /api/assembly/votes?id={id}
 * Retrieves specific voting details for an isolated survey.
 */
async function getVotesHandler(req, res) {
  try {
    await checkLogin(req);

    const id = req.query.id;
    console.log(`=== getVotesHandler: Fetching votes for survey ID: ${id}`);

    if (!id) {
      return res.status(400).json({ code: "400", error: "Missing required query parameter: id" });
    }

    const survey = await assemblySvc.getSurveyById(id);

    if (!survey) {
      return res.status(404).json({ code: "404", error: "Survey not found" });
    }

    res.status(200).json(survey);
  } catch (error) {
    if (error.message.includes('Authorization') || error.message.includes('Token') || error.message.includes('Application')) {
      return res.status(401).send(error.message);
    }
    console.error('getVotesHandler Error:', error);
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

    const newSurvey = await assemblySvc.createSurvey(question, options);

    res.status(201).json(newSurvey);
  } catch (error) {
    if (error.message.includes('Authorization') || error.message.includes('Token') || error.message.includes('Application')) {
      return res.status(401).send(error.message);
    }
    console.error('createSurveyHandler Error:', error);
    res.status(500).json({ code: "500", error: error.message });
  }
}

/*
 * Handler for GET /api/assembly/coefficient
 */
async function getCoefficientHandler(req, res) {
  try {
    await checkLogin(req);

    console.log('=== getCoefficientHandler');
    const data = await assemblySvc.getCoefficientData();

    res.status(200).json(data);
  } catch (error) {
    if (error.message.includes('Authorization') || error.message.includes('Token') || error.message.includes('Application')) {
      return res.status(401).send(error.message);
    }
    console.error('GetCoefficient Error:', error);
    res.status(500).json({ code: "500", error: error.message });
  }
}

/**
 * Handler for POST /api/assembly/restart
 * Resets an existing survey back to an open status and wipes previous vote tabulations.
 */
async function restartSurveyHandler(req, res) {
  try {
    await checkLogin(req);

    const { id } = req.body;
    console.log(`=== restartSurveyHandler: Restarting survey ID: ${id}`);

    if (!id) {
      return res.status(400).json({ code: "400", error: "Missing required field: id" });
    }

    const updatedSurvey = await assemblySvc.restartSurvey(id);

    if (!updatedSurvey) {
      return res.status(404).json({ code: "404", error: "Survey not found" });
    }

    res.status(200).json({
      code: "200",
      message: "Survey restarted successfully",
      survey: updatedSurvey
    });
  } catch (error) {
    if (error.message.includes('Authorization') || error.message.includes('Token') || error.message.includes('Application')) {
      return res.status(401).send(error.message);
    }
    console.error('restartSurveyHandler Error:', error);
    res.status(500).json({ code: "500", error: error.message });
  }
}

/**
 * Handler for POST /api/assembly/close
 * Formally freezes voting inputs on a survey, calculate final metrics, and compile results.
 */
async function closeVotesHandler(req, res) {
  try {
    await checkLogin(req);

    const { id } = req.body;
    console.log(`=== closeVotesHandler: Closing survey ID: ${id}`);

    if (!id) {
      return res.status(400).json({ code: "400", error: "Missing required field: id" });
    }

    const closedSurvey = await assemblySvc.closeSurvey(id);

    if (!closedSurvey) {
      return res.status(404).json({ code: "404", error: "Survey not found" });
    }

    res.status(200).json(closedSurvey);
  } catch (error) {
    if (error.message.includes('Authorization') || error.message.includes('Token') || error.message.includes('Application')) {
      return res.status(401).send(error.message);
    }
    console.error('closeVotesHandler Error:', error);
    res.status(500).json({ code: "500", error: error.message });
  }
}

module.exports = {
  getAttendeesHandler,
  getAllSurveysHandler,
  getVotesHandler,
  getCoefficientHandler,
  createSurveyHandler,
  restartSurveyHandler,
  closeVotesHandler
};
