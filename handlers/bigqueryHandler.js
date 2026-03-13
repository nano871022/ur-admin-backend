const { getActiveUserStats } = require('../services/bigquerySvc');

/**
 * Handler for getting active user statistics.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function activeUserStatsHandler(req, res) {
    try {
        const stats = await getActiveUserStats();
        res.json({
            code: 200,
            data: stats
        });
    } catch (error) {
        console.error('Error in activeUserStatsHandler:', error);
        res.status(500).json({
            code: 500,
            message: 'Error retrieving active user statistics',
            detail: error.message
        });
    }
}

module.exports = { activeUserStatsHandler };
