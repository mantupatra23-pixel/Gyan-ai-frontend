"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, Image as ImageIcon, Send, Sparkles, BookOpen, 
  Terminal, History, Settings, Zap, Bot, PenTool, Activity
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

// --- 1. 3D KNOWLEDGE GALAXY COMPONENT ---
function KnowledgeGalaxy() {
  const ref = useRef<any>();
  const [sphere] = useState(() => {
    const arr = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  });

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial transparent color="#6366f1" size={0.05} sizeAttenuation={true} depthWrite={false} />
      </Points>
    </group>
  );
}

export default function GyanAIV3() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [emotion, setEmotion] = useState("Calm"); // Calm, Analytical, Supportive
  const [messages, setMessages] = useState<any[]>([
    { id: 1, role: 'ai', text: 'Namaste Mantu! Neural-Sync Active. Aaj hum kaunsa concept "Magic Canvas" par draw karenge?' }
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
    
    // Emotional Tone Analysis (Simulation)
    if (input.toLowerCase().includes("hard") || input.toLowerCase().includes("nahi")) {
      setEmotion("Supportive");
    } else {
      setEmotion("Analytical");
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        role: 'ai', 
        text: 'Main Newton ke laws draw kar raha hoon. Dekhiye Magic Canvas par... $F = m \cdot a$' 
      }]);
      setIsTyping(false);
      setEmotion("Calm");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col lg:flex-row overflow-hidden font-sans">
      
      {/* --- SIDEBAR: 3D KNOWLEDGE GALAXY --- */}
      <nav className="hidden lg:flex w-80 flex-col bg-[#0b0f1a] border-r border-slate-800/40 p-6 relative">
        <div className="z-10">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="text-indigo-500 w-8 h-8" />
            <h1 className="text-2xl font-black text-white tracking-tighter">GyanAI <span className="text-[10px] bg-indigo-600 px-2 py-0.5 rounded-full">v3.0</span></h1>
          </div>
          
          <div className="space-y-1">
            <SidebarItem icon={<Bot size={18}/>} label="Neural Teacher" active />
            <SidebarItem icon={<Terminal size={18}/>} label="Code Lab" />
            <SidebarItem icon={<History size={18}/>} label="Memory Bank" />
          </div>
        </div>

        {/* --- 3. KNOWLEDGE GALAXY (Live 3D) --- */}
        <div className="absolute inset-0 top-1/2 h-1/2 opacity-40">
           <Canvas camera={{ position: [0, 0, 5] }}>
              <KnowledgeGalaxy />
           </Canvas>
           <div className="absolute bottom-10 left-6 right-6 text-center">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Knowledge Galaxy Mastery</p>
              <div className="mt-2 h-1 bg-slate-800 rounded-full overflow-hidden">
                 <motion.div animate={{ width: '65%' }} className="h-full bg-indigo-500 shadow-[0_0_10px_#6366f1]"></motion.div>
              </div>
           </div>
        </div>
      </nav>

      {/* --- MAIN WORKSPACE --- */}
      <main className="flex-1 flex flex-col p-4 gap-6">
        <div className="flex flex-col xl:flex-row gap-6 h-full max-h-[90vh]">
          
          {/* LEFT: NEURAL VISUALIZER & MAGIC CANVAS */}
          <div className="flex-[2.5] flex flex-col gap-6">
            
            {/* 1. NEURAL-SYNC VOICE VISUALIZER */}
            <div className="relative aspect-video lg:h-[350px] bg-black rounded-[3rem] border border-slate-800 overflow-hidden shadow-2xl">
              <Canvas>
                <ambientLight intensity={0.5} />
                <Float speed={5} rotationIntensity={2} floatIntensity={2}>
                  <Sphere args={[1, 64, 64]} scale={1.5}>
                    <MeshDistortMaterial 
                      color={emotion === "Supportive" ? "#facc15" : "#6366f1"} 
                      speed={isTyping ? 10 : 2} 
                      distort={isTyping ? 0.6 : 0.3} 
                    />
                  </Sphere>
                </Float>
              </Canvas>
              <div className="absolute bottom-8 w-full text-center">
                <div className="flex items-center justify-center gap-2">
                  <Activity size={14} className="text-indigo-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-500 tracking-[0.4em] uppercase">Neural-Sync: {emotion}</span>
                </div>
              </div>
            </div>

            {/* 2. AUTO-DRAWING MAGIC CANVAS */}
            <div className="flex-1 bg-slate-950/50 rounded-[3rem] border border-slate-800/40 p-8 relative overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2">
                  <PenTool size={12} /> Magic Teacher Canvas
                </span>
              </div>
              <div className="flex-1 border border-dashed border-indigo-900/30 rounded-[2rem] flex items-center justify-center relative">
                 <AnimatePresence>
                   {isTyping && (
                     <motion.div 
                        initial={{ pathLength: 0 }} 
                        animate={{ pathLength: 1 }} 
                        className="absolute w-32 h-32 border-4 border-indigo-500/20 rounded-full"
                     />
                   )}
                 </AnimatePresence>
                 <p className="text-slate-700 italic text-sm">AI is sketching Newton's laws...</p>
              </div>
            </div>
          </div>

          {/* RIGHT: SMART CHAT & EMOTION ANALYZER */}
          <div className="flex-1 bg-[#0b0f1a] rounded-[3rem] border border-slate-800/50 flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800/50 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${emotion === 'Supportive' ? 'bg-yellow-400' : 'bg-green-500'} animate-pulse`}></div>
                  <h3 className="font-bold text-white tracking-tight">Doubt Solver</h3>
               </div>
               {/* 4. EMOTIONAL TONE ANALYSIS DISPLAY */}
               <div className="px-3 py-1 bg-slate-900 rounded-full border border-slate-800">
                  <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">{emotion} Mode</span>
               </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] p-4 rounded-[1.8rem] text-sm ${
                    m.role === 'ai' ? 'bg-slate-900 text-slate-200 rounded-tl-none border border-slate-800' : 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-600/20'
                  }`}>
                    <div className="markdown-content prose prose-invert max-w-none text-sm">
                      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                        {m.text}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && <div className="text-[10px] text-indigo-500 font-bold animate-pulse">GyanAI is thinking deeply...</div>}
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-[2rem] border border-slate-800 shadow-inner focus-within:border-indigo-500/50 transition-all">
                <button className="p-3 text-slate-500 hover:text-indigo-400"><ImageIcon size={20}/></button>
                <button className="p-3 text-slate-500 hover:text-indigo-400"><Mic size={20}/></button>
                <input 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Explain Relativity..." 
                  className="flex-1 bg-transparent border-none py-3 px-2 text-sm text-white focus:outline-none" 
                />
                <button onClick={handleSend} className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-500/20"><Send size={18}/></button>
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
    <div className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${active ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/10' : 'text-slate-500 hover:bg-slate-800/50'}`}>
      {icon} <span className="text-sm font-bold tracking-tight">{label}</span>
    </div>
  );
}
