const request = require('supertest');
const express = require('express');
const {
  getAttendeesHandler,
  getAllSurveysHandler,
  getCoefficientHandler
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
  getCoefficientData: jest.fn()
}));

const app = express();
app.use(express.json());
app.get('/api/assembly/attendees', getAttendeesHandler);
app.get('/api/assembly/all', getAllSurveysHandler);
app.get('/api/assembly/coefficient', getCoefficientHandler);

describe('GET /api/assembly/attendees', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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
    expect(checkLogin).toHaveBeenCalled();
    expect(assemblySvc.getAttendeesMetrics).toHaveBeenCalled();
  });

  it('should return 401 when authentication fails', async () => {
    checkLogin.mockRejectedValue(new Error('Authorization token is missing - Bearer required'));

    const res = await request(app).get('/api/assembly/attendees');

    expect(res.statusCode).toEqual(401);
    expect(res.text).toBe('Authorization token is missing - Bearer required');
    expect(assemblySvc.getAttendeesMetrics).not.toHaveBeenCalled();
  });

  it('should return 500 when service fails', async () => {
    checkLogin.mockResolvedValue(true);
    assemblySvc.getAttendeesMetrics.mockRejectedValue(new Error('Firestore error'));

    const res = await request(app)
      .get('/api/assembly/attendees')
      .set('Authorization', 'Bearer valid-token')
      .set('Application', 'ur-admin-site');

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({ code: '500', error: 'Firestore error' });
  });
});

describe('GET /api/assembly/all', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and list of surveys when authenticated', async () => {
    const mockSurveys = [
      {
        id: 'survey1',
        question: 'Question 1',
        status: 'OPEN',
        createdAt: '2026-06-18T10:00:00.000Z',
        options: [
          { text: 'Option 1', votesCount: 1, coefficientVotes: 0.5 }
        ]
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
    expect(checkLogin).toHaveBeenCalled();
    expect(assemblySvc.getAllSurveys).toHaveBeenCalled();
  });

  it('should return 500 when service fails', async () => {
    checkLogin.mockResolvedValue(true);
    assemblySvc.getAllSurveys.mockRejectedValue(new Error('Firestore error'));
const { newRouter } = require('./router');
const admin = require('firebase-admin');
const { checkLogin } = require('./loginHandler');

// Mock admin
jest.mock('firebase-admin', () => {
  const getMock = jest.fn();
  const collectionMock = jest.fn(() => ({
    get: getMock
  }));
  const firestoreMock = jest.fn(() => ({
    collection: collectionMock
  }));
  return {
    firestore: firestoreMock
  };
});

// Mock checkLogin to bypass authentication
jest.mock('./loginHandler', () => ({
  ...jest.requireActual('./loginHandler'),
  checkLogin: jest.fn().mockResolvedValue(true)
}));

const app = express();
app.use(newRouter());

describe('GET /api/assembly/all', () => {
  it('should return 200 and list of surveys', async () => {
    const mockSurveys = [
      {
        id: 'survey1',
        data: () => ({
          question: 'Question 1',
          status: 'OPEN',
          createDate: {
            toDate: () => new Date('2026-06-18T10:00:00Z')
          },
          options: [
            { text: 'Option 1', votesCount: 1, coefficientVotes: 0.5 }
          ]
        })
      }
    ];

    admin.firestore().collection().get.mockResolvedValue(mockSurveys);

    const res = await request(app)
      .get('/api/assembly/all')
      .set('Authorization', 'Bearer valid-token')
      .set('Application', 'ur-admin-site');

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({ code: '500', error: 'Firestore error' });
  });
});

describe('GET /api/assembly/coefficient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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
    expect(checkLogin).toHaveBeenCalled();
    expect(assemblySvc.getCoefficientData).toHaveBeenCalled();
  });

  it('should return 500 when service fails', async () => {
    checkLogin.mockResolvedValue(true);
    assemblySvc.getCoefficientData.mockRejectedValue(new Error('Firestore error'));

    const res = await request(app)
      .get('/api/assembly/coefficient')
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toEqual({
      id: 'survey1',
      question: 'Question 1',
      status: 'OPEN',
      createdAt: '2026-06-18T10:00:00.000Z',
      options: [
        { text: 'Option 1', votesCount: 1, coefficientVotes: 0.5 }
      ]
    });
  });

  it('should return 500 when firestore fails', async () => {
    admin.firestore().collection().get.mockRejectedValue(new Error('Firestore error'));

    const res = await request(app)
      .get('/api/assembly/all')
      .set('Authorization', 'Bearer valid-token')
      .set('Application', 'ur-admin-site');

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({ code: '500', error: 'Firestore error' });
    expect(res.body.code).toEqual('500');
  });
});
