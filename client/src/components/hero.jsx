"use client";
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export function HeroSection({
  heroRef,
  heroOpacity,
  heroScale,
  scrollToWhyChoose,
  APP_NAME = "LexNova AI",
}) {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <HeroHighlight className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Radial Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 opacity-70">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25px 25px, rgba(0, 0, 255, 0.1) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(0, 0, 255, 0.1) 2%, transparent 0%)",
            backgroundSize: "100px 100px",
          }}
        ></div>
      </div>

      {/* Hero Content */}
      <motion.div
        ref={heroRef}
        className="relative z-10 text-center max-w-4xl px-4"
        style={{ opacity: heroOpacity, scale: heroScale }}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              delay: 0.3,
              staggerChildren: 0.3,
            },
          },
        }}
      >
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
          variants={fadeInUp}
        >
          {APP_NAME}
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl mb-8 text-slate-700"
          variants={fadeInUp}
        >
          <Highlight className="text-slate-700 dark:text-white">
            Transforming legal research and document analysis
          </Highlight>{" "}
          while upholding ethical standards.
        </motion.p>

        <motion.div
          className="flex flex-col gap-4 justify-center"
          variants={fadeInUp}
        >
          <Button
            className="w-full px-8 py-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-lg border-blue-500 hover:border-blue-600 shadow-sm"
            onClick={() =>
              document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Explore Tools
          </Button>
          <div className="flex flex-row gap-4 justify-center">
            <Button
              className="flex-1 px-8 py-6 bg-white text-blue-600 hover:bg-blue-50 border border-blue-200 hover:border-blue-300 text-lg shadow-sm"
              onClick={scrollToWhyChoose}
            >
              Legal News
            </Button>
            <Button
              className="flex-1 px-8 py-6 bg-white text-blue-600 hover:bg-blue-50 border border-blue-200 hover:border-blue-300 text-lg shadow-sm"
              onClick={scrollToWhyChoose}
            >
              Past Cases
            </Button>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
      >
        <ChevronRight className="w-10 h-10 text-slate-700 rotate-90" />
      </motion.div>
    </HeroHighlight>
  );
}
