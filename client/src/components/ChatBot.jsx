import React, { useEffect, useRef, useState } from 'react';
import { FaPaperPlane, FaCommentDots, FaTimes } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// 🧠 Add your Gemini API Key
const API_KEY = 'AIzaSyCVxdVEaErStAzdSl3XL0WSok8pZ1DpYCQ';
const genAI = new GoogleGenerativeAI(API_KEY);

const Chatbot = ({ mockJson }) => {
    const [messages, setMessages] = useState([
        {
            sender: 'bot',
            text: 'Hello! I’m your Legal Assistant. Ask me anything.',
            typing: false,
        },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({
        x: window.innerWidth - 380,
        y: window.innerHeight - 580,
    });

    const chatRef = useRef(null);
    const dragging = useRef(false);
    const offset = useRef({ x: 0, y: 0 });

    // 🌀 Scroll to latest message
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    // 🔁 Reset on new JSON context
    useEffect(() => {
        setMessages([
            {
                sender: 'bot',
                text: 'New document detected! I’m here to assist based on the latest context.',
                typing: false,
            },
        ]);
    }, [mockJson]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: 'user', text: input, typing: false };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        setTimeout(() => {
            setMessages(prev => [
                ...prev,
                { sender: 'bot', text: 'Typing...', typing: true },
            ]);
        }, 500);

        try {
            const model = genAI.getGenerativeModel({
                model: 'gemini-2.0-flash',
            });

            // 🧠 General + Contextual Prompt
            const generalContext = `You are a legal AI assistant. Respond in clear, helpful manner, read the question and respond accordingly donot always provide entire information for simple questions. Use Markdown formatting for steps or emphasis.`;

            let documentContext = '';

            if (mockJson && Object.keys(mockJson).length > 0) {
                documentContext = `Document Context: ${JSON.stringify(mockJson, null, 2)}`;
            }

            const fullContext = [generalContext, documentContext || '', input];

            // Handle doc-related questions when no context
            if (!mockJson || Object.keys(mockJson).length === 0) {
                const docKeywords = ['document', 'summary', 'report', 'clause'];
                const isDocQuery = docKeywords.some(kw =>
                    input.toLowerCase().includes(kw)
                );

                if (isDocQuery) {
                    setMessages(prev =>
                        prev.map((msg, i) =>
                            i === prev.length - 1
                                ? {
                                      ...msg,
                                      text: '⚠️ No document has been uploaded. Please upload a document to get context-specific answers.',
                                      typing: false,
                                  }
                                : msg
                        )
                    );
                    setLoading(false);
                    return;
                }
            }

            const result = await model.generateContent(fullContext);
            const response = await result.response.text();

            setMessages(prev =>
                prev.map((msg, i) =>
                    i === prev.length - 1
                        ? { ...msg, text: response, typing: false }
                        : msg
                )
            );
        } catch (err) {
            console.error('AI Error:', err);
            setMessages(prev =>
                prev.map((msg, i) =>
                    i === prev.length - 1
                        ? {
                              ...msg,
                              text: '⚠️ Something went wrong. Please try again.',
                              typing: false,
                          }
                        : msg
                )
            );
        }

        setLoading(false);
    };

    // 🖱️ Drag handlers
    const startDrag = e => {
        dragging.current = true;
        offset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        };
    };

    const onDrag = e => {
        if (!dragging.current) return;
        setPosition({
            x: e.clientX - offset.current.x,
            y: e.clientY - offset.current.y,
        });
    };

    const stopDrag = () => {
        dragging.current = false;
    };

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <div
                    onClick={() => setIsOpen(true)}
                    className='fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-xl cursor-pointer z-50'
                    title='Open Chat'
                >
                    <FaCommentDots size={20} />
                </div>
            )}

            {/* Chat Modal */}
            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        left: position.x,
                        top: position.y,
                        zIndex: 9999,
                        width: '350px',
                        maxWidth: '90%',
                    }}
                    onMouseMove={onDrag}
                    onMouseUp={stopDrag}
                >
                    <div className='bg-white rounded-xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col h-[500px]'>
                        {/* Header */}
                        <div
                            onMouseDown={startDrag}
                            className='bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 cursor-move flex justify-between items-center'
                        >
                            <span className='font-semibold'>
                                🧑‍⚖️ Legal Assistant
                            </span>
                            <FaTimes
                                onClick={() => setIsOpen(false)}
                                className='cursor-pointer hover:text-slate-200'
                            />
                        </div>

                        {/* Messages */}
                        <div
                            ref={chatRef}
                            className='flex-1 overflow-y-auto px-3 py-2 bg-slate-50 space-y-3'
                        >
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${
                                        msg.sender === 'user'
                                            ? 'justify-end'
                                            : 'justify-start'
                                    }`}
                                >
                                    <div
                                        className={`max-w-[75%] rounded-lg px-4 py-2 text-sm ${
                                            msg.sender === 'user'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-200 text-gray-800'
                                        }`}
                                    >
                                        {msg.typing ? (
                                            <Skeleton count={1} width={100} />
                                        ) : msg.sender === 'bot' ? (
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                            >
                                                {msg.text}
                                            </ReactMarkdown>
                                        ) : (
                                            msg.text
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input */}
                        <div className='flex border-t p-2'>
                            <input
                                type='text'
                                className='flex-1 px-3 py-1.5 border rounded-l-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                placeholder='Type a message...'
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyPress={e =>
                                    e.key === 'Enter' && sendMessage()
                                }
                            />
                            <button
                                onClick={sendMessage}
                                disabled={loading}
                                className='bg-indigo-600 text-white px-4 rounded-r-md hover:bg-indigo-700 transition'
                            >
                                <FaPaperPlane />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;
