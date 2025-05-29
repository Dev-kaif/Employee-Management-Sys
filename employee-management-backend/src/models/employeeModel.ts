import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
    },
    department: {
      type: String,
    },
    role: {
      type: String,
      enum: ['admin', 'employee'],
      default: 'employee',
    },
  },
  { timestamps: true }
);

export const Employee = mongoose.model('Employee', employeeSchema);
