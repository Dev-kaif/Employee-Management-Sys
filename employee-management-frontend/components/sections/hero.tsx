"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "motion/react"
import Button from "@/components/ui/button"
import { ArrowRight, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface HeroProps {
  isLoggedIn: boolean;
  userRole: string | null;
}

export default function Hero({ isLoggedIn, userRole }: HeroProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const features = [
    "Employee profiles & records",
    "Time tracking & attendance",
    "Performance evaluations",
    "Payroll integration",
  ]

  const handleCtaClick = () => {
    if (isLoggedIn) {
      if(userRole=="admin"){
        router.push('/adminDashboard');
      }else{
        router.push('/employeeDashboard');
      }
    } else {
      router.push('/signup');
    }
  };

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#F9FAFB] to-white -z-10" />

      <div className="absolute inset-0 opacity-[0.03] -z-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2563EB" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="inline-flex items-center rounded-full bg-[#EFF6FF] border border-[#DBEAFE] px-3 py-1"
            >
              <span className="text-xs font-medium text-[#2563EB] mr-2">NEW</span>
              <span className="text-xs text-[#374151]">Employee performance analytics now available</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#111827] leading-tight"
            >
              Simplify your <span className="text-[#2563EB]">employee management</span> workflow
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg md:text-xl text-[#374151] max-w-xl"
            >
              A comprehensive platform designed to streamline HR processes, enhance productivity, and improve employee
              engagement.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              {isLoggedIn ? (
                <Button onClick={handleCtaClick} size="lg" icon={<ArrowRight size={18} />} iconPosition="right">
                  Continue to Dashboard
                </Button>
              ) : (
                <>
                  <Button onClick={handleCtaClick} size="lg" icon={<ArrowRight size={18} />} iconPosition="right">
                    Get Started
                  </Button>
                  <Button size="lg" variant="outline">
                    Book a Demo
                  </Button>
                </>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="pt-4"
            >
              <p className="text-sm text-[#9CA3AF] mb-4">Trusted by leading companies worldwide</p>
              <div className="flex flex-wrap items-center gap-8">
                {["Acme Inc", "Globex", "Stark Industries", "Wayne Enterprises"].map((company, index) => (
                  <div key={index} className="text-[#374151] font-semibold opacity-70">
                    {company}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div style={{ y, opacity }} className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="relative z-10"
            >
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-[#E5E7EB]">
                <img
                  src="https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?q=80&w=3247&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Employee Management Dashboard"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="absolute -right-4 top-1/4 bg-white rounded-lg shadow-lg p-4 border border-[#E5E7EB] max-w-[200px]"
            >
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-[#10B981] flex-shrink-0" />
                    <span className="text-sm text-[#374151]">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="absolute -left-4 bottom-1/4 bg-white rounded-lg shadow-lg p-4 border border-[#E5E7EB]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center">
                  <span className="text-[#2563EB] font-bold">+28%</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#111827]">Productivity Increase</p>
                  <p className="text-xs text-[#9CA3AF]">Average across all clients</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}