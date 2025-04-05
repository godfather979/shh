import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement } from 'chart.js';
import ChatModal from '@/components/ChatModal';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement);

export default function DocView() {
  const [docs, setDocs] = useState([]);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [showContextMenu, setShowContextMenu] = useState(false);
  const docViewerRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    console.log(location?.state?.summary, "Summary Here")

    console.log(selectedText, "URL Here")
  }, [selectedText])

  // Handle text selection and context menu
  useEffect(() => {
    const handleContextMenu = (e) => {
      const selection = window.getSelection();
      if (selection.toString().trim()) {
        e.preventDefault();
        setSelectedText(selection.toString().trim());
        setContextMenuPosition({ x: e.clientX, y: e.clientY });
        setShowContextMenu(true);
      }
    };

    const handleClick = () => {
      setShowContextMenu(false);
    };

    // Add event listeners for main document
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClick);

    // Handle PDF viewer iframe content
    const handleIframeLoad = () => {
      const iframe = docViewerRef.current?.querySelector('iframe');
      if (iframe) {
        iframe.contentDocument?.addEventListener('contextmenu', handleContextMenu);
      }
    };

    // Set up mutation observer to detect iframe changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        handleIframeLoad();
      });
    });

    if (docViewerRef.current) {
      observer.observe(docViewerRef.current, { 
        childList: true, 
        subtree: true 
      });
    }

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleClick);
      observer.disconnect();
    };
  }, []);

  // Fetch and analyze PDF
  useEffect(() => {
    const fetchAndAnalyzePDF = async () => {
      if (location.state && location.state.url) {
        try {
          // Download the PDF
          const response = await axios.get(location.state.url, { responseType: 'blob' });
          const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
          const pdfFile = new File([pdfBlob], "document.pdf", { type: 'application/pdf' });

          // Set the document for DocViewer
          setDocs([{ uri: URL.createObjectURL(pdfFile), fileType: "pdf", fileName: "document.pdf" }]);

          // Prepare form data for upload
          const formData = new FormData();
          formData.append('pdf', pdfFile);

          // Upload and analyze the PDF
          const uploadResponse = await axios.post('http://localhost:5000/upload-pdf', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });

          const extractedText = uploadResponse.data.text;

          // Perform various analyses
          const statuteAnalysis = await analyzeStatuteText(extractedText);
          const ipcAnalysis = await analyzeIPCText(extractedText);
          const segmentationAnalysis = await analyzeSemanticSegmentation(extractedText);
          const judgmentAnalysis = await analyzeJudgmentPrediction(extractedText);

          setOutput({
            statuteAnalysis,
            ipcAnalysis,
            segmentationAnalysis,
            judgmentAnalysis
          });

        } catch (error) {
          console.error('Error processing PDF:', error);
          setError('Error processing PDF. Please try again.');
        }
      } else {
        console.error('No PDF URL provided in location state');
        setError('No PDF URL provided. Please upload a document first.');
      }
    };

    fetchAndAnalyzePDF();
  }, [location]);

  // Analysis functions
  const analyzeStatuteText = async (text) => {
    try {
      const response = await axios.post('http://localhost:5000/statute-identification', { text });
      return response.data;
    } catch (error) {
      setError('Error analyzing statute text. Please try again.');
      return null;
    }
  };

  const analyzeIPCText = async (text) => {
    try {
      const response = await axios.post('http://localhost:5000/ipc-identification', { text });
      return response.data;
    } catch (error) {
      setError('Error analyzing IPC text. Please try again.');
      return null;
    }
  };

  const analyzeSemanticSegmentation = async (text) => {
    try {
      const response = await axios.post('http://localhost:5000/semantic-segmentation', { text });
      return response.data;
    } catch (error) {
      setError('Error analyzing semantic segmentation. Please try again.');
      return null;
    }
  };

  const analyzeJudgmentPrediction = async (text) => {
    try {
      const response = await axios.post('http://localhost:5000/judgment-prediction', { text });
      return response.data;
    } catch (error) {
      setError('Error analyzing judgment prediction. Please try again.');
      return null;
    }
  };

  // Render analysis results
  const renderStatuteIdentification = () => {
    const highestStatute = Object.entries(output.statuteAnalysis)
      .sort(([, a], [, b]) => b - a)[0];
    return (
      <div>
        <h3 className="font-semibold">Statute Identification:</h3>
        <p>Highest Statute: {highestStatute[0]}</p>
      </div>
    );
  };

  const renderIPCIdentification = () => {
    const top3IPC = Object.entries(output.ipcAnalysis)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
    return (
      <div>
        <h3 className="font-semibold">Top 3 IPC Sections:</h3>
        <ul className="list-disc pl-5">
          {top3IPC.map(([section, probability]) => (
            <li key={section}>{section}</li>
          ))}
        </ul>
      </div>
    );
  };

  const renderSemanticSegmentation = () => {
    const labels = output.segmentationAnalysis.top_tags.map(tag => tag.tag);
    const data = output.segmentationAnalysis.top_tags.map(tag => tag.count);

    const lineData = {
      labels: labels,
      datasets: [{
        label: 'Tag Count',
        data: data,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    };

    return (
      <div>
        <h3 className="font-semibold">Semantic Segmentation:</h3>
        <Line data={lineData} />
      </div>
    );
  };

  const renderJudgmentPrediction = () => {
    const labels = ['Landlord', 'Tenant', 'Neutral', 'Other'];
    const data = output.judgmentAnalysis.probabilities;

    const barData = {
      labels: labels,
      datasets: [{
        label: 'Probability',
        data: data,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    };

    return (
      <div>
        <h3 className="font-semibold">Judgment Prediction:</h3>
        <p>Prediction: {output.judgmentAnalysis.prediction}</p>
        <Bar data={barData} />
      </div>
    );
  };

  // Custom context menu component
  const ContextMenu = () => (
    showContextMenu && (
      <div
        className="fixed bg-white border border-gray-200 shadow-lg rounded-md p-1 z-50"
        style={{
          left: contextMenuPosition.x,
          top: contextMenuPosition.y,
        }}
      >
        <button
          onClick={() => {
            setIsOpen(true);
            setShowContextMenu(false);
          }}
          className="px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
        >
          Chat about this selection
        </button>
      </div>
    )
  );

  return (
    <div className="flex min-h-screen">
      <ContextMenu />
      
      {/* Left side document viewer */}
      <div className="w-1/2 bg-gray-100 p-3 h-full flex flex-col">
        {error && <p className="text-red-500">{error}</p>}
        {docs.length > 0 ? (
          <>
            <DocViewer 
              ref={docViewerRef}
              documents={docs} 
              pluginRenderers={DocViewerRenderers}
              style={{ width: '100%', height: 'calc(100vh - 200px)', overflowY: 'auto' }} 
            />
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Document Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{location.state.summary}</p>
              </CardContent>
            </Card>
          </>
        ) : (
          <p>No document loaded. Please upload a PDF first.</p>
        )}
      </div>

      {/* Right side analysis panel */}
      <div className="w-1/2 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Document Analysis</h1>
        {output ? (
          <div className='space-y-8'>
            {renderStatuteIdentification()}
            {renderIPCIdentification()}
            {renderSemanticSegmentation()}
            {renderJudgmentPrediction()}
          </div>
        ) : (
          <p className="mb-4">Loading analysis results...</p>
        )}
      </div>

      {/* Chat button and modal */}
      <>
        <Button
          className="fixed bottom-4 right-4 rounded-full w-12 h-12 p-0"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="w-6 h-6" />
          <span className="sr-only">Open chat</span>
        </Button>

        <ChatModal 
          isOpen={isOpen} 
          summary={selectedText || location.state.summary}
          setIsOpen={setIsOpen} 
        />
      </>
    </div>
  );
}