import { Request, Response } from "express";
import { Shift } from "../models/shiftModel";
import { Employee } from "../models/employeeModel";

const canAccessShift = (req: Request, shiftUserId: string) => {
  return req.user?.role === "admin" || req.user?.userId === shiftUserId;
};

// Start a new shift
export const startShift = async (req: Request, res: Response) => {
  if (req.user?.role !== "employee") {
    res.status(403).json({ message: "Only employees can start shifts" });
    return;
  }

  try {
    // Check if there is an ongoing shift for this user
    const ongoingShift = await Shift.findOne({
      employee: req.user.userId,
      endTime: null,
    });

    if (ongoingShift) {
      res.status(400).json({ message: "Shift already in progress" });
      return;
    }

    const newShift = await Shift.create({
      employee: req.user.userId,
      startTime: new Date(),
      endTime: null,
      workSummary: null,
    });

    res.status(201).json({ message: "Shift started", shift: newShift });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// End a shift
export const endShift = async (req: Request, res: Response) => {

  const shiftId = req.params.id
  const { workSummery }:{ workSummery:string  } = req.body

  if (req.user?.role !== "employee") {
    res.status(403).json({ message: "Only employees can end shifts" });
    return;
  }

  if(!workSummery){
    res.status(403).json({ message: "Work Summary is required" });
    return;
  }

  try {
    const shift = await Shift.findById(shiftId);

    if (!shift) {
      res.status(404).json({ message: "Shift not found" });
      return;
    }

    if (!canAccessShift(req, shift.employee.toString())) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    if (shift.endTime) {
      res.status(400).json({ message: "Shift already ended" });
      return;
    }

    shift.endTime = new Date();
    shift.workSummary = workSummery;
    await shift.save();

    res.status(200).json({ message: "Shift ended", shift });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};


// /shifts/:id - Get shift details (employee or admin)
export const getShiftById = async (req: Request, res: Response) => {
  try {
    const shiftId = req.params.id
    const shift = await Shift.findById(shiftId);

    if (!shift) {
      res.status(404).json({ message: "Shift not found" });
      return;
    }
    if (!canAccessShift(req, shift.employee.toString())) {
      res.status(403).json({ message: "Access denied" });
      return 
    }

    res.status(200).json(shift);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};


// List shifts (employee gets own, admin gets all)
export const getShifts = async (req: Request, res: Response) => {

  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const requestingUser = await Employee.findById(req.user.userId);

    if (!requestingUser) {
      res.status(404).json({ message: "Admin not found" });
      return;
    }

    let shifts;

    if (requestingUser.role === "admin") {

      const usersInCompany = await Employee.find({
        company: requestingUser.company,
      }).select("_id");

      const userIds = usersInCompany.map(user => user._id);

      shifts = await Shift.find({ employee: { $in: userIds } });

    } else if (requestingUser.role === "employee") {
      
      shifts = await Shift.find({ employee: requestingUser._id });
      
    } else {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    res.status(200).json(shifts);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};   


