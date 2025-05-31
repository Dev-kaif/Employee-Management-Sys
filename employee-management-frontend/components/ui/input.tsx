"use client";

import type React from "react";

import { type InputHTMLAttributes, forwardRef, useState } from "react";
import { motion } from "motion/react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, icon, fullWidth = false, className = "", type, ...props },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className={`${fullWidth ? "w-full" : ""} space-y-1.5`}>
        {label && (
          <label className="block text-sm font-medium text-[#374151]">
            {label}
          </label>
        )}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            className={`
              flex items-center gap-2 w-full rounded-md border ${
                error
                  ? "border-[#EF4444] focus-within:border-[#EF4444] focus-within:ring-1 focus-within:ring-[#EF4444]"
                  : "border-[#E5E7EB] focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB]"
              } bg-white transition-all duration-200 ${className}
            `}
          >
            {icon && (
              <div className="pl-3 text-[#9CA3AF] flex items-center">
                {icon}
              </div>
            )}
            <input
              ref={ref}
              type={inputType}
              className={`
              w-full py-2 px-3 rounded-md text-[#111827] placeholder:text-[#9CA3AF] bg-transparent
              focus:outline-none focus:ring-0 focus:border-none focus:shadow-none
              disabled:cursor-not-allowed disabled:opacity-50
              ${icon ? "pl-2" : ""}
              ${isPassword ? "pr-10" : ""}
            `}
              {...props}
            />

            {isPassword && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] hover:text-[#374151]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
          </motion.div>
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-[#EF4444]"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
