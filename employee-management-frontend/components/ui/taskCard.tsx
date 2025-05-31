// components/TaskCard.tsx
import React from "react";
import { motion } from "motion/react";
import { Task } from "@/lib/types"; // Corrected import path for Task type
import Button from "@/components/ui/button"; // Assuming you have this Button component
import { Eye } from "lucide-react"; // Import an eye icon for "View Details"
import { useRouter } from "next/navigation";

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const router = useRouter();

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "assigned": // Added assigned status color
        return "bg-blue-500 text-white";
      case "in-progress":
        return "bg-primary text-white";
      case "completed":
        return "bg-success text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Assuming 'dueDate' from Task interface is your 'deadline'
  const isOverdue =
    new Date(task.dueDate) < new Date() && task.status !== "completed";

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
      className={`bg-surface rounded-lg p-6 shadow-sm border transition-all duration-200 hover:shadow-md ${
        isOverdue ? "border-error" : "border-gray-100"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <h4 className="font-semibold text-text line-clamp-2 pr-4">
          {task.title}
        </h4>{" "}
        {/* Added pr-4 for spacing */}
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(
            task.status
          )}`}
        >
          {task.status}
        </span>
      </div>

      <p className="text-text-secondary text-sm mb-4 line-clamp-3">
        {task.description}
      </p>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">DeadLine:</span>{" "}
          {/* Changed from Deadline */}
          <span className={isOverdue ? "text-error font-medium" : "text-text"}>
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Button to navigate to detailed task page */}
      <Button
        onClick={() => router.push(`/employeeDashboard/task/${task._id}`)}
        variant="outline"
        className="w-full flex items-center justify-center gap-2 text-primary border-primary hover:bg-primary-hover hover:text-white"
      >
        <Eye size={16} /> View Details
      </Button>
    </motion.div>
  );
};

export default TaskCard;
