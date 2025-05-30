"use client"

import { useState, useRef } from "react"
import { motion, useScroll, useTransform } from "motion/react"
import Card from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

export default function Testimonials() {
  const containerRef = useRef<HTMLElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [50, -50])

  const testimonials = [
    {
      quote:
        "EmpManage has completely transformed how we handle our HR operations. The intuitive interface and powerful features have saved us countless hours of administrative work.",
      author: "Sarah Johnson",
      role: "HR Director",
      company: "Acme Inc.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=3164&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 5,
    },
    {
      quote:
        "The analytics and reporting capabilities are outstanding. We can now make data-driven decisions about our workforce that have significantly improved our productivity.",
      author: "Michael Chen",
      role: "Operations Manager",
      company: "Globex Corporation",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=2662&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 5,
    },
    {
      quote:
        "Employee self-service features have reduced our HR team's workload by 40%. Our employees love the mobile accessibility and ease of use.",
      author: "Emily Rodriguez",
      role: "Chief People Officer",
      company: "Stark Industries",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4,
    },
  ]

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section id="testimonials" ref={containerRef} className="py-24 bg-white relative overflow-hidden">
      {/* Background elements */}
      <motion.div
        style={{ y }}
        className="absolute -left-64 top-0 w-[500px] h-[500px] rounded-full bg-[#F5F3FF] opacity-30 blur-3xl -z-10"
      />

      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">Trusted by HR professionals worldwide</h2>
          <p className="text-lg text-[#374151]">
            See what our customers have to say about how EmpManage has transformed their HR operations and employee
            management.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <motion.div
              animate={{ x: `-${activeIndex * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex"
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <Card variant="elevated" className="p-8 h-full">
                    <div className="flex flex-col h-full">
                      <div className="flex mb-6">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={20}
                            className={`${i < testimonial.rating ? "text-[#F59E0B] fill-[#F59E0B]" : "text-[#E5E7EB]"}`}
                          />
                        ))}
                      </div>
                      <blockquote className="text-xl text-[#111827] italic mb-8 flex-grow">
                        "{testimonial.quote}"
                      </blockquote>
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                          <img
                            src={testimonial.avatar || "/placeholder.svg"}
                            alt={testimonial.author}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-[#111827]">{testimonial.author}</p>
                          <p className="text-sm text-[#374151]">
                            {testimonial.role}, {testimonial.company}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-center mt-8 space-x-2">
            <button
              onClick={prevTestimonial}
              className="w-10 h-10 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#374151] hover:bg-[#F9FAFB] transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    activeIndex === index ? "bg-[#2563EB]" : "bg-[#E5E7EB] hover:bg-[#D1D5DB]"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={nextTestimonial}
              className="w-10 h-10 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#374151] hover:bg-[#F9FAFB] transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
