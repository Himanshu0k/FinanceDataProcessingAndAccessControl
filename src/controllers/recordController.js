const recordService = require('../services/recordService');
const ApiResponse = require('../utils/response');

class RecordController {
  // Create new record
  async createRecord(req, res, next) {
    try {
      const record = await recordService.createRecord(req.body, req.user.id);
      return ApiResponse.success(
        res,
        { record },
        'Record created successfully',
        201
      );
    } catch (error) {
      next(error);
    }
  }

  // Get all records with filters
  async getAllRecords(req, res, next) {
    try {
      const result = await recordService.getAllRecords(
        req.query,
        req.user.role,
        req.user.id
      );
      return ApiResponse.success(
        res,
        result,
        'Records fetched successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  // Get record by ID
  async getRecordById(req, res, next) {
    try {
      const record = await recordService.getRecordById(
        req.params.id,
        req.user.role,
        req.user.id
      );
      return ApiResponse.success(
        res,
        { record },
        'Record fetched successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  // Update record
  async updateRecord(req, res, next) {
    try {
      const record = await recordService.updateRecord(
        req.params.id,
        req.body,
        req.user.role,
        req.user.id
      );
      return ApiResponse.success(
        res,
        { record },
        'Record updated successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  // Delete record
  async deleteRecord(req, res, next) {
    try {
      const result = await recordService.deleteRecord(
        req.params.id,
        req.user.role,
        req.user.id
      );
      return ApiResponse.success(res, result, 'Record deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  // Get records by user ID
  async getRecordsByUserId(req, res, next) {
    try {
      const records = await recordService.getRecordsByUserId(
        req.params.userId,
        req.query,
        req.user.role,
        req.user.id
      );
      return ApiResponse.success(
        res,
        { records, count: records.length },
        'User records fetched successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  // Get records grouped by category
  async getRecordsByCategory(req, res, next) {
    try {
      const categories = await recordService.getRecordsByCategory(
        req.user.role,
        req.user.id
      );
      return ApiResponse.success(
        res,
        { categories, count: categories.length },
        'Category summary fetched successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  // Bulk delete records
  async bulkDeleteRecords(req, res, next) {
    try {
      const result = await recordService.bulkDeleteRecords(
        req.body.recordIds,
        req.user.role,
        req.user.id
      );
      return ApiResponse.success(res, result, 'Records deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RecordController();