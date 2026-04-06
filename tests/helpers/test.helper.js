const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

class TestHelper {
  // Clean database before tests
  async cleanDatabase() {
    await prisma.record.deleteMany({});
    await prisma.user.deleteMany({});
  }

  // Create test users with different roles
  async createTestUsers() {
    const password = await bcrypt.hash('password123', 10);

    // Use upsert to avoid duplicate errors
    const admin = await prisma.user.upsert({
      where: { email: 'admin@test.com' },
      update: {},
      create: {
        email: 'admin@test.com',
        password,
        name: 'Admin User',
        role: 'ADMIN',
        status: 'ACTIVE'
      }
    });

    const analyst = await prisma.user.upsert({
      where: { email: 'analyst@test.com' },
      update: {},
      create: {
        email: 'analyst@test.com',
        password,
        name: 'Analyst User',
        role: 'ANALYST',
        status: 'ACTIVE'
      }
    });

    const viewer = await prisma.user.upsert({
      where: { email: 'viewer@test.com' },
      update: {},
      create: {
        email: 'viewer@test.com',
        password,
        name: 'Viewer User',
        role: 'VIEWER',
        status: 'ACTIVE'
      }
    });

    const inactiveUser = await prisma.user.upsert({
      where: { email: 'inactive@test.com' },
      update: {},
      create: {
        email: 'inactive@test.com',
        password,
        name: 'Inactive User',
        role: 'VIEWER',
        status: 'INACTIVE'
      }
    });

    return { admin, analyst, viewer, inactiveUser };
  }

  // Create sample records for a user
  async createSampleRecords(userId) {
    // Delete existing records for this user first
    await prisma.record.deleteMany({
      where: { userId }
    });

    const records = [];

    // January records
    records.push(
      await prisma.record.create({
        data: {
          userId,
          amount: 5000,
          type: 'INCOME',
          category: 'Salary',
          date: new Date('2024-01-15'),
          description: 'Monthly salary'
        }
      })
    );

    records.push(
      await prisma.record.create({
        data: {
          userId,
          amount: 1500,
          type: 'EXPENSE',
          category: 'Rent',
          date: new Date('2024-01-20'),
          description: 'Monthly rent payment'
        }
      })
    );

    records.push(
      await prisma.record.create({
        data: {
          userId,
          amount: 500,
          type: 'EXPENSE',
          category: 'Food',
          date: new Date('2024-01-25'),
          description: 'Groceries'
        }
      })
    );

    // February records
    records.push(
      await prisma.record.create({
        data: {
          userId,
          amount: 3000,
          type: 'INCOME',
          category: 'Freelance',
          date: new Date('2024-02-10'),
          description: 'Freelance project'
        }
      })
    );

    records.push(
      await prisma.record.create({
        data: {
          userId,
          amount: 200,
          type: 'EXPENSE',
          category: 'Transport',
          date: new Date('2024-02-15'),
          description: 'Uber rides'
        }
      })
    );

    records.push(
      await prisma.record.create({
        data: {
          userId,
          amount: 800,
          type: 'EXPENSE',
          category: 'Food',
          date: new Date('2024-02-20'),
          description: 'Restaurants'
        }
      })
    );

    // March records
    records.push(
      await prisma.record.create({
        data: {
          userId,
          amount: 5000,
          type: 'INCOME',
          category: 'Salary',
          date: new Date('2024-03-15'),
          description: 'Monthly salary'
        }
      })
    );

    records.push(
      await prisma.record.create({
        data: {
          userId,
          amount: 1500,
          type: 'EXPENSE',
          category: 'Rent',
          date: new Date('2024-03-20'),
          description: 'Monthly rent'
        }
      })
    );

    return records;
  }

  // Get tokens for all user roles
  async getTokens(app) {
    const request = require('supertest');
    
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'password123' });
    
    const analystRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'analyst@test.com', password: 'password123' });
    
    const viewerRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'viewer@test.com', password: 'password123' });

    return {
      adminToken: adminRes.body.data.token,
      analystToken: analystRes.body.data.token,
      viewerToken: viewerRes.body.data.token,
      adminUser: adminRes.body.data.user,
      analystUser: analystRes.body.data.user,
      viewerUser: viewerRes.body.data.user
    };
  }

  // Disconnect Prisma after tests
  async disconnect() {
    await prisma.$disconnect();
  }
}

module.exports = new TestHelper();