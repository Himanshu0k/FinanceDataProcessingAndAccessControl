const authService = require('../services/authService');
const ApiResponse = require('../utils/response');

class AuthController {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      return ApiResponse.success(
        res,
        result,
        'User registered successfully',
        201
      );
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      return ApiResponse.success(
        res,
        result,
        'Login successful'
      );
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      return ApiResponse.success(
        res,
        { user: req.user },
        'Profile fetched successfully'
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();