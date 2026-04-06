const dashboardService = require('../services/dashboardService');
const ApiResponse = require('../utils/response');

class DashboardController {
  // Get overview statistics
  async getOverview(req, res, next) {
    try {
      const overview = await dashboardService.getOverview(
        req.user.role,
        req.user.id,
        req.query
      );
      return ApiResponse.success(
        res,
        { overview },
        'Overview statistics fetched successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  // Get category breakdown
  async getCategoryBreakdown(req, res, next) {
    try {
      const categories = await dashboardService.getCategoryBreakdown(
        req.user.role,
        req.user.id,
        req.query
      );
      return ApiResponse.success(
        res,
        { categories, count: categories.length },
        'Category breakdown fetched successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  // Get recent activity
  async getRecentActivity(req, res, next) {
    try {
      const limit = req.query.limit || 10;
      const activity = await dashboardService.getRecentActivity(
        req.user.role,
        req.user.id,
        limit
      );
      return ApiResponse.success(
        res,
        { activity, count: activity.length },
        'Recent activity fetched successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  // Get monthly trends
  async getMonthlyTrends(req, res, next) {
    try {
      const trends = await dashboardService.getMonthlyTrends(
        req.user.role,
        req.user.id,
        req.query
      );
      return ApiResponse.success(
        res,
        { trends },
        'Monthly trends fetched successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  // Get weekly trends
  async getWeeklyTrends(req, res, next) {
    try {
      const trends = await dashboardService.getWeeklyTrends(
        req.user.role,
        req.user.id
      );
      return ApiResponse.success(
        res,
        { trends, count: trends.length },
        'Weekly trends fetched successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  // Get top categories
  async getTopCategories(req, res, next) {
    try {
      const topCategories = await dashboardService.getTopCategories(
        req.user.role,
        req.user.id,
        req.query
      );
      return ApiResponse.success(
        res,
        { topCategories, count: topCategories.length },
        'Top categories fetched successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  // Get income vs expense comparison
  async getIncomeExpenseComparison(req, res, next) {
    try {
      const comparison = await dashboardService.getIncomeExpenseComparison(
        req.user.role,
        req.user.id,
        req.query
      );
      return ApiResponse.success(
        res,
        { comparison },
        'Income vs expense comparison fetched successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  // Get financial health score
  async getFinancialHealth(req, res, next) {
    try {
      const health = await dashboardService.getFinancialHealth(
        req.user.role,
        req.user.id
      );
      return ApiResponse.success(
        res,
        { health },
        'Financial health score calculated successfully'
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();