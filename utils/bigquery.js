const { BigQuery } = require('@google-cloud/bigquery');
const { loadEnv } = require('./loadEnv');
const fs = require('fs');
const path = require('path');

let bqClient;

/**
 * Gets or initializes the BigQuery client.
 * @returns {BigQuery}
 */
function getBigQueryClient() {
    if (!bqClient) {
        const credentialsPath = loadEnv('credentials');
        const projectId = loadEnv('FIREBASE_PROJECT_ID');

        const absolutePath = path.isAbsolute(credentialsPath)
            ? credentialsPath
            : path.join(process.cwd(), credentialsPath);

        const config = {
            projectId: projectId,
        };

        if (fs.existsSync(absolutePath)) {
            config.keyFilename = absolutePath;
        } else {
            console.warn(`Credentials file not found at ${absolutePath}, attempting to initialize BigQuery with default credentials.`);
        }

        bqClient = new BigQuery(config);
    }
    return bqClient;
}

module.exports = { getBigQueryClient };
