import db from '../db/index.js';
import { sendSalaryReport } from './emailService.js';

export function processSalaries() {
  const minimumWeight = 30; // kg
  const today = new Date();
  const weekStart = new Date(today.setDate(today.getDate() - 7));
  
  // Get all tea records for the past week
  const records = db.prepare(`
    SELECT 
      employee_id,
      date,
      weight
    FROM tea_records
    WHERE date >= ? AND date <= ?
    ORDER BY employee_id, date
  `).all(weekStart.toISOString().split('T')[0], today.toISOString().split('T')[0]);

  // Group records by employee
  const employeeRecords = {};
  records.forEach(record => {
    if (!employeeRecords[record.employee_id]) {
      employeeRecords[record.employee_id] = [];
    }
    employeeRecords[record.employee_id].push(record);
  });

  // Calculate salaries
  const salaryRecords = [];
  Object.entries(employeeRecords).forEach(([employeeId, records]) => {
    // Skip Tuesdays and calculate daily averages
    const dailyAverages = records.reduce((acc, record) => {
      const day = new Date(record.date).getDay();
      if (day !== 2) { // Skip Tuesday (2)
        if (!acc[record.date]) {
          acc[record.date] = { total: 0, count: 0 };
        }
        acc[record.date].total += record.weight;
        acc[record.date].count++;
      }
      return acc;
    }, {});

    // Calculate days worked (days with average >= minimumWeight)
    const daysWorked = Object.values(dailyAverages).filter(
      day => (day.total / day.count) >= minimumWeight
    ).length;

    // Calculate overall average
    const totalWeight = Object.values(dailyAverages).reduce(
      (sum, day) => sum + day.total, 0
    );
    const totalDays = Object.values(dailyAverages).reduce(
      (sum, day) => sum + day.count, 0
    );
    const averageWeight = totalWeight / totalDays;

    // Calculate total amount (simplified example)
    const ratePerDay = 1000; // LKR
    const totalAmount = daysWorked * ratePerDay;

    salaryRecords.push({
      employee_id: employeeId,
      week_starting: weekStart.toISOString().split('T')[0],
      week_ending: today.toISOString().split('T')[0],
      days_worked: daysWorked,
      average_weight: averageWeight,
      total_amount: totalAmount,
      status: 'pending'
    });
  });

  // Save salary records
  const stmt = db.prepare(`
    INSERT INTO salary_records (
      id, employee_id, week_starting, week_ending,
      days_worked, average_weight, total_amount, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((records) => {
    records.forEach(record => {
      stmt.run(
        crypto.randomUUID(),
        record.employee_id,
        record.week_starting,
        record.week_ending,
        record.days_worked,
        record.average_weight,
        record.total_amount,
        record.status
      );
    });
  });

  insertMany(salaryRecords);

  // Send email report
  sendSalaryReport(salaryRecords);
}