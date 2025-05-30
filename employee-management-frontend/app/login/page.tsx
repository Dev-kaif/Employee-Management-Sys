"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "motion/react"
import Link from "next/link"
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react"
import Button from "@/components/ui/button"
import Input from "@/components/ui/input"

interface FormData {
  email: string
  password: string
  rememberMe: boolean
}

interface FormErrors {
  email?: string
  password?: string
}

export default function LoginPage() {

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    rememberMe: false,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

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

    // Clear login error when user makes changes
    if (loginError) {
      setLoginError(null)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
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

        // For demo purposes, show an error if email contains "error"
        if (formData.email.includes("error")) {
          setLoginError("Invalid email or password. Please try again.")
        } else {
          // Successful login would redirect to dashboard
          window.location.href = "/"
        }
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
        <div className="w-full max-w-md">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-xl shadow-lg border border-[#E5E7EB] overflow-hidden"
          >
            <div className="p-8">
              <motion.div variants={itemVariants} className="text-center mb-8">
                <h1 className="text-2xl font-bold text-[#111827]">Welcome back</h1>
                <p className="text-[#374151] mt-2">Log in to your EmpManage account</p>
              </motion.div>

              {loginError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#FEF2F2] border border-[#FEE2E2] text-[#EF4444] p-3 rounded-md mb-6"
                >
                  {loginError}
                </motion.div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
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
                        placeholder="Enter your password"
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
                  </motion.div>

                  <motion.div variants={itemVariants} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="rememberMe"
                        name="rememberMe"
                        type="checkbox"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-[#E5E7EB] text-[#2563EB] focus:ring-[#2563EB] focus:ring-offset-0"
                      />
                      <label htmlFor="rememberMe" className="ml-2 text-sm text-[#374151]">
                        Remember me
                      </label>
                    </div>
                    <div>
                      <Link href="#" className="text-sm text-[#2563EB] hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Button
                      type="submit"
                      fullWidth
                      disabled={isSubmitting}
                      className={isSubmitting ? "opacity-80 cursor-not-allowed" : ""}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <Loader2 size={18} className="animate-spin mr-2" />
                          Logging in...
                        </span>
                      ) : (
                        "Log in"
                      )}
                    </Button>
                  </motion.div>
                </div>
              </form>

              <motion.div variants={itemVariants} className="mt-6 text-center">
                <p className="text-[#374151]">
                  Don't have an account?{" "}
                  <Link href="/signup" className="text-[#2563EB] hover:underline font-medium">
                    Sign up
                  </Link>
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-8 pt-6 border-t border-[#E5E7EB] text-center">
                <p className="text-sm text-[#9CA3AF] mb-4">Or continue with</p>
                <div className="flex space-x-4 justify-center">
                  {["Google", "Microsoft", "Apple"].map((provider) => (
                    <button
                      key={provider}
                      type="button"
                      className="flex-1 py-2 px-4 border border-[#E5E7EB] rounded-md text-[#374151] hover:bg-[#F9FAFB] transition-colors text-sm font-medium"
                    >
                      {provider}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-8 text-center text-sm text-[#9CA3AF]">
            By logging in, you agree to our{" "}
            <a href="#" className="text-[#2563EB] hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-[#2563EB] hover:underline">
              Privacy Policy
            </a>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
