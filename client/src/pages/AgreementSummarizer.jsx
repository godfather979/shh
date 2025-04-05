import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import { FileUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ipcDummyData = {
    'IPC Section 354 - Outraging Modesty of Woman': 0.6809,
    'IPC Section 403 - Dishonest Misappropriation of Property': 0.3145,
    'IPC Section 405 - Criminal Breach of Trust': 0.4152,
    'IPC Section 415 - Cheating': 0.5281,
    'IPC Section 441 - Criminal Trespass': 0.5245,
    'IPC Section 442 - House Trespass': 0.6148,
    'IPC Section 498A - Cruelty to Woman': 0.497,
    'IPC Section 506 - Criminal Intimidation': 0.4993,
};

const statuteDummyData = {
    'Agreements & Contracts': 0.5646,
    'Corporate Governance': 0.4601,
    'Criminal Cases': 0.5575,
    'Environmental Cases': 0.7158,
    'Family Disputes/Laws': 0.6283,
    'Intellectual Property': 0.4003,
    'Medical Records': 0.4547,
    'Memorandum of Understanding': 0.5395,
};

const segmentationDummyData = {
    top_tags: [
        { tag: 'Ruling', count: 328 },
        { tag: 'Arguments', count: 201 },
        { tag: 'Precedents', count: 77 },
    ],
};

const COLORS = ['#34d399', '#facc15', '#f87171'];

const AgreementSummarizer = () => {
    const [file, setFile] = useState(null);
    const [showResults, setShowResults] = useState(false);

    const handleFileUpload = e => {
        const uploaded = e.target.files[0];
        if (uploaded) {
            setFile(uploaded);
            setTimeout(() => {
                setShowResults(true); // simulate processing
            }, 1000);
        }
    };

    const ipcChartData = Object.entries(ipcDummyData).map(
        ([section, score]) => ({
            section,
            shortLabel: section.split(' - ')[0].replace('IPC Section ', 'Sec '),
            score: parseFloat((score * 100).toFixed(2)),
        })
    );

    const statuteChartData = Object.entries(statuteDummyData).map(
        ([category, score]) => ({
            category,
            score: parseFloat((score * 100).toFixed(2)),
        })
    );

    return (
        <div className='p-6 space-y-6'>
            <Card className='bg-gradient-to-br from-indigo-100 to-white shadow-xl'>
                <CardContent className='p-6 flex flex-col items-center space-y-4'>
                    <FileUp className='h-10 w-10 text-indigo-600' />
                    <input
                        type='file'
                        onChange={handleFileUpload}
                        className='hidden'
                        id='file-upload'
                    />
                    <label
                        htmlFor='file-upload'
                        className='cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition'
                    >
                        {file ? 'Replace File' : 'Upload Agreement File'}
                    </label>
                </CardContent>
            </Card>

            {showResults && (
                <motion.div
                    className='grid md:grid-cols-2 gap-6'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    {/* IPC Chart - Vertical & Clean */}
                    <Card className='p-4 shadow-lg rounded-2xl'>
                        <h2 className='text-lg font-semibold mb-2 text-indigo-700'>
                            IPC Sections Detected
                        </h2>
                        <ResponsiveContainer width='100%' height={300}>
                            <BarChart
                                data={ipcChartData}
                                margin={{
                                    top: 10,
                                    right: 20,
                                    bottom: 50,
                                    left: 10,
                                }}
                            >
                                <XAxis
                                    dataKey='shortLabel'
                                    angle={-30}
                                    textAnchor='end'
                                    interval={0}
                                    height={60}
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis />
                                <Tooltip
                                    formatter={(value, name, props) => [
                                        `${value}%`,
                                        'Likelihood',
                                    ]}
                                    labelFormatter={label =>
                                        ipcChartData.find(
                                            d => d.shortLabel === label
                                        )?.section
                                    }
                                />
                                <Bar
                                    dataKey='score'
                                    fill='#4f46e5'
                                    radius={[8, 8, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Statute Pie Chart */}
                    <Card className='p-4 shadow-lg rounded-2xl'>
                        <h2 className='text-lg font-semibold mb-2 text-indigo-700'>
                            Statute Category Distribution
                        </h2>
                        <ResponsiveContainer width='100%' height={300}>
                            <PieChart>
                                <Pie
                                    data={statuteChartData}
                                    dataKey='score'
                                    nameKey='category'
                                    cx='50%'
                                    cy='50%'
                                    outerRadius={100}
                                    fill='#8884d8'
                                    label={({ name, percent }) =>
                                        `${name}: ${(percent * 100).toFixed(1)}%`
                                    }
                                >
                                    {statuteChartData.map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Semantic Tag Summary */}
                    <Card className='p-6 shadow-lg rounded-2xl md:col-span-2'>
                        <h2 className='text-lg font-semibold mb-4 text-indigo-700'>
                            Semantic Segmentation Summary
                        </h2>
                        <div className='grid grid-cols-3 gap-4'>
                            {segmentationDummyData.top_tags.map(
                                (tag, index) => (
                                    <motion.div
                                        key={tag.tag}
                                        className={`rounded-xl p-4 text-white shadow-md ${
                                            index === 0
                                                ? 'bg-green-500'
                                                : index === 1
                                                  ? 'bg-yellow-500'
                                                  : 'bg-red-500'
                                        }`}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <div className='text-2xl font-bold'>
                                            {tag.count}
                                        </div>
                                        <div className='text-sm'>{tag.tag}</div>
                                    </motion.div>
                                )
                            )}
                        </div>
                    </Card>
                </motion.div>
            )}
        </div>
    );
};

export default AgreementSummarizer;
