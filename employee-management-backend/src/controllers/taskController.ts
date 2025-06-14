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

    const {
      title,
      description,
      assignedTo,
      dueDate,
      scheduledFor,
      isScheduled,
    } = req.body;

    const assignedEmployee = await Employee.findById(assignedTo);

    if (!assignedEmployee) {
      res.status(404).json({ message: "Assigned employee not found" });
      return;
    }

    const admin = await Employee.findById(req.user.userId);

    if (
      !admin ||
      admin.role !== "admin" ||
      admin.company?.toString() !== assignedEmployee.company?.toString()
    ) {
      res.status(403).json({ message: "Cross-company assignment not allowed" });
      return;
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      assignedBy: req.user.userId,
      dueDate,
      scheduledFor,
      isScheduled: isScheduled,
      status: isScheduled ? "pending" : "assigned",
    });

    res.status(201).json({ message: "task Created Sucessfully", task });
  } catch (err) {
    res.status(500).json({ message: "Error creating task", error: err });
  }
};

// GET /api/tasks - Admin gets all tasks
export const getAllTasks = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== "admin") {
      res.status(403).json({ message: "Only admins can view all tasks" });
      return;
    }

    const admin = await Employee.findById(req.user.userId);

    if (!admin) {
      res.status(404).json({ message: "Admin not found" });
      return;
    }

    const companyEmployees = await Employee.find({
      company: admin.company,
    }).select("_id");

    const employeeIds = companyEmployees.map((emp) => emp._id);

    const tasks = await Task.find({ assignedTo: { $in: employeeIds } })
      .populate("assignedTo", "username email")
      .populate("assignedBy", "username email");

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

    const employee = await Employee.findById(req.params.id);
    const admin = await Employee.findById(req.user.userId);

    if (
      !employee ||
      !admin ||
      employee.company?.toString() !== admin.company?.toString()
    ) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    const tasks = await Task.find({ assignedTo: req.params.id }).populate(
      "assignedTo",
      "username email"
    );

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// GET /api/tasks/my - Employee gets their tasks
export const getMyTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find({
      assignedTo: req.user?.userId,
      status: { $in: ["assigned", "completed", "in-progress"] },
    });

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// PUT /api/tasks/update/:id - Employee updates their task status
export const updateTaskStatus = async (req: Request, res: Response) => {
  try {
    const newStatus = req.body.status as string;
    const taskId = req.params.id;

    const task = await Task.findById(taskId);

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    if (task.assignedTo.toString() !== req.user?.userId?.toString()) {
      res
        .status(403)
        .json({ message: "You are not authorized to update this task" });
      return;
    }

    const currentStatus = task.status;

    if (newStatus === "in-progress") {
      if (currentStatus === "assigned" || currentStatus === "pending") {
        task.status = newStatus;
        if (!task.startedAt) {
          task.startedAt = new Date();
        }
      } else if (currentStatus === "in-progress") {
        res.status(200).json({ message: "Task is already in-progress", task });
        return;
      } else {
        res.status(400).json({
          message: `Cannot change status from "${currentStatus}" to "in-progress".`,
        });
        return;
      }
    } else if (newStatus === "completed") {
      if (currentStatus === "in-progress") {
        task.status = newStatus;
        if (!task.completedAt) {
          task.completedAt = new Date();
        }
      } else {
        res.status(400).json({
          message: `Cannot change status from "${currentStatus}" to "completed".`,
        });
        return;
      }
    } else if (newStatus === "assigned" || newStatus === "pending") {
      task.status = newStatus;
      if (newStatus === "assigned" && currentStatus === "in-progress") {
        task.startedAt = null;
        task.completedAt = null;
      }
    } else {
      res.status(400).json({ message: "Invalid status provided." });
      return;
    }

    await task.save();

    res.status(200).json({ message: "Task status updated successfully", task });
  } catch (err: any) {
    console.error("Error updating task status:", err);
    if (err.name === "CastError") {
      res.status(400).json({ message: "Invalid task ID format." });
      return;
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/tasks/:id - Employee gets thier task by id
export const getTaskByTaskId = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    if (task.assignedTo.toString() !== req.user?.userId.toString()) {
      res.status(403).json({ message: "You are not authorized to get this task" });
      return;
    }
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== "admin") {
      res.status(403).json({ message: "Forbidden: Only admins can delete tasks." });
      return;
    }

    const taskId = req.params.id; 

    const taskToDelete = await Task.findById(taskId);

    if (!taskToDelete) {
      res.status(404).json({ message: "Task not found." });
      return;
    }

    if (taskToDelete.assignedBy.toString() !== req.user?.userId.toString()) {
      res.status(403).json({ message: "You are not authorized to get this task" });
      return;
    }

    await Task.findByIdAndDelete(taskId);

    res.status(200).json({ message: "Task deleted successfully." });

  } catch (error: any) {
    // console.error("Error deleting task:", error); // Log the error for debugging
    if (error.name === "CastError") {
      res.status(400).json({ message: "Invalid task ID format." });
      return;
    }
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};