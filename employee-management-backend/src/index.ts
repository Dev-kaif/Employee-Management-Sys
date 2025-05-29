import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes";
import employeeRoutes from "./routes/employeeRoutes";
import shiftRoutes from "./routes/shiftRoutes";
import taskRoutes from "./routes/taskRoutes";
import { Mongo_Db_URL } from "./config/config";


const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/shifts", shiftRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;

interface IUserPayload {
  userId: string;
  role: "admin" | "employee";
}

declare global {
  namespace Express {
    interface Request {
      user?: IUserPayload;
    }
  }
}

async function main() {
  try {
    await mongoose.connect(Mongo_Db_URL);
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error(" MongoDB connection failed:", err);
    process.exit(1);
  }
}

main()
