"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Stars } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, Image as ImageIcon, Send, Zap, BrainCircuit, LayoutDashboard, 
  Globe, Terminal, PenTool, Volume2, Trash2, X, Activity, BookOpen, GraduationCap
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

// --- 🌌 DYNAMIC NEURAL BACKGROUND ---
function KnowledgeStars() {
  const ref = useRef<any>(null);
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 40;
      ref.current.rotation.y -= delta / 50;
    }
  });
  return (
    <group>
      <Stars radius={100} depth={50} count={1500} factor={4} saturation={0} fade speed={1} />
      <mesh ref={ref}>
        <sphereGeometry args={[1.1, 32, 32]} />
        <MeshDistortMaterial color="#1e1b4b" speed={1} distort={0.4} radius={1} />
      </mesh>
    </group>
  );
}

export default function GyanAIV10() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [subjectMode, setSubjectMode] = useState("General"); // Math, Physics, General
  const [progress, setProgress] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedChat = localStorage.getItem('gyanai_v10_mantu');
    if (savedChat) {
      const parsed = JSON.parse(savedChat);
      setMessages(parsed);
      setProgress(Math.min(parsed.length * 5, 100));
    } else {
      setMessages([{ id: 1, role: 'ai', text: 'Namaste Mantu! v10.0 Brain Trust active. Aaj hum kis subject par focus karein?' }]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('gyanai_v10_mantu', JSON.stringify(messages));
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    setProgress(Math.min(messages.length * 5, 100));
  }, [messages, isTyping]);

  // --- 🧠 DYNAMIC THEME ENGINE ---
  const detectSubject = (text: string) => {
    const t = text.toLowerCase();
    if (t.includes('math') || t.includes('solve') || t.includes('calculate')) return 'Math';
    if (t.includes('physics') || t.includes('force') || t.includes('speed') || t.includes('work')) return 'Physics';
    return 'General';
  };

  const getThemeColor = () => {
    if (subjectMode === 'Math') return '#f59e0b'; // Gold
    if (subjectMode === 'Physics') return '#06b6d4'; // Cyan
    return '#6366f1'; // Indigo
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() && !selectedImage) return;

    setSubjectMode(detectSubject(textToSend));
    const userMsg = { id: Date.now(), role: 'user', text: textToSend, image: selectedImage };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setSelectedImage(null);
    setIsTyping(true);

    try {
      const response = await fetch('https://good-items-itch.loca.lt/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Bypass-Tunnel-Reminder': 'true' },
        body: JSON.stringify({ text: textToSend, image: userMsg.image }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: data.response }]);
      speak(data.response);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: "Mantu, connection error! AWS check karein." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 flex flex-col lg:flex-row overflow-hidden font-sans">
      
      {/* --- 📟 SMART SIDEBAR --- */}
      <nav className="hidden lg:flex w-72 flex-col bg-slate-950/50 backdrop-blur-3xl border-r border-white/5 p-6 z-20">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/20">
            <BrainCircuit className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white italic leading-none">GyanAI</h1>
            <p className="text-[8px] text-indigo-400 font-bold uppercase tracking-widest mt-1">Brain Trust v10</p>
          </div>
        </div>
        
        <div className="space-y-1 flex-1">
          <SidebarItem icon={<LayoutDashboard size={18}/>} label="Neural Hub" active />
          <SidebarItem icon={<BookOpen size={18}/>} label="Lessons" />
          
          <div className="mt-8 p-4 bg-slate-900/40 rounded-[2rem] border border-white/5">
             <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] font-black uppercase text-slate-500 tracking-tighter">Learning Progress</span>
                <span className="text-[9px] font-bold text-indigo-400">{progress}%</span>
             </div>
             <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div animate={{ width: `${progress}%` }} className="h-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" />
             </div>
             <p className="text-[8px] text-slate-600 mt-3 italic">Keep going Mantu! You're doing great.</p>
          </div>
        </div>

        <button onClick={() => { localStorage.removeItem('gyanai_v10_mantu'); window.location.reload(); }} className="flex items-center gap-3 p-4 text-slate-500 hover:text-red-500 transition-all rounded-2xl">
          <Trash2 size={16} /> <span className="text-[9px] font-black uppercase">Reset Brain</span>
        </button>
      </nav>

      {/* --- 🖥️ CORE INTERFACE --- */}
      <main className="flex-1 flex flex-col p-4 md:p-6 gap-6 relative">
        <div className="flex flex-col xl:flex-row gap-6 h-full max-h-[92vh]">
          
          <div className="flex-[2.5] flex flex-col gap-6 overflow-hidden">
            {/* DYNAMIC VISUALIZER */}
            <div className="relative aspect-video lg:h-[380px] bg-black rounded-[4rem] border border-white/5 overflow-hidden shadow-2xl">
              <Canvas camera={{ position: [0, 0, 5] }}>
                 <ambientLight intensity={0.4} />
                 <Float speed={4}>
                    <Sphere args={[1.2, 64, 64]}>
                       <MeshDistortMaterial 
                          color={isSpeaking ? "#ec4899" : getThemeColor()} 
                          speed={isSpeaking ? 8 : 2} 
                          distort={isSpeaking ? 0.6 : 0.3} 
                          emissive={getThemeColor()}
                          emissiveIntensity={0.4}
                       />
                    </Sphere>
                 </Float>
              </Canvas>
              <div className="absolute top-8 left-8 flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] italic">Link: Mantu-Stable</span>
              </div>
              <div className="absolute bottom-8 right-8">
                 <span className="text-[10px] font-black text-indigo-400 bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/20">
                    MODE: {subjectMode.toUpperCase()}
                 </span>
              </div>
            </div>

            {/* STATUS CARDS */}
            <div className="flex gap-4 flex-1">
               <div className="flex-1 bg-slate-950/30 rounded-[3rem] border border-white/5 p-6 flex flex-col justify-center items-center">
                  <GraduationCap className="text-slate-800 mb-2" size={20} />
                  <p className="text-[8px] font-black text-slate-700 uppercase">Tutor Active</p>
               </div>
               <div className="flex-1 bg-indigo-600/5 rounded-[3rem] border border-indigo-500/10 p-6 flex flex-col justify-center items-center">
                  <Activity className={`mb-2 ${isTyping ? 'text-indigo-400 animate-spin' : 'text-slate-800'}`} size={20} />
                  <p className="text-[8px] font-black text-indigo-900 uppercase">Neural Load</p>
               </div>
            </div>
          </div>

          {/* CHAT INTERFACE */}
          <div className="flex-1 min-w-[380px] bg-slate-950/60 rounded-[4.5rem] border border-white/5 flex flex-col shadow-2xl overflow-hidden backdrop-blur-3xl relative">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <Zap size={16} className="text-indigo-500" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Command Hub</span>
               </div>
               <div className="flex gap-1">
                  {[1,2,3].map(i => <div key={i} className="w-1 h-1 bg-slate-800 rounded-full" />)}
               </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
              {messages.map((m) => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col ${m.role === 'ai' ? 'items-start' : 'items-end'}`}>
                  {m.image && <img src={m.image} alt="doc" className="max-w-[220px] rounded-[2.5rem] mb-4 border border-white/10 shadow-2xl hover:scale-105 transition-all" />}
                  <div className={`max-w-[92%] p-6 rounded-[2.8rem] text-[13px] leading-relaxed tracking-tight ${m.role === 'ai' ? 'bg-slate-900/90 text-slate-100 border border-white/5 rounded-tl-none shadow-xl' : 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-600/20'}`}>
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{m.text}</ReactMarkdown>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 ml-4">
                   <div className="flex gap-1">
                      <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce" />
                      <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce delay-75" />
                      <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce delay-150" />
                   </div>
                   <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Brain Thinking...</span>
                </div>
              )}
            </div>

            {/* PREVIEW IMAGE */}
            <AnimatePresence>
              {selectedImage && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="px-8 pb-4">
                  <div className="relative inline-block">
                    <img src={selectedImage} className="w-24 h-24 object-cover rounded-[2rem] border-2 border-indigo-500 shadow-2xl" />
                    <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 shadow-xl hover:scale-110 transition-all"><X size={12}/></button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* INPUT FIELD */}
            <div className="p-8">
              <div className="flex items-center gap-2 bg-slate-900/80 border border-white/5 p-2 rounded-[3.5rem] focus-within:border-indigo-500/30 transition-all shadow-inner">
                <input type="file" ref={fileInputRef} onChange={(e) => {
                  const file = e.target.files?.[0];
                  if(file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setSelectedImage(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }} accept="image/*" className="hidden" />
                
                <button onClick={() => fileInputRef.current?.click()} className="p-4 text-slate-600 hover:text-indigo-400"><ImageIcon size={20}/></button>
                <input 
                   value={input} 
                   onChange={(e) => setInput(e.target.value)} 
                   onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
                   placeholder="Ask Mantu's Brain Trust..." 
                   className="flex-1 bg-transparent border-none py-3 px-2 text-sm text-white focus:outline-none placeholder:text-slate-800" 
                />
                <button onClick={() => handleSend()} className="p-5 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-500 active:scale-95 transition-all">
                   <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <div className="absolute inset-0 opacity-10 pointer-events-none -z-10"><Canvas><KnowledgeStars /></Canvas></div>
    </div>
  );
}

function SidebarItem({ icon, label, active = false }: any) {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border ${active ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/20 shadow-inner' : 'text-slate-600 hover:bg-slate-900/50 hover:text-slate-300 border-transparent'}`}>
      {icon} <span className="text-[10px] font-black uppercase tracking-widest leading-none">{label}</span>
    </div>
  );
}
