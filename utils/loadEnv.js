const dotenv = require('dotenv');

// Load environment variables once at startup
dotenv.config();

/**
 * Loads environment variables and retrieves the value of the specified key.
 * @param {string} key - The environment variable key.
 * @returns {string} - The value of the environment variable.
 * @throws {Error} - If the environment variable is not set.
 */
function loadEnv(key) {
  let value = process.env[key];

  // If the original key is not found, try the uppercase version
  if (value === undefined || value === '') {
    const upperKey = key.toUpperCase();
    value = process.env[upperKey];
  }

  if (value === undefined || value === '') {
    throw new Error(`Environment variable ${key} not set`);
  }
  return value;
}

module.exports = { loadEnv };
