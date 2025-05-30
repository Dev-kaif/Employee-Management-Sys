import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Employee } from "../models/employeeModel";
import { JWT_SECRET } from "../config/config";

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password, designation, department, role, company } = req.body;

    const existingUser = await Employee.findOne({ email });

    if (existingUser) {
      res.status(409).json({ message: "Email already in use" });
      return;
    }

    if (role === "admin") {
      const existingAdmin = await Employee.findOne({ company, role: "admin" });
      if (existingAdmin) {
        res.status(403).json({
          message: `An admin already exists for the company "${company}"`,
        });
        return;
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = await Employee.create({
      username,
      email,
      password: hashedPassword,
      designation,
      department,
      role,
      company,
    });

    const token = jwt.sign(
      { userId: newEmployee._id, role: newEmployee.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: newEmployee._id,
        username: newEmployee.username,
        email: newEmployee.email,
        role: newEmployee.role,
        company: newEmployee.company,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await Employee.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
