"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { dashboardAPI } from "@/lib/api";
import { useToast } from "@/components/hooks/use-toast";
import { Employee } from "@/lib/types";
import { Menu, X } from "lucide-react";

interface props {
  setFunction: () => void;
  aboolean: boolean;
  nametype:string
}

const Header = ({ setFunction, aboolean,nametype }: props) => {
  const { toast } = useToast();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const employeeData = await dashboardAPI.getCurrentEmployee();
        setEmployee(employeeData);
      } catch (error: any) {
        console.error("Failed to fetch employee data for header:", error);
        toast({
          title: "Error",
          description:
            error.response?.data?.message ||
            "Failed to load user data for header.",
          variant: "destructive",
        });
        setEmployee(null);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [toast]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-surface border-b border-gray-200 px-4 py-4 lg:pl-68" // Added px, py for consistent padding
    >
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-start">
          <button
            onClick={() => setFunction()}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {aboolean ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div>
            <h1 className="text-2xl font-bold text-text">{nametype} Dashboard</h1>
            {loading ? (
              <p className="text-text-secondary">Loading user data...</p>
            ) : (
              <p className="text-text-secondary">
                Welcome back, {employee?.username || "User"}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:block text-right">
            {loading ? (
              <p className="text-sm font-medium text-text">Loading...</p>
            ) : (
              <>
                <p className="text-sm font-medium text-text">
                  {employee?.username || "N/A"}
                </p>
                <p className="text-xs text-text-secondary">
                  {employee?.designation || "N/A"}
                </p>{" "}
                {/* Changed to designation */}
              </>
            )}
          </div>

          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {loading
                ? "..."
                : employee?.username?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
