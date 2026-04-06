const request = require('supertest');
const app = require('../server');
const testHelper = require('./helpers/test.helper');

describe('Financial Records API Tests', () => {
  let tokens;
  let sampleRecords;

  beforeAll(async () => {
    await testHelper.cleanDatabase();
    await testHelper.createTestUsers();
    tokens = await testHelper.getTokens(app);
    sampleRecords = await testHelper.createSampleRecords(tokens.adminUser.id);
  });

  afterAll(async () => {
    await testHelper.disconnect();
  });

  describe('POST /api/records', () => {
    it('should allow ADMIN to create record', async () => {
      const res = await request(app)
        .post('/api/records')
        .set('Authorization', `Bearer ${tokens.adminToken}`)
        .send({
          amount: 1000,
          type: 'INCOME',
          category: 'Bonus',
          date: '2024-03-20',
          description: 'Performance bonus'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.record.amount).toBe('1000');
    });

    it('should allow VIEWER to create own record', async () => {
      const res = await request(app)
        .post('/api/records')
        .set('Authorization', `Bearer ${tokens.viewerToken}`)
        .send({
          amount: 500,
          type: 'EXPENSE',
          category: 'Shopping',
          date: '2024-03-21',
          description: 'Clothes'
        });

      expect(res.statusCode).toBe(201);
    });

    it('should NOT allow ANALYST to create record', async () => {
      const res = await request(app)
        .post('/api/records')
        .set('Authorization', `Bearer ${tokens.analystToken}`)
        .send({
          amount: 500,
          type: 'INCOME',
          category: 'Test',
          date: '2024-03-21'
        });

      expect(res.statusCode).toBe(403);
    });

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/records')
        .set('Authorization', `Bearer ${tokens.adminToken}`)
        .send({
          amount: 1000
        });

      expect(res.statusCode).toBe(400);
    });

    it('should validate amount is positive', async () => {
      const res = await request(app)
        .post('/api/records')
        .set('Authorization', `Bearer ${tokens.adminToken}`)
        .send({
          amount: -100,
          type: 'INCOME',
          category: 'Test',
          date: '2024-03-21'
        });

      expect(res.statusCode).toBe(400);
    });

    it('should validate type is INCOME or EXPENSE', async () => {
      const res = await request(app)
        .post('/api/records')
        .set('Authorization', `Bearer ${tokens.adminToken}`)
        .send({
          amount: 100,
          type: 'INVALID',
          category: 'Test',
          date: '2024-03-21'
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/records', () => {
    it('should get all records for ADMIN', async () => {
      const res = await request(app)
        .get('/api/records')
        .set('Authorization', `Bearer ${tokens.adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.records).toBeInstanceOf(Array);
    });

    it('should get only own records for VIEWER', async () => {
      const res = await request(app)
        .get('/api/records')
        .set('Authorization', `Bearer ${tokens.viewerToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.records.every(r => r.userId === tokens.viewerUser.id)).toBe(true);
    });

    it('should filter by type', async () => {
      const res = await request(app)
        .get('/api/records?type=INCOME')
        .set('Authorization', `Bearer ${tokens.adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.records.every(r => r.type === 'INCOME')).toBe(true);
    });

    it('should filter by category', async () => {
      const res = await request(app)
        .get('/api/records?category=Salary')
        .set('Authorization', `Bearer ${tokens.adminToken}`);

      expect(res.statusCode).toBe(200);
    });

    it('should filter by date range', async () => {
      const res = await request(app)
        .get('/api/records?startDate=2024-01-01&endDate=2024-01-31')
        .set('Authorization', `Bearer ${tokens.adminToken}`);

      expect(res.statusCode).toBe(200);
    });

    it('should filter by amount range', async () => {
      const res = await request(app)
        .get('/api/records?minAmount=1000&maxAmount=5000')
        .set('Authorization', `Bearer ${tokens.adminToken}`);

      expect(res.statusCode).toBe(200);
    });

    it('should search records', async () => {
      const res = await request(app)
        .get('/api/records?search=salary')
        .set('Authorization', `Bearer ${tokens.adminToken}`);

      expect(res.statusCode).toBe(200);
    });

    it('should support pagination', async () => {
      const res = await request(app)
        .get('/api/records?page=1&limit=5')
        .set('Authorization', `Bearer ${tokens.adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.pagination).toHaveProperty('currentPage', 1);
    });

    it('should support sorting', async () => {
      const res = await request(app)
        .get('/api/records?sortBy=amount&sortOrder=desc')
        .set('Authorization', `Bearer ${tokens.adminToken}`);

      expect(res.statusCode).toBe(200);
    });
  });

  describe('GET /api/records/:id', () => {
    it('should get record by ID', async () => {
      const recordId = sampleRecords[0].id;
      const res = await request(app)
        .get(`/api/records/${recordId}`)
        .set('Authorization', `Bearer ${tokens.adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.record.id).toBe(recordId);
    });

    it('should return 404 for non-existent record', async () => {
      const res = await request(app)
        .get('/api/records/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${tokens.adminToken}`);

      expect(res.statusCode).toBe(404);
    });

    it('should NOT allow VIEWER to view others records', async () => {
      const recordId = sampleRecords[0].id;
      const res = await request(app)
        .get(`/api/records/${recordId}`)
        .set('Authorization', `Bearer ${tokens.viewerToken}`);

      expect(res.statusCode).toBe(403);
    });
  });

  describe('PUT /api/records/:id', () => {
    it('should allow ADMIN to update any record', async () => {
      const recordId = sampleRecords[0].id;
      const res = await request(app)
        .put(`/api/records/${recordId}`)
        .set('Authorization', `Bearer ${tokens.adminToken}`)
        .send({
          amount: 5500,
          description: 'Updated salary'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.record.amount).toBe('5500');
    });

    it('should NOT allow ANALYST to update record', async () => {
      const recordId = sampleRecords[0].id;
      const res = await request(app)
        .put(`/api/records/${recordId}`)
        .set('Authorization', `Bearer ${tokens.analystToken}`)
        .send({
          amount: 6000
        });

      expect(res.statusCode).toBe(403);
    });
  });

  describe('DELETE /api/records/:id', () => {
    it('should allow ADMIN to delete any record', async () => {
      const createRes = await request(app)
        .post('/api/records')
        .set('Authorization', `Bearer ${tokens.adminToken}`)
        .send({
          amount: 100,
          type: 'EXPENSE',
          category: 'Test',
          date: '2024-03-25'
        });

      const recordId = createRes.body.data.record.id;

      const res = await request(app)
        .delete(`/api/records/${recordId}`)
        .set('Authorization', `Bearer ${tokens.adminToken}`);

      expect(res.statusCode).toBe(200);
    });

    it('should NOT allow ANALYST to delete record', async () => {
      const recordId = sampleRecords[1].id;
      const res = await request(app)
        .delete(`/api/records/${recordId}`)
        .set('Authorization', `Bearer ${tokens.analystToken}`);

      expect(res.statusCode).toBe(403);
    });
  });

  describe('GET /api/records/category-summary', () => {
    it('should get category summary', async () => {
      const res = await request(app)
        .get('/api/records/category-summary')
        .set('Authorization', `Bearer ${tokens.adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.categories).toBeInstanceOf(Array);
    });
  });

  describe('GET /api/records/user/:userId', () => {
    it('should get user records', async () => {
      const res = await request(app)
        .get(`/api/records/user/${tokens.adminUser.id}`)
        .set('Authorization', `Bearer ${tokens.adminToken}`);

      expect(res.statusCode).toBe(200);
    });

    it('should allow VIEWER to get own records only', async () => {
      const res = await request(app)
        .get(`/api/records/user/${tokens.adminUser.id}`)
        .set('Authorization', `Bearer ${tokens.viewerToken}`);

      expect(res.statusCode).toBe(403);
    });
  });

  describe('POST /api/records/bulk-delete', () => {
    it('should bulk delete records', async () => {
      // Create test records
      const record1 = await request(app)
        .post('/api/records')
        .set('Authorization', `Bearer ${tokens.adminToken}`)
        .send({
          amount: 100,
          type: 'EXPENSE',
          category: 'Test',
          date: '2024-03-25'
        });

      const record2 = await request(app)
        .post('/api/records')
        .set('Authorization', `Bearer ${tokens.adminToken}`)
        .send({
          amount: 200,
          type: 'EXPENSE',
          category: 'Test',
          date: '2024-03-26'
        });

      const res = await request(app)
        .post('/api/records/bulk-delete')
        .set('Authorization', `Bearer ${tokens.adminToken}`)
        .send({
          recordIds: [
            record1.body.data.record.id,
            record2.body.data.record.id
          ]
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.deletedCount).toBe(2);
    });
  });
});