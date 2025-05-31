import express from 'express';
import { createEmployee, getAllEmployees, getEmployeeById,getMyEmployee, updateEmployee, deleteEmployee, changeEmployeePassword } from '../controllers/employeeController';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

// All routes require authentication

router.use(authenticate); 

router.post('/', createEmployee);
router.get('/', getAllEmployees);
router.get('/my', getMyEmployee);
router.get('/:id', getEmployeeById);
router.put('/:id', updateEmployee);
router.put('/changePassword/:id', changeEmployeePassword);
router.delete('/:id', deleteEmployee);

export default router;
