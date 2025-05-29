import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config";

interface JwtPayload {
  userId: string;
  role: "admin" | "employee";
}

export const authenticate = ( req: Request, res: Response, next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Authorization token missing or invalid" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }
};
