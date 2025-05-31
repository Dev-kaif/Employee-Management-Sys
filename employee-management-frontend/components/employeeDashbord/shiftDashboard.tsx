"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";

import { dashboardAPI } from "@/lib/api";
import { Shift } from "@/lib/types";
import { useToast } from "@/components/hooks/use-toast";
import Button from "@/components/ui/button";
import MyLoader from "@/components/ui/loader";

const ShiftHistoryPage: React.FC = () => {
  const { toast } = useToast();

  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDuration = useCallback(
    (startTime: string, endTime: string | null) => {
      if (!endTime) return "Ongoing";

      const start = new Date(startTime);
      const end = new Date(endTime);
      const diffMs = end.getTime() - start.getTime();
      if (isNaN(diffMs) || diffMs < 0) return "Invalid Duration"; 

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      return `${hours}h ${minutes}m`;
    },
    []
  );

  const fetchShiftHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedShifts = await dashboardAPI.getShifts();
      setShifts(fetchedShifts);
    } catch (err: any) {
      console.error("Failed to fetch shift history:", err);
      setError(err.response?.data?.message || "Failed to load shift history.");
      toast({
        title: "Error fetching shifts",
        description:
          err.response?.data?.message ||
          "Could not load your shift history. Please try again.",
        variant: "destructive",
      });
      setShifts([]); // Clear shifts on error
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchShiftHistory();
  }, [fetchShiftHistory]);

  if (loading) {
    return <MyLoader />;
  }

  if (error) {
    return (
      <div className="animate-fade-in text-center py-12">
        <h3 className="text-lg font-medium text-text mb-2">
          Error Loading Shifts
        </h3>
        <p className="text-text-secondary mb-4">{error}</p>
        <Button onClick={fetchShiftHistory}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <motion.h1
              className="text-3xl font-bold text-text"
              initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Your Shift History
            </motion.h1>
          </div>
        </div>

        {shifts.length === 0 ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20, filter: "blur(4px)" }}
            animate={{ scale: 1, opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-surface rounded-lg p-8 text-center border border-gray-100"
          >
            <div className="text-4xl mb-4">🕒</div>
            <h4 className="text-lg font-medium text-text mb-2">
              No Shift History
            </h4>
            <p className="text-text-secondary">
              Your completed shifts will appear here.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {shifts.map((shift, index) => (
              <motion.div
                key={shift._id} // Using _id as per your Shift interface
                initial={{ y: 30, opacity: 0, filter: "blur(6px)" }} // Animation for individual cards
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.5, delay: index * 0.08 }} // Staggered animation
                className="bg-surface rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-text">
                      Shift on {new Date(shift.startTime).toLocaleDateString()}
                    </h4>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 text-sm text-text-secondary">
                      <span>
                        Start:{" "}
                        {new Date(shift.startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {shift.endTime && (
                        <span>
                          End:{" "}
                          {new Date(shift.endTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500 text-white text-sm font-medium">
                      {formatDuration(shift.startTime, shift.endTime as string)}
                    </span>
                  </div>
                </div>

                {shift.workSummary && (
                  <div className="border-t border-gray-100 pt-4 mt-4">
                    <h5 className="text-sm font-medium text-text mb-2">
                      Work Summary
                    </h5>
                    <p className="text-text-secondary text-sm">
                      {shift.workSummary}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ShiftHistoryPage;
