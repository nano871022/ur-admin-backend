const admin = require('firebase-admin');

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

module.exports = { getAttendeesMetrics };
