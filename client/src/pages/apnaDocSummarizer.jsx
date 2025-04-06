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
            "## GDPR Compliance Assessment\n\nThis document has been reviewed for GDPR ",
        parsed_clauses:
            "\n| Clause | Risk Level | Suggested Changes |\n|---|---|---|\n| ",
        probability: 0.72, // Changed probability for better visualization example
        belongs:
            'This document appears to relate to **Section 420 ',
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
            data.parsed_clauses = data.parsed_clauses.replace(/^```(?:\w+)?\n?/, '')      // Removes the opening code block fence, e.g. ``` or ```markdown
            .replace(/\n?```$/, '') ;
            setResponseData(data.parsed_clauses);
            console.log('Parsed clauses:', data.parsed_clauses);

            // setResponseData(data);
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-4xl mx-auto bg-white p-6 rounded-xl border border-slate-200 shadow-md"
    >
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">
            Document Summary & Analysis
        </h2>
        <div className="bg-gradient-to-br from-blue-100 to-indigo-100 text-slate-800 p-6 rounded-xl whitespace-pre-wrap font-mono overflow-auto">
    <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        // components={{
        //     p: ({ node, ...props }) => <p className="mb-4 text-slate-800" {...props} />,
        //     strong: ({ node, ...props }) => <strong className="text-slate-800 font-semibold" {...props} />,
        //     li: ({ node, ...props }) => <li className="ml-6 list-disc text-slate-800" {...props} />,
        //     code: ({ node, ...props }) => <code className="bg-slate-700 text-slate-800 px-1 py-0.5 rounded" {...props} />,
        //     pre: ({ node, ...props }) => <pre className="bg-slate-700 text-slate-800 p-4 rounded overflow-x-auto" {...props} />,
        //     h1: ({ node, ...props }) => <h1 className="text-slate-800 text-2xl font-bold mb-4" {...props} />,
        //     h2: ({ node, ...props }) => <h2 className="text-slate-800 text-xl font-semibold mb-3" {...props} />,
        // }}
    >
        {responseData}
    </ReactMarkdown>
</div>

    </motion.div>
)}

            </div>
            <Chatbot mockJson={responseData} />
        </div>
    );
};

export default ApnaDocSummarizer;
