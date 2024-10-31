import nodemailer from 'nodemailer';
import db from '../db/index.js';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendSalaryReport(salaryRecords) {
  const adminEmails = db.prepare(
    'SELECT username FROM users WHERE role = ?'
  ).all('admin').map(user => user.username);

  const html = generateSalaryReportHtml(salaryRecords);

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: adminEmails.join(','),
    subject: 'Weekly Salary Report',
    html,
  });
}

export async function sendDailyReport() {
  const today = new Date().toISOString().split('T')[0];
  const records = db.prepare(`
    SELECT e.name, t.weight
    FROM tea_records t
    JOIN employees e ON e.id = t.employee_id
    WHERE date = ?
  `).all(today);

  const html = generateDailyReportHtml(records);

  const adminEmails = db.prepare(
    'SELECT username FROM users WHERE role = ?'
  ).all('admin').map(user => user.username);

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: adminEmails.join(','),
    subject: `Daily Tea Collection Report - ${today}`,
    html,
  });
}

function generateSalaryReportHtml(records) {
  return `
    <h2>Weekly Salary Report</h2>
    <table border="1" cellpadding="5">
      <tr>
        <th>Employee</th>
        <th>Days Worked</th>
        <th>Average Weight</th>
        <th>Total Amount</th>
      </tr>
      ${records.map(record => `
        <tr>
          <td>${record.employee_name}</td>
          <td>${record.days_worked}</td>
          <td>${record.average_weight}kg</td>
          <td>$${record.total_amount}</td>
        </tr>
      `).join('')}
    </table>
  `;
}

function generateDailyReportHtml(records) {
  return `
    <h2>Daily Tea Collection Report</h2>
    <table border="1" cellpadding="5">
      <tr>
        <th>Employee</th>
        <th>Weight Collected</th>
      </tr>
      ${records.map(record => `
        <tr>
          <td>${record.name}</td>
          <td>${record.weight}kg</td>
        </tr>
      `).join('')}
    </table>
  `;
}