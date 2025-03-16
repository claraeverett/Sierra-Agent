import React, { useState, useEffect, useRef } from 'react';
import apiService from '../services/api';
import { MessageProps } from './Message';

// Loading animation component
const LoadingAnimation = () => (
  <div className="flex justify-start">
    <div className="pr-[15%]">
      <div className="chat-bubble assistant">
        <div className="flex space-x-2 items-center">
          <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  </div>
);

// Send button component
const SendButton = ({ onClick, disabled }: { onClick: () => void, disabled: boolean }) => (
  <button 
    type="button" 
    onClick={onClick} 
    disabled={disabled}
    className="send-button"
    aria-label="Send message"
  >
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="w-5 h-5"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  </button>
);

// Chat component to handle the conversation
function Chat() {
  const [messages, setMessages] = useState<MessageProps[]>([
    {
      id: '1',
      text: 'Hello! I\'m Sierra, your hiking and outdoor adventure assistant. How can I help you today?',
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load sessionId from localStorage on component mount
  useEffect(() => {
    const storedSessionId = localStorage.getItem('sierraSessionId');
    if (storedSessionId) {
      setSessionId(storedSessionId);
    }
    
    // Scroll to bottom when component mounts
    scrollToBottom();
  }, []);

  // Auto-scroll to bottom when messages change or loading state changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    // Use setTimeout to ensure the scroll happens after any pending renders
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Function to focus the input field
  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  // Add a new handler for input focus
  const handleInputFocus = () => {
    // Scroll to the bottom when input is focused
    scrollToBottom();
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const message = input.trim();
    setInput('');
    setIsTyping(false);

    const userMessage: MessageProps = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setIsLoading(true);

    try {
      // Call the API service with sessionId if available
      const response = await apiService.sendMessage({
        message,
        sessionId: sessionId
      });

      // Store the sessionId if it's returned from the server
      const responseSessionId = response.sessionId;
      if (responseSessionId) {
        setSessionId(responseSessionId);
        localStorage.setItem('sierraSessionId', responseSessionId);
      }

      const assistantMessage: MessageProps = {
        id: (Date.now() + 1).toString(),
        text: response.response || response.message || '', // Support both formats
        sender: 'assistant',
        timestamp: new Date(),
        intent: response.intent,
        parameters: response.parameters,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting response:', error);
      
      // Add error message
      const errorMessage: MessageProps = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error while processing your request. Please try again later.',
        sender: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[800px] min-h-0 chat-container" onClick={focusInput}>
      <div className="flex-1 overflow-y-auto p-6 space-y-6 chat-messages-container min-h-0">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div 
              className={`${
                message.sender === 'user' ? 'pl-[15%]' : 'pr-[15%]'
              }`}
            >
              <div
                className={`chat-bubble ${
                  message.sender === 'user' ? 'user' : 'assistant'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.text}</p>
              </div>
            </div>
          </div>
        ))}
        {isLoading && <LoadingAnimation />}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-5 flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-center relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder="Type Your Message..."
            className={`chat-input pr-12 ${isTyping ? 'typing' : ''}`}
            disabled={isLoading}
          />
          <div className="absolute right-3">
            <SendButton 
              onClick={handleSendMessage} 
              disabled={isLoading || !input.trim()} 
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Chat; 