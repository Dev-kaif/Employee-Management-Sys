"use client"

import {  useRef } from "react"
import { motion, useScroll, useTransform } from "motion/react"
import Hero from "@/components/sections/hero"
import Features from "@/components/sections/features"
import Dashboard from "@/components/sections/dashboard"
import Testimonials from "@/components/sections/testimonials"
import Pricing from "@/components/sections/pricing"
import CTA from "@/components/sections/cta"
import Navbar from "@/components/sections/navbar"
import Footer from "@/components/sections/footer"

export default function Home() {

  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])

  return (
    <main className="relative overflow-hidden bg-[#F9FAFB]">
      <Navbar />
      <motion.div ref={containerRef} style={{ opacity, scale }} className="relative z-10">
        <Hero />
        <Features />
        <Dashboard />
        <Testimonials />
        <Pricing />
        <CTA />
      </motion.div>
      <Footer />
    </main>
  )
}
