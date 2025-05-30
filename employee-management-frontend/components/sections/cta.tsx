"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Button from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CTA() {
  const containerRef = useRef<HTMLElement>(null);
  const router = useRouter();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section ref={containerRef} className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] -z-10" />

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 -z-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid-pattern"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to transform your employee management?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Join thousands of companies that use EmpManage to streamline their
            HR operations, boost productivity, and create a better workplace
            experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white hover:bg-white/90 active:bg-white/80 text-black"
              icon={<ArrowRight size={18} />}
              iconPosition="right"
              onClick={() => router.push("/signup")}
            >
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 active:bg-white/20"
            >
              Schedule a Demo
            </Button>
          </div>

          <p className="mt-6 text-sm text-white/80">
            No credit card required. 14-day free trial.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
