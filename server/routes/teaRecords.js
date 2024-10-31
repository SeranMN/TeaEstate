import express from 'express';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth.js';
import db from '../db/index.js';

const router = express.Router();

// Get all tea records
router.get('/', auth, (req, res) => {
  try {
    const records = db.prepare(`
      SELECT 
        t.*,
        e.name as employee_name,
        u.username as verified_by_name
      FROM tea_records t
      JOIN employees e ON e.id = t.employee_id
      JOIN users u ON u.id = t.verified_by
      ORDER BY t.date DESC
    `).all();

    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add new tea record
router.post(
  '/',
  auth,
  [
    body('employeeId').notEmpty(),
    body('date').notEmpty().isDate(),
    body('weight').isFloat({ min: 0 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { employeeId, date, weight } = req.body;
      const id = crypto.randomUUID();

      db.prepare(`
        INSERT INTO tea_records (id, employee_id, date, weight, verified_by)
        VALUES (?, ?, ?, ?, ?)
      `).run(id, employeeId, date, weight, req.user.id);

      res.json({ id, employeeId, date, weight, verifiedBy: req.user.id });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

export default router;