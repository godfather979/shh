import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { FileDown } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLocation } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import { templates } from '@/lib/templates';

export default function TextEditor() {
    const [versions, setVersions] = useState([]);
    const [currentVersionId, setCurrentVersionId] = useState(null);
    const [showSignatureModal, setShowSignatureModal] = useState(false);
    const [activeTab, setActiveTab] = useState('draw');
    const [signatureData, setSignatureData] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastX, setLastX] = useState(0);
    const [lastY, setLastY] = useState(0);

    const editorRef = useRef(null);
    const canvasRef = useRef(null);
    const location = useLocation();
    const { formValues, category } = location.state || {};

    const generateTemplate = (category, formValues) => {
        let template = templates[category] || 'Template not found.';
        if (!formValues) return template;

        return template.replace(/\{\{(.*?)\}\}/g, (_, label) => {
            const key = label
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9]/gi, '_');
            return formValues[key] || '';
        });
    };

    const saveVersion = content => {
        const newVersion = {
            id: versions.length + 1,
            content,
            timestamp: new Date(),
        };
        setVersions(prev => [...prev, newVersion]);
        setCurrentVersionId(newVersion.id);
    };

    const switchVersion = id => {
        const selected = versions.find(v => v.id === id);
        if (selected && editorRef.current) {
            editorRef.current.innerHTML = selected.content;
            setCurrentVersionId(id);
        }
    };

    const downloadAsPDF = async () => {
        const element = editorRef.current;

        // Wait for all images to load (including signature)
        await waitForImagesToLoad(element);

        const opt = {
            margin: 0,
            filename: 'document.pdf',
            image: { type: 'jpeg', quality: 1 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css'] },
        };
        html2pdf().set(opt).from(element).save();
    };

    const downloadAsDoc = () => {
        const content = editorRef.current.innerHTML;
        const blob = new Blob(['\ufeff', content], {
            type: 'application/msword',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'document.doc';
        link.click();
        URL.revokeObjectURL(url);
    };

    const startDrawing = e => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        setIsDrawing(true);
        setLastX(x);
        setLastY(y);
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const draw = e => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        ctx.lineTo(x, y);
        ctx.stroke();
        setLastX(x);
        setLastY(y);
    };

    const endDrawing = () => setIsDrawing(false);
    const clearCanvas = () =>
        canvasRef.current
            .getContext('2d')
            .clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    const insertSignature = dataUrl => {
        if (editorRef.current && dataUrl) {
            const img = document.createElement('img');
            img.src = dataUrl;
            img.style.maxWidth = '200px';
            img.style.marginTop = '20px';
            editorRef.current.appendChild(img);
            setShowSignatureModal(false);
        }
    };

    const waitForImagesToLoad = element => {
        const images = element.getElementsByTagName('img');
        const promises = Array.from(images).map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => {
                img.onload = img.onerror = resolve;
            });
        });
        return Promise.all(promises);
    };

    const handleFileUpload = e => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setSignatureData(reader.result);
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (formValues && category && editorRef.current) {
            const templateHTML = generateTemplate(category, formValues);
            editorRef.current.innerHTML = templateHTML;
            saveVersion(templateHTML);
        }
    }, [formValues, category]);

    return (
        <div className='flex flex-col h-screen overflow-hidden'>
            {showSignatureModal && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='bg-white p-4 rounded-lg w-96'>
                        <div className='flex gap-2 mb-4'>
                            <Button
                                variant={
                                    activeTab === 'draw' ? 'default' : 'outline'
                                }
                                onClick={() => setActiveTab('draw')}
                            >
                                Draw
                            </Button>
                            <Button
                                variant={
                                    activeTab === 'upload'
                                        ? 'default'
                                        : 'outline'
                                }
                                onClick={() => setActiveTab('upload')}
                            >
                                Upload
                            </Button>
                        </div>
                        {activeTab === 'draw' ? (
                            <div>
                                <canvas
                                    ref={canvasRef}
                                    width={400}
                                    height={200}
                                    className='border rounded w-full'
                                    onMouseDown={startDrawing}
                                    onMouseUp={endDrawing}
                                    onMouseMove={draw}
                                    onTouchStart={startDrawing}
                                    onTouchEnd={endDrawing}
                                    onTouchMove={draw}
                                />
                                <div className='flex gap-2 mt-2'>
                                    <Button onClick={clearCanvas}>Clear</Button>
                                    <Button
                                        onClick={() =>
                                            insertSignature(
                                                canvasRef.current.toDataURL()
                                            )
                                        }
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        variant='outline'
                                        onClick={() =>
                                            setShowSignatureModal(false)
                                        }
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <input
                                    type='file'
                                    accept='image/*'
                                    onChange={handleFileUpload}
                                    className='mb-2'
                                />
                                {signatureData && (
                                    <div className='mb-2'>
                                        <img
                                            src={signatureData}
                                            alt='Signature Preview'
                                            className='max-w-[200px]'
                                        />
                                        <div className='flex gap-2 mt-2'>
                                            <Button
                                                onClick={() =>
                                                    insertSignature(
                                                        signatureData
                                                    )
                                                }
                                            >
                                                Save
                                            </Button>
                                            <Button
                                                variant='outline'
                                                onClick={() =>
                                                    setSignatureData(null)
                                                }
                                            >
                                                Clear
                                            </Button>
                                        </div>
                                    </div>
                                )}
                                <Button
                                    variant='outline'
                                    onClick={() => setShowSignatureModal(false)}
                                    className='mt-2'
                                >
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className='flex flex-col md:flex-row h-full max-w-full mx-auto p-4 gap-4'>
                <div className='flex flex-col w-full md:w-2/3 items-center'>
                    <h1 className='text-2xl font-bold mb-4'>
                        EWS Certificate Editor
                    </h1>
                    <div
                        ref={editorRef}
                        contentEditable
                        className='bg-white text-black border rounded overflow-auto p-6 shadow'
                        style={{
                            width: '210mm',
                            height: '297mm',
                            boxSizing: 'border-box',
                        }}
                    />
                    <div className='flex gap-2 mt-4 flex-wrap'>
                        <Button
                            onClick={() =>
                                saveVersion(editorRef.current.innerHTML)
                            }
                        >
                            Save Version
                        </Button>
                        <Button onClick={() => setShowSignatureModal(true)}>
                            Add Signature
                        </Button>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant='outline'
                                        onClick={downloadAsPDF}
                                    >
                                        <FileDown className='h-4 w-4 mr-2' />{' '}
                                        PDF
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Download as PDF</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant='outline'
                                        onClick={downloadAsDoc}
                                    >
                                        <FileDown className='h-4 w-4 mr-2' />{' '}
                                        DOC
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Download as DOC</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
                <div className='w-full md:w-1/3 mt-4 md:mt-0'>
                    <h2 className='text-xl font-semibold mb-4'>
                        Version History
                    </h2>
                    <ScrollArea className='h-[calc(100vh-8rem)]'>
                        {versions.map(version => (
                            <div
                                key={version.id}
                                className={`p-2 mb-2 rounded cursor-pointer ${version.id === currentVersionId ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}
                                onClick={() => switchVersion(version.id)}
                            >
                                <h3 className='font-medium'>
                                    Version {version.id}
                                </h3>
                                <p className='text-sm'>
                                    {version.timestamp.toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}
