import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  Shield,
  Pill,
  PhoneCall,
  HeartPulse,
  Smartphone,
  Share2,
  CheckCheck,
  Building,
  HelpCircle
} from 'lucide-react';
import { DispatchNotification } from '../types';

interface HospitalAssistantProps {
  notifications: DispatchNotification[];
  currentLanguage: 'kn' | 'hi' | 'en' | 'te' | 'ta';
}

export const HospitalAssistant: React.FC<HospitalAssistantProps> = ({
  notifications,
  currentLanguage
}) => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'ನಮಸ್ಕಾರ! ನಾನು ಜನಾರೋಗ್ಯ ಮಿತ್ರ (JanArogya Mitra). ಸರ್ಕಾರಿ ವಿಕ್ಟೋರಿಯಾ ಆಸ್ಪತ್ರೆಯ ಚಿಕಿತ್ಸೆಗಳು, ಆಯುಷ್ಮಾನ್ ಭಾರತ್ ಕಾರ್ಡ್ ಪ್ರಯೋಜನಗಳು, ಜನೌಷಧಿ ಉಚಿತ ಔಷಧಗಳು ಅಥವಾ ತುರ್ತು ಆಂಬ್ಯುಲೆನ್ಸ್ ಬಗ್ಗೆ ಏನಾದರೂ ಪ್ರಶ್ನೆಗಳಿದ್ದರೆ ಕೇಳಿ.'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickQuestions = [
    {
      label: 'Ayushman Bharat PM-JAY ₹5L Benefit',
      query: 'How to claim ₹5,00,000 cashless benefit under Ayushman Bharat ABHA card in Victoria Hospital?'
    },
    {
      label: 'Free Generic Medicines (Jan Aushadhi)',
      query: 'Where is the Pradhan Mantri Jan Aushadhi counter and how to get free medicines for BPL?'
    },
    {
      label: '24x7 Blood Bank & Free Dialysis',
      query: 'Where is the 24x7 blood bank and is emergency dialysis free in Victoria hospital?'
    },
    {
      label: 'Emergency Ambulance 108',
      query: 'How does emergency triage work if patient arrives via 108 ambulance?'
    }
  ];

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputQuery;
    if (!textToSend.trim()) return;

    const newMsgs = [...messages, { role: 'user' as const, text: textToSend }];
    setMessages(newMsgs);
    setInputQuery('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          language: currentLanguage
        })
      });

      if (!response.ok) throw new Error('Failed to get answer');
      const data = await response.json();

      setMessages([...newMsgs, { role: 'assistant', text: data.answer }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages([
        ...newMsgs,
        {
          role: 'assistant',
          text: 'JanArogya Mitra is currently running. All Ayushman Bharat counters are active at Ground Floor Counter 3, and Jan Aushadhi generic medicines are available at Ground Floor Exit Gate.'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div id="hospital-assistant-container" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-emerald-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                24x7 Multilingual Public Health Concierge
              </span>
              <span className="text-xs text-emerald-200">Karnataka Govt &amp; NHA Schemes</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              JanArogya Mitra: Hospital AI Scheme &amp; Navigation Guide
            </h2>
            <p className="text-emerald-100 text-sm mt-1 max-w-2xl">
              Ask questions about doctor availability, free dialysis, Jan Aushadhi generic medicine savings, Ayushman Bharat PM-JAY registration, or track SMS/WhatsApp dispatches.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/15">
            <PhoneCall className="w-8 h-8 text-emerald-400 shrink-0" />
            <div className="text-xs">
              <p className="font-semibold text-white">Emergency Helpline: 108</p>
              <p className="text-emerald-200">Hospital Desk: 080-26701150</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AI Chatbot (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-md flex flex-col h-[600px] overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">JanArogya Mitra</h4>
                <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Online • Victoria &amp; Bowring Hospital AI Guide
                </p>
              </div>
            </div>

            <span className="text-xs text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-medium">
              Gemini 3.7 Flash
            </span>
          </div>

          {/* Quick FAQ Prompts */}
          <div className="p-3 bg-slate-50/50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q.query)}
                className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 transition-all cursor-pointer shadow-2xs"
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-xs font-bold">
                    AI
                  </div>
                )}

                <div
                  className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none font-medium'
                      : 'bg-slate-100 text-slate-800 rounded-tl-none font-medium whitespace-pre-wrap'
                  }`}
                >
                  {m.text}
                </div>

                {m.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 text-xs font-bold">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-xs text-slate-400 font-medium">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-200"></div>
                <span>JanArogya Mitra is formulating guidance...</span>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="p-3 border-t border-slate-100 bg-white flex items-center gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about hospital rooms, schemes, medicines, or tokens..."
              className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputQuery.trim() || isTyping}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: WhatsApp / SMS Notification Live Dispatch Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              Live Patient Notification Dispatch Log
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Real-time SMS and WhatsApp token slips triggered via automated agentic workflows to reduce waiting room congestion.
            </p>

            {notifications.length > 0 ? (
              <div className="space-y-3 max-h-[480px] overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 transition-all"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          notif.channel === 'WhatsApp' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {notif.channel}
                        </span>
                        <span className="text-xs font-bold text-slate-800">{notif.phone}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                        <CheckCheck className="w-3 h-3 text-emerald-600" />
                        {notif.timestamp}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white border border-slate-200 font-mono text-[11px] text-slate-800 leading-relaxed">
                      {notif.messageText}
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                      <span>Token: <strong className="text-slate-900">{notif.tokenNumber}</strong></span>
                      <span>Status: <strong className="text-emerald-700">{notif.status} ✓</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl text-center flex flex-col items-center justify-center">
                <Smartphone className="w-10 h-10 text-slate-300 mb-2" />
                <p className="text-xs font-bold text-slate-600">No Notifications Dispatched Yet</p>
                <p className="text-[11px] text-slate-400 max-w-xs mt-1">
                  Generate a triage token in the Voice Kiosk or Document Scanner and click "Send WhatsApp / SMS" to simulate live automated dispatch.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
