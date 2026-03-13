const request = require('supertest');
const express = require('express');
const { newRouter } = require('./router');
const { getActiveUserStats } = require('../services/bigquerySvc');
const { ActiveUserStats } = require('../models/activeUserStats');

// Mock the service
jest.mock('../services/bigquerySvc');

const app = express();
app.use(newRouter());

describe('GET /api/stats/active-users', () => {
    it('should return 200 and active user stats', async () => {
        const mockStats = new ActiveUserStats(150, '2023-10-01');
        getActiveUserStats.mockResolvedValue(mockStats);

        const res = await request(app).get('/api/stats/active-users');

        expect(res.statusCode).toEqual(200);
        expect(res.body.code).toEqual(200);
        expect(res.body.data).toEqual({
            activeUsers: 150,
            referenceDate: '2023-10-01'
        });
    });

    it('should return 500 when service fails', async () => {
        getActiveUserStats.mockRejectedValue(new Error('BigQuery error'));

        const res = await request(app).get('/api/stats/active-users');

        expect(res.statusCode).toEqual(500);
        expect(res.body.code).toEqual(500);
        expect(res.body.message).toBe('Error retrieving active user statistics');
    });
});
