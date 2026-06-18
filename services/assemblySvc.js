const admin = require('firebase-admin');

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

module.exports = { getCoefficientData };
