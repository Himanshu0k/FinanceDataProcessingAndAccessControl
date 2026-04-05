const bcrypt = require('bcrypt');
const prisma = require('../config/database');
const AppError = require('../utils/errorHandler');

class UserService {
  // Get all users (with optional filters)
  async getAllUsers(filters = {}) {
    const { role, status, search } = filters;

    const where = {};

    if (role) {
      where.role = role;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { records: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return users;
  }

  // Get user by ID
  async getUserById(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { records: true }
        }
      }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  // Create new user (Admin only)
  async createUser(userData) {
    const { email, password, name, role } = userData;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'VIEWER'
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true
      }
    });

    return user;
  }

  // Update user
  async updateUser(userId, updateData, requestingUser) {
    const { email, name, role, status, password } = updateData;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Prevent users from updating their own role or status
    if (requestingUser.id === userId) {
      if (role && role !== user.role) {
        throw new AppError('You cannot change your own role', 403);
      }
      if (status && status !== user.status) {
        throw new AppError('You cannot change your own status', 403);
      }
    }

    const dataToUpdate = {};

    if (email) {
      // Check if email is already taken by another user
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser && existingUser.id !== userId) {
        throw new AppError('Email already in use', 400);
      }

      dataToUpdate.email = email;
    }

    if (name) dataToUpdate.name = name;
    if (role) dataToUpdate.role = role;
    if (status) dataToUpdate.status = status;

    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        updatedAt: true
      }
    });

    return updatedUser;
  }

  // Delete user
  async deleteUser(userId, requestingUser) {
    // Prevent users from deleting themselves
    if (requestingUser.id === userId) {
      throw new AppError('You cannot delete your own account', 403);
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Delete user (cascade will delete related records)
    await prisma.user.delete({
      where: { id: userId }
    });

    return { message: 'User deleted successfully' };
  }

  // Toggle user status (Activate/Deactivate)
  async toggleUserStatus(userId, requestingUser) {
    // Prevent users from changing their own status
    if (requestingUser.id === userId) {
      throw new AppError('You cannot change your own status', 403);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status: newStatus },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true
      }
    });

    return updatedUser;
  }

  // Get user statistics
  async getUserStats(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        records: {
          select: {
            type: true,
            amount: true,
            date: true
          }
        }
      }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const totalRecords = user.records.length;
    const totalIncome = user.records
      .filter(r => r.type === 'INCOME')
      .reduce((sum, r) => sum + Number(r.amount), 0);
    const totalExpense = user.records
      .filter(r => r.type === 'EXPENSE')
      .reduce((sum, r) => sum + Number(r.amount), 0);

    return {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      totalRecords,
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense
    };
  }
}

module.exports = new UserService();