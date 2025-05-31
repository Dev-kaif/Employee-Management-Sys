import express from "express";
import {
  assignTask,
  getAllTasks,
  getTasksByEmployee,
  getMyTasks,
  updateTaskStatus,
  getTaskByTaskId,
  deleteTask,
} from "../controllers/taskController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.use(authenticate);

// Admin
router.post("/assign", assignTask);
router.get("/", getAllTasks);
router.get("/employee/:id", getTasksByEmployee);
router.delete("/:id", deleteTask);

// Employee
router.get("/my", getMyTasks);
router.put("/update/:id", updateTaskStatus);
router.get("/:id", getTaskByTaskId);

export default router;
