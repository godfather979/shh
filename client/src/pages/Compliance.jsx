import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import { Loader2, Upload } from 'lucide-react';
import axios from 'axios';
import FileUpload from '../components/FileUpload';

const Compliance = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [gdprSummary, setGdprSummary] = useState('');
    const [riskCategories, setRiskCategories] = useState(null);
    const [error, setError] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);

    const handleFileChange = selectedFile => {
        setFile(selectedFile);
        setError(null);
        setGdprSummary('');
        setRiskCategories(null);
    };
    
    const handleFileSelect = (file) => {
        console.log("Selected file:", file); // Confirm it works
        setUploadedFile(file);
      };

    const handleUpload = async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);

        try {
            setLoading(true);
            setError(null);

            const [gdprRes, analysisRes] = await Promise.all([
                axios.post('http://127.0.0.1:5000/gdpr-compliance', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }),
                axios.post('http://127.0.0.1:5000/analyze?file', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }),
            ]);

            setGdprSummary(gdprRes.data.gdpr_compliance);
            setRiskCategories(analysisRes.data.risk_categories);
        } catch (err) {
            setError(
                'An error occurred while uploading or processing the file.'
            );
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getRiskBorderClass = (riskName) => {
        switch (riskName) {
          case '🟢 Low Risk':
            return 'border-green-200';
          case '🟡 Medium Risk':
            return 'border-yellow-200';
          case '🔴 High Risk':
            return 'border-red-200';
          default:
            return 'border-gray-300'; // Default border color if risk name doesn't match
        }
      };
      
      const renderRiskCard = (title,color, items) => { // Removed the 'color' prop
          if (!items || Object.keys(items).length === 0) return null;
      
          const borderColorClass = getRiskBorderClass(title);
          const shadowColor = borderColorClass.replace('border-', 'shadow-'); // Derive shadow color
          const shadowClass = `${shadowColor}-500`;
      
          return (
              <div
                  className={`flex-1 rounded-xl p-4 mt-8 text-sm text-slate-700 bg-white border-4 ${borderColorClass} ${shadowClass}`}
                  style={{ boxShadow: `0 2px 4px 0 rgba(0, 0, 0, 0.05), 0 2px 4px 0 rgba(var(--tw-shadow-color), 0.3)` }}
              >
                  <h3 className={`font-bold ${borderColorClass.replace('border', 'text')}-800 mb-2 text-base`}>{title}</h3>
                  <ul className="list-disc pl-5 space-y-1">
                      {Object.entries(items).map(([clause, text], idx) => (
                          <li key={idx}>
                              <span className="font-semibold">{clause}</span>: {text}
                          </li>
                      ))}
                  </ul>
              </div>
          );
      };
    

    const renderGoogleLinks = () => {
        if (!riskCategories) return null;
        const allClauses = [
            ...Object.keys(riskCategories.high_risk || {}),
            ...Object.keys(riskCategories.medium_risk || {}),
            ...Object.keys(riskCategories.low_risk || {}),
        ];

        return (
            <div className='mt-10 bg-white rounded-xl p-6 border border-slate-200 shadow'>
                <h3 className='text-xl font-bold mb-4 text-slate-800'>
                    📚 External References
                </h3>
                <ul className='list-disc pl-5 space-y-2 text-blue-600 underline'>
                    {allClauses.map((clause, idx) => (
                        <li key={idx}>
                            <a
                                href={`https://www.google.com/search?q=${encodeURIComponent(clause + ' law India')}`}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-blue-600 hover:underline'
                            >
                                {clause}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div className='min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8 px-4'>
            <motion.div
                className='text-center mb-10'
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
            >
                <h1 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text mb-4'>
                    Compliance Analyzer
                </h1>
                <p className='text-slate-700 text-lg'>
                    Upload your document for GDPR and Risk analysis
                </p>
            </motion.div>

            {/* Upload section */}
            {/* <motion.div
                className='max-w-2xl mx-auto mb-12 bg-white p-6 rounded-xl shadow-md border border-slate-200'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
            >
                <div className='flex flex-col sm:flex-row items-center gap-4'>
                    <input
                        type='file'
                        accept='.pdf,.doc,.docx,.txt'
                        onChange={handleFileChange}
                        className='file-input file-input-bordered file-input-sm'
                    />
                    <button
                        onClick={handleUpload}
                        disabled={!file || loading}
                        className='inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {loading ? (
                            <Loader2 className='w-4 h-4 animate-spin' />
                        ) : (
                            <Upload className='w-4 h-4' />
                        )}
                        Analyze
                    </button>
                </div>
            </motion.div> */}
            <motion.div
                className='max-w-2xl mx-auto mb-12 bg-white p-6 rounded-xl shadow-md border border-slate-200'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
            >
            <FileUpload onFileSelect={setFile} /> {/* ✅ Pass setFile directly */}
                {file && (
                    <div className="mt-4">
                    <p className="text-sm text-gray-600">File received in Compliance:</p>
                    <p className="text-blue-700 font-medium">{file.name}</p>
                    </div>
                )}


                <div className="w-full flex justify-center">
                <button
                    onClick={handleUpload}
                    disabled={!file || loading}
                    className='mt-4 w-auto inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    {loading ? (
                    <Loader2 className='w-4 h-4 animate-spin' />
                    ) : (
                    <Upload className='w-4 h-4' />
                    )}
                    Analyze
                </button>
                </div>
            </motion.div>


            {/* Loading Spinner */}
            {loading && (
                <div className='flex justify-center items-center'>
                    <div className='flex flex-col items-center'>
                        <div className='w-14 h-14 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin'></div>
                        <p className='mt-4 text-slate-600'>
                            Analyzing document...
                        </p>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className='text-red-600 bg-red-50 border border-red-200 p-4 rounded-xl max-w-2xl mx-auto mb-6'>
                    {error}
                </div>
            )}

            {/* Results Layout */}
            {gdprSummary && riskCategories && !loading && (
                <motion.div
                    className='flex flex-col md:flex-row gap-8 max-w-7xl mx-auto'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* GDPR Summary Table */}
                    <div className="w-full md:w-2/3 px-4">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 h-full overflow-auto max-h-[150vh] mt-8">
                        <h2 className="text-xl font-bold text-slate-800 mb-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text">
                        🛡️ GDPR Compliance Summary
                        </h2>
                        <div className="prose prose-slate max-w-none prose-table:border prose-th:bg-slate-50 prose-th:p-2 prose-td:p-2 prose-td:border text-slate-600">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {gdprSummary}
                        </ReactMarkdown>
                        </div>
                    </div>
                    </div>

                    {/* Risk Cards */}
                    <div className='w-full md:w-1/3 flex flex-col justify-between gap-1 md:mt-0'>
                        {renderRiskCard(
                            '🟢 Low Risk',
                            'green',
                            riskCategories.low_risk
                        )}
                        {renderRiskCard(
                            '🟡 Medium Risk',
                            'yellow',
                            riskCategories.medium_risk
                        )}
                        {renderRiskCard(
                            '🔴 High Risk',
                            'red',
                            riskCategories.high_risk
                        )}
                    </div>
                </motion.div>
            )}

            {/* External References */}
            {!loading && riskCategories && renderGoogleLinks()}
        </div>
    );
};

export default Compliance;
