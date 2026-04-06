const prisma = require('../config/database');
const AppError = require('../utils/errorHandler');

class DashboardService {
  // Get overview statistics
  async getOverview(userRole, userId, filters = {}) {
    const { startDate, endDate } = filters;

    const where = {};

    // If VIEWER, only show own records
    if (userRole === 'VIEWER') {
      where.userId = userId;
    }

    // Apply date filters
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    // Get all records matching criteria
    const records = await prisma.record.findMany({
      where,
      select: {
        amount: true,
        type: true,
        date: true
      }
    });

    // Calculate totals
    const totalIncome = records
      .filter(r => r.type === 'INCOME')
      .reduce((sum, r) => sum + Number(r.amount), 0);

    const totalExpense = records
      .filter(r => r.type === 'EXPENSE')
      .reduce((sum, r) => sum + Number(r.amount), 0);

    const netBalance = totalIncome - totalExpense;

    // Count records
    const incomeCount = records.filter(r => r.type === 'INCOME').length;
    const expenseCount = records.filter(r => r.type === 'EXPENSE').length;

    return {
      totalIncome,
      totalExpense,
      netBalance,
      totalRecords: records.length,
      incomeCount,
      expenseCount,
      averageIncome: incomeCount > 0 ? totalIncome / incomeCount : 0,
      averageExpense: expenseCount > 0 ? totalExpense / expenseCount : 0
    };
  }

  // Get category-wise breakdown
  async getCategoryBreakdown(userRole, userId, filters = {}) {
    const { startDate, endDate, type } = filters;

    const where = {};

    if (userRole === 'VIEWER') {
      where.userId = userId;
    }

    if (type) {
      where.type = type;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const records = await prisma.record.findMany({
      where,
      select: {
        category: true,
        type: true,
        amount: true
      }
    });

    // Group by category
    const categoryMap = {};

    records.forEach(record => {
      if (!categoryMap[record.category]) {
        categoryMap[record.category] = {
          category: record.category,
          totalIncome: 0,
          totalExpense: 0,
          netAmount: 0,
          transactionCount: 0,
          incomeCount: 0,
          expenseCount: 0
        };
      }

      const amount = Number(record.amount);
      categoryMap[record.category].transactionCount++;

      if (record.type === 'INCOME') {
        categoryMap[record.category].totalIncome += amount;
        categoryMap[record.category].incomeCount++;
      } else {
        categoryMap[record.category].totalExpense += amount;
        categoryMap[record.category].expenseCount++;
      }

      categoryMap[record.category].netAmount = 
        categoryMap[record.category].totalIncome - categoryMap[record.category].totalExpense;
    });

    // Convert to array and sort by total amount
    const categories = Object.values(categoryMap).sort((a, b) => {
      const totalA = a.totalIncome + a.totalExpense;
      const totalB = b.totalIncome + b.totalExpense;
      return totalB - totalA;
    });

    // Calculate percentages
    const grandTotal = categories.reduce((sum, cat) => 
      sum + cat.totalIncome + cat.totalExpense, 0
    );

    categories.forEach(cat => {
      const categoryTotal = cat.totalIncome + cat.totalExpense;
      cat.percentage = grandTotal > 0 ? ((categoryTotal / grandTotal) * 100).toFixed(2) : 0;
    });

    return categories;
  }

  // Get recent activity
  async getRecentActivity(userRole, userId, limit = 10) {
    const where = {};

    if (userRole === 'VIEWER') {
      where.userId = userId;
    }

    const records = await prisma.record.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: parseInt(limit)
    });

