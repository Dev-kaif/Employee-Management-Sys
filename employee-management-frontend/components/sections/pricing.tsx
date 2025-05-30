"use client"

import { useState, useRef } from "react"
import { motion, useScroll, useTransform } from "motion/react"
import Card from "@/components/ui/card"
import Button from "@/components/ui/button"
import { Check } from "lucide-react"

export default function Pricing() {
  const containerRef = useRef<HTMLElement>(null)
  const [isAnnual, setIsAnnual] = useState(true)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])

  const plans = [
    {
      name: "Starter",
      description: "Perfect for small teams getting started",
      monthlyPrice: 29,
      annualPrice: 24,
      features: [
        "Up to 25 employees",
        "Basic employee profiles",
        "Time tracking",
        "Leave management",
        "Mobile access",
        "Email support",
      ],
      highlighted: false,
      cta: "Start Free Trial",
    },
    {
      name: "Professional",
      description: "Ideal for growing businesses",
      monthlyPrice: 79,
      annualPrice: 69,
      features: [
        "Up to 100 employees",
        "Advanced employee profiles",
        "Time tracking & attendance",
        "Performance evaluations",
        "Document management",
        "Team communication",
        "Priority support",
      ],
      highlighted: true,
      cta: "Start Free Trial",
      badge: "Most Popular",
    },
    {
      name: "Enterprise",
      description: "For large organizations with complex needs",
      monthlyPrice: 199,
      annualPrice: 179,
      features: [
        "Unlimited employees",
        "Custom workflows",
        "Advanced analytics",
        "API access",
        "SSO integration",
        "Custom roles & permissions",
        "Dedicated account manager",
        "24/7 phone support",
      ],
      highlighted: false,
      cta: "Contact Sales",
    },
  ]

  return (
    <section id="pricing" ref={containerRef} className="py-24 bg-[#F9FAFB] relative overflow-hidden">
      {/* Background elements */}
      <motion.div
        style={{ y }}
        className="absolute -right-64 bottom-0 w-[500px] h-[500px] rounded-full bg-[#EFF6FF] opacity-30 blur-3xl -z-10"
      />

      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">Simple, transparent pricing</h2>
          <p className="text-lg text-[#374151] mb-8">
            Choose the plan that's right for your business, with no hidden fees or long-term commitments.
          </p>

          <div className="flex items-center justify-center space-x-4">
            <span className={`text-sm font-medium ${!isAnnual ? "text-[#111827]" : "text-[#9CA3AF]"}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-14 h-7 rounded-full bg-[#E5E7EB] flex items-center p-1 cursor-pointer"
            >
              <motion.div
                animate={{ x: isAnnual ? 28 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-5 h-5 rounded-full bg-[#2563EB] shadow-sm"
              />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? "text-[#111827]" : "text-[#9CA3AF]"}`}>
              Annual <span className="text-[#10B981]">Save 15%</span>
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card
                variant={plan.highlighted ? "elevated" : "bordered"}
                className={`h-full flex flex-col ${plan.highlighted ? "border-2 border-[#2563EB] shadow-lg" : ""}`}
              >
                <div className="p-6 pb-0 relative">
                  {plan.badge && (
                    <div className="absolute top-0 right-6 -translate-y-1/2 bg-[#2563EB] text-white text-xs font-medium py-1 px-3 rounded-full">
                      {plan.badge}
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-[#111827] mb-2">{plan.name}</h3>
                  <p className="text-[#374151] mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-[#111827]">
                      ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-[#374151]">/month per user</span>
                  </div>
                </div>

                <div className="p-6 pt-0 flex-grow">
                  <div className="border-t border-[#E5E7EB] pt-6 mb-6">
                    <p className="font-medium text-[#111827] mb-4">What's included:</p>
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start space-x-3">
                          <Check size={18} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                          <span className="text-[#374151]">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Button variant={plan.highlighted ? "primary" : "outline"} fullWidth>
                    {plan.cta}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-[#374151]">
            Need a custom plan for your enterprise?{" "}
            <a href="#" className="text-[#2563EB] font-medium hover:underline">
              Contact our sales team
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
