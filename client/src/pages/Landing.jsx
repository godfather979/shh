import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, FileText, Brain, History, ArrowUpDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const handleGetStarted = () => {
    navigate('/signin')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-800">LegalAssist AI</div>
          <Button onClick={handleGetStarted}>Get Started</Button>
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-2">
            <a href="#features" className="block text-gray-600 hover:text-gray-800">Features</a>
          </div>
        )}
      </header>

      <main>
        <section className="container mx-auto px-4 py-5 text-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            {...fadeIn}
          >
            Making Legal Understanding Accessible to Everyone
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            {...fadeIn}
            transition={{ delay: 0.2 }}
          >
            Navigate the legal system with confidence using our AI-powered platform. From understanding case laws to filling out court forms, we make legal processes simple and accessible for everyone.
          </motion.p>
          <motion.div 
            className="space-x-4"
            {...fadeIn}
            transition={{ delay: 0.4 }}
          >
            <Button size="lg" onClick={handleGetStarted}>
              Start Your Legal Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={handleGetStarted}>
              Try For Free
            </Button>
          </motion.div>
        </section>

        <section id="features" className="bg-gray-50 pt-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Smart Legal Solutions</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
              {[
                { icon: <FileText className="h-10 w-10 text-blue-500" />, title: "Case Law Analysis", description: "AI-powered retrieval and summary of relevant case laws and precedents for your specific situation." },
                { icon: <Brain className="h-10 w-10 text-green-500" />, title: "Contract Assessment", description: "Identify high-risk clauses and ensure compliance with current regulations like GDPR." },
                { icon: <History className="h-10 w-10 text-purple-500" />, title: "Legal Document Assistant", description: "Simplified court form filling with AI guidance to reduce errors and save time." },
                { icon: <ArrowUpDown className="h-10 w-10 text-indigo-500" />, title: "Legal Updates Tracker", description: "Compare old documents with current laws and stay informed with personalized legal news." },
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">LegalAssist AI</h3>
              <p className="text-gray-400">Making legal understanding accessible and empowering individuals with AI-driven legal assistance.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Case Law Search</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contract Review</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Document Assistant</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Disclaimer</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            © {new Date().getFullYear()} LegalAssist AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}