const request = require('supertest');
const express = require('express');
const { getAttendeesHandler } = require('./assemblyHandler');
const { checkLogin } = require('./loginHandler');
const { getAttendeesMetrics } = require('../services/assemblySvc');

// Mock dependencies
jest.mock('./loginHandler', () => ({
  checkLogin: jest.fn()
}));
jest.mock('../services/assemblySvc', () => ({
  getAttendeesMetrics: jest.fn()
}));

const app = express();
app.use(express.json());
app.get('/api/assembly/attendees', getAttendeesHandler);

describe('GET /api/assembly/attendees', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and metrics when authenticated', async () => {
    const mockMetrics = { attendanceCount: 45, totalUnits: 100 };
    checkLogin.mockResolvedValue(true);
    getAttendeesMetrics.mockResolvedValue(mockMetrics);

    const res = await request(app)
      .get('/api/assembly/attendees')
      .set('Authorization', 'Bearer valid-token')
      .set('Application', 'ur-admin-site');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockMetrics);
    expect(checkLogin).toHaveBeenCalled();
    expect(getAttendeesMetrics).toHaveBeenCalled();
  });

  it('should return 401 when authentication fails', async () => {
    checkLogin.mockRejectedValue(new Error('Authorization token is missing - Bearer required'));

    const res = await request(app).get('/api/assembly/attendees');

    expect(res.statusCode).toEqual(401);
    expect(res.text).toBe('Authorization token is missing - Bearer required');
    expect(getAttendeesMetrics).not.toHaveBeenCalled();
  });

  it('should return 500 when service fails', async () => {
    checkLogin.mockResolvedValue(true);
    getAttendeesMetrics.mockRejectedValue(new Error('Firestore error'));

    const res = await request(app)
      .get('/api/assembly/attendees')
      .set('Authorization', 'Bearer valid-token')
      .set('Application', 'ur-admin-site');

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({ code: '500', error: 'Firestore error' });
  });
});
