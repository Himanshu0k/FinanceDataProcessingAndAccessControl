const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.record.deleteMany({});
  await prisma.user.deleteMany({});

  const password = await bcrypt.hash('password123', 10);

  // Create users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@finance.com',
      password,
      name: 'Admin User',
      role: 'ADMIN',
      status: 'ACTIVE'
    }
  });

  const analyst = await prisma.user.create({
    data: {
      email: 'analyst@finance.com',
      password,
      name: 'Analyst User',
      role: 'ANALYST',
      status: 'ACTIVE'
    }
  });

  const viewer = await prisma.user.create({
    data: {
      email: 'viewer@finance.com',
      password,
      name: 'Viewer User',
      role: 'VIEWER',
      status: 'ACTIVE'
    }
  });

  console.log('✅ Users created');

  // Create sample records
  const recordsData = [
    // Admin's records
    { userId: admin.id, amount: 5000, type: 'INCOME', category: 'Salary', date: new Date('2024-01-15'), description: 'Monthly salary' },
    { userId: admin.id, amount: 1500, type: 'EXPENSE', category: 'Rent', date: new Date('2024-01-20'), description: 'Monthly rent' },
    { userId: admin.id, amount: 500, type: 'EXPENSE', category: 'Food', date: new Date('2024-01-25'), description: 'Groceries' },
    { userId: admin.id, amount: 3000, type: 'INCOME', category: 'Freelance', date: new Date('2024-02-10'), description: 'Freelance project' },
    { userId: admin.id, amount: 200, type: 'EXPENSE', category: 'Transport', date: new Date('2024-02-15'), description: 'Uber rides' },
    
    // Viewer's records
    { userId: viewer.id, amount: 4000, type: 'INCOME', category: 'Salary', date: new Date('2024-01-15'), description: 'Monthly salary' },
    { userId: viewer.id, amount: 1200, type: 'EXPENSE', category: 'Rent', date: new Date('2024-01-20'), description: 'Rent payment' },
    { userId: viewer.id, amount: 300, type: 'EXPENSE', category: 'Food', date: new Date('2024-01-28'), description: 'Dining out' },
  ];

  await prisma.record.createMany({
    data: recordsData
  });

  console.log('✅ Records created');
  console.log('✅ Seed completed!');
  console.log('\n📧 Test credentials:');
  console.log('Admin: admin@finance.com / password123');
  console.log('Analyst: analyst@finance.com / password123');
  console.log('Viewer: viewer@finance.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });