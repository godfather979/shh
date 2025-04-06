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
import FileUpload from '../components/FileUpload';
import { Loader2, Upload } from 'lucide-react';
import { useEffect } from 'react';

// const ipcDummyData = {
//     'IPC Section 354 - Outraging Modesty of Woman': 0.6809,
//     'IPC Section 403 - Dishonest Misappropriation of Property': 0.3145,
//     'IPC Section 405 - Criminal Breach of Trust': 0.4152,
//     'IPC Section 415 - Cheating': 0.5281,
//     'IPC Section 441 - Criminal Trespass': 0.5245,
//     'IPC Section 442 - House Trespass': 0.6148,
//     'IPC Section 498A - Cruelty to Woman': 0.497,
//     'IPC Section 506 - Criminal Intimidation': 0.4993,
// };

// const statuteDummyData = {
//     'Agreements & Contracts': 0.5646,
//     'Corporate Governance': 0.4601,
//     'Criminal Cases': 0.5575,
//     'Environmental Cases': 0.7158,
//     'Family Disputes/Laws': 0.6283,
//     'Intellectual Property': 0.4003,
//     'Medical Records': 0.4547,
//     'Memorandum of Understanding': 0.5395,
// };

// const segmentationDummyData = {
//     top_tags: [
//         { tag: 'Ruling', count: 328 },
//         { tag: 'Arguments', count: 201 },
//         { tag: 'Precedents', count: 77 },
//     ],
// };

const COLORS = ['#34d399', '#facc15', '#f87171'];

const AgreementSummarizer = () => {
    const [file, setFile] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);   
    const [responseText,setResponseText] = useState('')
    const [ipcData, setIpcData] = useState(null);
    const [statueData, setStatueData] = useState(null);
    const [segmentationData, setSegmentationData] = useState(null)
 
    useEffect(() => {
        if (!showResults || !responseText) return;
      
        const fetchData = async () => {
          setLoading(true);
          setError(null);
      
          const options = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: responseText }),
          };
      
          try {
            // IPC Identification
            const ipcResponse = await fetch("http://127.0.0.1/ipc-identification", options);
            if (!ipcResponse.ok) throw new Error("Failed to fetch IPC data");
            const ipcData = await ipcResponse.json();
            setIpcData(ipcData);
      
            // Semantic Segmentation
            const segmentationResponse = await fetch("http://127.0.0.1/semantic-segmentation", options);
            if (!segmentationResponse.ok) throw new Error("Failed to fetch segmentation data");
            const segmentationData = await segmentationResponse.json();
            setSegmentationData(segmentationData);
      
            // Statute Prediction
            const statuteResponse = await fetch("http://127.0.0.1/judgement-prediction", options);
            if (!statuteResponse.ok) throw new Error("Failed to fetch statute data");
            const statueData = await statuteResponse.json();
            setStatueData(statueData);
          } catch (err) {
            console.error("Error posting to endpoints:", err);
            setError("One or more data sources failed to load.");
          } finally {
            setLoading(false);
            setShowResults(true);
          }
        };
      
        fetchData();
      }, [responseText]);
      
      


      const ipcChartData = ipcData
      ? Object.entries(ipcData).map(([section, score]) => ({
          section,
          shortLabel: section.split(' - ')[0].replace('IPC Section ', 'Sec '),
          score: parseFloat((score * 100).toFixed(2)),
        }))
      : [];
    
    const statuteChartData = statuteData
      ? Object.entries(statuteData).map(([category, score]) => ({
          category,
          score: parseFloat((score * 100).toFixed(2)),
        }))
      : [];

    const handleUpload = async () => {
        if (!file) return;
      
        const formData = new FormData();
        formData.append('pdf', file);
      
        try {
          setLoading(true);
          setError(null);
          setShowResults(false);
      
          const response = await fetch("http://localhost:5000/upload-pdf", {
            method: "POST",
            body: formData,
          });
      
          if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
          }
      
          const text = await response.text();
          console.log("Server response:", text);
          setResponseText(text); // <-- store response text here
        //   setShowResults(true);
        } catch (err) {
          setError("An error occurred while uploading or processing the file.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      

      const MotionBar = (props) => {
        const { x, y, width, height, fill } = props;
    
        return (
            <motion.rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={fill}
                rx={8}
                initial={{ scaleY: 1 }}
                whileHover={{
                    scaleY: 1.05,
                    originY: 1,
                    transition: { duration: 0.3, ease: 'easeOut' },
                }}
            />
        );
    };
    
    
    return (
        <div className='p-6 space-y-6'>
            {/* <Card className='bg-gradient-to-br from-indigo-100 to-white shadow-xl'>
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
            </Card> */}
            <motion.div
                className='max-w-2xl mx-auto mb-12 bg-white p-6 rounded-xl shadow-md border border-slate-200'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
            >
            <FileUpload onFileSelect={setFile} /> {/* ✅ Pass setFile directly */}
                {file && (
                    <div className="mt-4">
                    <p className="text-sm text-gray-600">File received for agreement analysis:</p>
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

            {showResults && (
                <motion.div
                    className='grid md:grid-cols-2 gap-6'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    <Card className="p-4 pt-6 pb-3 shadow-lg rounded-2xl bg-white">
                    <h2 className="text-lg font-semibold mb-6 text-indigo-700">
                        IPC Sections Detected
                    </h2>

                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={ipcChartData}
                            margin={{ top: 0, right: 20, bottom: 30, left: 10 }} // shifted chart lower
                        >
                            <XAxis
                                dataKey="shortLabel"
                                angle={-30}
                                textAnchor="end"
                                interval={0}
                                height={60}
                                tick={{ fontSize: 12, fill: '#334155', fontWeight: 500 }}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: '#64748b' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(79, 70, 229, 0.05)' }}
                                contentStyle={{
                                    borderRadius: '8px',
                                    border: '1px solid #e0e7ff',
                                    backgroundColor: '#f8fafc',
                                    fontSize: '14px',
                                    color: '#1e293b',
                                }}
                                formatter={(value) => [`${value}%`, 'Likelihood']}
                                labelFormatter={(label) =>
                                    ipcChartData.find((d) => d.shortLabel === label)?.section
                                }
                            />
                            <Bar
                                dataKey="score"
                                fill="url(#barGradient)"
                                shape={<MotionBar />}
                            />
                            <defs>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#6366f1" />
                                    <stop offset="100%" stopColor="#818cf8" />
                                </linearGradient>
                            </defs>
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
                            {segmentationData.top_tags.map(
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
