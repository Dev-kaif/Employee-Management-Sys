import express from 'express';
import { startShift, endShift, getShiftById, getShifts } from '../controllers/shiftController';

import { authenticate } from '../middlewares/authMiddleware'

const router = express.Router();

router.use(authenticate);

// Employees
router.post('/start', startShift);
router.post('/end', endShift);
router.get('/my', getShiftById);

// Admin
router.get('/', getShifts);

export default router;
