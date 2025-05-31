"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Card } from "@/components/ui/card";
import {
  Users,
  Clock,
  BarChart3,
  Calendar,
  MessageSquare,
  FileText,
  Shield,
  Zap,
} from "lucide-react";

export default function Features() {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  const features = [
    {
      icon: <Users className="text-[#2563EB]" size={24} />,
      title: "Employee Profiles",
      description:
        "Comprehensive employee profiles with all relevant information in one place.",
    },
    {
      icon: <Clock className="text-[#10B981]" size={24} />,
      title: "Time Tracking",
      description:
        "Accurate time tracking and attendance management with automated reports.",
    },
    {
      icon: <BarChart3 className="text-[#8B5CF6]" size={24} />,
      title: "Performance Analytics",
      description:
        "Track and analyze employee performance with customizable metrics.",
    },
    {
      icon: <Calendar className="text-[#F43F5E]" size={24} />,
      title: "Leave Management",
      description:
        "Streamlined leave request and approval process with calendar integration.",
    },
    {
      icon: <MessageSquare className="text-[#14B8A6]" size={24} />,
      title: "Team Communication",
      description:
        "Built-in messaging and announcement system for effective team communication.",
    },
    {
      icon: <FileText className="text-[#F59E0B]" size={24} />,
      title: "Document Management",
      description:
        "Secure storage and management of employee documents and contracts.",
    },
    {
      icon: <Shield className="text-[#EF4444]" size={24} />,
      title: "Role-based Access",
      description:
        "Granular access control based on roles and responsibilities.",
    },
    {
      icon: <Zap className="text-[#2563EB]" size={24} />,
      title: "Workflow Automation",
      description:
        "Automate repetitive HR tasks and approval workflows to save time.",
    },
  ];

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
    <section
      id="features"
      ref={containerRef}
      className="py-24 bg-white relative overflow-hidden"
    >
      {/* Background elements */}
      <motion.div
        style={{ y }}
        className="absolute -right-64 -top-64 w-[500px] h-[500px] rounded-full bg-[#EFF6FF] opacity-50 blur-3xl -z-10"
      />
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [-100, 100]) }}
        className="absolute -left-64 -bottom-64 w-[500px] h-[500px] rounded-full bg-[#F5F3FF] opacity-50 blur-3xl -z-10"
      />

      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">
            Powerful features to transform your HR operations
          </h2>
          <p className="text-lg text-[#374151]">
            Our comprehensive suite of tools helps you manage your workforce
            efficiently and boost productivity across your organization.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card
                variant="bordered"
                className="h-full p-6 hover:border-[#2563EB] transition-colors duration-300"
                interactive
              >
                <div className="w-12 h-12 rounded-lg bg-[#F9FAFB] flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-[#111827] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[#374151]">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
