const userService = require('../services/userService');
const ApiResponse = require('../utils/response');

class UserController {
  // Get all users
  async getAllUsers(req, res, next) {
    try {
      const filters = {
        role: req.query.role,
        status: req.query.status,
        search: req.query.search
      };

      const users = await userService.getAllUsers(filters);
      return ApiResponse.success(
        res,
        { users, count: users.length },
        'Users fetched successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  // Get user by ID
  async getUserById(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id);
      return ApiResponse.success(res, { user }, 'User fetched successfully');
    } catch (error) {
      next(error);
    }
  }

  // Create new user
  async createUser(req, res, next) {
    try {
      const user = await userService.createUser(req.body);
      return ApiResponse.success(
        res,
        { user },
        'User created successfully',
        201
      );
    } catch (error) {
      next(error);
    }
  }

  // Update user
  async updateUser(req, res, next) {
    try {
      const user = await userService.updateUser(
        req.params.id,
        req.body,
        req.user
      );
      return ApiResponse.success(res, { user }, 'User updated successfully');
    } catch (error) {
      next(error);
    }
  }

  // Delete user
  async deleteUser(req, res, next) {
    try {
      const result = await userService.deleteUser(req.params.id, req.user);
      return ApiResponse.success(res, result, 'User deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  // Toggle user status
  async toggleUserStatus(req, res, next) {
    try {
      const user = await userService.toggleUserStatus(req.params.id, req.user);
      return ApiResponse.success(
        res,
        { user },
        'User status updated successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  // Get user statistics
  async getUserStats(req, res, next) {
    try {
      const stats = await userService.getUserStats(req.params.id);
      return ApiResponse.success(
        res,
        { stats },
        'User statistics fetched successfully'
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();