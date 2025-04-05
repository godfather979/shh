import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from "lucide-react"
import { generateDescription } from '@/lib/chatb'

export default function ChatModal({ isOpen, setIsOpen, summary }) {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", sender: 'bot' },
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false) 

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return

    setMessages([...messages, { text: inputMessage, sender: 'user' }])
    const userMessage = inputMessage 
    setInputMessage('') 

    setLoading(true)

    try {
      const documentSummary = summary;

      const aiResponse = await generateDescription(userMessage, documentSummary)

      setMessages(prevMessages => [
        ...prevMessages,
        { text: aiResponse, sender: 'bot' }
      ])
    } catch (error) {
      setMessages(prevMessages => [
        ...prevMessages,
        { text: 'Sorry, there was an error processing your request.', sender: 'bot' }
      ])
    } finally {
      // Set loading to false after response is processed
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] max-h-[700px]">
        <DialogHeader>
          <DialogTitle>Chat with your Legal Assistant</DialogTitle>
          {/* <DialogDescription>
            Ask any question and get instant help!
          </DialogDescription> */}
        </DialogHeader>
        <ScrollArea className="h-[400px] p-2 border rounded-md">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
            >
              <span
                className={`inline-block p-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {message.text}
              </span>
            </div>
          ))}
        </ScrollArea>
        <div className="flex items-center mt-1">
          <Input
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage()
              }
            }}
            className="flex-grow mr-2"
            disabled={loading} // Disable input if loading
          />
          <Button onClick={handleSendMessage} disabled={loading}>
            <Send className="w-4 h-4 mr-2" />
            {loading ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}