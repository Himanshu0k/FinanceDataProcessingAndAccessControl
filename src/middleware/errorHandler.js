const ApiResponse = require('../utils/response');
const AppError = require('../utils/errorHandler');

const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('Error:', err);

  // Handle known operational errors
  if (err instanceof AppError) {
    return ApiResponse.error(res, err.message, err.statusCode);
  }

  // Handle Prisma errors
  if (err.code === 'P2002') {
    return ApiResponse.error(res, 'Duplicate entry found', 400);
  }

  if (err.code === 'P2025') {
    return ApiResponse.error(res, 'Record not found', 404);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return ApiResponse.error(res, 'Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return ApiResponse.error(res, 'Token expired', 401);
  }

  // Default error
  return ApiResponse.error(
    res,
    process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    500
  );
};

module.exports = errorHandler;