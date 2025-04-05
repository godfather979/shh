import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const LegalDrafting = () => {
  // State management
  const [step, setStep] = useState(1);
  const [userFacts, setUserFacts] = useState('');
  const [userPromises, setUserPromises] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [legalDrafts, setLegalDrafts] = useState(null);
  const [downloadReady, setDownloadReady] = useState(false);

  // Dummy data that would come from backend - now using the array structure you provided
  const dummyLegalDrafts = [
    {
      "heading": "# Case Summary: Donoghue v Stevenson [1932] AC 562",
      "summary": "## Facts:\nMrs. Donoghue consumed ginger beer purchased for her by a friend at a café. The bottle contained a decomposed snail, which she did not see until she had already drunk some of the beer. She subsequently became ill and sued the manufacturer, etc"
    },
    {
      "heading": "# Legal Analysis",
      "summary": "## Legal Principles:\nThis case established the modern concept of negligence in tort law, by setting out general principles whereby one person would owe another person a duty of care."
    }
  ];

  // Function to simulate getting data from backend
  const getLegalDraft = () => {
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setLegalDrafts(dummyLegalDrafts);
      setIsLoading(false);
      setDownloadReady(true);
    }, 2000);
  };

  // Function to simulate downloading PDF
  const downloadPDF = () => {
    setIsLoading(true);
    
    // Simulate download delay
    setTimeout(() => {
      alert("PDF downloaded successfully!");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 px-4 py-8 md:py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header - matching your provided style */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
            Legal Drafting Assistant
          </h1>
          <p className="text-slate-700 text-xl max-w-2xl mx-auto">
            Create professional legal documents based on your specific facts and promises
          </p>
        </motion.div>

        <motion.div 
          className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-4">Tell us the facts</h2>
                  <p className="text-slate-600 text-lg">
                    Please enter all relevant facts that should be considered in your legal document.
                  </p>
                  <textarea
                    className="w-full p-4 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-300 bg-slate-50 min-h-40 text-slate-800"
                    placeholder="Enter facts here..."
                    value={userFacts}
                    onChange={(e) => setUserFacts(e.target.value)}
                  ></textarea>
                  <div className="pt-4 flex justify-end">
                    <motion.button
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 px-8 rounded-lg shadow-md transition duration-300"
                      onClick={() => setStep(2)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Continue
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-4">Define your prayers</h2>
                  <p className="text-slate-600 text-lg">
                    What prayers or obligations should be included in this legal document?
                  </p>
                  <textarea
                    className="w-full p-4 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-300 bg-slate-50 min-h-40 text-slate-800"
                    placeholder="Enter promises here..."
                    value={userPromises}
                    onChange={(e) => setUserPromises(e.target.value)}
                  ></textarea>
                  <div className="pt-4 flex justify-between">
                    <motion.button
                      className="text-blue-600 hover:text-blue-800 font-medium py-3 px-6 rounded-lg hover:bg-blue-50 transition duration-300 border border-blue-200 hover:border-blue-300"
                      onClick={() => setStep(1)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Back
                    </motion.button>
                    <motion.button
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 px-8 rounded-lg shadow-md transition duration-300"
                      onClick={() => {
                        setStep(3);
                        getLegalDraft();
                      }}
                      disabled={!userFacts.trim() || !userPromises.trim()}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Get Legal Draft
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                    <h2 className="text-2xl md:text-3xl font-semibold text-slate-800">Your Legal Draft</h2>
                    <motion.button
                      className="text-blue-600 hover:text-blue-800 font-medium py-2 px-4 rounded-lg hover:bg-blue-50 transition duration-300 border border-blue-200 hover:border-blue-300 self-start"
                      onClick={() => setStep(2)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Edit Inputs
                    </motion.button>
                  </div>

                  {isLoading ? (
                    <motion.div 
                      className="flex flex-col items-center justify-center py-20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
                      <p className="text-slate-600 text-lg">Generating your legal document...</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      {legalDrafts && legalDrafts.map((draft, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + (index * 0.15) }}
                          className="bg-gradient-to-br from-blue-100 to-indigo-100 p-6 rounded-lg border border-blue-200"
                        >
                          <div className="prose prose-slate max-w-none">
                            <ReactMarkdown>{draft.heading}</ReactMarkdown>
                            <ReactMarkdown>{draft.summary}</ReactMarkdown>
                          </div>
                        </motion.div>
                      ))}

                      {legalDrafts && (
                        <motion.div 
                          className="mt-8 flex justify-center"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <motion.button
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 px-8 rounded-lg shadow-md transition duration-300 flex items-center"
                            onClick={downloadPDF}
                            disabled={!downloadReady || isLoading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {isLoading ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                              </>
                            ) : (
                              "Download Detailed PDF"
                            )}
                          </motion.button>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LegalDrafting;