const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authenticate = require('../middleware/authMiddleware');
const { query } = require('express-validator');
const validate = require('../middleware/validationMiddleware');

router.use(authenticate);

const dateRangeValidator = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date')
];

const yearValidator = [
  query('year')
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage('Year must be between 2000 and 2100')
];

const periodValidator = [
  query('period')
    .optional()
    .isIn(['monthly', 'quarterly', 'yearly'])
    .withMessage('Period must be monthly, quarterly, or yearly')
];

/**
 * @swagger
 * /api/dashboard/overview:
 *   get:
 *     summary: Get financial overview
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Overview statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     overview:
 *                       type: object
 *                       properties:
 *                         totalIncome:
 *                           type: number
 *                         totalExpense:
 *                           type: number
 *                         netBalance:
 *                           type: number
 *                         totalRecords:
 *                           type: integer
 */
router.get(
  '/overview',
  dateRangeValidator,
  validate,
  dashboardController.getOverview
);

/**
 * @swagger
 * /api/dashboard/category-breakdown:
 *   get:
 *     summary: Get category-wise breakdown
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category breakdown
 */
router.get(
  '/category-breakdown',
  [...dateRangeValidator, query('type').optional().isIn(['INCOME', 'EXPENSE'])],
  validate,
  dashboardController.getCategoryBreakdown
);

/**
 * @swagger
 * /api/dashboard/monthly-trends:
 *   get:
 *     summary: Get monthly trends
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Monthly trends data
 */
router.get(
  '/monthly-trends',
  yearValidator,
  validate,
  dashboardController.getMonthlyTrends
);

/**
 * @swagger
 * /api/dashboard/financial-health:
 *   get:
 *     summary: Get financial health score
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Financial health metrics
 */
router.get(
  '/financial-health',
  dashboardController.getFinancialHealth
);

router.get(
  '/recent-activity',
  [query('limit').optional().isInt({ min: 1, max: 50 })],
  validate,
  dashboardController.getRecentActivity
);

router.get(
  '/weekly-trends',
  dashboardController.getWeeklyTrends
);

router.get(
  '/top-categories',
  [
    query('type').optional().isIn(['INCOME', 'EXPENSE']),
    query('limit').optional().isInt({ min: 1, max: 20 })
  ],
  validate,
  dashboardController.getTopCategories
);

router.get(
  '/income-expense-comparison',
  [...periodValidator, ...yearValidator],
  validate,
  dashboardController.getIncomeExpenseComparison
);

module.exports = router;