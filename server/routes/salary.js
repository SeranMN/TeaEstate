import express from 'express';
import { auth, adminOnly } from '../middleware/auth.js';
import db from '../db/index.js';
import { processSalaries } from '../services/salaryService.js';

const router = express.Router();

// Get all salary records
router.get('/', auth, (req, res) => {
  try {
    const records = db.prepare(`
      SELECT 
        s.*,
        e.name as employee_name
      FROM salary_records s
      JOIN employees e ON e.id = s.employee_id
      ORDER BY s.week_starting DESC
    `).all();

    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Process salaries manually
router.post('/process', auth, adminOnly, (req, res) => {
  try {
    processSalaries();
    res.json({ message: 'Salaries processed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;