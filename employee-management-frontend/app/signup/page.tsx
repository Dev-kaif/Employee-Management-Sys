"use client"

import { useState } from "react"
import axios from "axios"
import { motion } from "motion/react"
import Link from "next/link"
import { Eye, EyeOff, Check } from "lucide-react"
import Button from "@/components/ui/button"
import Input from "@/components/ui/input"
import { Backend_Url } from "@/config"

interface FormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  designation: string
  department: string
  company: string
  agreeToTerms: boolean
}

interface FormErrors {
  fullName?: string
  email?: string
  password?: string
  confirmPassword?: string
  designation?: string
  department?: string
  company?: string
  agreeToTerms?: string
}

export default function SignupPage() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    designation: "",
    department: "",
    company: "",
    agreeToTerms: false,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email"
    if (!formData.password) newErrors.password = "Password is required"
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters"
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm password"
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
    if (!formData.designation.trim()) newErrors.designation = "Designation is required"
    if (!formData.department.trim()) newErrors.department = "Department is required"
    if (!formData.company.trim()) newErrors.company = "Company name is required"
    if (!formData.agreeToTerms) newErrors.agreeToTerms = "Please accept the terms and conditions"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const res = await axios.post(`${Backend_Url}/api/auth/signup`, {
        username: formData.fullName,
        email: formData.email,
        password: formData.password,
        designation: formData.designation,
        department: formData.department,
        company: formData.company,
      })
      setIsSubmitted(true);

      localStorage.setItem("token", res.data.token);
      alert("SignUp Sucessfull successful");
      window.location.href = "/dashboard";

    } catch (error: any) {
      alert(error.response?.data?.message || "Signup failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8 border border-gray-200"
      >
        <h1 className="text-3xl font-bold text-center mb-6">Create your account</h1>

        {isSubmitted ? (
          <div className="text-center py-10">
            <Check className="mx-auto text-green-500 mb-3" size={40} />
            <p className="text-lg font-semibold text-green-700">Account created successfully!</p>
            <Button className="mt-5" onClick={() => (window.location.href = "/login")}>
              Go to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
              <Input
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
 
              />
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />
              <Input
                label="Designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                error={errors.designation}
              />
              <Input
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                error={errors.department}
              />
              <Input
                label="Company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                error={errors.company}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
              />
              <label className="text-sm">I agree to the terms and conditions</label>
            </div>
            {errors.agreeToTerms && <p className="text-red-500 text-sm">{errors.agreeToTerms}</p>}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Sign Up"}
            </Button>
            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Log in
              </Link>
            </p>
          </form>
        )}
      </motion.div>
    </main>
  )
}
