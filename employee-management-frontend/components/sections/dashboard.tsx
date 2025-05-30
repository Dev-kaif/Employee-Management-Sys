"use client"

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Button from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Dashboard() {
  const containerRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])
  const y = useTransform(scrollYProgress, [0, 0.5], [100, 0])

  const dashboardFeatures = [
    {
      title: "Real-time Analytics",
      description: "Get instant insights into your workforce with real-time analytics and customizable dashboards.",
    },
    {
      title: "Employee Self-Service",
      description: "Empower employees to manage their profiles, request time off, and access important documents.",
    },
    {
      title: "Mobile Accessibility",
      description: "Access your HR dashboard anytime, anywhere with our responsive mobile interface.",
    },
  ]

  return (
    <section id="dashboard" ref={containerRef} className="py-24 bg-[#F9FAFB] relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <motion.div
              style={{ scale, opacity, y }}
              className="relative rounded-xl overflow-hidden shadow-xl border border-[#E5E7EB]"
            >
              <img
                src="https://images.unsplash.com/photo-1576267423429-569309b31e84?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Employee Dashboard Interface"
                className="w-full h-auto"
              />

              {/* Dashboard highlights */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-[#E5E7EB] max-w-[180px]"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#EFF6FF] flex items-center justify-center">
                    <span className="text-[#2563EB] font-bold text-sm">98%</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#111827]">Attendance Rate</p>
                    <p className="text-xs text-[#10B981]">+2.4% this month</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-[#E5E7EB]"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
                  <p className="text-xs font-medium text-[#111827]">12 employees online now</p>
                </div>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2 space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827]">
              Intuitive dashboard for complete workforce visibility
            </h2>
            <p className="text-lg text-[#374151]">
              Our user-friendly dashboard provides a comprehensive overview of your workforce, enabling you to make
              data-driven decisions and optimize your HR processes.
            </p>

            <div className="space-y-6">
              {dashboardFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 * index, duration: 0.5 }}
                  className="flex gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                    <span className="text-[#2563EB] font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#111827] mb-2">{feature.title}</h3>
                    <p className="text-[#374151]">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button icon={<ArrowRight size={18} />} iconPosition="right" className="mt-4">
              Explore Dashboard
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
