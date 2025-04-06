import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FileUpload from '../components/FileUpload'; // Assuming this component exists
import Chatbot from '../components/ChatBot'; // Assuming this component exists
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // Import remark-gfm for table support

const ApnaDocSummarizer = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [responseData, setResponseData] = useState(null);
    const [showSummary, setShowSummary] = useState(false); // Single state to control summary visibility

    // Mock response data for frontend development
    const mockResponse = {
        gdpr_compliance_report:
            "## GDPR Compliance Assessment\n\nThis document has been reviewed for GDPR compliance issues. Below is a summary of key findings:\n\n### Key Concerns\n\n1. **Data Subject Rights**: The agreement does not explicitly outline procedures for handling data subject access requests, which is a requirement under GDPR Article 15.\n\n2. **Data Processing Limitations**: The contract lacks clear boundaries on data processing activities, potentially conflicting with Article 5's purpose limitation principle.\n\n3. **Data Retention Policies**: No specific timeframes for data retention are provided, which may contradict Article 5(1)(e) requirements.\n\n### Recommendations\n\n- Add specific clauses addressing data subject rights and request handling procedures\n- Define clear data processing purposes and limitations\n- Implement and document appropriate data retention periods\n- Consider adding provisions for data breach notification protocols",
        parsed_clauses:
            "\n| Clause | Risk Level | Suggested Changes |\n|---|---|---|\n| (1) The Vendor will sell and the BUYER will buy that entire house No....................... Road ...................... more particularly described in the Schedule hereunder written at a price of Rs. ................................................... ................................................... .........................free from all encumbrances. | Low | Ensure that the property address and price are filled in with specific and accurate information. |\n| (2) The BUYER has paid a sum of Rs. ............... .. as earnest money on ......................... the receipt of which sum, the Vendor hereby acknowledges and the balance amount of consideration will be paid at the time of execution of conveyance deed. | Low |  Fill in the exact amount of earnest money and the date it was paid.  Specify the method of payment (e.g., check number, bank transfer). |\n| (3) The sale shall be completed within a period of. .................. months from this date and it is hereby agreed that time is the essence of the contract. | Medium | Fill in the number of months allowed for completion.  Consider adding a clause outlining consequences for delays caused by either party, force majeure considerations, and acceptable reasons for extension. |\n| (4) The Vendor shall submit the title deeds of the house in his possession or power to the BUYER's advocate within one week from the date of this agreement for investigation of title and the BUYER will intimate about his advocate's report within ................ days after delivery of title deeds to his advocate. | Medium | Fill in the number of days the Buyer's advocate has to provide the report. Consider adding a clause specifying what constitutes a valid title objection and a process for resolving title issues. |\n| (5) If the BUYER's Advocate gives the report that the Vendor's title is not clear, the Vendor shall refund the earnest money, without interest to the BUYER within .................. days from the date of intimation about the advocate's report by the BUYER If the Vendor does not refund the earnest money within ................... days from the date of intimation about the advocate's report, the Vendor will be liable to pay interest @ ................. p.m. upto the date of repayment of earnest money. | Medium | Fill in the number of days for the refund period and the interest rate.  Consider adding a clause outlining the specific process for notifying the Vendor of title objections and the consequences of failing to do so correctly. Clarify what constitutes \"not clear\" title. |\n| (6) The Vendor declares that the sale of the house will be without encumbrances. | High | **CRITICAL:** This is a significant representation.  This should be backed by a title search conducted by a reputable title company. The agreement should include a clause requiring the vendor to rectify any encumbrances discovered during the title search at their own expense within a specified timeframe.  Failure to do so should give the buyer the option to terminate the agreement and receive a full refund of the earnest money, plus reasonable expenses incurred. Consider including a clause specifying the type of encumbrances covered (e.g., liens, mortgages, easements). |\n| (7) The Vendor will hand over the vacant possession of the house on the execution and registration of conveyance deed. | Low |  No immediate changes needed.  It is important to ensure the property is indeed vacant on the transfer date. |\n| (8) If the BUYER commits breach of the agreement, the vendor shall be entitled to forfeit the earnest money paid by the purchaser to the vendor and the vendor will be at liberty to resell the property to any person. | Medium | Add clarity regarding what constitutes a \"breach\" by the buyer.  Consider adding a clause outlining a cure period for the buyer to remedy the breach before the earnest money is forfeited. Explore including language for mediation or arbitration. |\n| (9) It the Vendor commits breach of the agreement, he shall be liable to refund earnest money, received by him and a sum of Rs. ................. by way of liquidated damages. | High | Fill in the amount of liquidated damages. This clause significantly limits the Buyer's remedies. A Buyer would likely want the option of *specific performance* (forcing the sale) in addition to or instead of liquidated damages. Consider adding a clause stating: \"In the event of a breach by the Vendor, the Buyer shall have the option to either (a) terminate this agreement and receive a refund of the earnest money and the sum of Rs. [amount] as liquidated damages, or (b) seek specific performance of this agreement in a court of competent jurisdiction.\" This provides the Buyer with more robust protection.  |\n| (10) The Vendor shall execute the conveyance deed in favour of the purchaser or his nominee as the purchaser may require, on receipt of the balance consideration. | Low | No immediate changes needed. |\n| (11) The vendor shall at his own costs obtain clearance certificate under Income tax Act, 1961 and other permissions required for the completion of the sale. | Medium | Specify which \"other permissions\" are anticipated. This will prevent disputes later. |\n| (12) The expenses for, preparation of the conveyance deed, cost of stamp, registration charges and all other cut of pocket expenses shall be borne by the purchaser. | Low | No immediate changes needed.  This is a fairly standard arrangement, but Buyers should ensure they are prepared for these expenses. |\n\n\n*Explanation of Risk Levels:\n\n   *High:* Clauses that could result in significant financial loss or legal disputes if not properly addressed.\n*   *Medium:* Clauses that have potential for disputes or require further clarification to avoid misunderstandings.\n*   *Low:* Clauses that are relatively standard and pose minimal risk.\n\n*Important Considerations:\n\n   *Legal Advice:* This analysis is for informational purposes only and does not constitute legal advice. Consult with a qualified real estate attorney to review the contract and advise you on your specific situation.\n*   *Jurisdiction:* Real estate laws vary by jurisdiction. The suggested changes may need to be adjusted based on the applicable laws in your area.\n*   *Negotiation:* The specific terms of the agreement are subject to negotiation between the buyer and seller.\n\nThis table provides a structured analysis of the legal clauses in the contract, highlights potential risks, and suggests changes to protect the buyer's interests. Remember to consult with legal professionals for tailored advice.\n",
        probability: 0.72, // Changed probability for better visualization example
        belongs:
            'This document appears to relate to **Section 420 (Cheating and dishonestly inducing delivery of property)** and **Section 406 (Punishment for criminal breach of trust)** of the Indian Penal Code (IPC).',
    };

    // Example with missing fields for testing conditional rendering
    // const mockResponseMissingFields = {
    //   "parsed_clauses": "| Clause | Risk Level | Suggested Changes |\n|---|---|---|\n| (1) The Vendor will sell... | Low | Specify details. |",
    //   // "gdpr_compliance_report": "...", // Missing
    //   "probability": 0.65,
    //   // "belongs": "..." // Missing
    // };

    const handleFileUpload = async file => {
        if (!file) {
            console.log('File removed or invalid.');
            setIsLoading(false);
            setResponseData(null);
            setShowSummary(false);
            return;
        }

        console.log('handleFileUpload triggered with file:', file.name);
        setIsLoading(true);
        setShowSummary(false);
        setResponseData(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('http://127.0.0.1:5000/analyze', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(
                    `Server responded with status ${response.status}`
                );
            }

            const data = await response.json();
            console.log('API response received:', data);
            setResponseData(data);
        } catch (error) {
            console.error('Error during file upload or API call:', error);
            setResponseData({ error: 'Failed to analyze the document.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateSummary = () => {
        console.log('Generating summary display');
        setShowSummary(true); // Show the summary section
    };

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 },
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const buttonStyle =
        'flex items-center justify-center px-6 py-3 rounded-md font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed';

    // Helper function to render the probability graph
    const renderProbabilityGraph = probability => {
        const percentage = Math.round(probability * 100);
        let barColor = 'from-red-500 to-orange-500'; // Default low
        if (percentage > 66) {
            barColor = 'from-green-400 to-blue-500'; // High
        } else if (percentage > 33) {
            barColor = 'from-yellow-400 to-orange-500'; // Medium
        }

        return (
            <div className='w-full'>
                <div className='relative pt-1'>
                    <div className='flex mb-2 items-center justify-between'>
                        <div>
                            <span className='text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-100'>
                                Favourability Probability
                            </span>
                        </div>
                        <div className='text-right'>
                            <span
                                className={`text-xs font-semibold inline-block ${percentage > 66 ? 'text-green-600' : percentage > 33 ? 'text-yellow-600' : 'text-red-600'}`}
                            >
                                {percentage}%
                            </span>
                        </div>
                    </div>
                    <div className='overflow-hidden h-4 mb-4 text-xs flex rounded bg-slate-200'>
                        <div
                            style={{ width: `${percentage}%` }}
                            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r ${barColor} transition-all duration-500 ease-out`}
                        ></div>
                    </div>
                </div>
                <p className='text-center text-sm text-slate-600 mt-1'>
                    Estimated probability the legal outcome will be favourable
                    based on the document's clauses.
                </p>
            </div>
        );
    };

    return (
        <div className='min-h-screen bg-gradient-to-b from-slate-50 to-slate-100'>
            <div className=' mx-auto px-4 py-12'>
                {/* Header */}
                <motion.div
                    className='text-center mb-12'
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className='text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text'>
                        Legal Document Summarizer
                    </h1>
                    <p className='text-slate-700 text-xl max-w-2xl mx-auto'>
                        Upload your legal document for analysis and insights.
                    </p>
                </motion.div>

                {/* File Upload Section */}
                <motion.div
                    className='max-w-2xl mx-auto mb-12'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    <div className='bg-white rounded-xl shadow-lg p-6 border border-slate-200'>
                        <FileUpload
                            onFileSelect={handleFileUpload}
                            isLoading={isLoading}
                        />
                    </div>
                </motion.div>

                {/* Generate Summary Button */}
                {responseData &&
                    !isLoading &&
                    !showSummary && ( // Show button only if data loaded and summary not yet shown
                        <motion.div
                            className='max-w-2xl mx-auto mb-8 flex justify-center'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                        >
                            <button
                                className={buttonStyle}
                                onClick={handleGenerateSummary}
                                disabled={isLoading} // Disable if loading (though handled by conditional render too)
                            >
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='h-5 w-5 mr-2'
                                    viewBox='0 0 20 20'
                                    fill='currentColor'
                                >
                                    <path d='M10 12a2 2 0 100-4 2 2 0 000 4z' />
                                    <path
                                        fillRule='evenodd'
                                        d='M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z'
                                        clipRule='evenodd'
                                    />
                                </svg>
                                Get Summary & Analysis
                            </button>
                        </motion.div>
                    )}

                {/* Loading Indicator */}
                {isLoading && (
                    <motion.div
                        className='flex justify-center my-12'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className='flex flex-col items-center'>
                            <div className='w-16 h-16 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin'></div>
                            <p className='mt-4 text-slate-600'>
                                Analyzing document...
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Results Section - Shown only when showSummary is true */}
                {showSummary && responseData && !isLoading && (
                    <motion.div
                        className='w-full mx-auto p-10 space-y-10 ' // Added space-y for spacing between sections
                        initial='initial'
                        animate='animate'
                        variants={staggerContainer}
                    >
                        <div className='flex flex-wrap -mx-4 h-4/5 min-h-screen'>
                            {' '}
                            {/* Updated height to 4/5 of screen height */}
                            {/* Section 1: Parsed Clauses Table */}
                            {responseData.parsed_clauses && (
                                <motion.div
                                    className='w-full md:w-1/2 px-4 mb-8 md:mb-0'
                                    variants={fadeInUp}
                                >
                                    <div className='bg-white rounded-xl shadow-lg p-6 border border-slate-200 h-full overflow-auto max-h-[100vh]'>
                                        {' '}
                                        {/* Added max-h-[60vh] for fixed height and overflow-auto for scrolling */}
                                        <h2 className='text-xl font-bold text-slate-800 mb-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text  top-0 bg-white pb-2'>
                                            Parsed Clauses Analysis
                                        </h2>
                                        {/* Render markdown table using ReactMarkdown and remarkGfm */}
                                        <div className='prose prose-slate max-w-none text-slate-600 prose-td:px-4 prose-td:py-2 prose-th:px-4 prose-th:py-2 prose-table:border prose-th:bg-slate-50 overflow-x-auto'>
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                            >
                                                {responseData.parsed_clauses}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            {/* Section 2: GDPR Compliance Report */}
                            {responseData.gdpr_compliance_report && (
                                <motion.div
                                    className='w-full md:w-1/2 px-4'
                                    variants={fadeInUp}
                                >
                                    <div className='bg-white rounded-xl shadow-lg p-6 border border-slate-200 h-full overflow-auto max-h-[100vh]'>
                                        <h2 className='text-xl font-bold text-slate-800 mb-4 bg-gradient-to-r from-green-500 to-emerald-600 text-transparent bg-clip-text'>
                                            GDPR Compliance Summary
                                        </h2>
                                        <div className='prose prose-slate max-w-none text-slate-700 text-sm'>
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                            >
                                                {
                                                    responseData.gdpr_compliance_report
                                                }
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Section 3: IPC Sections and Probability Graph */}
                        <motion.div
                            className='grid grid-cols-1 md:grid-cols-2 gap-8'
                            variants={fadeInUp}
                        >
                            {/* IPC Identification */}
                            {responseData.belongs && (
                                <div className='bg-white rounded-xl shadow-lg p-6 border border-slate-200'>
                                    <h2 className='text-xl font-bold text-slate-800 mb-4 bg-gradient-to-r from-red-500 to-pink-500 text-transparent bg-clip-text'>
                                        IPC Section Identification
                                    </h2>
                                    <p className='text-slate-700 text-sm'>
                                        {responseData.belongs}
                                    </p>
                                </div>
                            )}

                            {/* Probability Graph */}
                            {typeof responseData.probability === 'number' && (
                                <div className='bg-white rounded-xl shadow-lg p-6 border border-slate-200'>
                                    {renderProbabilityGraph(
                                        responseData.probability
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </div>
            <Chatbot mockJson={mockResponse} />
        </div>
    );
};

export default ApnaDocSummarizer;
