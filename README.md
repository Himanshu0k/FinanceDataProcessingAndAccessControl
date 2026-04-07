📊 Finance Dashboard API
========================

A robust and scalable RESTful API for managing financial records with role-based access control, comprehensive analytics, and real-time dashboard insights.

[Show Image](https://nodejs.org/)[Show Image](https://expressjs.com/)[Show Image](https://www.postgresql.org/)[Show Image](https://www.prisma.io/)[Show Image](LICENSE)

📑 Table of Contents
--------------------

*   [Overview](#overview)
    
*   [Key Features](#key-features)
    
*   [Technology Stack](#technology-stack)
    
*   [System Architecture](#system-architecture)
    
*   [Database Schema](#database-schema)
    
*   [API Endpoints](#api-endpoints)
    
*   [Role-Based Access Control](#role-based-access-control)
    
*   [Installation & Setup](#installation--setup)
    
*   [Environment Variables](#environment-variables)
    
*   [Running the Application](#running-the-application)
    
*   [API Documentation](#api-documentation)
    
*   [Testing](#testing)
    
*   [Project Structure](#project-structure)
    
*   [Security Features](#security-features)
    
*   [Future Enhancements](#future-enhancements)
    
*   [Contributing](#contributing)
    
*   [License](#license)
    

🎯 Overview
-----------

The **Finance Dashboard API** is a comprehensive backend solution designed to help users manage their financial records, track income and expenses, and gain insights through powerful analytics. Built with modern technologies and best practices, this API provides a secure, scalable, and maintainable foundation for financial management applications.

### 🎓 Project Purpose

This project demonstrates:

*   **RESTful API Design** with proper HTTP methods and status codes
    
*   **Role-Based Access Control (RBAC)** implementation
    
*   **Data validation** and error handling
    
*   **Database modeling** with Prisma ORM
    
*   **Authentication & Authorization** using JWT
    
*   **Comprehensive testing** with Jest
    
*   **API documentation** with Swagger/OpenAPI
    
*   **Clean code architecture** following SOLID principles
    

✨ Key Features
--------------

### 🔐 Authentication & Authorization

*   **JWT-based authentication** for secure API access
    
*   **Password encryption** using bcrypt
    
*   **Token-based session management**
    
*   **Role-based access control** (VIEWER, ANALYST, ADMIN)
    

### 👥 User Management

*   Complete CRUD operations for users
    
*   Role assignment and management
    
*   User status control (Active/Inactive)
    
*   User statistics and analytics
    
*   Search and filtering capabilities
    

### 💰 Financial Records Management

*   Create, read, update, delete financial transactions
    
*   Support for income and expense categorization
    
*   **Advanced filtering** by:
    
    *   Date range
        
    *   Category
        
    *   Transaction type (Income/Expense)
        
    *   Amount range
        
    *   Text search
        
*   **Pagination** for large datasets
    
*   **Sorting** by multiple fields
    
*   **Bulk operations** for efficiency
    

### 📊 Dashboard & Analytics

*   **Financial overview** with key metrics
    
*   **Category-wise breakdown** of transactions
    
*   **Monthly and weekly trends** analysis
    
*   **Income vs Expense comparison** (monthly/quarterly/yearly)
    
*   **Top spending categories** identification
    
*   **Financial health score** calculation
    
*   **Recent activity** tracking
    

### 🔒 Security Features

*   Password hashing with bcrypt
    
*   JWT token authentication
    
*   Role-based authorization middleware
    
*   Input validation and sanitization
    
*   SQL injection prevention (via Prisma)
    
*   XSS protection
    
*   CORS configuration
    
*   Helmet.js security headers
    

🛠 Technology Stack
-------------------

### Backend Framework

*   **Node.js** (v18+) - JavaScript runtime
    
*   **Express.js** (v4.x) - Web application framework
    

### Database

*   **PostgreSQL** (v14+) - Relational database
    
*   **Prisma ORM** (v5.x) - Type-safe database client
    

### Authentication & Security

*   **JWT (jsonwebtoken)** - Token-based authentication
    
*   **bcrypt** - Password hashing
    
*   **Helmet.js** - Security headers
    
*   **CORS** - Cross-origin resource sharing
    

### Validation & Error Handling

*   **express-validator** - Request validation
    
*   **Custom error handling** middleware
    

### Documentation

*   **Swagger/OpenAPI 3.0** - API documentation
    
*   **swagger-jsdoc** - JSDoc to Swagger conversion
    
*   **swagger-ui-express** - Interactive API explorer
    

### Testing

*   **Jest** - Testing framework
    
*   **Supertest** - HTTP assertions
    

### Development Tools

*   **Nodemon** - Auto-restart on file changes
    
*   **Morgan** - HTTP request logger
    
*   **Winston** - Application logging
    

🏗 System Architecture
----------------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   ┌─────────────────────────────────────────────────────────────┐  │                        Client Layer                          │  │          (Postman, Frontend App, Mobile App)                 │  └──────────────────────┬──────────────────────────────────────┘                         │                         ▼  ┌─────────────────────────────────────────────────────────────┐  │                     API Gateway Layer                        │  │              (Express Middleware Stack)                      │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │  │  │  CORS    │  │  Helmet  │  │  Morgan  │  │   JSON   │   │  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │  └──────────────────────┬──────────────────────────────────────┘                         │                         ▼  ┌─────────────────────────────────────────────────────────────┐  │                  Authentication Layer                        │  │          (JWT Verification & Role Validation)                │  └──────────────────────┬──────────────────────────────────────┘                         │                         ▼  ┌─────────────────────────────────────────────────────────────┐  │                   Application Layer                          │  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │  │  │ Controllers  │  │  Services    │  │  Validators  │      │  │  │ (Routes)     │  │  (Business   │  │  (Input      │      │  │  │              │  │   Logic)     │  │   Validation)│      │  │  └──────────────┘  └──────────────┘  └──────────────┘      │  └──────────────────────┬──────────────────────────────────────┘                         │                         ▼  ┌─────────────────────────────────────────────────────────────┐  │                    Data Access Layer                         │  │                    (Prisma ORM)                              │  └──────────────────────┬──────────────────────────────────────┘                         │                         ▼  ┌─────────────────────────────────────────────────────────────┐  │                   Database Layer                             │  │                   (PostgreSQL)                               │  └─────────────────────────────────────────────────────────────┘   `

💾 Database Schema
------------------

prisma

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   enum Role {    VIEWER   // Can view own records    ANALYST  // Can view all records and analytics    ADMIN    // Full access to all features  }  enum RecordType {    INCOME    EXPENSE  }  enum UserStatus {    ACTIVE    INACTIVE  }  model User {    id        String      @id @default(uuid())    email     String      @unique    password  String    name      String    role      Role        @default(VIEWER)    status    UserStatus  @default(ACTIVE)    createdAt DateTime    @default(now())    updatedAt DateTime    @updatedAt    records   Record[]  }  model Record {    id          String      @id @default(uuid())    amount      Decimal     @db.Decimal(10, 2)    type        RecordType    category    String    date        DateTime    description String?    userId      String    user        User        @relation(fields: [userId], references: [id])    createdAt   DateTime    @default(now())    updatedAt   DateTime    @updatedAt    @@index([userId])    @@index([date])    @@index([type])    @@index([category])  }   `

🔌 API Endpoints
----------------

### 🔐 Authentication Endpoints

MethodEndpointDescriptionAccessPOST/api/auth/registerRegister new userPublicPOST/api/auth/loginLogin userPublicGET/api/auth/profileGet current user profileAuthenticated

### 👥 User Management Endpoints

MethodEndpointDescriptionAccessGET/api/usersGet all usersANALYST, ADMINGET/api/users/:idGet user by IDANALYST, ADMINPOST/api/usersCreate new userADMINPUT/api/users/:idUpdate userADMINDELETE/api/users/:idDelete userADMINPATCH/api/users/:id/toggle-statusToggle user statusADMINGET/api/users/:id/statsGet user statisticsANALYST, ADMIN

**Query Parameters for GET /api/users:**

*   role - Filter by role (VIEWER/ANALYST/ADMIN)
    
*   status - Filter by status (ACTIVE/INACTIVE)
    
*   search - Search by name or email
    

### 💰 Financial Records Endpoints

MethodEndpointDescriptionAccessGET/api/recordsGet all recordsAll (filtered by role)GET/api/records/:idGet record by IDAll (filtered by ownership)POST/api/recordsCreate recordADMIN, VIEWERPUT/api/records/:idUpdate recordADMIN, VIEWER (own)DELETE/api/records/:idDelete recordADMIN, VIEWER (own)POST/api/records/bulk-deleteBulk delete recordsADMIN, VIEWER (own)GET/api/records/category-summaryCategory summaryAllGET/api/records/user/:userIdGet user's recordsAll (with restrictions)

**Query Parameters for GET /api/records:**

*   type - Filter by type (INCOME/EXPENSE)
    
*   category - Filter by category
    
*   startDate - Filter from date (ISO 8601)
    
*   endDate - Filter to date (ISO 8601)
    
*   minAmount - Minimum amount
    
*   maxAmount - Maximum amount
    
*   search - Search in description/category
    
*   page - Page number (default: 1)
    
*   limit - Records per page (default: 10, max: 100)
    
*   sortBy - Sort field (date/amount/category/type/createdAt)
    
*   sortOrder - Sort order (asc/desc)
    

### 📊 Dashboard Analytics Endpoints

MethodEndpointDescriptionAccessGET/api/dashboard/overviewFinancial overviewAllGET/api/dashboard/category-breakdownCategory breakdownAllGET/api/dashboard/recent-activityRecent transactionsAllGET/api/dashboard/monthly-trendsMonthly trendsAllGET/api/dashboard/weekly-trendsWeekly trendsAllGET/api/dashboard/top-categoriesTop spending categoriesAllGET/api/dashboard/income-expense-comparisonIncome vs ExpenseAllGET/api/dashboard/financial-healthFinancial health scoreAll

🔑 Role-Based Access Control
----------------------------

### Role Hierarchy

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   ADMIN (Highest Privileges)    ├─ Full access to all features    ├─ User management (create, update, delete)    ├─ Manage all financial records    └─ View all analytics and reports  ANALYST (Read-Only Analytics)    ├─ View all financial records    ├─ Access all analytics and reports    ├─ View user information    └─ Cannot create, update, or delete  VIEWER (Personal Records Only)    ├─ View own financial records only    ├─ Create own financial records    ├─ Update own financial records    ├─ Delete own financial records    └─ View personal analytics only   `

### Permission Matrix

FeatureVIEWERANALYSTADMINRegister/Login✅✅✅View Own Records✅✅✅View All Records❌✅✅Create Records✅❌✅Update Own Records✅❌✅Update Any Record❌❌✅Delete Own Records✅❌✅Delete Any Record❌❌✅View Analytics✅ (own)✅ (all)✅ (all)View Users❌✅✅Manage Users❌❌✅

🚀 Installation & Setup
-----------------------

### Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js** (v18.0.0 or higher)
    
*   **npm** (v9.0.0 or higher)
    
*   **PostgreSQL** (v14.0 or higher)
    
*   **Git** (for cloning the repository)
    

### Step 1: Clone the Repository

bash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   git clone https://github.com/Himanshu0k/FinanceDataProcessingAndAccessControl.git  cd FinanceDataProcessingAndAccessControl   `

### Step 2: Install Dependencies

bash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   npm install   `

### Step 3: Database Setup

#### Option A: Using Local PostgreSQL

1.  **Create a PostgreSQL database:**
    

bash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   # Login to PostgreSQL  psql -U postgres  # Create database  CREATE DATABASE finance_db;  # Exit psql  \q   `

1.  **Configure database connection:**
    

Update the .env file (see Environment Variables section below)

#### Option B: Using Docker (Alternative)

bash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   # Run PostgreSQL in Docker  docker run --name postgres-finance \    -e POSTGRES_PASSWORD=yourpassword \    -e POSTGRES_DB=finance_db \    -p 5432:5432 \    -d postgres:14   `

### Step 4: Environment Configuration

Create a .env file in the root directory:

bash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   cp .env.example .env   `

Then edit .env with your configuration (see Environment Variables section)

### Step 5: Database Migration

bash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   # Generate Prisma Client  npx prisma generate  # Run database migrations  npx prisma migrate dev --name init  # (Optional) Seed the database with sample data  npm run prisma:seed   `

### Step 6: Verify Setup

bash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   # Start the development server  npm run dev  # The server should start at http://localhost:3000   `

🔧 Environment Variables
------------------------

Create a .env file in the root directory with the following variables:

env

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   # Database Configuration  DATABASE_URL="postgresql://username:password@localhost:5432/finance_db?schema=public"  # JWT Configuration  JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"  # Server Configuration  PORT=3000  NODE_ENV=development  # Optional: Logging Level  LOG_LEVEL=debug   `

### Environment Variable Descriptions

VariableDescriptionExampleDATABASE\_URLPostgreSQL connection stringpostgresql://postgres:password@localhost:5432/finance\_dbJWT\_SECRETSecret key for JWT token generationyour-secret-key-min-32-charactersPORTServer port number3000NODE\_ENVEnvironment modedevelopment or production

**⚠️ Security Note:** Never commit your .env file to version control. The .env file is included in .gitignore.

🏃 Running the Application
--------------------------

### Development Mode

bash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   # Run with auto-reload on file changes  npm run dev   `

### Production Mode

bash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   # Start production server  npm start   `

### Database Management

bash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   # Generate Prisma Client  npm run prisma:generate  # Run migrations  npm run prisma:migrate  # Open Prisma Studio (Database GUI)  npm run prisma:studio  # Seed database with sample data  npm run prisma:seed   `

### Testing

bash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   # Run all tests  npm test  # Run tests in watch mode  npm run test:watch  # Run tests with coverage report  npm run test:coverage   `

📚 API Documentation
--------------------

### Interactive Documentation (Swagger UI)

Once the server is running, access the interactive API documentation:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   http://localhost:3000/api-docs   `

**Features:**

*   ✅ Browse all available endpoints
    
*   ✅ View request/response schemas
    
*   ✅ Test endpoints directly from browser
    
*   ✅ Authentication support
    
*   ✅ Example requests and responses
    

### How to Use Swagger UI

1.  **Start the server:** npm run dev
    
2.  **Open browser:** Navigate to http://localhost:3000/api-docs
    
3.  **Authenticate:**
    
    *   Click on any /api/auth/login endpoint
        
    *   Click "Try it out"
        
    *   Enter credentials:
        

json

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML     `{         "email": "admin@test.com",         "password": "password123"       }`

*   Click "Execute"
    
*   Copy the token from the response
    
*   Click "Authorize" button at the top
    
*   Enter: Bearer YOUR\_TOKEN\_HERE
    

1.  **Test endpoints:** Now you can test all protected endpoints!
    

### Sample API Requests

#### Register a New User

bash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   curl -X POST http://localhost:3000/api/auth/register \    -H "Content-Type: application/json" \    -d '{      "email": "user@example.com",      "password": "password123",      "name": "John Doe",      "role": "VIEWER"    }'   `

#### Login

bash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   curl -X POST http://localhost:3000/api/auth/login \    -H "Content-Type: application/json" \    -d '{      "email": "user@example.com",      "password": "password123"    }'   `

#### Create a Financial Record

bash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   curl -X POST http://localhost:3000/api/records \    -H "Content-Type: application/json" \    -H "Authorization: Bearer YOUR_JWT_TOKEN" \    -d '{      "amount": 5000,      "type": "INCOME",      "category": "Salary",      "date": "2024-03-15",      "description": "Monthly salary"    }'   `

#### Get Dashboard Overview

bash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   curl -X GET "http://localhost:3000/api/dashboard/overview?startDate=2024-01-01&endDate=2024-12-31" \    -H "Authorization: Bearer YOUR_JWT_TOKEN"   `

🧪 Testing
----------

### Test Coverage

The project includes comprehensive test suites covering:

*   ✅ **Authentication Tests** (13 tests)
    
    *   User registration validation
        
    *   Login scenarios
        
    *   Token authentication
        
    *   Profile access
        
*   ✅ **User Management Tests** (17 tests)
    
    *   CRUD operations
        
    *   Role-based access control
        
    *   User filtering and search
        
    *   Status management
        
*   ✅ **Financial Records Tests** (27 tests)
    
    *   Record creation and validation
        
    *   Advanced filtering
        
    *   Pagination and sorting
        
    *   Bulk operations
        
    *   Ownership checks
        
*   ✅ **Dashboard Analytics Tests** (17 tests)
    
    *   Overview statistics
        
    *   Trend analysis
        
    *   Category breakdowns
        
    *   Financial health scoring
        

**Total: 74+ test cases**

### Running Tests

bash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   # Run all tests  npm test  # Run tests with coverage report  npm run test:coverage  # Run tests in watch mode (auto-rerun on changes)  npm run test:watch  # Run specific test file  npm test -- auth.test.js   `

### Test Results Example

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   PASS  tests/auth.test.js (6.234s)  PASS  tests/user.test.js (7.123s)  PASS  tests/record.test.js (8.456s)  PASS  tests/dashboard.test.js (5.789s)  Test Suites: 4 passed, 4 total  Tests:       74 passed, 74 total  Snapshots:   0 total  Time:        27.602s  Coverage Summary:  Statements   : 85.43% ( 1234/1445 )  Branches     : 78.12% ( 234/299 )  Functions    : 82.34% ( 156/189 )  Lines        : 86.23% ( 1198/1389 )   `

📁 Project Structure
--------------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   FinanceDataProcessingAndAccessControl/  │  ├── src/  │   ├── config/  │   │   ├── database.js          # Prisma client configuration  │   │   └── swagger.js            # Swagger/OpenAPI configuration  │   │  │   ├── controllers/              # Request handlers  │   │   ├── authController.js     # Authentication logic  │   │   ├── userController.js     # User management  │   │   ├── recordController.js   # Financial records  │   │   └── dashboardController.js # Analytics  │   │  │   ├── middleware/               # Custom middleware  │   │   ├── authMiddleware.js     # JWT authentication  │   │   ├── roleMiddleware.js     # Role-based authorization  │   │   ├── validationMiddleware.js # Input validation  │   │   └── errorHandler.js       # Global error handling  │   │  │   ├── routes/                   # API route definitions  │   │   ├── authRoutes.js         # /api/auth/*  │   │   ├── userRoutes.js         # /api/users/*  │   │   ├── recordRoutes.js       # /api/records/*  │   │   └── dashboardRoutes.js    # /api/dashboard/*  │   │  │   ├── services/                 # Business logic layer  │   │   ├── authService.js        # Authentication services  │   │   ├── userService.js        # User management services  │   │   ├── recordService.js      # Record management services  │   │   └── dashboardService.js   # Analytics services  │   │  │   ├── validators/               # Input validation schemas  │   │   ├── authValidator.js      # Auth input validation  │   │   ├── userValidator.js      # User input validation  │   │   └── recordValidator.js    # Record input validation  │   │  │   └── utils/                    # Utility functions  │       ├── errorHandler.js       # Custom error classes  │       ├── response.js           # Response formatters  │       └── logger.js             # Logging utilities  │  ├── prisma/  │   ├── schema.prisma             # Database schema  │   ├── migrations/               # Database migration files  │   └── seed.js                   # Database seeding script  │  ├── tests/  │   ├── helpers/  │   │   └── testHelper.js         # Test utilities  │   ├── globalSetup.js            # Global test setup  │   ├── globalTeardown.js         # Global test cleanup  │   ├── auth.test.js              # Authentication tests  │   ├── user.test.js              # User management tests  │   ├── record.test.js            # Records tests  │   └── dashboard.test.js         # Dashboard tests  │  ├── .env                          # Environment variables (not in git)  ├── .env.example                  # Environment template  ├── .gitignore                    # Git ignore rules  ├── jest.config.js                # Jest configuration  ├── package.json                  # Project dependencies  ├── package-lock.json             # Dependency lock file  ├── README.md                     # Project documentation  └── server.js                     # Application entry point   `

### Architecture Layers

#### 1\. **Routes Layer** (src/routes/)

*   Defines API endpoints
    
*   Maps HTTP methods to controllers
    
*   Applies middleware (auth, validation)
    
*   Contains Swagger documentation
    

#### 2\. **Controllers Layer** (src/controllers/)

*   Handles HTTP requests/responses
    
*   Calls service layer for business logic
    
*   Formats API responses
    
*   Handles errors
    

#### 3\. **Services Layer** (src/services/)

*   Contains core business logic
    
*   Interacts with database via Prisma
    
*   Implements data processing
    
*   Reusable across different routes
    

#### 4\. **Middleware Layer** (src/middleware/)

*   Authentication verification
    
*   Authorization checks
    
*   Input validation
    
*   Error handling
    

#### 5\. **Data Layer** (prisma/)

*   Database schema definition
    
*   Migration management
    
*   Database seeding
    

🔒 Security Features
--------------------

### 1\. **Authentication Security**

*   ✅ Passwords hashed using bcrypt (10 salt rounds)
    
*   ✅ JWT tokens with expiration (7 days)
    
*   ✅ Token-based stateless authentication
    
*   ✅ Secure password requirements (minimum 6 characters)
    

### 2\. **Authorization Security**

*   ✅ Role-based access control (RBAC)
    
*   ✅ Route-level permissions
    
*   ✅ Resource ownership validation
    
*   ✅ Middleware-based authorization
    

### 3\. **Input Validation**

*   ✅ Request body validation using express-validator
    
*   ✅ Query parameter validation
    
*   ✅ Type checking and sanitization
    
*   ✅ Custom validation rules
    

### 4\. **Database Security**

*   ✅ Prisma ORM prevents SQL injection
    
*   ✅ Parameterized queries
    
*   ✅ Type-safe database operations
    
*   ✅ Database constraints and indexes
    

### 5\. **HTTP Security**

*   ✅ Helmet.js for security headers
    
*   ✅ CORS configuration
    
*   ✅ Rate limiting (ready to implement)
    
*   ✅ HTTPS support (production)
    

### 6\. **Error Handling**

*   ✅ Custom error classes
    
*   ✅ Detailed error logging
    
*   ✅ User-friendly error messages
    
*   ✅ Stack trace hiding in production
    

📊 API Response Format
----------------------

### Success Response

json

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   {    "success": true,    "message": "Operation completed successfully",    "data": {      // Response data here    }  }   `

### Error Response

json

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   {    "success": false,    "message": "Error description",    "errors": [      {        "field": "email",        "message": "Email is required"      }    ]  }   `

### Pagination Response

json

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   {    "success": true,    "data": {      "records": [...],      "pagination": {        "currentPage": 1,        "totalPages": 10,        "totalRecords": 95,        "recordsPerPage": 10      }    }  }   `

🎨 Code Quality & Best Practices
--------------------------------

### Design Patterns Used

1.  **MVC Pattern** - Separation of concerns
    
2.  **Repository Pattern** - Data access abstraction (via Prisma)
    
3.  **Middleware Pattern** - Request processing pipeline
    
4.  **Factory Pattern** - Error and response creation
    
5.  **Singleton Pattern** - Database connection
    

### Coding Standards

*   ✅ **ES6+ JavaScript** syntax
    
*   ✅ **Async/Await** for asynchronous operations
    
*   ✅ **Modular code** structure
    
*   ✅ **DRY principle** (Don't Repeat Yourself)
    
*   ✅ **SOLID principles**
    
*   ✅ **Meaningful naming** conventions
    
*   ✅ **Error handling** at every layer
    
*   ✅ **Code comments** for complex logic
    

### Performance Optimizations

*   ✅ Database indexing on frequently queried fields
    
*   ✅ Pagination for large datasets
    
*   ✅ Efficient database queries
    
*   ✅ Connection pooling
    
*   ✅ Caching headers (ready to implement)
    

🚀 Future Enhancements
----------------------

### Planned Features

*   **Advanced Analytics**
    
    *   Predictive spending analysis
        
    *   Budget forecasting
        
    *   Spending pattern recognition
        
    *   Custom report generation
        
*   **Additional Features**
    
    *   File upload for receipts
        
    *   Recurring transactions
        
    *   Multi-currency support
        
    *   Email notifications
        
    *   Data export (CSV, PDF)
        
    *   Budget goals and alerts
        
*   **Performance Improvements**
    
    *   Redis caching layer
        
    *   Rate limiting implementation
        
    *   API response compression
        
    *   Database query optimization
        
*   **Security Enhancements**
    
    *   Two-factor authentication (2FA)
        
    *   OAuth2 integration
        
    *   Refresh token mechanism
        
    *   Audit logging
        
    *   IP whitelisting
        
*   **DevOps**
    
    *   Docker containerization
        
    *   CI/CD pipeline
        
    *   Kubernetes deployment
        
    *   Monitoring and alerting
        
    *   Automated backups
        

🤝 Contributing
---------------

Contributions are welcome! Please follow these steps:

1.  **Fork the repository**
    
2.  **Create a feature branch** (git checkout -b feature/AmazingFeature)
    
3.  **Commit your changes** (git commit -m 'Add some AmazingFeature')
    
4.  **Push to the branch** (git push origin feature/AmazingFeature)
    
5.  **Open a Pull Request**
    

### Contribution Guidelines

*   Follow the existing code style
    
*   Write tests for new features
    
*   Update documentation as needed
    
*   Ensure all tests pass before submitting PR
    
*   Provide clear commit messages
    

📝 License
----------

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

👨‍💻 Author
------------

**Himanshu Kumar**

*   GitHub: [@Himanshu0k](https://github.com/Himanshu0k)
    
*   Repository: [FinanceDataProcessingAndAccessControl](https://github.com/Himanshu0k/FinanceDataProcessingAndAccessControl)
    

📧 Support
----------

For support, questions, or feedback:

*   Open an issue in the GitHub repository
    
*   Email: [your.email@example.com](mailto:your.email@example.com)
    

🙏 Acknowledgments
------------------

*   **Express.js** - Fast, unopinionated web framework
    
*   **Prisma** - Next-generation ORM
    
*   **PostgreSQL** - Powerful open-source database
    
*   **Jest** - Delightful JavaScript testing
    
*   **Swagger** - API documentation
    

📸 Screenshots
--------------

### Swagger API Documentation

Show Image

### API Response Example

json

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   {    "success": true,    "message": "Records fetched successfully",    "data": {      "records": [        {          "id": "123e4567-e89b-12d3-a456-426614174000",          "amount": "5000.00",          "type": "INCOME",          "category": "Salary",          "date": "2024-03-15T00:00:00.000Z",          "description": "Monthly salary",          "createdAt": "2024-03-15T10:30:00.000Z"        }      ],      "pagination": {        "currentPage": 1,        "totalPages": 5,        "totalRecords": 47,        "recordsPerPage": 10      }    }  }   `

🎯 Project Status
-----------------

**Current Version:** 1.0.0**Status:** ✅ Production Ready**Last Updated:** April 2024

### Completed Features ✅

*   Authentication & Authorization
    
*   User Management
    
*   Financial Records CRUD
    
*   Advanced Filtering & Pagination
    
*   Dashboard Analytics
    
*   Comprehensive Testing
    
*   API Documentation
    
*   Security Implementation
    

**⭐ If you find this project helpful, please consider giving it a star on GitHub!**

Made with ❤️ by Himanshu Kumar