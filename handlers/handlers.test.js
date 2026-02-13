const request = require('supertest');
const express = require('express');
const { newRouter } = require('./router');

const app = express();
app.use(newRouter());

describe('GET /api/health', () => {
  it('should return 200 and success message', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe('Aplicación funcionando correctamente');
  });
});

describe('GET /', () => {
  it('should return 200 and welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ code: 200, detail: "Welcome" });
  });
});
