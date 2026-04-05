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

    const admin = await prisma.user.create({
      data: {
        email: 'admin@test.com',
        password,
        name: 'Admin User',
        role: 'ADMIN',
        status: 'ACTIVE'
      }
    });

    const analyst = await prisma.user.create({
      data: {
        email: 'analyst@test.com',
        password,
        name: 'Analyst User',
        role: 'ANALYST',
        status: 'ACTIVE'
      }
    });

    const viewer = await prisma.user.create({
      data: {
        email: 'viewer@test.com',
        password,
        name: 'Viewer User',
        role: 'VIEWER',
        status: 'ACTIVE'
      }
    });

    const inactiveUser = await prisma.user.create({
      data: {
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
    const records = await prisma.record.createMany({
      data: [
        {
          userId,
          amount: 5000,
          type: 'INCOME',
          category: 'Salary',
          date: new Date('2024-01-15'),
          description: 'Monthly salary'
        },
        {
          userId,
          amount: 1500,
          type: 'EXPENSE',
          category: 'Rent',
          date: new Date('2024-01-20'),
          description: 'Monthly rent payment'
        },
        {
          userId,
          amount: 500,
          type: 'EXPENSE',
          category: 'Food',
          date: new Date('2024-01-25'),
          description: 'Groceries'
        },
        {
          userId,
          amount: 3000,
          type: 'INCOME',
          category: 'Freelance',
          date: new Date('2024-02-10'),
          description: 'Freelance project'
        }
      ]
    });

    return records;
  }

  // Disconnect Prisma after tests
  async disconnect() {
    await prisma.$disconnect();
  }
}

module.exports = new TestHelper();