const { verifyToken, createToken } = require('../services/loginSvc');
const jwt = require('jsonwebtoken');

// Mock realtimeDataSvc
jest.mock('../services/realtimeDataSvc', () => ({
  validateUser: jest.fn().mockResolvedValue(true),
}));

describe('loginSvc', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    process.env.APP_SECRET = 'test_secret';
    process.env.CACHE_TIME_TOKEN_LIFE = '10';
    process.env.CACHE_TIME_TOKEN_REFRESH = '10';
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('createToken', () => {
    it('should create a valid token', async () => {
      const token = await createToken('test@example.com', 'user123');
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      const decoded = jwt.verify(token, process.env.APP_SECRET);
      expect(decoded.user_id).toBe('user123');
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', async () => {
      const token = jwt.sign({ user_id: 'user123' }, process.env.APP_SECRET);
      const isValid = await verifyToken(token);
      expect(isValid).toBe(true);
    });

    it('should return false for an invalid token', async () => {
      const isValid = await verifyToken('invalid_token');
      expect(isValid).toBe(false);
    });

    it('should return false if APP_SECRET is not set', async () => {
      delete process.env.APP_SECRET;
      // We expect it to fail gracefully or throw if not caught
      // In loginSvc, it's wrapped in a try-catch returning false
      const token = jwt.sign({ user_id: 'user123' }, 'some_secret');
      const isValid = await verifyToken(token);
      expect(isValid).toBe(false);
    });
  });
});
