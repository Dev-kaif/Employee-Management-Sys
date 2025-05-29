import { Request, Response } from "express";
import { Shift } from "../models/shiftModel";

const canAccessShift = (req: Request, shiftUserId: string) => {
  req.user?.role === "admin" || req.user?.userId === shiftUserId;
  return;
};

// POST /shifts/start - Start a new shift (employee only)
export const startShift = async (req: Request, res: Response) => {
  if (req.user?.role !== "employee") {
    res.status(403).json({ message: "Only employees can start shifts" });
    return;
  }

  try {
    // Check if there is an ongoing shift for this user
    const ongoingShift = await Shift.findOne({
      user: req.user.userId,
      endTime: null,
    });

    if (ongoingShift) {
      res.status(400).json({ message: "Shift already in progress" });
      return;
    }

    const newShift = Shift.create({
      user: req.user.userId,
      startTime: new Date(),
      endTime: null,
      workLogs: [],
    });

    res.status(201).json({ message: "Shift started", shift: newShift });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// PUT /shifts/:id/end - End a shift (employee only)
export const endShift = async (req: Request, res: Response) => {
  if (req.user?.role !== "employee") {
    res.status(403).json({ message: "Only employees can end shifts" });
    return;
  }

  try {
    const shift = await Shift.findById(req.params.id);

    if (!shift) {
      res.status(404).json({ message: "Shift not found" });
      return;
    }

    if (shift.endTime) {
      res.status(400).json({ message: "Shift already ended" });
      return;
    }

    shift.endTime = new Date();
    await shift.save();

    res.status(200).json({ message: "Shift ended", shift });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// PUT /shifts/:id/worklogs - Add work logs to a shift (employee only)
export const addWorkLogs = async (req: Request, res: Response) => {
  if (req.user?.role !== "employee") {
    res.status(403).json({ message: "Only employees can add work logs" });
    return;
  }

  try {
    const shift = await Shift.findById(req.params.id);

    if (!shift) {
      res.status(404).json({ message: "Shift not found" });
      return;
    }

    if (shift.endTime) {
      res.status(400).json({ message: "Cannot add logs to ended shift" });
      return;
    }

    const { workSummary } = req.body;

    if (!Array.isArray(workSummary)) {
      res.status(400).json({ message: "workLogs must be an array" });
      return;
    }

    shift.workSummary = req.body.workSummary || shift.workSummary;

    await shift.save();

    res.status(200).json({ message: "Work logs added", shift });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /shifts/:id - Get shift details (employee or admin)
export const getShiftById = async (req: Request, res: Response) => {
  try {
    const shift = await Shift.findById(req.params.id);

    if (!shift) {
      res.status(404).json({ message: "Shift not found" });
      return;
    }

    res.status(200).json(shift);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /shifts - List shifts (employee gets own, admin gets all)
export const getShifts = async (req: Request, res: Response) => {
  try {
    let shifts;

    if (req.user?.role === "admin") {
      shifts = await Shift.find();
    } else if (req.user?.role === "employee") {
      shifts = await Shift.find({ user: req.user.userId });
    } else {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    res.status(200).json(shifts);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
