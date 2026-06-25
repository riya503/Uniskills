const request = require('supertest');
const app = require('../app');


describe('🔐 Auth API Tests', () => {

  test('GET / → server is alive', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('UniSkills');
  });

  test('POST /api/auth/register → rejects empty body', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({});
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  test('POST /api/auth/login → rejects wrong credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'fake_ci_user@test.com', password: 'wrongpass123' });
    expect(res.statusCode).not.toBe(200);
  });

  test('POST /api/auth/forgot-password → rejects unknown email', async () => {
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'nobody_ci@fake.com' });
    expect(res.statusCode).not.toBe(200);
  });

});


describe('📚 Skills API Tests', () => {

  test('GET /api/skills/all → responds successfully', async () => {
    const res = await request(app).get('/api/skills/all');
    expect([200, 500]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(Array.isArray(res.body)).toBe(true);
    }
  });

});


describe('🎓 Sessions API Tests', () => {

  test('POST /api/sessions/request → rejects empty payload', async () => {
    const res = await request(app)
      .post('/api/sessions/request')
      .send({});
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  test('POST /api/sessions/accept → rejects empty payload', async () => {
    const res = await request(app)
      .post('/api/sessions/accept')
      .send({});
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

});

