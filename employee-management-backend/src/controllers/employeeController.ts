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

    // If admin is not found or company is missing, handle error
    if (!admin || !admin.company) {
      res.status(404).json({ message: "Admin or admin's company not found" });
      return;
    }

    // Find all employees in the same company, excluding the current admin's ID
    const employees = await Employee.find({
      company: admin.company,
      _id: { $ne: req.user?.userId } // Exclude the current user's ID
    });

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
    const { username, email, password, designation, department } =
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
      role:"employee",
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



export const changeEmployeePassword = async (req: Request, res: Response) => {
  // Only an admin should be able to change another employee's password
  if (!isAdmin(req)) {
    res.status(403).json({ message: "Access denied, admin only" });
    return;
  }

  const { id } = req.params; 
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    res.status(400).json({ message: "New password must be at least 6 characters long." });
    return;
  }

  try {
    const employee = await Employee.findById(id);

    if (!employee) {
      res.status(404).json({ message: "Employee not found." });
      return;
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    employee.password = hashedPassword;
    await employee.save(); 

    res.status(200).json({ message: "Employee password updated successfully." });
  } catch (error) {
    console.error("Change Employee Password Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


// employee gets his own data
export const getMyEmployee = async (req: Request, res: Response) => {
  try {
    const employee = await Employee.findById(req.user?.userId);

    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
