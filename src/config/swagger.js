const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance Dashboard API',
      version: '1.0.0',
      description: 'A comprehensive finance dashboard API with role-based access control, financial records management, and analytics',
      contact: {
        name: 'API Support',
        email: 'support@financedashboard.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://api.financedashboard.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: 'c8a7c4c9-4e61-428d-b09b-0cd90a9b4e83'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com'
            },
            name: {
              type: 'string',
              example: 'John Doe'
            },
            role: {
              type: 'string',
              enum: ['VIEWER', 'ANALYST', 'ADMIN'],
              example: 'VIEWER'
            },
            status: {
              type: 'string',
              enum: ['ACTIVE', 'INACTIVE'],
              example: 'ACTIVE'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Record: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            amount: {
              type: 'number',
              format: 'decimal',
              example: 5000.00
            },
            type: {
              type: 'string',
              enum: ['INCOME', 'EXPENSE'],
              example: 'INCOME'
            },
            category: {
              type: 'string',
              example: 'Salary'
            },
            date: {
              type: 'string',
              format: 'date',
              example: '2024-03-15'
            },
            description: {
              type: 'string',
              example: 'Monthly salary'
            },
            userId: {
              type: 'string',
              format: 'uuid'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Error message'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object'
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication endpoints'
      },
      {
        name: 'Users',
        description: 'User management endpoints (Admin only)'
      },
      {
        name: 'Records',
        description: 'Financial records management'
      },
      {
        name: 'Dashboard',
        description: 'Analytics and dashboard endpoints'
      }
    ]
  },
  apis: ['./src/routes/*.js'] // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;