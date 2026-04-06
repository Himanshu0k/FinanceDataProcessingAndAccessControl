const request = require('supertest');
const app = require('../server');
const testHelper = require('./helpers/test.helper');

describe('Dashboard API Tests', () => {
  let tokens;

  beforeAll(async () => {
    await testHelper.cleanDatabase();
    await testHelper.createTestUsers();
    tokens = await testHelper.getTokens(app);
    await testHelper.createSampleRecords(tokens.adminUser.id);
    await testHelper.createSampleRecords(tokens.viewerUser.id);
  });

  afterAll(async () => {
    await testHelper.disconnect();
  });

  describe('GET /api/dashboard/overview', () => {
    it('should get overview statistics', async () => {
      const res = await request(app)
        .get('/api/dashboard/overview')
        .set('Authorization', `Bearer ${tokens.adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.overview).toHaveProperty('totalIncome');
      expect(res.body.data.overview).toHaveProperty('totalExpense');
      expect(res.body.data.overview).toHaveProperty('netBalance');
      expect(res.body.data.overview).toHaveProperty('totalRecords');
    });

    it('should filter overview by date range', async () => {
      const res = await request(app)
        .get('/api/dashboard/overview?startDate=2024-01-01&endDate=2024-01-31')
        .set('Authorization', `Bearer ${tokens.adminToken}`);

      expect(res.statusCode).toBe(200);
    });

    it('should show only own data for VIEWER', async () => {
      const res = await request(app)
        .get('/api/dashboard/overview')
        .set('Authorization', `Bearer ${tokens.viewerToken}`);

      expect(res.statusCode).toBe(200);
    });
  });

  describe('GET /api/dashboard/category-breakdown', () => {
    it('should get category breakdown', async () => {
      const res = await request(app)
        .get('/api/dashboard/category-breakdown')
        .set('Authorization', `Bearer ${tokens.adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.categories).toBeInstanceOf(Array);
      if (res.body.data.categories.length > 0) {
        expect(res.body.data.categories[0]).toHaveProperty('category');
        expect(res.body.data.categories[0]).toHaveProperty('totalIncome');
        expect(res.body.data.categories[0]).toHaveProperty('totalExpense');
      }
    });

    it('should filter category breakdown by type', async () => {
      const res = await request(app)
        .get('/api/dashboard/category-breakdown?type=INCOME')
        .set('Authorization', `Bearer ${tokens.adminToken}`);

      expect(res.statusCode).toBe(200);
    });
  });

  describe('GET /api/dashboard/recent-activity', () => {
    it('should get recent activity', async () => {
      const res = await request(app)
        .get('/api/dashboard/recent-activity')
        .set('Authorization', `Bearer ${tokens.adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.activity).toBeInstanceOf(Array);
    });

    it('should limit recent activity results', async () => {
      const res = await request(app)
        .get('/api/dashboard/recent-activity?limit=5')
        .set('Authorization', `Bearer ${tokens.adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.activity.length).toBeLessThanOrEqual(5);
    });
  });

  describe('GET /api/dashboard/monthly-trends', () => {
    it('should get monthly trends', async () => {
      const res = await request(app)
        .get('/api/dashboard/monthly-trends')
        .set('Authorization', `Bearer ${tokens.adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.trends).toHaveProperty('year');
      expect(res.body.data.trends).toHaveProperty('months');
      expect(res.body.data.trends.months).toHaveLength(12);
    });

    it('should get monthly trends for specific year', async () => {
      const res = await request(app)
        .get('/api/dashboard/monthly-trends?year=2024')
        .set('Authorization', `Bearer ${tokens.adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.trends.year).toBe(2024);
    });
  });

  describe('GET /api/dashboard/weekly-trends', () => {
    it('should get weekly trends', async () => {
      const res = await request(app)
        .get('/api/dashboard/weekly-trends')
        .set('Authorization', `Bearer ${tokens.adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.trends).toBeInstanceOf(Array);
    });
  });

  describe('GET /api/dashboard/top-categories', () => {
    it('should get top categories', async () => {
      const res = await request(app)
        .get('/api/dashboard/top-categories')
        .set('Authorization', `Bearer ${tokens.adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.topCategories).toBeInstanceOf(Array);
    });

    it('should limit top categories', async () => {
      const res = await request(app)
        .get('/api/dashboard/top-categories?limit=3')
        .set('Authorization', `Bearer ${tokens.adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.topCategories.length).toBeLessThanOrEqual(3);
    });

    it('should filter top categories by type', async () => {
      const res = await request(app)
        .get('/api/dashboard/top-categories?type=EXPENSE')
        .set('Authorization', `Bearer ${tokens.adminToken}`);

      expect(res.statusCode).toBe(200);
    });
  });

  describe('GET /api/dashboard/income-expense-comparison', () => {
    it('should get monthly comparison', async () => {
      const res = await request(app)
        .get('/api/dashboard/income-expense-comparison?period=monthly')
        .set('Authorization', `Bearer ${tokens.adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.comparison.period).toBe('monthly');
    });

    it('should get quarterly comparison', async () => {
      const res = await request(app)
        .get('/api/dashboard/income-expense-comparison?period=quarterly')
        .set('Authorization', `Bearer ${tokens.adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.comparison.period).toBe('quarterly');
    });

    it('should get yearly comparison', async () => {
      const res = await request(app)
        .get('/api/dashboard/income-expense-comparison?period=yearly')
        .set('Authorization', `Bearer ${tokens.adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.comparison.period).toBe('yearly');
    });
  });

  describe('GET /api/dashboard/financial-health', () => {
    it('should get financial health score', async () => {
      const res = await request(app)
        .get('/api/dashboard/financial-health')
        .set('Authorization', `Bearer ${tokens.adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.health).toHaveProperty('healthScore');
      expect(res.body.data.health).toHaveProperty('healthStatus');
      expect(res.body.data.health).toHaveProperty('savingsRate');
      expect(res.body.data.health).toHaveProperty('expenseToIncomeRatio');
      expect(res.body.data.health.healthScore).toBeGreaterThanOrEqual(0);
      expect(res.body.data.health.healthScore).toBeLessThanOrEqual(100);
    });
  });
});