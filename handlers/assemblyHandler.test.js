const request = require('supertest');
const express = require('express');
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
    expect(res.body.code).toEqual('500');
  });
});
