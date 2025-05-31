"use client"

import { motion } from "motion/react"
import type { ReactNode } from "react"
import type { HTMLMotionProps } from "motion/react"

interface ButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode
  variant?: "primary" | "outline" | "ghost" | "danger" | "success"
  size?: "sm" | "md" | "lg"
  fullWidth?: boolean
  icon?: ReactNode
  iconPosition?: "left" | "right"
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  icon,
  iconPosition = "left",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles = "font-medium rounded-md transition-all duration-200 flex items-center justify-center"

  const sizeStyles = {
    sm: "text-sm px-3 py-1.5 gap-1.5",
    md: "text-base px-4 py-2 gap-2",
    lg: "text-lg px-6 py-3 gap-2.5",
  }

  const variantStyles = {
    primary: "bg-[#2563EB] text-white hover:bg-[#1D4ED8] active:bg-[#1E40AF] shadow-sm",
    outline: "bg-white border border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB] active:bg-[#F3F4F6]",
    ghost: "bg-transparent text-[#374151] hover:bg-[#F9FAFB] active:bg-[#F3F4F6]",
    danger: "bg-[#EF4444] text-white hover:bg-[#DC2626] active:bg-[#B91C1C] shadow-sm",
    success: "bg-[#10B981] text-white hover:bg-[#059669] active:bg-[#047857] shadow-sm",
  }

  const widthStyles = fullWidth ? "w-full" : ""

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyles} ${className}`}
      {...props}
    >
      {icon && iconPosition === "left" && <span>{icon}</span>}
      {children}
      {icon && iconPosition === "right" && <span>{icon}</span>}
    </motion.button>
  )
}
