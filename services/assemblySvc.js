const admin = require('firebase-admin');

/**
 * Maps a Firestore survey document to the Survey interface.
 * @param {Object} doc Firestore DocumentSnapshot.
 * @returns {Object} Mapped survey object.
 */
function mapSurveyDoc(doc) {
  const data = doc.data();
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

  return survey;
}

/**
 * Retrieves assembly attendance metrics from Firestore.
 * Queries the 'assemblies' collection for an active assembly.
 * @returns {Promise<{attendanceCount: number, totalUnits: number}>}
 */
async function getAttendeesMetrics() {
  const db = admin.firestore();
  const assembliesRef = db.collection('assemblies');

  // Query for the active assembly
  const activeAssemblies = await assembliesRef.where('status', '==', 'ACTIVE').limit(1).get();

  if (activeAssemblies.empty) {
    console.log('No active assembly found in Firestore');
    return {
      attendanceCount: 0,
      totalUnits: 0
    };
  }

  const assemblyDoc = activeAssemblies.docs[0];
  const data = assemblyDoc.data();

  return {
    attendanceCount: data.attendanceCount || 0,
    totalUnits: data.totalUnits || 0
  };
}

/**
 * Fetches all surveys from Firestore and maps them to the Survey interface.
 * @returns {Promise<Array>} Array of surveys.
 */
async function getAllSurveys() {
  const db = admin.firestore();
  const surveysSnapshot = await db.collection('surveys').get();

  const surveys = [];
  surveysSnapshot.forEach(doc => {
    surveys.push(mapSurveyDoc(doc));
  });

  return surveys;
}

/**
 * Fetches a single survey from Firestore by ID.
 * @param {string} id The survey ID.
 * @returns {Promise<Object|null>} The survey object or null if not found.
 */
async function getSurveyById(id) {
  const db = admin.firestore();
  const doc = await db.collection('surveys').doc(id).get();

  if (!doc.exists) {
    return null;
  }

  return mapSurveyDoc(doc);
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

/*
 * Retrieves real-time quorum and coefficient metrics.
 */
async function getCoefficientData() {
  const db = admin.firestore();

  // Query attendees who are present
  const attendeesSnapshot = await db.collection('attendees').where('present', '==', true).get();

  let coefficientSum = 0;
  attendeesSnapshot.forEach(doc => {
    const data = doc.data();
    if (data.coefficient) {
      coefficientSum += data.coefficient;
    }
  });

  // Round to 2 decimal places
  const coefficientPercentage = Math.round(coefficientSum * 100) / 100;

  // Fetch minRequiredPercentage from assemblies collection
  // Assuming there is a 'current' assembly document or similar.
  // If not found, default to 50.0 as per objective example.
  let minRequiredPercentage = 50.0;
  try {
    const assemblyDoc = await db.collection('assemblies').doc('active').get();
    if (assemblyDoc.exists) {
      const assemblyData = assemblyDoc.data();
      if (assemblyData.minRequiredPercentage !== undefined) {
        minRequiredPercentage = assemblyData.minRequiredPercentage;
      }
    }
  } catch (error) {
    console.error('Error fetching assembly config:', error);
  }

  return {
    coefficientPercentage: coefficientPercentage,
    quorumPercentage: coefficientPercentage,
    minRequiredPercentage: minRequiredPercentage
  };
}

/**
 * Restarts a survey by resetting its status and clearing all votes and statistics.
 * @param {string} id The survey ID.
 * @returns {Promise<Object|null>} The updated survey object or null if not found.
 */
async function restartSurvey(id) {
  const db = admin.firestore();
  const docRef = db.collection('surveys').doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    return null;
  }

  const data = doc.data();
  const resetOptions = (data.options || []).map(opt => {
    const newOpt = { ...opt };
    if (newOpt.votes !== undefined) newOpt.votes = 0;
    if (newOpt.votesCount !== undefined) newOpt.votesCount = 0;
    newOpt.coefficientVotes = 0;
    return newOpt;
  });

  const updateData = {
    status: 'OPEN',
    options: resetOptions,
    mostVotedOption: admin.firestore.FieldValue.delete(),
    mostVotedVotes: admin.firestore.FieldValue.delete(),
    mostVotedCoefficient: admin.firestore.FieldValue.delete()
  };

  await docRef.update(updateData);

  const updatedDoc = await docRef.get();
  return mapSurveyDoc(updatedDoc);
}

module.exports = {
  getAttendeesMetrics,
  getAllSurveys,
  getSurveyById,
  getCoefficientData,
  createSurvey,
  restartSurvey
};
