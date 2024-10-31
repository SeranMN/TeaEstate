import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRoutes from './routes/auth.js';
import employeeRoutes from './routes/employees.js';
import teaRecordRoutes from './routes/teaRecords.js';
import salaryRoutes from './routes/salary.js';
import { initDb } from './db/index.js';
import { processSalaries } from './services/salaryService.js';
import { sendDailyReport } from './services/emailService.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 3000;

// Initialize database
initDb();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/tea-records', teaRecordRoutes);
app.use('/api/salary', salaryRoutes);

// Schedule salary processing every Monday at 1 AM
cron.schedule('0 1 * * 1', processSalaries);

// Schedule daily report at 11 PM
cron.schedule('0 23 * * *', sendDailyReport);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});