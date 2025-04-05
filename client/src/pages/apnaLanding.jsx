// App.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
// import { link } from 'fs';
// import HeroSection from '@/components/hero';

const LegalAI = () => {
  const [hovered, setHovered] = useState(null);
  const whyChooseRef = useRef(null);
  const heroRef = useRef(null);
  const toolsRef = useRef(null);
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);
  
  // Set name as a constant to use everywhere
  const APP_NAME = "Law-dya cha AI";
  
  // Scroll animations
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(heroScrollProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(heroScrollProgress, [0, 1], [1, 0.95]);
  
  const tools = [
    {
      id: 1,
      title: "Conflict Management",
      description: "AI-powered detection of contradicting clauses in legal documents",
      icon: "⚖️",
      link: "/conflict-management",
    },
    {
      id: 2,
      title: "Contract Analysis",
      description: "Deep insights into agreements with AI-driven analytics",
      icon: "📝",
      link: "/contract-analysis",
    },
    {
      id: 3,
      title: "Case Research",
      description: "Explore relevant precedents and recent legal developments",
      icon: "🔍",
      link: "/case-research",
    },
    {
      id: 4,
      title: "Document Creator",
      description: "Form-based document generation with live editing capabilities",
      icon: "📄",
      link: "/create",
    },
    {
      id: 5,
      title: "Legal Drafting",
      description: "Professionally formatted drafts from facts and prayer inputs",
      icon: "✍️",
      link: "/legal-drafting",
    },
    {
      id: 6,
      title: "Document Summarizer",
      description: "Concise summaries of complex legal texts in seconds",
      icon: "📊",
      link: "/document-summarizer",
    },
  ];

  // Framer motion variants for animations
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const scrollToWhyChoose = () => {
    whyChooseRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800">
      {/* Hero Section with Pattern Background */}
        <motion.section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{ opacity: heroOpacity, scale: heroScale }}
        >
        {/* Abstract background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 opacity-70">
            <div className="absolute inset-0" style={{ 
            backgroundImage: "radial-gradient(circle at 25px 25px, rgba(0, 0, 255, 0.1) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(0, 0, 255, 0.1) 2%, transparent 0%)",
            backgroundSize: "100px 100px" 
            }}></div>   
        </div>
        
        <motion.div 
            className="relative z-10 text-center max-w-4xl px-4"
            initial="hidden"
            animate="visible"
            variants={{
            hidden: { opacity: 0 },
            visible: { 
                opacity: 1,
                transition: {
                delay: 0.3,
                staggerChildren: 0.3
                }
            }
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
            Transforming legal research and document analysis while upholding ethical standards
            </motion.p>
            <motion.div 
            className="flex flex-col gap-4 justify-center"
            variants={fadeInUp}
            >
            <Button
                className="w-full px-8 py-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-lg broder-blue-500 hover:border-blue-600 shadow-sm"
                onClick={() => document.getElementById('tools').scrollIntoView({ behavior: 'smooth' })}
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
        
        {/* Scroll indicator */}
        <motion.div 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
        >
            <ChevronRight className="w-10 h-10 text-slate-700 rotate-90" />
        </motion.div>
        </motion.section>
      
      {/* Tools Section */}
      <motion.div 
        id="tools" 
        ref={toolsRef}
        className="py-24 px-4 bg-gradient-to-b from-slate-100 to-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-3xl md:text-5xl font-bold mb-4 text-center text-slate-800"
            variants={fadeInUp}
          >
            Our AI-Powered Tools
          </motion.h2>
          <motion.p 
            className="text-xl text-slate-600 mb-16 text-center max-w-3xl mx-auto"
            variants={fadeInUp}
          >
            Harness the power of artificial intelligence to streamline your legal workflow
          </motion.p>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {tools.map((tool) => (
              <motion.div
                key={tool.id}
                className="relative group"
                onMouseEnter={() => setHovered(tool.id)}
                onMouseLeave={() => setHovered(null)}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
                variants={fadeInUp}
              >
                {/* Default glow effect that intensifies on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-xl blur-md opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                <Card className="relative h-full bg-white border-slate-200 shadow-sm overflow-hidden z-10">
                  <CardHeader>
                    <div className="text-4xl mb-2">{tool.icon}</div>
                    <CardTitle className="text-2xl text-slate-800">{tool.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-600 text-base">
                      {tool.description}
                    </CardDescription>
                  </CardContent>
                  <CardFooter>
                <Button
                    variant="ghost"
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-0"
                    onClick={() => {
                    window.location.href = tool.link; // Basic browser navigation
                    // If you are using React Router, you would use something like:
                    // navigate(tool.link);
                    }}
                >
                    Learn more →
                </Button>
                </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
      </motion.div>
      
      {/* Features Section */}
      <motion.div 
        ref={whyChooseRef}
        className="py-24 px-4 bg-gradient-to-b from-white to-slate-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <div className="relative flex justify-center mb-28">
        <div className="w-full max-w-3xl h-[2px] bg-gradient-to-r from-transparent via-blue-600 to-transparent"></div>
      </div>
        
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-3xl md:text-5xl font-bold mb-16 text-center text-slate-800"
            variants={fadeInUp}
          >
            Why Choose {APP_NAME}
          </motion.h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-16"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <div className="space-y-8">
              <motion.div variants={fadeInUp}>
                <h3 className="text-2xl font-bold mb-4 flex items-center text-slate-800">
                  <span className="text-blue-600 mr-2">✓</span> 
                  Ethically Compliant
                </h3>
                <p className="text-slate-600">
                  Our AI solutions adhere to all ethical guidelines and legal advertising restrictions in India.
                </p>
              </motion.div>
              
              <motion.div variants={fadeInUp}>
                <h3 className="text-2xl font-bold mb-4 flex items-center text-slate-800">
                  <span className="text-blue-600 mr-2">✓</span> 
                  Time-Saving Research
                </h3>
                <p className="text-slate-600">
                  Reduce research time by up to 70% with our AI-powered search and analysis tools.
                </p>
              </motion.div>
              
              <motion.div variants={fadeInUp}>
                <h3 className="text-2xl font-bold mb-4 flex items-center text-slate-800">
                  <span className="text-blue-600 mr-2">✓</span> 
                  Document Intelligence
                </h3>
                <p className="text-slate-600">
                  Advanced document analysis for detecting conflicts and summarizing complex legal texts.
                </p>
              </motion.div>
            </div>
            
            <div className="space-y-8">
              <motion.div variants={fadeInUp}>
                <h3 className="text-2xl font-bold mb-4 flex items-center text-slate-800">
                  <span className="text-blue-600 mr-2">✓</span> 
                  Streamlined Workflows
                </h3>
                <p className="text-slate-600">
                  Intuitive tools that integrate seamlessly into your existing legal practice.
                </p>
              </motion.div>
              
              <motion.div variants={fadeInUp}>
                <h3 className="text-2xl font-bold mb-4 flex items-center text-slate-800">
                  <span className="text-blue-600 mr-2">✓</span> 
                  Indian Legal Context
                </h3>
                <p className="text-slate-600">
                  Built specifically for the Indian legal system and practices.
                </p>
              </motion.div>
              
              <motion.div variants={fadeInUp}>
                <h3 className="text-2xl font-bold mb-4 flex items-center text-slate-800">
                  <span className="text-blue-600 mr-2">✓</span> 
                  Secure & Confidential
                </h3>
                <p className="text-slate-600">
                  Bank-level encryption and privacy measures to protect your client data.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* CTA Section */}
      <motion.div 
        ref={ctaRef}
        className="py-24 px-4 bg-gradient-to-b from-slate-50 to-blue-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <div className="relative flex justify-center mb-28">
        <div className="w-full max-w-3xl h-[2px] bg-gradient-to-r from-transparent via-blue-600 to-transparent"></div>
      </div>
      
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-3xl md:text-5xl font-bold mb-6 text-slate-800"
            variants={fadeInUp}
          >
            Ready to Transform Your Legal Practice?
          </motion.h2>
          <motion.p 
            className="text-xl text-slate-600 mb-10"
            variants={fadeInUp}
          >
            Join thousands of legal professionals already using {APP_NAME} to enhance their practice.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={fadeInUp}
          >
            <Button
              className="px-8 py-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-lg"
            >
              Get Started Now
            </Button>
            <Button
              className="px-8 py-6 bg-white text-blue-600 hover:bg-blue-50 border border-blue-200 hover:border-blue-300 text-lg shadow-sm"
            >
              Schedule a Demo
            </Button>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Footer */}
      <footer className="py-12 px-4 bg-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                {APP_NAME}
              </h2>
            </div>
            <div className="flex gap-8">
              <a href="#" className="text-slate-600 hover:text-blue-600">About</a>
              <a href="#" className="text-slate-600 hover:text-blue-600">Tools</a>
              <a href="#" className="text-slate-600 hover:text-blue-600">Pricing</a>
              <a href="#" className="text-slate-600 hover:text-blue-600">Contact</a>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-8 text-center text-slate-500">
            <p>© 2025 {APP_NAME}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LegalAI;