const request = require('supertest');
const app = require('../server');
const testHelper = require('./helpers/test.helper');

describe('User Management API Tests', () => {
  let tokens;

  beforeAll(async () => {
    await testHelper.cleanDatabase();
    await testHelper.createTestUsers();
    tokens = await testHelper.getTokens(app);
  });

  afterAll(async () => {
    await testHelper.disconnect();
  });

  describe('GET /api/users', () => {
    it('should allow ADMIN to get all users', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${tokens.adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.users).toBeInstanceOf(Array);
      expect(res.body.data.count).toBeGreaterThan(0);
    });

    it('should allow ANALYST to get all users', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${tokens.analystToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should NOT allow VIEWER to get all users', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${tokens.viewerToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should filter users by role', async () => {
      const res = await request(app)
        .get('/api/users?role=ADMIN')
        .set('Authorization', `Bearer ${tokens.adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.users.every(u => u.role === 'ADMIN')).toBe(true);
    });

    it('should filter users by status', async () => {
      const res = await request(app)
        .get('/api/users?status=ACTIVE')
        .set('Authorization', `Bearer ${tokens.adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.users.every(u => u.status === 'ACTIVE')).toBe(true);
    });

    it('should search users', async () => {
      const res = await request(app)
        .get('/api/users?search=admin')
        .set('Authorization', `Bearer ${tokens.adminToken}`);

      expect(res.statusCode).toBe(200);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should get user by ID', async () => {
      const res = await request(app)
        .get(`/api/users/${tokens.viewerUser.id}`)
        .set('Authorization', `Bearer ${tokens.adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.user.id).toBe(tokens.viewerUser.id);
    });

    it('should return 404 for non-existent user', async () => {
      const res = await request(app)
        .get('/api/users/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${tokens.adminToken}`);

      expect(res.statusCode).toBe(404);
    });
  });

  describe('POST /api/users', () => {
    it('should allow ADMIN to create user', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${tokens.adminToken}`)
        .send({
          email: 'newuser@test.com',
          password: 'password123',
          name: 'New User',
          role: 'ANALYST'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.user.email).toBe('newuser@test.com');
    });

    it('should NOT allow ANALYST to create user', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${tokens.analystToken}`)
        .send({
          email: 'blocked@test.com',
          password: 'password123',
          name: 'Blocked User'
        });

      expect(res.statusCode).toBe(403);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should allow ADMIN to update user', async () => {
      const res = await request(app)
        .put(`/api/users/${tokens.viewerUser.id}`)
        .set('Authorization', `Bearer ${tokens.adminToken}`)
        .send({
          name: 'Updated Name'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.user.name).toBe('Updated Name');
    });

    it('should NOT allow user to change own role', async () => {
      const res = await request(app)
        .put(`/api/users/${tokens.adminUser.id}`)
        .set('Authorization', `Bearer ${tokens.adminToken}`)
        .send({
          role: 'VIEWER'
        });

      expect(res.statusCode).toBe(403);
    });
  });

  describe('PATCH /api/users/:id/toggle-status', () => {
    it('should toggle user status', async () => {
      const res = await request(app)
        .patch(`/api/users/${tokens.viewerUser.id}/toggle-status`)
        .set('Authorization', `Bearer ${tokens.adminToken}`);

      expect(res.statusCode).toBe(200);
    });

    it('should NOT allow toggling own status', async () => {
      const res = await request(app)
        .patch(`/api/users/${tokens.adminUser.id}/toggle-status`)
        .set('Authorization', `Bearer ${tokens.adminToken}`);

      expect(res.statusCode).toBe(403);
    });
  });

  describe('GET /api/users/:id/stats', () => {
    beforeAll(async () => {
      await testHelper.createSampleRecords(tokens.adminUser.id);
    });

    it('should get user statistics', async () => {
      const res = await request(app)
        .get(`/api/users/${tokens.adminUser.id}/stats`)
        .set('Authorization', `Bearer ${tokens.adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.stats).toHaveProperty('totalRecords');
      expect(res.body.data.stats).toHaveProperty('totalIncome');
      expect(res.body.data.stats).toHaveProperty('totalExpense');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should allow ADMIN to delete user', async () => {
      const createRes = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${tokens.adminToken}`)
        .send({
          email: 'tobedeleted@test.com',
          password: 'password123',
          name: 'To Be Deleted'
        });

      const userId = createRes.body.data.user.id;

      const res = await request(app)
        .delete(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${tokens.adminToken}`);

      expect(res.statusCode).toBe(200);
    });

    it('should NOT allow deleting self', async () => {
      const res = await request(app)
        .delete(`/api/users/${tokens.adminUser.id}`)
        .set('Authorization', `Bearer ${tokens.adminToken}`);

      expect(res.statusCode).toBe(403);
    });
  });
});