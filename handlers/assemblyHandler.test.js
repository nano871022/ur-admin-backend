const request = require('supertest');
const express = require('express');
const { newRouter } = require('./router');
const assemblySvc = require('../services/assemblySvc');
const { checkLogin } = require('./loginHandler');

// Mock the service and login check
jest.mock('../services/assemblySvc');
jest.mock('./loginHandler', () => ({
  ...jest.requireActual('./loginHandler'),
  checkLogin: jest.fn()
}));

const app = express();
app.use(newRouter());

describe('GET /api/assembly/coefficient', () => {
  it('should return 200 and coefficient data when authenticated', async () => {
    const mockData = {
      coefficientPercentage: 62.45,
      quorumPercentage: 62.45,
      minRequiredPercentage: 50.0
    };
    assemblySvc.getCoefficientData.mockResolvedValue(mockData);
    checkLogin.mockResolvedValue();

    const res = await request(app)
      .get('/api/assembly/coefficient')
      .set('Authorization', 'Bearer valid-token')
      .set('Application', 'ur-admin-site');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockData);
  });

  it('should return 401 when authentication fails', async () => {
    checkLogin.mockRejectedValue(new Error('Invalid Token'));

    const res = await request(app)
      .get('/api/assembly/coefficient');

    expect(res.statusCode).toEqual(401);
    expect(res.text).toBe('Invalid Token');
  });

  it('should return 500 when service fails', async () => {
    checkLogin.mockResolvedValue();
    assemblySvc.getCoefficientData.mockRejectedValue(new Error('Firestore error'));

    const res = await request(app)
      .get('/api/assembly/coefficient')
      .set('Authorization', 'Bearer valid-token')
      .set('Application', 'ur-admin-site');

    expect(res.statusCode).toEqual(500);
    expect(res.body.code).toEqual("500");
    expect(res.body.error).toBe('Firestore error');
  });
});
