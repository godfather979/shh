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
      "heading": "# Case Summary: Legal Research Draft: Retrospective Service Tax Demand on Subcontracted Labor",
      "summary": `

### I. Case Summary:

M/s Rohit Engineering Services ("the Petitioner") has filed a writ petition challenging a retrospective demand of ₹87,00,000 in service tax levied by the Commissioner of Central Excise and GST, Bhopal ("the Respondent"). The demand pertains to subcontracted labor services. The Petitioner argues that these services fall under the reverse charge mechanism, and thus, the Respondent erred in fastening liability under Section 73 of the Finance Act, 1994. The Respondent contends that the Petitioner failed to provide sufficient documentary evidence to support claimed tax exemptions. The core issue is the legality of the retrospective service tax demand, particularly considering the transition to the Goods and Services Tax (GST) regime.

### II. Relation of Cited Judgments:

The provided judgments, Kailash Electricals vs. CGST & CE Kanpur, while dealing with service tax and interpretations of "governmental authority" for exemptions, offer limited direct relevance to the Petitioner's case. They primarily address the scope of exemptions related to governmental entities and the mechanics of partial reverse charge mechanisms, including valuation and abatement. However, they indirectly highlight the complexities of service tax law and the potential for disputes arising from its interpretation, especially concerning exemptions and the shift to GST. The discussion regarding abatements and valuation options available to the service recipient underscores the importance of proper documentation, which is a key point of contention in the present case.

### III. Legal Opinion:

The Petitioner's argument hinges on the applicability of the reverse charge mechanism to the subcontracted labor services. If the services indeed fall under this mechanism, the primary liability for service tax payment would rest with the service recipient, not the Petitioner. The Respondent's counter-argument focuses on the lack of documentary evidence supporting the Petitioner’s claimed exemptions. This raises the question of the Petitioner's burden of proof in demonstrating eligibility for such exemptions.

While the provided judgments do not directly address retrospective application of service tax demands, the principles of tax law, including those of fairness and due process, are relevant. The transition to GST further complicates the matter. If the relevant services were subsequently treated differently under GST, applying retrospective service tax demands could be seen as inequitable. The Petitioner's case could benefit from researching case law specifically addressing retrospective application of tax demands in the context of the transition to GST. Furthermore, establishing a clear timeline of events and demonstrating diligent attempts to comply with the prevailing tax regulations at the time the services were rendered will be crucial to the Petitioner's defense. The lack of documentary evidence, as highlighted by the Respondent, weakens the Petitioner's position. Therefore, exploring any available evidence to corroborate the claimed exemptions is paramount.

### IV. Conclusion:

The Petitioner's success depends on demonstrating that the services in question genuinely fall under the reverse charge mechanism and that they had acted in good faith by attempting to comply with the prevailing tax regulations. A comprehensive legal strategy must address the evidentiary burden and the implications of the transition to GST. Researching precedents specifically dealing with retrospective tax demands in similar transitional contexts would significantly bolster the Petitioner's arguments. Finally, a thorough review of all relevant documentation is crucial to identify any supporting evidence that might mitigate the Respondent's claim regarding insufficient documentation.`
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