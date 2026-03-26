'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Bot, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface Message {
  role: 'user' | 'mom';
  content: string;
}

export default function AskMomChat() {
  const { t, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'mom', content: t('chat.welcome') }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.concat(userMsg).map(m => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.content
          }))
        })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, { role: 'mom', content: data.content }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'mom', content: t('chat.error') }]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  return (
    <div className={`fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'} z-50`}>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`bg-orange-800 text-white p-4 rounded-full shadow-2xl hover:bg-orange-900 transition-all duration-300 flex items-center gap-2 group border-4 border-amber-100 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="font-semibold px-1">{t('chat.title')}</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-orange-50 w-80 md:w-96 h-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border-2 border-orange-200 animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-orange-800 text-white p-4 flex justify-between items-center bg-[url('/bg-pattern.svg')] bg-opacity-10">
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-orange-100 overflow-hidden border-2 border-amber-200 flex items-center justify-center">
                 <span className="text-2xl">👵</span>
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">{t('chat.title')}</h3>
                <p className="text-xs text-orange-100">{t('chat.online')}</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-orange-700/50 p-1 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4 scroll-smooth" ref={scrollRef}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? (isRTL ? 'justify-start' : 'justify-end') : (isRTL ? 'justify-end' : 'justify-start')}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                  msg.role === 'user' 
                  ? `bg-orange-800 text-white ${isRTL ? 'rounded-tl-none' : 'rounded-tr-none'}` 
                  : `bg-white text-gray-800 border border-orange-100 ${isRTL ? 'rounded-tr-none text-right' : 'rounded-tl-none text-left'} prose prose-sm prose-orange`
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className={`flex ${isRTL ? 'justify-end' : 'justify-start'}`}>
                <div className={`bg-white text-gray-800 border border-orange-100 p-3 rounded-2xl ${isRTL ? 'rounded-tr-none' : 'rounded-tl-none'} flex gap-1 items-center`}>
                  <div className="w-1.5 h-1.5 bg-orange-300 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce delay-150"></div>
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce delay-225"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-orange-100">
            <div className="relative flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t('chat.placeholder')}
                className={`flex-grow p-3 ${isRTL ? 'pl-12 pr-4 text-right' : 'pr-12 pl-4 text-left'} rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-800 focus:border-transparent text-sm bg-orange-50/30`}
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className={`absolute ${isRTL ? 'left-2' : 'right-2'} top-2 p-1.5 bg-orange-800 text-white rounded-lg hover:bg-orange-900 transition-colors disabled:opacity-50`}
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className={`w-5 h-5 ${isRTL ? 'scale-x-[-1]' : ''}`} />}
              </button>
            </div>
            <p className="text-[10px] text-center text-gray-400 mt-2 italic">
              "{t('chat.quote')}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
