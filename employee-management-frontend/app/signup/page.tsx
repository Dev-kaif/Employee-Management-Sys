"use client";

import { useState } from "react";
import axios from "axios";
import { motion } from "motion/react"; 
import Link from "next/link";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Backend_Url } from "@/config";
import { useToast } from "@/components/hooks/use-toast"; 

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  designation: string;
  department: string;
  company: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  designation?: string;
  department?: string;
  company?: string;
  agreeToTerms?: string;
}

// Define variants for the staggering effect
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1, // Delay before children start animating
      staggerChildren: 0.08, // Delay between each child's animation
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0, filter: "blur(4px)" }, // Start with blur
  visible: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 100,
    },
  },
};

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
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { toast } = useToast();

  const departments = [
    "Engineering",
    "Product",
    "Design",
    "Marketing",
    "Sales",
    "HR",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.designation.trim())
      newErrors.designation = "Designation is required";
    if (!formData.department.trim())
      newErrors.department = "Department is required";
    if (!formData.company.trim())
      newErrors.company = "Company name is required";
    if (!formData.agreeToTerms)
      newErrors.agreeToTerms = "Please accept the terms and conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await axios.post(`${Backend_Url}/api/auth/signup`, {
        username: formData.fullName,
        email: formData.email,
        password: formData.password,
        designation: formData.designation,
        department: formData.department,
        company: formData.company,
      });
      setIsSubmitted(true);

      localStorage.setItem("token", res.data.token);

      toast({
        title: "Signup Successful!",
        description: "Your admin account has been created.",
      });

      window.location.href = "/adminDashboard";
    } catch (error: any) {
      toast({
        title: "Signup Failed",
        description: error.response?.data?.message || "An unexpected error occurred.",
        variant: "destructive", 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8 border border-gray-200"
      >
        <h1 className="text-3xl font-bold text-center mb-2">
          Create Admin account
        </h1>
        {/* Note about single admin per company */}
        <p className="text-sm text-center text-text-secondary mb-6">
          <span className="text-red-500 font-semibold">Important:</span> Only
          one admin can be registered per company. This account will manage your
          company's dashboard.
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Apply variants to the container for staggering */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Input
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <Input
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <Input
                label="Designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                error={errors.designation}
              />
            </motion.div>
            {/* Wrap the Select div as a motion.div item */}
            <motion.div variants={itemVariants}>
              <Label htmlFor="department">Department</Label>
              <Select
                value={formData.department}
                onValueChange={(value) =>
                  handleSelectChange("department", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.department && (
                <p className="text-red-500 text-sm mt-1">{errors.department}</p>
              )}
            </motion.div>
            <motion.div variants={itemVariants}>
              <Input
                label="Company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                error={errors.company}
              />
            </motion.div>
          </motion.div>

          {/* These also need to be wrapped as motion.div items */}
          <motion.div variants={itemVariants} className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="h-4 w-4 text-primary rounded focus:ring-primary-dark"
            />
            <label htmlFor="agreeToTerms" className="text-sm">
              I agree to the terms and conditions
            </label>
          </motion.div>
          {errors.agreeToTerms && (
            <motion.p variants={itemVariants} className="text-red-500 text-sm">{errors.agreeToTerms}</motion.p>
          )}

          <motion.div variants={itemVariants}>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Sign Up"}
            </Button>
          </motion.div>
          <motion.p variants={itemVariants} className="text-sm text-center mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </motion.p>
        </form>
      </motion.div>
    </main>
  );
}