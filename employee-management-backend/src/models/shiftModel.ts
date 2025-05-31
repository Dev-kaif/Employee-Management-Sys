import mongoose from 'mongoose';

const shiftSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
    totalHours: {
      type: Number, 
    },
    workSummary: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Shift = mongoose.model('Shift', shiftSchema);
