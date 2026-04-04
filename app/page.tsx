"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float, Sphere, MeshDistortMaterial, Stars, PerspectiveCamera, Text } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, Image as ImageIcon, Send, Sparkles, Zap, Bot, 
  Activity, Cpu, Globe, Terminal, BrainCircuit, LayoutDashboard, 
  Database, Radio, Gauge
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

// --- 🌌 1. 3D KNOWLEDGE GALAXY (Interative Hub) ---
function KnowledgeStars() {
  const ref = useRef<any>(null);
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 15;
      ref.current.rotation.y -= delta / 20;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <mesh ref={ref}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <MeshDistortMaterial color="#4f46e5" speed={2} distort={0.4} radius={1} />
      </mesh>
    </group>
  );
}

export default function GyanAIFinalAlpha() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    { id: 1, role: 'ai', text: 'Neural-Sync v5.0 Initialized. Knowledge Galaxy is online. How can I assist you today, Mantu?' }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: input }]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        role: 'ai', 
        text: 'Analyzing your query through the neural network... Logic mapped. Preparing explanation.' 
      }]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 flex flex-col lg:flex-row overflow-hidden font-sans selection:bg-indigo-500/30 relative">
      
      {/* --- 🧬 LEFT SIDEBAR: 3D TELEMETRY --- */}
      <nav className="hidden lg:flex w-80 flex-col bg-slate-950/90 backdrop-blur-2xl border-r border-indigo-500/10 p-6 z-20 relative">
        <div className="z-10 relative">
          <div className="flex items-center gap-3 mb-12">
            <div className="p-2 bg-indigo-600 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.6)]">
              <BrainCircuit className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-widest uppercase">Gyan<span className="text-indigo-500 italic">AI</span></h1>
          </div>
          
          <div className="space-y-2 mb-10">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4">Neural Navigation</p>
            <SidebarItem icon={<LayoutDashboard size={18}/>} label="Core Console" active />
            <SidebarItem icon={<Globe size={18}/>} label="Concept Galaxy" />
            <SidebarItem icon={<Terminal size={18}/>} label="Logic Lab" />
            <SidebarItem icon={<Radio size={18}/>} label="Live Signals" />
          </div>

          {/* 📊 LIVE PERFORMANCE HUD */}
          <div className="p-4 bg-indigo-950/20 rounded-3xl border border-indigo-500/20 backdrop-blur-md space-y-4">
             <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">Neural Load</span>
                <span className="text-[9px] text-green-400 font-mono">24.8%</span>
             </div>
             <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <motion.div animate={{ width: '24.8%' }} className="h-full bg-indigo-500 shadow-[0_0_10px_#6366f1]"></motion.div>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">Sync Speed</span>
                <span className="text-[9px] text-teal-400 font-mono">1.2ms</span>
             </div>
          </div>
        </div>

        {/* 🌌 MINI GALAXY BACKGROUND */}
        <div className="absolute inset-0 h-full w-full opacity-30 pointer-events-none">
           <Canvas>
              <KnowledgeStars />
           </Canvas>
        </div>
      </nav>

      {/* --- 🚀 MAIN COMMAND CENTER --- */}
      <main className="flex-1 flex flex-col p-2 md:p-6 gap-6 relative z-10">
        <div className="flex flex-col xl:flex-row gap-6 h-full max-h-[92vh]">
          
          {/* LEFT: 3D VISUALIZER & MAGIC CANVAS */}
          <div className="flex-[2.8] flex flex-col gap-6 overflow-hidden">
            
            {/* 🤖 THE NEURAL CORE (Teacher Face) */}
            <div className="relative aspect-video lg:h-[400px] bg-black rounded-[3rem] border border-indigo-500/20 overflow-hidden shadow-2xl group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-transparent to-transparent opacity-60"></div>
              
              <div className="absolute top-8 left-8 z-20 flex items-center gap-3">
                <div className="bg-indigo-600/10 px-4 py-1.5 rounded-full border border-indigo-500/30 flex items-center gap-3 backdrop-blur-md">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
                  <span className="text-[10px] font-black tracking-[0.3em] text-white uppercase italic">Neural Sync Active</span>
                </div>
              </div>

              {/* CENTRAL 3D CORE */}
              <div className="h-full w-full flex items-center justify-center relative">
                 <Canvas camera={{ position: [0, 0, 5] }}>
                    <ambientLight intensity={0.5} />
                    <Float speed={4} rotationIntensity={1} floatIntensity={2}>
                       <Sphere args={[1.2, 64, 64]}>
                          <MeshDistortMaterial 
                            color="#6366f1" 
                            speed={isTyping ? 8 : 2} 
                            distort={isTyping ? 0.6 : 0.3} 
                            roughness={0} 
                            emissive="#4f46e5"
                            emissiveIntensity={0.5}
                          />
                       </Sphere>
                    </Float>
                 </Canvas>
                 <div className="absolute bottom-10 flex flex-col items-center">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.5em] mb-4">GyanAI Intelligence Hub</p>
                    <div className="flex gap-4">
                       <Gauge size={16} className="text-indigo-900" />
                       <Cpu size={16} className="text-indigo-900" />
                       <Database size={16} className="text-indigo-900" />
                    </div>
                 </div>
              </div>
            </div>

            {/* 🎨 NEURAL RENDER CANVAS (Whiteboard) */}
            <div className="flex-1 bg-slate-950/40 rounded-[3rem] border border-slate-800/60 p-8 relative overflow-hidden backdrop-blur-sm flex flex-col">
                <div className="flex justify-between items-center mb-6">
                   <div className="flex items-center gap-2">
                      <PenTool size={14} className="text-indigo-500" />
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Neural Render Output</span>
                   </div>
                   <div className="text-[10px] font-mono text-indigo-900">SYSTEM.READY()</div>
                </div>
                <div className="flex-1 border border-indigo-500/10 rounded-[2rem] flex flex-col items-center justify-center bg-slate-900/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
                    <motion.div animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ repeat: Infinity, duration: 4 }} className="text-indigo-400 font-mono text-xs italic z-10">
                       Waiting for complex geometry analysis...
                    </motion.div>
                </div>
            </div>
          </div>

          {/* RIGHT: COMMAND TERMINAL (Chat) */}
          <div className="flex-1 min-w-[360px] bg-[#0b0f1a] rounded-[3.5rem] border border-indigo-500/20 flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.8)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_20px_#6366f1]"></div>
            
            <div className="p-8 border-b border-white/5 bg-slate-900/10 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center border border-indigo-500/20 shadow-inner">
                    <Zap size={22} className="text-indigo-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white tracking-tight">AI Command Center</h3>
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                       <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest italic">Llama-3 Neural Core</p>
                    </div>
                  </div>
               </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
              <AnimatePresence mode="popLayout">
                {messages.map((m) => (
                  <motion.div 
                    key={m.id}
                    initial={{ opacity: 0, x: m.role === 'ai' ? -20 : 20, scale: 0.98 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`max-w-[90%] p-5 rounded-[2.2rem] text-sm leading-relaxed shadow-2xl border ${
                      m.role === 'ai' 
                      ? 'bg-slate-900/90 text-indigo-50 border-indigo-500/10 rounded-tl-none backdrop-blur-xl' 
                      : 'bg-indigo-600 text-white rounded-tr-none border-indigo-400/30 shadow-indigo-600/20 font-medium'
                    }`}>
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                            {m.text}
                        </ReactMarkdown>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isTyping && (
                <div className="flex items-center gap-3 ml-4">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                  <span className="text-[9px] font-black text-indigo-900 uppercase tracking-widest">Processing Data...</span>
                </div>
              )}
            </div>

            <div className="p-8 bg-slate-950/50 backdrop-blur-3xl">
              <div className="relative group flex items-center gap-3 bg-slate-900/80 border border-indigo-500/10 p-3 rounded-[2.5rem] focus-within:border-indigo-500/40 transition-all shadow-inner">
                <button className="p-3 text-slate-600 hover:text-indigo-400 transition-colors"><ImageIcon size={20}/></button>
                <button className="p-3 text-slate-600 hover:text-indigo-400 transition-colors"><Mic size={20}/></button>
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Initiate a neural query..." 
                  className="flex-1 bg-transparent border-none py-3 px-2 text-sm text-white focus:outline-none placeholder:text-slate-700 font-medium" 
                />
                <button onClick={handleSend} className="p-4 bg-indigo-600 text-white rounded-full shadow-[0_0_25px_rgba(79,70,229,0.4)] hover:bg-indigo-500 active:scale-95 transition-all">
                  <Send size={20} />
                </button>
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
    <div className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border ${
      active ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/20 shadow-inner' : 'text-slate-600 hover:bg-slate-900/50 hover:text-slate-300 border-transparent'
    }`}>
      <div className={`${active ? 'text-indigo-500' : ''}`}>{icon}</div>
      <span className="text-xs font-black tracking-widest uppercase">{label}</span>
    </div>
  );
}
