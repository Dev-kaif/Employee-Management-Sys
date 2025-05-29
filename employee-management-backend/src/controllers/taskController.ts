import { Request, Response } from "express";
import { Task } from "../models/taskModel";
import { Employee } from "../models/employeeModel";

// POST /api/tasks/assign - Admin assigns task
export const assignTask = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== "admin") {
      res.status(403).json({ message: "Only admins can assign tasks" });
      return;
    }

    const { title, description, assignedTo, dueDate } = req.body;

    const employee = await Employee.findById(assignedTo);

    if (!employee) {
      res.status(404).json({ message: "Assigned employee not found" });
      return;
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      assignedBy: req.user.userId,
      dueDate,
    });

    res.status(201).json({ message: "Task assigned", task });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};



// GET /api/tasks - Admin gets all tasks
export const getAllTasks = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== "admin") {
      res.status(403).json({ message: "Only admins can view all tasks" });
      return;
    }

    const tasks = await Task.find()
      .populate("assignedTo", "name email")
      .populate("assignedBy", "name email");

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};



// GET /api/tasks/employee/:id - Admin gets tasks by employee
export const getTasksByEmployee = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== "admin") {
      res
        .status(403)
        .json({ message: "Only admins can view tasks by employee" });
      return;
    }

    const { id } = req.params;

    const tasks = await Task.find({ assignedTo: id }).populate(
      "assignedTo",
      "name email"
    );

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};



// GET /api/tasks/my - Employee gets their tasks
export const getMyTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user?.userId });

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};



// PUT /api/tasks/update/:id - Employee updates their task status
export const updateTaskStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const taskId = req.params.id;

    const task = await Task.findById(taskId);
    res.status(404).json({ message: "Task not found" });
    if (!task) return;

    // Only assigned employee can update
    if (task.assignedTo.toString() !== req.user?.userId.toString()) {
      res
        .status(403)
        .json({ message: "You are not authorized to update this task" });
      return;
    }

    task.status = status;

    if (status === "in-progress") task.startedAt = new Date();
    if (status === "completed") task.completedAt = new Date();

    await task.save();

    res.status(200).json({ message: "Task status updated", task });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};
