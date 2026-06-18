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

module.exports = { getAllSurveys };
