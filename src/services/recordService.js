const prisma = require('../config/database');
const AppError = require('../utils/errorHandler');

class RecordService {
  // Create new record
  async createRecord(recordData, userId) {
    const { amount, type, category, date, description } = recordData;

    const record = await prisma.record.create({
      data: {
        amount,
        type,
        category,
        date: new Date(date),
        description,
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return record;
  }

  // Get all records with filtering
  async getAllRecords(filters, userRole, userId) {
    const {
      type,
      category,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      search,
      sortBy = 'date',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = filters;

    const where = {};

    // If not ADMIN or ANALYST, only show own records
    if (userRole === 'VIEWER') {
      where.userId = userId;
    }

    // Filter by type (INCOME/EXPENSE)
    if (type) {
      where.type = type;
    }

    // Filter by category
    if (category) {
      where.category = {
        contains: category,
        mode: 'insensitive'
      };
    }

    // Filter by date range
    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }

    // Filter by amount range
    if (minAmount || maxAmount) {
      where.amount = {};
      if (minAmount) {
        where.amount.gte = parseFloat(minAmount);
      }
      if (maxAmount) {
        where.amount.lte = parseFloat(maxAmount);
      }
    }

    // Search in description or category
    if (search) {
      where.OR = [
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const take = parseInt(limit);

    // Determine sort field
    const orderBy = {};
    orderBy[sortBy] = sortOrder;

    // Get records with pagination
    const [records, totalCount] = await Promise.all([
      prisma.record.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy,
        skip,
        take
      }),
      prisma.record.count({ where })
    ]);

    return {
      records,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalRecords: totalCount,
        recordsPerPage: take
      }
    };
  }

  // Get record by ID
  async getRecordById(recordId, userRole, userId) {
    const record = await prisma.record.findUnique({
      where: { id: recordId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!record) {
      throw new AppError('Record not found', 404);
    }

    // Check if user has permission to view this record
    if (userRole === 'VIEWER' && record.userId !== userId) {
      throw new AppError('You do not have permission to view this record', 403);
    }

    return record;
  }

  // Update record
  async updateRecord(recordId, updateData, userRole, userId) {
    const { amount, type, category, date, description } = updateData;

    // Check if record exists
    const existingRecord = await prisma.record.findUnique({
      where: { id: recordId }
    });

    if (!existingRecord) {
      throw new AppError('Record not found', 404);
    }

    // Check permissions
    if (userRole === 'VIEWER' && existingRecord.userId !== userId) {
      throw new AppError('You do not have permission to update this record', 403);
    }

    if (userRole === 'ANALYST') {
      throw new AppError('Analysts can only view records, not modify them', 403);
    }

    const dataToUpdate = {};
    if (amount !== undefined) dataToUpdate.amount = amount;
    if (type) dataToUpdate.type = type;
    if (category) dataToUpdate.category = category;
    if (date) dataToUpdate.date = new Date(date);
    if (description !== undefined) dataToUpdate.description = description;

    const updatedRecord = await prisma.record.update({
      where: { id: recordId },
      data: dataToUpdate,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return updatedRecord;
  }

  // Delete record
  async deleteRecord(recordId, userRole, userId) {
    // Check if record exists
    const record = await prisma.record.findUnique({
      where: { id: recordId }
    });

    if (!record) {
      throw new AppError('Record not found', 404);
    }

    // Check permissions
    if (userRole === 'VIEWER' && record.userId !== userId) {
      throw new AppError('You do not have permission to delete this record', 403);
    }

    if (userRole === 'ANALYST') {
      throw new AppError('Analysts can only view records, not delete them', 403);
    }

    await prisma.record.delete({
      where: { id: recordId }
    });

    return { message: 'Record deleted successfully' };
  }

  // Get records by user ID
  async getRecordsByUserId(targetUserId, filters, requestingUserRole, requestingUserId) {
    // Check permissions
    if (requestingUserRole === 'VIEWER' && targetUserId !== requestingUserId) {
      throw new AppError('You can only view your own records', 403);
    }

    const {
      type,
      category,
      startDate,
      endDate,
      sortBy = 'date',
      sortOrder = 'desc'
    } = filters;

    const where = { userId: targetUserId };

    if (type) where.type = type;
    if (category) where.category = { contains: category, mode: 'insensitive' };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const orderBy = {};
    orderBy[sortBy] = sortOrder;

    const records = await prisma.record.findMany({
      where,
      orderBy,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return records;
  }

  // Get records summary by category
  async getRecordsByCategory(userRole, userId) {
    const where = {};

    // If VIEWER, only show own records
    if (userRole === 'VIEWER') {
      where.userId = userId;
    }

    const records = await prisma.record.findMany({
      where,
      select: {
        category: true,
        type: true,
        amount: true
      }
    });

    // Group by category
    const categoryMap = {};

    records.forEach(record => {
      if (!categoryMap[record.category]) {
        categoryMap[record.category] = {
          category: record.category,
          totalIncome: 0,
          totalExpense: 0,
          netAmount: 0,
          count: 0
        };
      }

      const amount = Number(record.amount);
      categoryMap[record.category].count++;

      if (record.type === 'INCOME') {
        categoryMap[record.category].totalIncome += amount;
      } else {
        categoryMap[record.category].totalExpense += amount;
      }

      categoryMap[record.category].netAmount = 
        categoryMap[record.category].totalIncome - categoryMap[record.category].totalExpense;
    });

    return Object.values(categoryMap);
  }

  // Bulk delete records
  async bulkDeleteRecords(recordIds, userRole, userId) {
    if (userRole === 'ANALYST') {
      throw new AppError('Analysts cannot delete records', 403);
    }

    // For VIEWER, verify all records belong to them
    if (userRole === 'VIEWER') {
      const records = await prisma.record.findMany({
        where: {
          id: { in: recordIds }
        },
        select: { userId: true }
      });

      const allOwnRecords = records.every(r => r.userId === userId);
      if (!allOwnRecords) {
        throw new AppError('You can only delete your own records', 403);
      }
    }

    const result = await prisma.record.deleteMany({
      where: {
        id: { in: recordIds }
      }
    });

    return {
      message: `${result.count} record(s) deleted successfully`,
      deletedCount: result.count
    };
  }
}

module.exports = new RecordService();