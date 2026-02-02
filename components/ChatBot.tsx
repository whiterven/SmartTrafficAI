import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Sparkles } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { ChatMessage } from '../types';
import { AnimatePresence, motion } from 'framer-motion';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hi! I\'m your AI assistant. Ask me anything about traffic or site optimization.', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Format history for API
    const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
    }));

    try {
      const responseText = await geminiService.sendMessage(history, userMsg.text);
      setMessages(prev => [...prev, { role: 'model', text: responseText, timestamp: Date.now() }]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-80 sm:w-96 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ height: '500px' }}
          >
            {/* Header */}
            <div className="bg-slate-900 p-4 border-b border-slate-700 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Sparkles size={16} className="text-brand-400" />
                <span className="font-semibold text-slate-100">SmartTraffic AI</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.role === 'user' 
                      ? 'bg-brand-600 text-white rounded-tr-sm' 
                      : 'bg-slate-700 text-slate-200 rounded-tl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center space-x-2">
                    <Loader2 size={14} className="animate-spin text-brand-400" />
                    <span className="text-xs text-slate-400">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-slate-900 border-t border-slate-700">
              <div className="flex items-center bg-slate-800 rounded-full px-4 py-2 border border-slate-700 focus-within:border-brand-500 transition-colors">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask Gemini..."
                  className="flex-1 bg-transparent border-none focus:outline-none text-sm text-white placeholder-slate-500"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="ml-2 text-brand-400 hover:text-brand-300 disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/40 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
};

export default ChatBot;
