"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "motion/react"
import Link from "next/link"
import { ArrowLeft, Check, Eye, EyeOff } from "lucide-react"
import Button from "@/components/ui/button"
import Input from "@/components/ui/input"

interface FormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

interface FormErrors {
  fullName?: string
  email?: string
  password?: string
  confirmPassword?: string
  agreeToTerms?: string
}

export default function SignupPage() {
  
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)

      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false)
        setIsSubmitted(true)

        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
            agreeToTerms: false,
          })
          setIsSubmitted(false)
        }, 3000)
      }, 1500)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Link href="/" className="inline-flex items-center text-[#374151] hover:text-[#2563EB] transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Back to home
          </Link>
        </motion.div>
      </div>

      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg border border-[#E5E7EB] overflow-hidden">
            <div className="p-8">
              <motion.div variants={itemVariants} className="text-center mb-8">
                <h1 className="text-2xl font-bold text-[#111827]">Create your account</h1>
                <p className="text-[#374151] mt-2">Join thousands of companies using EmpManage</p>
              </motion.div>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={32} className="text-[#10B981]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#111827] mb-2">Account created!</h3>
                  <p className="text-[#374151]">Your account has been successfully created. You can now log in.</p>
                  <Button className="mt-6" onClick={() => (window.location.href = "/login")}>
                    Continue to Login
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <motion.div variants={itemVariants}>
                      <Input
                        label="Full Name"
                        name="fullName"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleChange}
                        error={errors.fullName}
                        fullWidth
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        fullWidth
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <div className="relative">
                        <Input
                          label="Password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={handleChange}
                          error={errors.password}
                          fullWidth
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-[38px] text-[#9CA3AF] hover:text-[#374151] transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <p className="text-xs text-[#9CA3AF] mt-1">Password must be at least 8 characters</p>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <div className="relative">
                        <Input
                          label="Confirm Password"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          error={errors.confirmPassword}
                          fullWidth
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-[38px] text-[#9CA3AF] hover:text-[#374151] transition-colors"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="agreeToTerms"
                            name="agreeToTerms"
                            type="checkbox"
                            checked={formData.agreeToTerms}
                            onChange={handleChange}
                            className="w-4 h-4 rounded border-[#E5E7EB] text-[#2563EB] focus:ring-[#2563EB] focus:ring-offset-0"
                          />
                        </div>
                        <div className="ml-3">
                          <label htmlFor="agreeToTerms" className="text-sm text-[#374151]">
                            I agree to the{" "}
                            <a href="#" className="text-[#2563EB] hover:underline">
                              Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href="#" className="text-[#2563EB] hover:underline">
                              Privacy Policy
                            </a>
                          </label>
                          {errors.agreeToTerms && <p className="text-sm text-[#EF4444] mt-1">{errors.agreeToTerms}</p>}
                        </div>
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Button
                        type="submit"
                        fullWidth
                        disabled={isSubmitting}
                        className={isSubmitting ? "opacity-80 cursor-not-allowed" : ""}
                      >
                        {isSubmitting ? "Creating Account..." : "Create Account"}
                      </Button>
                    </motion.div>
                  </div>
                </form>
              )}

              <motion.div variants={itemVariants} className="mt-6 text-center">
                <p className="text-[#374151]">
                  Already have an account?{" "}
                  <Link href="/login" className="text-[#2563EB] hover:underline font-medium">
                    Log in
                  </Link>
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
