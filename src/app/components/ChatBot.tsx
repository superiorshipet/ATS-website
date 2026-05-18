import { useState } from 'react';

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "مرحباً! 👋 أنا مساعد ATS الذكي. كيف يمكنني مساعدتك اليوم؟", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    // إضافة رسالة المستخدم
    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, sender: "user" }]);
    setInput("");
    setIsTyping(true);
    
    // معالجة الرسالة
    setTimeout(() => {
      let reply = "";
      const msg = userMessage.toLowerCase();
      
      // التحقق من الكلمات المفتاحية
      if (msg.includes('اسمك') || msg.includes('من انت') || msg.includes('你是谁')) {
        reply = "أنا مساعد ATS الذكي! 🤖 تم تطويري لمساعدتك في استخدام منصة التوظيف. اسألني أي شيء!";
      }
      else if (msg.includes('وظائف') || msg.includes('وظيفة') || msg.includes('job') || msg.includes('عمل')) {
        reply = "📋 **الوظائف المتاحة:**\n\nيمكنك البحث عن الوظائف من خلال:\n1. الذهاب إلى 'الوظائف المتاحة' في القائمة\n2. استخدام شريط البحث للتصفية\n3. الضغط على 'قدم الآن' للتقديم\n\nهل تبحث عن وظيفة معينة؟";
      }
      else if (msg.includes('سيرة') || msg.includes('cv') || msg.includes('resume') || msg.includes('السيرة')) {
        reply = "📄 **بناء السيرة الذاتية:**\n\nلإنشاء سيرتك الذاتية:\n1. اذهب إلى 'بناء السيرة الذاتية'\n2. أضف معلوماتك الشخصية\n3. أضف خبراتك العملية\n4. أضف مهاراتك\n5. اضغط 'حفظ'\n\nيمكنك أيضاً رفع ملف PDF جاهز!";
      }
      else if (msg.includes('تسجيل') || msg.includes('دخول') || msg.includes('login')) {
        reply = "🔐 **تسجيل الدخول:**\n\nللتسجيل كخريج أو جهة توظيف:\n1. اذهب إلى صفحة التسجيل\n2. اختر نوع الحساب\n3. املأ البيانات\n4. اضغط 'إنشاء حساب'\n\nللدخول: استخدم بريدك الإلكتروني وكلمة المرور.";
      }
      else if (msg.includes('شركات') || msg.includes('شركة') || msg.includes('employer') || msg.includes('جهة')) {
        reply = "🏢 **جهات التوظيف:**\n\nكجهة توظيف يمكنك:\n1. نشر وظائف جديدة\n2. إدارة الوظائف المنشورة\n3. مراجعة المتقدمين\n4. قبول أو رفض الطلبات\n\nهل تريد نشر وظيفة جديدة؟";
      }
      else if (msg.includes('خريج') || msg.includes('graduate') || msg.includes('طالب')) {
        reply = "🎓 **الخريجين:**\n\nكخريج يمكنك:\n1. بناء سيرتك الذاتية\n2. البحث عن وظائف مناسبة\n3. التقديم على الوظائف\n4. متابعة حالة طلباتك\n\nهل تبحث عن وظيفة معينة؟";
      }
      else if (msg.includes('مشكلة') || msg.includes('خطأ') || msg.includes('error') || msg.includes('bug')) {
        reply = "⚠️ **الدعم الفني:**\n\nإذا واجهتك أي مشكلة، يرجى:\n1. التأكد من اتصال الإنترنت\n2. تحديث الصفحة (F5)\n3. مسح الكاش (Ctrl+Shift+Delete)\n4. أو التواصل معنا على: support@ats-website.com";
      }
      else if (msg.includes('شكر') || msg.includes('thank') || msg.includes('thanks')) {
        reply = "🙏 **على الرحب والسعة!**\n\nسعيد بمساعدتك! هل هناك شيء آخر تحتاج إليه؟";
      }
      else if (msg.includes('مساعدة') || msg.includes('help') || msg.includes('المساعدة')) {
        reply = "💡 **المساعدة السريعة:**\n\n• 'وظائف' - للبحث عن وظائف\n• 'سيرة ذاتية' - لبناء السيرة الذاتية\n• 'تسجيل' - للتسجيل والدخول\n• 'شركات' - لمعلومات جهات التوظيف\n• 'خريج' - لمعلومات الخريجين\n• 'مشكلة' - للإبلاغ عن مشكلة\n• 'شكراً' - للتواصل الإيجابي\n\nاسألني أي شيء!";
      }
      else {
        reply = "💡 **كيف يمكنني مساعدتك؟**\n\nجرب كتابة أحد هذه الكلمات:\n• 'وظائف' - للبحث عن وظائف\n• 'سيرة ذاتية' - لبناء السيرة الذاتية\n• 'تسجيل' - للتسجيل والدخول\n• 'شركات' - لمعلومات جهات التوظيف\n• 'مساعدة' - لعرض كل الأوامر\n\nأو اكتب سؤالك بشكل طبيعي وسأحاول مساعدتك!";
      }
      
      setMessages(prev => [...prev, { text: reply, sender: "bot" }]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-all z-50 group"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
          </div>
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 left-6 w-[450px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h3 className="font-bold">مساعد ATS الذكي</h3>
                <p className="text-xs text-blue-100">متصل فورا | ردود فورية</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-lg transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slideIn`}>
                <div className={`max-w-[85%] p-3 rounded-xl ${
                  msg.sender === 'user' 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 rounded-bl-none shadow-sm border'
                }`}>
                  <p className="text-sm whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 p-3 rounded-xl rounded-bl-none shadow-sm border">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="اكتب سؤالك هنا..."
                className="flex-1 p-3 border rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-right"
                dir="rtl"
              />
              <button
                onClick={sendMessage}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl hover:scale-105 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">
              💡 جرب كتابة: مرحباً | وظائف | سيرة ذاتية | تسجيل | شركات | خريج | مساعدة
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideIn { animation: slideIn 0.2s ease-out; }
        .animate-bounce { animation: bounce 0.6s infinite; }
      `}</style>
    </>
  );
};
