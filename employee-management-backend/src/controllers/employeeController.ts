import { Request, Response } from "express";
import { Employee } from "../models/employeeModel";


const isAdmin = (req: Request) => req.user?.role === "admin";

export const getAllEmployees = async (req: Request, res: Response) => {
  if (!isAdmin(req)) {
    res.status(403).json({ message: "Access denied, admin only" });
    return;
  }

  try {
    const employees = await Employee.find();
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
    const { name, email, position, department } = req.body;

    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      res.status(400).json({ message: "Employee with this email already exists" });
      return;
    }

    const newEmployee = new Employee({
      name,
      email,
      position,
      department,
    });

    await newEmployee.save();

    res.status(201).json({
      message: "Employee created successfully",
      employee: newEmployee,
    });

  } catch (error) {
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

    res.status(200).json({ message: "Employee updated", employee: updatedEmployee });
    
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
