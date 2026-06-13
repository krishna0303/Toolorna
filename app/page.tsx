"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Zap, Target, Tag } from "lucide-react";
import Button from "@/components/ui/Button";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const steps = [
  {
    icon: Target,
    title: "Answer 4 Questions",
    desc: "Tell us your profession, challenge, budget, and tools you've tried.",
  },
  {
    icon: Zap,
    title: "Get AI Recommendation",
    desc: "Our AI analyzes 500+ tools and picks the one perfect for you.",
  },
  {
    icon: Tag,
    title: "Save with Coupon",
    desc: "Get an exclusive coupon code to save money on your perfect tool.",
  },
];

const stats = [
  { value: "10,000+", label: "Indians Matched" },
  { value: "₹2,400", label: "Average Saving" },
  { value: "500+", label: "Tools Analyzed" },
];

const trustIndicators = [
  "100% Free",
  "Instant Result",
  "Exclusive Coupons",
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-16 md:py-24">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-4xl md:text-5xl font-bold leading-tight mb-4"
            variants={fadeUp}
            custom={0}
          >
            Find Your Perfect Tool{" "}
            <span className="text-primary">in 60 Seconds</span>
          </motion.h1>

          <motion.p
            className="text-lg text-text-muted mb-8 max-w-lg mx-auto"
            variants={fadeUp}
            custom={1}
          >
            Answer 4 quick questions. Get 1 perfect tool recommendation. Save
            money with exclusive coupon codes.
          </motion.p>

          <motion.div variants={fadeUp} custom={2}>
            <Link href="/quiz">
              <Button className="text-lg px-8 py-4">
                Find My Perfect Tool <ArrowRight size={20} className="ml-2 inline" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="mt-6 flex flex-wrap items-center justify-center gap-4"
            variants={fadeUp}
            custom={3}
          >
            {trustIndicators.map((item) => (
              <span
                key={item}
                className="flex items-center gap-1.5 text-sm text-text-muted"
              >
                <CheckCircle size={14} className="text-success" />
                {item}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-border-custom py-12 px-4">
        <div className="max-w-2xl mx-auto grid grid-cols-3 gap-6 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl md:text-3xl font-bold text-primary">
                {stat.value}
              </p>
              <p className="text-sm text-text-muted mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <step.icon size={24} className="text-primary" />
                </div>
                <div className="text-xs text-text-muted mb-2">
                  Step {i + 1}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-text-muted">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-custom py-6 px-4 text-center text-sm text-text-muted">
        &copy; {new Date().getFullYear()} Toolorna
      </footer>
    </div>
  );
}
