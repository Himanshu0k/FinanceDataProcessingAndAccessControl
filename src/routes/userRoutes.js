const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {
  createUserValidator,
  updateUserValidator,
  getUsersQueryValidator
} = require('../validators/userValidator');
const validate = require('../middleware/validationMiddleware');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (ANALYST & ADMIN only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [VIEWER, ANALYST, ADMIN]
 *         description: Filter by role
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *         description: Filter by status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or email
 *     responses:
 *       200:
 *         description: Users fetched successfully
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
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *                     count:
 *                       type: integer
 *       403:
 *         description: Forbidden - Insufficient permissions
 */
router.get(
  '/',
  authorize('ANALYST', 'ADMIN'),
  getUsersQueryValidator,
  validate,
  userController.getAllUsers
);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User fetched successfully
 *       404:
 *         description: User not found
 */
router.get(
  '/:id',
  authorize('ANALYST', 'ADMIN'),
  userController.getUserById
);

/**
 * @swagger
 * /api/users/{id}/stats:
 *   get:
 *     summary: Get user statistics
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Statistics fetched successfully
 */
router.get(
  '/:id/stats',
  authorize('ANALYST', 'ADMIN'),
  userController.getUserStats
);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create new user (ADMIN only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [VIEWER, ANALYST, ADMIN]
 *     responses:
 *       201:
 *         description: User created successfully
 *       403:
 *         description: Forbidden
 */
router.post(
  '/',
  authorize('ADMIN'),
  createUserValidator,
  validate,
  userController.createUser
);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user (ADMIN only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.put(
  '/:id',
  authorize('ADMIN'),
  updateUserValidator,
  validate,
  userController.updateUser
);

/**
 * @swagger
 * /api/users/{id}/toggle-status:
 *   patch:
 *     summary: Toggle user status (ADMIN only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status toggled successfully
 */
router.patch(
  '/:id/toggle-status',
  authorize('ADMIN'),
  userController.toggleUserStatus
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user (ADMIN only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       403:
 *         description: Cannot delete own account
 */
router.delete(
  '/:id',
  authorize('ADMIN'),
  userController.deleteUser
);

module.exports = router;