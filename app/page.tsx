"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Stars, Grid, Points, PointMaterial } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Zap, BrainCircuit, LayoutDashboard, Trash2, X, Activity, 
  Beaker, Binary, Volume2, NotebookPen, Sparkles, Orbit, Cpu, ChevronRight
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import 'katex/dist/katex.min.css';

// --- 🌌 QUANTUM PARTICLE ENGINE ---
function QuantumParticles({ isThinking }: { isThinking: boolean }) {
  const points = useMemo(() => {
    const p = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      p[i * 3] = (Math.random() - 0.5) * 10;
      p[i * 3 + 1] = (Math.random() - 0.5) * 10;
      p[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return p;
  }, []);

  const ref = useRef<any>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += isThinking ? 0.05 : 0.002;
      ref.current.rotation.x += isThinking ? 0.02 : 0.001;
    }
  });

  return (
    <group>
      <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
        <PointMaterial transparent color="#6366f1" size={0.02} sizeAttenuation={true} depthWrite={false} />
      </Points>
      <Stars radius={50} depth={50} count={1000} factor={4} saturation={0} fade speed={isThinking ? 10 : 1} />
    </group>
  );
}

export default function GyanAIV15() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [notes, setNotes] = useState<string[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const API_URL = "https://scott-zoloft-seriously-appear.trycloudflare.com/ask";

  useEffect(() => {
    const savedChat = localStorage.getItem('gyanai_v15_mantu');
    const savedNotes = localStorage.getItem('gyanai_notes_v15');
    if (savedChat) setMessages(JSON.parse(savedChat));
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    else setMessages([{ id: 1, role: 'ai', text: 'Namaste Mantu! v15.0 Quantum Leap Active. Main ab aur bhi tezi se sochne aur aapke notes save karne ke liye taiyar hoon.' }]);
  }, []);

  useEffect(() => {
    localStorage.setItem('gyanai_v15_mantu', JSON.stringify(messages));
    localStorage.setItem('gyanai_notes_v15', JSON.stringify(notes));
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, notes]);

  const extractFormula = (text: string) => {
    const match = text.match(/\$.*?\$/g);
    if (match && !notes.includes(match[0])) {
      setNotes(prev => [match[0], ...prev].slice(0, 5));
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: userMsg.text }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: data.response }]);
      extractFormula(data.response);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: "Quantum Link Failure. Check AWS Server." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#010206] text-slate-300 flex flex-col lg:flex-row overflow-hidden font-sans">
      
      {/* --- 📟 QUANTUM SIDEBAR --- */}
      <nav className="hidden lg:flex w-80 flex-col bg-slate-950/90 backdrop-blur-3xl border-r border-white/5 p-8 z-20">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-indigo-600 rounded-[2rem] shadow-2xl shadow-indigo-500/30">
            <Cpu className="text-white w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-2xl font-black text-white italic tracking-tighter">GyanAI <span className="text-[10px] text-indigo-400 block not-italic font-mono">QUANTUM v15</span></h1>
        </div>
        
        <div className="space-y-3 flex-1 overflow-y-auto scrollbar-hide">
          <SidebarItem icon={<LayoutDashboard size={18}/>} label="Neural Hub" active />
          <SidebarItem icon={<Beaker size={18}/>} label="Geometry Lab" />
          
          <div className="mt-8 border-t border-white/5 pt-6">
            <div className="flex items-center gap-2 mb-4 text-indigo-400">
               <NotebookPen size={16} />
               <span className="text-[10px] font-black uppercase tracking-widest">Smart Notes</span>
            </div>
            <div className="space-y-3">
              {notes.length > 0 ? notes.map((n, i) => (
                <div key={i} className="p-3 bg-slate-900/50 rounded-2xl border border-white/5 text-[11px] font-mono overflow-x-hidden">
                   <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{n}</ReactMarkdown>
                </div>
              )) : <p className="text-[9px] text-slate-600 italic">No formulae captured yet...</p>}
            </div>
          </div>
        </div>

        <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="mt-6 flex items-center gap-4 p-4 text-slate-700 hover:text-red-500 transition-all rounded-2xl">
          <Trash2 size={16} /> <span className="text-[10px] font-black uppercase">Erase All</span>
        </button>
      </nav>

      {/* --- 🖥️ CORE INTERFACE --- */}
      <main className="flex-1 flex flex-col p-4 md:p-6 gap-6 relative overflow-hidden">
        <div className="flex flex-col xl:flex-row gap-6 h-full max-h-[94vh] z-10">
          
          <div className="flex-[2.6] flex flex-col gap-6">
            {/* QUANTUM VIEWER */}
            <div className="relative aspect-video lg:h-[450px] bg-black rounded-[5rem] border border-white/10 overflow-hidden shadow-2xl group">
              <Canvas camera={{ position: [0, 2, 7], fov: 45 }}>
                 <ambientLight intensity={0.5} />
                 <QuantumParticles isThinking={isTyping} />
                 <Float speed={5} rotationIntensity={1}>
                    <Sphere args={[1.4, 64, 64]}>
                       <MeshDistortMaterial color={isTyping ? "#ec4899" : "#6366f1"} speed={isTyping ? 10 : 2} distort={0.5} emissive={isTyping ? "#be185d" : "#312e81"} emissiveIntensity={0.6} metalness={0.8} />
                    </Sphere>
                 </Float>
              </Canvas>
              <div className="absolute top-10 left-10 flex items-center gap-3">
                 <Sparkles className="text-indigo-400" size={16} />
                 <p className="text-[11px] font-black text-white uppercase tracking-[0.5em] leading-none">Quantum Link: Stable</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 flex-1">
               <div className="bg-slate-950/20 rounded-[3.5rem] border border-white/5 p-8 flex flex-col justify-center items-center group">
                  <Orbit className="text-slate-800 mb-3 group-hover:text-indigo-400 transition-colors" size={32} />
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest group-hover:text-slate-500">Geometry Ready</p>
               </div>
               <div className="bg-slate-950/20 rounded-[3.5rem] border border-white/5 p-8 flex flex-col justify-center items-center group">
                  <Activity className={`mb-3 ${isTyping ? 'text-pink-500 animate-pulse' : 'text-slate-800'}`} size={32} />
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Thought Sync</p>
               </div>
            </div>
          </div>

          {/* CHAT HUB */}
          <div className="flex-1 min-w-[420px] bg-slate-950/60 rounded-[5rem] border border-white/5 flex flex-col shadow-2xl overflow-hidden backdrop-blur-3xl relative">
            <div className="p-10 border-b border-white/5 flex items-center justify-between bg-white/5">
               <div className="flex items-center gap-3 text-indigo-400">
                  <Zap size={18} fill="currentColor" />
                  <span className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Quantum Hub</span>
               </div>
               <Volume2 size={20} className={isTyping ? "text-pink-500 animate-pulse" : "text-slate-800"} />
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-12 scrollbar-hide">
              <AnimatePresence>
                {messages.map((m) => (
                  <motion.div key={m.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={`flex flex-col ${m.role === 'ai' ? 'items-start' : 'items-end'}`}>
                    <div className={`max-w-[95%] p-8 rounded-[3.5rem] text-[15px] leading-relaxed tracking-tight ${m.role === 'ai' ? 'bg-slate-900 text-slate-100 border border-white/5 rounded-tl-none shadow-2xl shadow-black/50' : 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-600/30'}`}>
                      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{m.text}</ReactMarkdown>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isTyping && (
                <div className="flex items-center gap-3 ml-8 text-indigo-500">
                   <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
                   <span className="text-[10px] font-black uppercase tracking-[0.6em] italic">Quantum Computing...</span>
                </div>
              )}
            </div>

            {/* INPUT HUB */}
            <div className="p-10 pt-4">
              <div className="flex items-center gap-2 bg-slate-900/80 border border-white/5 p-2 rounded-[4rem] shadow-inner focus-within:border-indigo-500/50 transition-all">
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Quantum command..." className="flex-1 bg-transparent border-none py-5 px-6 text-sm text-white focus:outline-none placeholder:text-slate-800 font-medium" />
                <button onClick={handleSend} className="p-6 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-500 active:scale-90 transition-all"><Send size={24}/></button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active = false }: any) {
  return (
    <div className={`flex items-center gap-5 p-5 rounded-[2.5rem] cursor-pointer transition-all border ${active ? 'bg-indigo-600/15 text-indigo-400 border-indigo-500/20 shadow-inner' : 'text-slate-700 hover:bg-slate-900/50 hover:text-slate-300 border-transparent'}`}>
      {icon} <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
    </div>
  );
}
