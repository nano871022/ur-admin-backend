const admin = require('firebase-admin');

/**
 * Fetches all surveys from Firestore and maps them to the Survey interface.
 * @returns {Promise<Array>} Array of surveys.
 */
async function getAllSurveys() {
  const db = admin.firestore();
  const surveysSnapshot = await db.collection('surveys').get();

  const surveys = [];
  surveysSnapshot.forEach(doc => {
    const data = doc.data();

    // Map Firestore data to Survey interface
    const survey = {
      id: doc.id,
      question: data.question || '',
      status: data.status || 'CLOSED',
      createdAt: data.createDate && typeof data.createDate.toDate === 'function'
        ? data.createDate.toDate().toISOString()
        : (data.createDate || null),
      options: data.options ? data.options.map(opt => ({
        text: opt.text || opt.value || '',
        votesCount: opt.votesCount !== undefined ? opt.votesCount : (opt.votes !== undefined ? opt.votes : 0),
        coefficientVotes: opt.coefficientVotes || 0
      })) : []
    };

    // Include summary fields if they exist
    if (data.mostVotedOption) survey.mostVotedOption = data.mostVotedOption;
    if (data.mostVotedVotes !== undefined) survey.mostVotedVotes = data.mostVotedVotes;
    if (data.mostVotedCoefficient !== undefined) survey.mostVotedCoefficient = data.mostVotedCoefficient;

    surveys.push(survey);
  });

  return surveys;
}

/**
 * Creates a new survey in Firestore.
 * @param {string} question The survey question.
 * @param {Array} options The survey options.
 * @returns {Promise<Object>} The created survey metadata.
 */
async function createSurvey(question, options) {
  const db = admin.firestore();

  const newSurveyData = {
    question: question,
    status: 'OPEN',
    createDate: admin.firestore.FieldValue.serverTimestamp(),
    timeUsed: "0",
    options: options.map(opt => ({
      value: opt.value || '',
      votes: opt.votes !== undefined ? opt.votes : 0
    }))
  };

  const docRef = await db.collection('surveys').add(newSurveyData);

  return {
    id: docRef.id,
    question: newSurveyData.question,
    status: newSurveyData.status,
    createdAt: new Date().toISOString(),
    options: newSurveyData.options.map(opt => ({
      text: opt.value,
      votesCount: opt.votes,
      coefficientVotes: 0
    }))
  };
}

module.exports = { getAllSurveys, createSurvey };
