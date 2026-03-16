const { Cache } = require('../models/cache');
const { ActiveUserStats } = require('../models/activeUserStats');
const { loadEnv } = require('../utils/loadEnv');
const fs = require('fs');
const path = require('path');
const { getBigQueryClient } = require('../utils/bigquery');

const bqCache = new Cache();
const CACHE_KEY = 'active_users_stats';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Retrieves active user statistics from BigQuery.
 * Uses caching to store the result.
 * @param {Object} [deps] - Dependencies for testing.
 * @returns {Promise<ActiveUserStats>}
 */
async function getActiveUserStats(deps = {}) {
    const cachedData = bqCache.get(CACHE_KEY);
    if (cachedData) {
        console.log("=== BigQuery Service: Returning cached active user stats");
        return cachedData;
    }

    console.log("=== BigQuery Service: Fetching active user stats from BigQuery");

    const bq = deps.bq || getBigQueryClient();

    const sqlPath = path.join(process.cwd(), 'resources/sql/active_users_prev_week.sql');
    let query = (deps.fs || fs).readFileSync(sqlPath, 'utf8');

    const options = {
        query: query,
        location: 'us-central1', // Adjust location if necessary
    };

    const [rows] = await bq.query(options);

    if (rows && rows.length > 0) {
        const stats = ActiveUserStats.fromBigQuery(rows[0]);
        bqCache.set(CACHE_KEY, stats, CACHE_TTL);
        return stats;
    }

    throw new Error('No data returned from BigQuery');
}

module.exports = { getActiveUserStats };
