import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Sparkles, User, Bot } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { ChatMessage } from '../types';
import { AnimatePresence, motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

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
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting right now. Please try again.", timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-3 w-[calc(100vw-32px)] sm:w-96 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ height: '500px' }}
          >
            {/* Header */}
            <div className="bg-slate-900 p-3 md:p-4 border-b border-slate-700 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-brand-500/20 flex items-center justify-center">
                   <Sparkles size={14} className="text-brand-400 md:w-4 md:h-4" />
                </div>
                <div>
                    <h3 className="font-semibold text-slate-100 text-xs md:text-sm">SmartTraffic AI</h3>
                    <div className="flex items-center space-x-1">
                        <span className="w-1 md:w-1.5 h-1 md:h-1.5 bg-green-500 rounded-full animate-pulse"/>
                        <span className="text-[10px] text-slate-400">Online</span>
                    </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4 bg-slate-900/50">
              {messages.map((msg, idx) => (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={idx} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-end max-w-[90%] md:max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center mb-1 ${
                        msg.role === 'user' ? 'bg-brand-600 ml-2' : 'bg-slate-700 mr-2'
                    }`}>
                        {msg.role === 'user' ? <User size={10} className="text-white md:w-3 md:h-3"/> : <Bot size={12} className="text-brand-400 md:w-3.5 md:h-3.5"/>}
                    </div>

                    {/* Bubble */}
                    <div className={`rounded-2xl px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm shadow-sm ${
                        msg.role === 'user' 
                        ? 'bg-brand-600 text-white rounded-tr-sm' 
                        : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-sm'
                    }`}>
                        <ReactMarkdown
                            components={{
                                p: ({node, ...props}) => <p {...props} className="mb-2 last:mb-0 leading-relaxed" />,
                                a: ({node, ...props}) => <a {...props} className={`underline hover:opacity-80 ${msg.role === 'user' ? 'text-white' : 'text-brand-400'}`} target="_blank" rel="noopener noreferrer" />,
                                ul: ({node, ...props}) => <ul {...props} className="list-disc pl-4 mb-2 space-y-1" />,
                                ol: ({node, ...props}) => <ol {...props} className="list-decimal pl-4 mb-2 space-y-1" />,
                                li: ({node, ...props}) => <li {...props} />,
                                strong: ({node, ...props}) => <strong {...props} className="font-bold" />,
                                blockquote: ({node, ...props}) => <blockquote {...props} className="border-l-2 border-slate-500 pl-3 italic my-2 opacity-80" />,
                                code: ({node, inline, className, children, ...props}: any) => {
                                    return inline ? (
                                        <code className="bg-black/20 rounded px-1 py-0.5 text-[10px] font-mono" {...props}>{children}</code>
                                    ) : (
                                        <div className="bg-black/30 rounded-lg p-2 my-2 overflow-x-auto border border-white/10">
                                            <code className="text-[10px] font-mono block" {...props}>{children}</code>
                                        </div>
                                    )
                                }
                            }}
                        >
                            {msg.text}
                        </ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-end max-w-[80%]">
                     <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 mr-2 flex items-center justify-center mb-1">
                        <Bot size={14} className="text-brand-400"/>
                     </div>
                     <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3">
                        <div className="flex space-x-1">
                            <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                        </div>
                     </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 md:p-4 bg-slate-900 border-t border-slate-700">
              <div className="flex items-center bg-slate-800 rounded-full px-3 py-1.5 md:px-4 md:py-2 border border-slate-700 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500/50 transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask for traffic advice..."
                  className="flex-1 bg-transparent border-none focus:outline-none text-xs md:text-sm text-white placeholder-slate-500 py-1"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="ml-2 text-brand-400 hover:text-brand-300 disabled:opacity-50 p-1.5 hover:bg-slate-700 rounded-full transition-colors"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin md:w-[18px]" /> : <Send size={16} className="md:w-[18px]" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-lg shadow-brand-500/40 flex items-center justify-center transition-all hover:scale-105 active:scale-95 group relative"
      >
        <span className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-0 group-hover:opacity-100 duration-1000" />
        {isOpen ? <X size={20} className="md:w-[24px] md:h-[24px]" /> : <MessageSquare size={20} className="fill-current md:w-[24px] md:h-[24px]" />}
      </button>
    </div>
  );
};

export default ChatBot;