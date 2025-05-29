import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee', 
      required: true,
    },
    dueDate: { type: Date, required: true },
    scheduledFor: {
        type: Date,
      },
      isScheduled: {
        type: Boolean,
        default: false,
      },
      status: {
        type: String,
        enum: ['pending', 'assigned', 'in-progress', 'completed'], 
      },
    startedAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export const Task = mongoose.model('Task', taskSchema);
