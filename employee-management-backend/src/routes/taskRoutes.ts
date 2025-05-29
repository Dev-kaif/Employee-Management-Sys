import express from "express";
import {
  assignTask,
  getAllTasks,
  getTasksByEmployee,
  getMyTasks,
  updateTaskStatus,
} from "../controllers/taskController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

// Protect all routes
router.use(authenticate);

// Admin Routes
router.post("/assign", assignTask);
router.get("/", getAllTasks);
router.get("/employee/:id", getTasksByEmployee);

// Employee Routes
router.get("/my", getMyTasks);
router.put("/update/:id", updateTaskStatus);

export default router;
