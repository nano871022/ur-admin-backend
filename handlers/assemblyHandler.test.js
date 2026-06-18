const request = require('supertest');
const express = require('express');
const {
  getAttendeesHandler,
  getAllSurveysHandler,
  getVotesHandler,
  getCoefficientHandler,
  createSurveyHandler
} = require('./assemblyHandler');
const { checkLogin } = require('./loginHandler');
const assemblySvc = require('../services/assemblySvc');

// Mock dependencies
jest.mock('./loginHandler', () => ({
  checkLogin: jest.fn()
}));
jest.mock('../services/assemblySvc', () => ({
  getAttendeesMetrics: jest.fn(),
  getAllSurveys: jest.fn(),
  getSurveyById: jest.fn(),
  getCoefficientData: jest.fn(),
  createSurvey: jest.fn()
}));

const app = express();
app.use(express.json());
app.get('/api/assembly/attendees', getAttendeesHandler);
app.get('/api/assembly/all', getAllSurveysHandler);
app.get('/api/assembly/votes', getVotesHandler);
app.get('/api/assembly/coefficient', getCoefficientHandler);
app.put('/api/assembly/create', createSurveyHandler);

describe('Assembly Handlers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/assembly/attendees', () => {
    it('should return 200 and metrics when authenticated', async () => {
      const mockMetrics = { attendanceCount: 45, totalUnits: 100 };
      checkLogin.mockResolvedValue(true);
      assemblySvc.getAttendeesMetrics.mockResolvedValue(mockMetrics);

      const res = await request(app)
        .get('/api/assembly/attendees')
        .set('Authorization', 'Bearer valid-token')
        .set('Application', 'ur-admin-site');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockMetrics);
    });

    it('should return 401 when authentication fails', async () => {
      checkLogin.mockRejectedValue(new Error('Authorization token is missing - Bearer required'));

      const res = await request(app).get('/api/assembly/attendees');

      expect(res.statusCode).toEqual(401);
      expect(res.text).toBe('Authorization token is missing - Bearer required');
    });
  });

  describe('GET /api/assembly/all', () => {
    it('should return 200 and list of surveys when authenticated', async () => {
      const mockSurveys = [
        {
          id: 'survey1',
          question: 'Question 1',
          status: 'OPEN',
          createdAt: '2026-06-18T10:00:00.000Z',
          options: [{ text: 'Option 1', votesCount: 1, coefficientVotes: 0.5 }]
        }
      ];
      checkLogin.mockResolvedValue(true);
      assemblySvc.getAllSurveys.mockResolvedValue(mockSurveys);

      const res = await request(app)
        .get('/api/assembly/all')
        .set('Authorization', 'Bearer valid-token')
        .set('Application', 'ur-admin-site');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockSurveys);
    });
  });

  describe('GET /api/assembly/votes', () => {
    it('should return 200 and the survey when authenticated and id is provided', async () => {
      const mockSurvey = {
        id: 'survey123',
        question: 'Sample Question',
        status: 'OPEN',
        createdAt: '2026-06-18T10:00:00Z',
        options: [{ text: 'Option 1', votesCount: 5, coefficientVotes: 10.5 }]
      };
      checkLogin.mockResolvedValue(true);
      assemblySvc.getSurveyById.mockResolvedValue(mockSurvey);

      const res = await request(app)
        .get('/api/assembly/votes?id=survey123')
        .set('Authorization', 'Bearer valid-token')
        .set('Application', 'ur-admin-site');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockSurvey);
      expect(assemblySvc.getSurveyById).toHaveBeenCalledWith('survey123');
    });

    it('should return 400 when id is missing', async () => {
      checkLogin.mockResolvedValue(true);

      const res = await request(app)
        .get('/api/assembly/votes')
        .set('Authorization', 'Bearer valid-token')
        .set('Application', 'ur-admin-site');

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toContain('Missing required query parameter: id');
    });

    it('should return 404 when survey is not found', async () => {
      checkLogin.mockResolvedValue(true);
      assemblySvc.getSurveyById.mockResolvedValue(null);

      const res = await request(app)
        .get('/api/assembly/votes?id=nonexistent')
        .set('Authorization', 'Bearer valid-token')
        .set('Application', 'ur-admin-site');

      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toContain('Survey not found');
    });

    it('should return 401 when not authenticated', async () => {
      checkLogin.mockRejectedValue(new Error('Authorization token is missing'));

      const res = await request(app).get('/api/assembly/votes?id=survey123');

      expect(res.statusCode).toEqual(401);
    });
  });

  describe('GET /api/assembly/coefficient', () => {
    it('should return 200 and coefficient data when authenticated', async () => {
      const mockData = {
        coefficientPercentage: 62.45,
        quorumPercentage: 62.45,
        minRequiredPercentage: 50.0
      };
      checkLogin.mockResolvedValue(true);
      assemblySvc.getCoefficientData.mockResolvedValue(mockData);

      const res = await request(app)
        .get('/api/assembly/coefficient')
        .set('Authorization', 'Bearer valid-token')
        .set('Application', 'ur-admin-site');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockData);
    });
  });

  describe('PUT /api/assembly/create', () => {
    it('should return 201 and the created survey', async () => {
      const mockSurvey = {
        id: 'new-id',
        question: 'Q',
        status: 'OPEN',
        createdAt: 'now',
        options: []
      };
      checkLogin.mockResolvedValue(true);
      assemblySvc.createSurvey.mockResolvedValue(mockSurvey);

      const res = await request(app)
        .put('/api/assembly/create')
        .set('Authorization', 'Bearer valid-token')
        .set('Application', 'ur-admin-site')
        .send({ question: 'Q', options: [] });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual(mockSurvey);
    });

    it('should return 400 when missing required fields', async () => {
      checkLogin.mockResolvedValue(true);

      const res = await request(app)
        .put('/api/assembly/create')
        .set('Authorization', 'Bearer valid-token')
        .set('Application', 'ur-admin-site')
        .send({ question: 'Q' });

      expect(res.statusCode).toEqual(400);
    });
  });
});
