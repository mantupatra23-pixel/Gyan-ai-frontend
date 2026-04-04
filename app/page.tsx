"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, Image as ImageIcon, Send, Sparkles, BookOpen, 
  Layout, History, Settings, Zap, Bot, Terminal, PenTool, Award, UserCheck
} from 'lucide-react';
import ReactMarkdown from 'react-markdown'; // For formatted explanations
import remarkMath from 'remark-math'; // For Math equations
import rehypeKatex from 'rehype-katex'; // For professional Math formatting
import 'katex/dist/katex.min.css'; // KaTeX CSS for Math formatting

// Interface for Messages
interface Message {
  id: number;
  role: 'ai' | 'user';
  text: string;
  type?: 'text' | 'equation' | 'diagram'; // To identify content type for special rendering
  timestamp: string;
}

export default function GyanAIFinal() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userKnowledgePoints, setUserKnowledgePoints] = useState(1250); // Student gamification points
  const [currentTopicMastery, setCurrentTopicMastery] = useState(65); // Percentage for mastery graph
  
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      role: 'ai', 
      text: 'Namaste Mantu! Main GyanAI hoon, aapka personal guru. Aaj hum Relativity ke complex equations solve karenge ya coding seekhenge?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    {
        id: 2,
        role: 'user',
        text: 'Explain Einstein\'s Mass-Energy Equivalence principle',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    {
        id: 3,
        role: 'ai',
        text: 'Mass-Energy Equivalence state karta hai ki mass aur energy ek hi cheez ke do different forms hain. Unke beech ka relation is simple equation se define hota hai: $E = mc^2$',
        type: 'equation',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { 
      id: Date.now(), 
      role: 'user', 
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // TODO: Connect with FastAPI Backend on AWS GPU
    // Add logic to increase knowledge points on a successful interaction
    
    setTimeout(() => {
        // Sample AI response with formatting
      const aiMsg: Message = {
        id: Date.now() + 1,
        role: 'ai',
        text: `Maine aapke doubt *${userMsg.text}* ko read kar liya hai. Abhi main iske liye ek professional diagram draw karunga whiteboard par!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
      // Simulate mastery increase for student mode
      setCurrentTopicMastery(prev => Math.min(100, prev + 5)); 
      setUserKnowledgePoints(prev => prev + 50);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col lg:flex-row font-sans selection:bg-indigo-500/30 overflow-hidden">
      
      {/* --- SIDEBAR (Student & Teacher Features) --- */}
      <nav className="hidden lg:flex w-72 flex-col bg-[#0b0f1a] border-r border-slate-800/40 p-6 z-20">
        <motion.div 
          initial={{ x: -20, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-white">GyanAI</h1>
        </motion.div>
        
        <div className="space-y-1 flex-1">
          <SidebarItem icon={<Layout size={18}/>} label="Dashboard" active />
          <SidebarItem icon={<BookOpen size={18}/>} label="My Courses (Student)" />
          <SidebarItem icon={<Terminal size={18}/>} label="Code Lab" />
          <SidebarItem icon={<History size={18}/>} label="Doubt History (Smart Cards)" />
          <SidebarItem icon={<UserCheck size={18}/>} label="Live Classes (Teacher Mode)" />
          <SidebarItem icon={<Award size={18}/>} label="Certifications" />
          <SidebarItem icon={<Settings size={18}/>} label="Settings" />
        </div>

        {/* --- Student Gamification: Knowledge Mastery Graph --- */}
        <div className="mt-6 p-4 bg-slate-900/40 rounded-[2rem] border border-slate-800/60 backdrop-blur-md">
            <div className="flex justify-between items-center mb-3">
                <p className="text-xs font-black uppercase text-indigo-400 tracking-widest">Mastery Graph</p>
                <p className="text-[10px] text-slate-500 font-medium">Topic: Relativity</p>
            </div>
            <div className="relative h-16 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${currentTopicMastery}%` }}
                    transition={{ duration: 1 }}
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-teal-600 to-indigo-600 rounded-r-xl shadow-[0_0_20px_rgba(79,70,229,0.2)]"
                ></motion.div>
                <div className="absolute inset-0 flex items-center justify-center font-bold text-lg text-white">
                    {currentTopicMastery}%
                </div>
            </div>
        </div>

        {/* --- Student Profile --- */}
        <div className="mt-4 p-4 bg-slate-900/40 rounded-[2rem] border border-slate-800/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-teal-500 flex items-center justify-center font-bold text-white ring-2 ring-indigo-500/20">M</div>
            <div>
              <p className="text-sm font-bold text-white">Mantu Patra</p>
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">{userKnowledgePoints} KP (Knowledge Points)</p>
            </div>
          </div>
        </div>
      </nav>

      {/* --- MAIN WORKSPACE --- */}
      <main className="flex-1 flex flex-col p-2 md:p-6 gap-6 relative">
        
        <div className="flex flex-col xl:flex-row gap-6 h-full max-h-[92vh]">
          
          {/* LEFT: TEACHER VISUALIZER & BOARD */}
          <div className="flex-[2.5] flex flex-col gap-6 overflow-hidden">
            
            {/* Advanced Teacher Visualizer: Neural Avatar */}
            <motion.div 
              layout
              className="relative aspect-video lg:h-[380px] bg-[#0b0f1a] rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden group"
            >
              {/* Reference image inspired glowing hub effect */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/30 via-transparent to-transparent opacity-80 blur-xl"></div>
              
              <div className="absolute top-6 left-6 flex items-center gap-3 z-10">
                <div className="bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black tracking-widest text-red-500 uppercase">Live AI Guru</span>
                </div>
              </div>
              
              {/* Teacher Visualizer: Neural Network Pulse */}
              <div className="h-full w-full flex flex-col items-center justify-center relative">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.6, 0.9, 0.6]
                  }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="w-56 h-56 bg-gradient-to-tr from-purple-700 to-pink-500 rounded-full blur-[110px] absolute"
                ></motion.div>
                {/* AI Humanoid Face placeholder: Represents advanced teacher model */}
                <Sparkles size={70} className={`text-indigo-200 transition-all duration-500 ${isTyping ? 'scale-110 blur-[1px]' : 'scale-100 opacity-60'}`} />
                <p className="mt-4 text-slate-300 font-mono text-[10px] tracking-[0.3em] uppercase z-10">
                  {isTyping ? 'Teacher is Processing...' : 'Ready for Doubt Session'}
                </p>
              </div>
            </motion.div>

            {/* Smart Whiteboard with Stroke Animation */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 bg-slate-950/50 rounded-[2.5rem] border border-slate-800/40 p-8 relative shadow-inner flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Interactive Board</span>
                <PenTool size={14} className="text-slate-800" />
              </div>
              {/* Whiteboard content area: Future RAG output for diagrams */}
              <div className="flex-1 border border-dashed border-slate-800/60 rounded-[1.5rem] flex items-center justify-center bg-slate-900/10 p-6 relative">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                 {/* Placeholder for SVG diagram: inspired by advanced teacher visuals */}
                 <div className="text-center">
                    <motion.div
                        animate={{ strokeDashoffset: [0, 100, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-40 h-20 border-l-4 border-b-4 border-pink-500 rounded-bl-3xl opacity-30 shadow-[0_0_15px_rgba(236,72,153,0.3)]"
                    ></motion.div>
                    <p className="text-pink-300 italic font-medium text-sm mt-3 opacity-80">AI is generating a diagram of curved space-time...</p>
                 </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: CHAT INTERFACE WITH MATH/MARKDOWN */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 min-w-[320px] bg-[#0b0f1a] rounded-[2.5rem] border border-slate-800/50 flex flex-col shadow-2xl overflow-hidden border-t-4 border-t-purple-600/50"
          >
            <div className="p-6 border-b border-slate-800/50 flex items-center justify-between bg-slate-900/10">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/20">
                    <Zap size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">GyanAI Guru</h3>
                    <p className="text-[9px] text-purple-400 font-black uppercase tracking-widest">Physics Expert Mode</p>
                  </div>
               </div>
            </div>

            {/* Scrollable Chat Area with professional formatting */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth scrollbar-thin scrollbar-thumb-slate-800"
            >
              <AnimatePresence mode="popLayout">
                {messages.map((m) => (
                  <motion.div 
                    key={m.id}
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className={`flex flex-col ${m.role === 'ai' ? 'items-start' : 'items-end'}`}
                  >
                    <div className={`max-w-[85%] p-4 rounded-[1.5rem] text-sm leading-relaxed ${
                      m.role === 'ai' 
                      ? 'bg-slate-900 text-slate-200 rounded-tl-none border border-slate-800 shadow-xl' 
                      : 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-600/10 font-medium'
                    }`}>
                        {/* Rendering AI response with LaTeX support for Math */}
                        {m.role === 'ai' && m.type === 'equation' ? (
                            <ReactMarkdown 
                                remarkPlugins={[remarkMath]}
                                rehypePlugins={[rehypeKatex]}
                                className="markdown-content"
                            >
                                {m.text}
                            </ReactMarkdown>
                        ) : (
                            m.text
                        )}
                    </div>
                    <span className="text-[8px] text-slate-600 mt-2 font-bold px-2">{m.timestamp}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-1.5 p-3 bg-slate-900/50 rounded-2xl border border-slate-800">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
            </div>

            {/* STUDENT ACTION BAR (Gamified) */}
            <div className="p-4 md:p-6 bg-[#0b0f1a] border-t border-slate-800/30 relative">
              
              {/* Reference image inspired teal glowing accent for Student actions */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-600/20 px-4 py-1 rounded-full border border-teal-500/30 text-[9px] font-black uppercase text-teal-400 tracking-widest">Student Mode</div>
              
              <div className="relative flex items-center gap-2 bg-slate-900/80 backdrop-blur-xl border border-teal-900/40 p-2 rounded-[2rem] focus-within:ring-2 focus-within:ring-teal-500/20 transition-all">
                <button className="p-3 text-slate-500 hover:text-teal-400 hover:bg-slate-800 rounded-full transition-all">
                  <ImageIcon size={18} />
                </button>
                <button className="p-3 text-slate-500 hover:text-teal-400 hover:bg-slate-800 rounded-full transition-all">
                  <Mic size={18} />
                </button>
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask a tough question (like E=mc^2)..." 
                  className="flex-1 bg-transparent border-none py-3 px-2 text-sm focus:outline-none text-white placeholder:text-slate-600"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="p-3 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:bg-slate-800 text-white rounded-2xl transition-all shadow-lg shadow-teal-600/20 active:scale-95"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

// Sidebar Helper Component
function SidebarItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <motion.div 
      whileHover={{ x: 5 }}
      className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${
        active 
        ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/10 shadow-[inset_0_0_20px_rgba(79,70,229,0.05)]' 
        : 'text-slate-500 hover:bg-slate-800/30 hover:text-slate-300'
      }`}
    >
      <div className={`${active ? 'text-indigo-500' : 'text-slate-600'}`}>{icon}</div>
      <span className="text-sm font-bold tracking-tight">{label}</span>
    </motion.div>
  );
}
