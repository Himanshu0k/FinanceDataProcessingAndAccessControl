const { PrismaClient } = require('@prisma/client');

module.exports = async () => {
  const prisma = new PrismaClient();
  
  // Clean database before all tests
  await prisma.record.deleteMany({});
  await prisma.user.deleteMany({});
  
  await prisma.$disconnect();
};