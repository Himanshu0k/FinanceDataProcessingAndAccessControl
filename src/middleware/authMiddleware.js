const authService = require('../services/authService');
const prisma = require('../config/database');
const ApiResponse = require('../utils/response');

const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ApiResponse.error(res, 'No token provided', 401);
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = authService.verifyToken(token);

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true
      }
    });

    if (!user) {
      return ApiResponse.error(res, 'User not found', 401);
    }

    if (user.status !== 'ACTIVE') {
      return ApiResponse.error(res, 'Account is inactive', 403);
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    return ApiResponse.error(res, error.message, 401);
  }
};

module.exports = authenticate;