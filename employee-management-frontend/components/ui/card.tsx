"use client"

import type { ReactNode } from "react"
import { motion } from "motion/react"

interface CardProps {
  children: ReactNode
  className?: string
  variant?: "default" | "bordered" | "elevated"
  onClick?: () => void
  interactive?: boolean
}

export default function Card({
  children,
  className = "",
  variant = "default",
  onClick,
  interactive = false,
}: CardProps) {
  const baseStyles = "rounded-lg overflow-hidden"

  const variantStyles = {
    default: "bg-white",
    bordered: "bg-white border border-[#E5E7EB]",
    elevated: "bg-white shadow-md",
  }

  const interactiveStyles = interactive ? "cursor-pointer transition-all duration-200 hover:shadow-md" : ""

  return (
    <motion.div
      whileHover={interactive ? { y: -4 } : {}}
      whileTap={interactive ? { y: 0 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`${baseStyles} ${variantStyles[variant]} ${interactiveStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}
