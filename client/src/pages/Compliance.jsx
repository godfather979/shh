import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import { Loader2, Upload } from 'lucide-react';
import axios from 'axios';

const Compliance = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [gdprSummary, setGdprSummary] = useState('');
    const [riskCategories, setRiskCategories] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = e => {
        setFile(e.target.files[0]);
        setError(null);
        setGdprSummary('');
        setRiskCategories(null);
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

    const renderRiskCard = (title, color, items) => {
        if (!items || Object.keys(items).length === 0) return null;
        return (
            <div
                className={`rounded-xl shadow-md p-4 text-sm text-slate-700 mb-4 bg-${color}-100 border-l-4 border-${color}-500`}
            >
                <h3 className={`font-bold text-${color}-800 mb-2`}>{title}</h3>
                <ul className='list-disc pl-5'>
                    {Object.entries(items).map(([clause, text], idx) => (
                        <li key={idx}>
                            <span className='font-semibold'>{clause}</span>:{' '}
                            {text}
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
        <div className='min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4'>
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
            <motion.div
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
                    <div className='w-full md:w-2/3 bg-white p-6 rounded-xl shadow-md border border-slate-200'>
                        <h2 className='text-xl font-bold text-slate-800 mb-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text'>
                            🛡️ GDPR Compliance Summary
                        </h2>
                        <div className='prose prose-slate max-w-none prose-table:border prose-th:bg-slate-50 prose-th:p-2 prose-td:p-2'>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {gdprSummary}
                            </ReactMarkdown>
                        </div>
                    </div>

                    {/* Risk Cards */}
                    <div className='w-full md:w-1/3'>
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
