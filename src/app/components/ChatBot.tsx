import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { API_URL } from '../../lib/api';

interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: string;
}

const STORAGE_KEY = 'ats_chat_history';

const QUICK_REPLIES = [
  'كيف أبحث عن وظيفة؟',
  'كيف أنشر وظيفة؟',
  'ما حالة طلباتي؟',
  'كيف أبني سيرتي الذاتية؟',
];

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('user_type') || 'guest';
  const userId = localStorage.getItem('user_id');

  // Load chat history from backend on first open
  useEffect(() => {
    if (!isOpen || historyLoaded || !userId) return;

    const loadHistory = async () => {
      try {
        const response = await fetch(`${API_URL}/chatbot/history?user_id=${userId}`);
        const data = await response.json();
        if (data.success && data.data && data.data.length > 0) {
          // Convert backend history to frontend format
          const backendMessages: ChatMessage[] = [];
          data.data.forEach((item: any) => {
            backendMessages.push({
              id: `h-${item.id}-user`,
              role: 'user',
              content: item.message,
              timestamp: item.created_at,
            });
            backendMessages.push({
              id: `h-${item.id}-bot`,
              role: 'bot',
              content: item.response,
              timestamp: item.created_at,
            });
          });
          setMessages(backendMessages);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      } finally {
        setHistoryLoaded(true);
      }
    };

    loadHistory();
  }, [isOpen, historyLoaded, userId]);

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opening
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Prepare message history for Groq context
    const messageHistory = messages.slice(-8).map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    try {
      const response = await fetch(`${API_URL}/chatbot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText.trim(),
          user_type: userType,
          user_id: userId,
          messages: messageHistory,
        }),
      });

      const data = await response.json();

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: data.success
          ? data.response
          : 'عذراً، حدث خطأ. الرجاء المحاولة لاحقاً.',
        timestamp: data.timestamp || new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: 'عذراً، تعذر الاتصال بالخادم. تأكد من اتصالك بالإنترنت.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickReply = (text: string) => {
    sendMessage(text);
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Don't show chatbot on auth page or if not logged in
  if (!token) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50" dir="rtl">
      {/* Chat Panel */}
      {isOpen && (
        <div
          className="mb-3 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
          style={{
            animation: 'slideIn 0.3s ease-out',
          }}
        >
          {/* Header */}
          <div className="bg-blue-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">مساعد سيرتي الذكية</h3>
                <p className="text-blue-100 text-xs">مدعوم بالذكاء الاصطناعي</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="text-blue-100 hover:text-white text-xs px-2 py-1 rounded hover:bg-white/10 transition-colors"
                  title="مسح المحادثة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 max-h-[400px] min-h-[300px] overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bot className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-gray-600 text-sm mb-1">أهلاً بك! 👋</p>
                <p className="text-gray-500 text-xs">أنا سيرتي، مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟</p>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === 'user' ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-sm'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-tl-sm shadow-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 flex-row-reverse">
                <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-gray-600" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-3 py-2 shadow-sm">
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length === 0 && !loading && (
            <div className="px-4 pb-2 bg-gray-50">
              <div className="flex flex-wrap gap-2">
                {QUICK_REPLIES.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleQuickReply(reply)}
                    className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1.5 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="اكتب رسالتك هنا..."
                className="flex-1 px-3 py-2 text-sm bg-gray-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder:text-gray-400"
                disabled={loading}
              />
              <Button
                type="submit"
                size="icon"
                className="rounded-xl w-9 h-9 bg-blue-600 hover:bg-blue-700 flex-shrink-0"
                disabled={loading || !input.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105 ${
          isOpen
            ? 'bg-gray-800 hover:bg-gray-900'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
        aria-label={isOpen ? 'إغلاق المحادثة' : 'فتح المحادثة'}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  );
}

