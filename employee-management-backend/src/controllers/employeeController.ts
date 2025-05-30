import { Request, Response } from "express";
import { Employee } from "../models/employeeModel";
import bcrypt from "bcryptjs";

const isAdmin = (req: Request) => req.user?.role === "admin";

export const getAllEmployees = async (req: Request, res: Response) => {
  if (!isAdmin(req)) {
    res.status(403).json({ message: "Access denied, admin only" });
    return;
  }

  try {
    const admin = await Employee.findById(req.user?.userId);
    const employees = await Employee.find({ company: admin?.company }); 
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getEmployeeById = async (req: Request, res: Response) => {
  if (!isAdmin(req)) {
    res.status(403).json({ message: "Access denied, admin only" });
    return;
  }

  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createEmployee = async (req: Request, res: Response) => {
  if (!isAdmin(req)) {
    res.status(403).json({ message: "Access denied, admin only" });
    return;
  }

  try {
    const { username, email, password, designation, department, role } =
      req.body;

    // Ensure the employee doesn't already exist
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      res.status(400).json({ message: "Employee with this email already exists" });
      return;
    }

    // Get the admin who is creating this employee
    const admin = await Employee.findById(req.user?.userId);
    if (!admin || admin.role !== "admin") {
      res.status(403).json({ message: "Only admins can create employees" });
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new employee under the admin's company
    const newEmployee = new Employee({
      username,
      email,
      password: hashedPassword,
      designation,
      department,
      role,
      company: admin.company,
    });

    await newEmployee.save();

    res.status(201).json({
      message: "Employee created successfully",
      employee: newEmployee,
    });
  } catch (error) {
    console.error("Create Employee Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateEmployee = async (req: Request, res: Response) => {
  if (!isAdmin(req)) {
    res.status(403).json({ message: "Access denied, admin only" });
    return;
  }

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!updatedEmployee) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }

    res
      .status(200)
      .json({ message: "Employee updated", employee: updatedEmployee });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  if (!isAdmin(req)) {
    res.status(403).json({ message: "Access denied, admin only" });
    return;
  }

  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);

    if (!deletedEmployee) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }

    res.status(200).json({ message: "Employee deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