    return records;
  }

  // Get monthly trends
  async getMonthlyTrends(userRole, userId, filters = {}) {
    const { year = new Date().getFullYear() } = filters;

    const where = {};

    if (userRole === 'VIEWER') {
      where.userId = userId;
    }

    // Get records for the specified year
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59);

    where.date = {
      gte: startOfYear,
      lte: endOfYear
    };

    const records = await prisma.record.findMany({
      where,
      select: {
        amount: true,
        type: true,
        date: true
      }
    });

    // Initialize months array
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const monthlyData = months.map((month, index) => ({
      month,
      monthNumber: index + 1,
      totalIncome: 0,
      totalExpense: 0,
      netAmount: 0,
      transactionCount: 0
    }));

    // Aggregate data by month
    records.forEach(record => {
      const monthIndex = new Date(record.date).getMonth();
      const amount = Number(record.amount);

      monthlyData[monthIndex].transactionCount++;

      if (record.type === 'INCOME') {
        monthlyData[monthIndex].totalIncome += amount;
      } else {
        monthlyData[monthIndex].totalExpense += amount;
      }

      monthlyData[monthIndex].netAmount = 
        monthlyData[monthIndex].totalIncome - monthlyData[monthIndex].totalExpense;
    });

    return {
      year: parseInt(year),
      months: monthlyData
    };
  }

  // Get weekly trends (last 12 weeks)
  async getWeeklyTrends(userRole, userId) {
    const where = {};

    if (userRole === 'VIEWER') {
      where.userId = userId;
    }

    // Get records from last 12 weeks
    const twelveWeeksAgo = new Date();
    twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84); // 12 weeks * 7 days

    where.date = {
      gte: twelveWeeksAgo
    };

    const records = await prisma.record.findMany({
      where,
      select: {
        amount: true,
        type: true,
        date: true
      },
      orderBy: {
        date: 'asc'
      }
    });

    // Group by week
    const weeklyMap = {};

    records.forEach(record => {
      const recordDate = new Date(record.date);
      const weekStart = new Date(recordDate);
      weekStart.setDate(recordDate.getDate() - recordDate.getDay()); // Start of week (Sunday)
      weekStart.setHours(0, 0, 0, 0);
      
      const weekKey = weekStart.toISOString().split('T')[0];

      if (!weeklyMap[weekKey]) {
        weeklyMap[weekKey] = {
          weekStart: weekStart,
          weekEnd: new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000),
          totalIncome: 0,
          totalExpense: 0,
          netAmount: 0,
          transactionCount: 0
        };
      }

      const amount = Number(record.amount);
      weeklyMap[weekKey].transactionCount++;

      if (record.type === 'INCOME') {
        weeklyMap[weekKey].totalIncome += amount;
      } else {
        weeklyMap[weekKey].totalExpense += amount;
      }

      weeklyMap[weekKey].netAmount = 
        weeklyMap[weekKey].totalIncome - weeklyMap[weekKey].totalExpense;
    });

    const weeks = Object.values(weeklyMap).sort((a, b) => 
      a.weekStart - b.weekStart
    );

    return weeks;
  }

  // Get top categories (highest spending/earning)
  async getTopCategories(userRole, userId, filters = {}) {
    const { type, limit = 5 } = filters;

    const where = {};

    if (userRole === 'VIEWER') {
      where.userId = userId;
    }

    if (type) {
      where.type = type;
    }

    const records = await prisma.record.findMany({
      where,
      select: {
        category: true,
        amount: true,
        type: true
      }
    });

    // Group by category
    const categoryMap = {};

    records.forEach(record => {
      if (!categoryMap[record.category]) {
        categoryMap[record.category] = {
          category: record.category,
          total: 0,
          count: 0,
          type: record.type
        };
      }

      categoryMap[record.category].total += Number(record.amount);
      categoryMap[record.category].count++;
    });

    // Convert to array and sort by total
    const topCategories = Object.values(categoryMap)
      .sort((a, b) => b.total - a.total)
      .slice(0, parseInt(limit));

    return topCategories;
  }

  // Get income vs expense comparison
  async getIncomeExpenseComparison(userRole, userId, filters = {}) {
    const { period = 'monthly', year = new Date().getFullYear() } = filters;

    const where = {};

    if (userRole === 'VIEWER') {
      where.userId = userId;
    }

    let startDate, endDate;

    if (period === 'yearly') {
      // Last 5 years
      startDate = new Date(year - 4, 0, 1);
      endDate = new Date(year, 11, 31);
    } else if (period === 'quarterly') {
      // 4 quarters of current year
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 11, 31);
    } else {
      // Monthly (default) - current year
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 11, 31);
    }

    where.date = {
      gte: startDate,
      lte: endDate
    };

    const records = await prisma.record.findMany({
      where,
      select: {
        amount: true,
        type: true,
        date: true
      }
    });

    let comparisonData;

    if (period === 'yearly') {
      // Group by year
      const yearMap = {};
      
      for (let y = year - 4; y <= year; y++) {
        yearMap[y] = { year: y, income: 0, expense: 0, net: 0 };
      }

      records.forEach(record => {
        const recordYear = new Date(record.date).getFullYear();
        const amount = Number(record.amount);

        if (record.type === 'INCOME') {
          yearMap[recordYear].income += amount;
        } else {
          yearMap[recordYear].expense += amount;
        }

        yearMap[recordYear].net = yearMap[recordYear].income - yearMap[recordYear].expense;
      });

      comparisonData = Object.values(yearMap);

    } else if (period === 'quarterly') {
      // Group by quarter
      const quarters = [
        { quarter: 'Q1', months: [0, 1, 2], income: 0, expense: 0, net: 0 },
        { quarter: 'Q2', months: [3, 4, 5], income: 0, expense: 0, net: 0 },
        { quarter: 'Q3', months: [6, 7, 8], income: 0, expense: 0, net: 0 },
        { quarter: 'Q4', months: [9, 10, 11], income: 0, expense: 0, net: 0 }
      ];

      records.forEach(record => {
        const month = new Date(record.date).getMonth();
        const quarterIndex = Math.floor(month / 3);
        const amount = Number(record.amount);

        if (record.type === 'INCOME') {
          quarters[quarterIndex].income += amount;
        } else {
          quarters[quarterIndex].expense += amount;
        }

        quarters[quarterIndex].net = quarters[quarterIndex].income - quarters[quarterIndex].expense;
      });

      comparisonData = quarters;

    } else {
      // Monthly (default)
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      const monthlyData = months.map((month, index) => ({
        month,
        monthNumber: index + 1,
        income: 0,
        expense: 0,
        net: 0
      }));

      records.forEach(record => {
        const monthIndex = new Date(record.date).getMonth();
        const amount = Number(record.amount);

        if (record.type === 'INCOME') {
          monthlyData[monthIndex].income += amount;
        } else {
          monthlyData[monthIndex].expense += amount;
        }

        monthlyData[monthIndex].net = monthlyData[monthIndex].income - monthlyData[monthIndex].expense;
      });

      comparisonData = monthlyData;
    }

    return {
      period,
      year: parseInt(year),
      data: comparisonData
    };
  }

  // Get financial health score
  async getFinancialHealth(userRole, userId) {
    const where = {};

    if (userRole === 'VIEWER') {
      where.userId = userId;
    }

    // Get last 3 months data
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    where.date = {
      gte: threeMonthsAgo
    };

    const records = await prisma.record.findMany({
      where,
      select: {
        amount: true,
        type: true,
        date: true
      }
    });

    const totalIncome = records
      .filter(r => r.type === 'INCOME')
      .reduce((sum, r) => sum + Number(r.amount), 0);

    const totalExpense = records
      .filter(r => r.type === 'EXPENSE')
      .reduce((sum, r) => sum + Number(r.amount), 0);

    const savingsRate = totalIncome > 0 
      ? ((totalIncome - totalExpense) / totalIncome * 100).toFixed(2)
      : 0;

    const expenseToIncomeRatio = totalIncome > 0
      ? ((totalExpense / totalIncome) * 100).toFixed(2)
      : 0;

    // Calculate health score (0-100)
    let healthScore = 100;

    // Deduct points based on expense ratio
    if (expenseToIncomeRatio > 90) healthScore -= 40;
    else if (expenseToIncomeRatio > 80) healthScore -= 30;
    else if (expenseToIncomeRatio > 70) healthScore -= 20;
    else if (expenseToIncomeRatio > 60) healthScore -= 10;

    // Add points for positive savings
    if (savingsRate > 30) healthScore += 10;
    else if (savingsRate > 20) healthScore += 5;

    // Ensure score is between 0 and 100
    healthScore = Math.max(0, Math.min(100, healthScore));

    let healthStatus;
    if (healthScore >= 80) healthStatus = 'Excellent';
    else if (healthScore >= 60) healthStatus = 'Good';
    else if (healthScore >= 40) healthStatus = 'Fair';
    else healthStatus = 'Needs Improvement';

    return {
      healthScore: parseFloat(healthScore.toFixed(2)),
      healthStatus,
      savingsRate: parseFloat(savingsRate),
      expenseToIncomeRatio: parseFloat(expenseToIncomeRatio),
      totalIncome,
      totalExpense,
      netSavings: totalIncome - totalExpense,
      period: 'Last 3 months'
    };
  }
}

module.exports = new DashboardService();