"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import axios from "axios";
import { Backend_Url } from "@/config";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await axios.post(`${Backend_Url}/api/auth/login`, {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);
      alert("Login successful");

      window.location.href = "/adminDashboard";
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <main className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/"
            className="inline-flex items-center text-[#374151] hover:text-[#2563EB] transition-colors"
          >
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
                <h1 className="text-2xl font-bold text-[#111827]">
                  Welcome back
                </h1>
                <p className="text-[#374151] mt-2">Log in to your account</p>
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-[38px] text-[#9CA3AF] hover:text-[#374151] transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Button
                      type="submit"
                      fullWidth
                      disabled={isSubmitting}
                      className={
                        isSubmitting ? "opacity-80 cursor-not-allowed" : ""
                      }
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
                  <Link
                    href="/signup"
                    className="text-[#2563EB] hover:underline font-medium"
                  >
                    Sign up
                  </Link>
                </p>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-8 text-center text-sm text-[#9CA3AF]"
          >
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
  );
}
