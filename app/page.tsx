"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Stars, Grid, ContactShadows, Environment } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, Image as ImageIcon, Send, Zap, BrainCircuit, LayoutDashboard, 
  Trash2, X, Activity, Beaker, LineChart, Binary, Volume2, Layers, Cpu
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import 'katex/dist/katex.min.css';

// --- 🌌 NEURAL DEEP-DIVE SCENE ---
function NeuralScene({ isThinking }: { isThinking: boolean }) {
  const meshRef = useRef<any>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      if (isThinking) {
        meshRef.current.distort = 0.6 + Math.sin(state.clock.getElapsedTime() * 5) * 0.2;
      }
    }
  });

  return (
    <group>
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      <Grid infiniteGrid fadeDistance={50} fadeStrength={5} sectionSize={3} sectionColor="#4338ca" cellColor="#1e1b4b" />
      <Float speed={4} rotationIntensity={1} floatIntensity={2}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[1.4, 128, 128]} />
          <MeshDistortMaterial 
            color={isThinking ? "#f43f5e" : "#6366f1"} 
            speed={isThinking ? 15 : 2} 
            distort={0.4} 
            emissive={isThinking ? "#9f1239" : "#312e81"}
            emissiveIntensity={0.5}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </Float>
      <ContactShadows position={[0, -2.5, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
    </group>
  );
}

export default function GyanAIV13() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [thinkingStep, setThinkingStep] = useState("");
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_URL = "https://scott-zoloft-seriously-appear.trycloudflare.com/ask";

  const thinkingLogs = [
    "Initializing Neural Bridge...",
    "Analyzing Visual Patterns...",
    "Extracting Mathematical Variables...",
    "Applying Scientific Laws...",
    "Generating Precise Solution..."
  ];

  useEffect(() => {
    const savedChat = localStorage.getItem('gyanai_v13_mantu');
    if (savedChat) setMessages(JSON.parse(savedChat));
    else setMessages([{ id: 1, role: 'ai', text: 'Namaste Mantu! v13.0 Neural Deep-Dive Active. Main ek saath kayi photos aur complex logic samajhne ke liye taiyar hoon.' }]);
  }, []);

  useEffect(() => {
    localStorage.setItem('gyanai_v13_mantu', JSON.stringify(messages));
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const simulateThinking = async () => {
    for (const log of thinkingLogs) {
      setThinkingStep(log);
      await new Promise(r => setTimeout(r, 600));
    }
  };

  const handleSend = async () => {
    if (!input.trim() && selectedImages.length === 0) return;

    const userMsg = { id: Date.now(), role: 'user', text: input, images: selectedImages };
    setMessages(prev => [...prev, userMsg]);
    
    const currentInput = input;
    const currentImages = selectedImages;

    setInput("");
    setSelectedImages([]);
    setIsTyping(true);

    await simulateThinking();

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: currentInput, image: currentImages[0] || null }), // Multi-image logic backend dependent
      });
      const data = await response.json();
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: "Neural Link Terminated. Check AWS Cloudflare." }]);
    } finally {
      setIsTyping(false);
      setThinkingStep("");
    }
  };

  return (
    <div className="min-h-screen bg-[#010204] text-slate-300 flex flex-col lg:flex-row overflow-hidden">
      
      {/* --- PROFESSOR SIDEBAR --- */}
      <nav className="hidden lg:flex w-80 flex-col bg-slate-950/80 backdrop-blur-3xl border-r border-white/5 p-8 z-20">
        <div className="flex items-center gap-4 mb-12">
          <div className="p-3.5 bg-indigo-600 rounded-[2rem] shadow-[0_0_20px_rgba(79,70,229,0.4)]">
            <Cpu className="text-white w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-2xl font-black text-white italic tracking-tighter">GyanAI <span className="text-[10px] text-pink-500 block not-italic font-mono">v13 DEEP-DIVE</span></h1>
        </div>
        
        <div className="space-y-4 flex-1">
          <SidebarItem icon={<Layers size={18}/>} label="Thought Hub" active />
          <SidebarItem icon={<Beaker size={18}/>} label="Visual Lab 2.0" />
          <SidebarItem icon={<Binary size={18}/>} label="Logic Engine" />
        </div>

        <div className="p-6 bg-slate-900/40 rounded-[2.5rem] border border-white/5 mb-6 text-center">
           <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">Neural Status</p>
           <p className="text-[11px] font-bold text-indigo-400">Cognitive Sync: 99.8%</p>
        </div>

        <button onClick={() => { localStorage.removeItem('gyanai_v13_mantu'); window.location.reload(); }} className="flex items-center gap-4 p-4 text-slate-700 hover:text-red-500 transition-all">
          <Trash2 size={16} /> <span className="text-[10px] font-black uppercase">Deep Format</span>
        </button>
      </nav>

      {/* --- MAIN CORE --- */}
      <main className="flex-1 flex flex-col p-4 md:p-6 gap-6 relative">
        <div className="flex flex-col xl:flex-row gap-6 h-full max-h-[94vh]">
          
          <div className="flex-[2.8] flex flex-col gap-6">
            {/* DEEP-DIVE VIEWER */}
            <div className="relative aspect-video lg:h-[450px] bg-black rounded-[5rem] border border-white/10 overflow-hidden shadow-2xl">
              <Canvas camera={{ position: [0, 2, 7], fov: 40 }}>
                 <ambientLight intensity={0.5} />
                 <NeuralScene isThinking={isTyping} />
              </Canvas>
              
              <AnimatePresence>
                {thinkingStep && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="absolute bottom-12 left-12 flex items-center gap-4">
                     <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                     <p className="text-sm font-black text-white italic tracking-widest uppercase">{thinkingStep}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* QUICK ACTIONS */}
            <div className="grid grid-cols-2 gap-6 flex-1">
               <div className="bg-slate-950/30 rounded-[4rem] border border-white/5 flex flex-col items-center justify-center group hover:bg-indigo-600/5 transition-all">
                  <Activity className="text-slate-800 mb-2 group-hover:text-indigo-500" size={32} />
                  <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Neural Load</span>
               </div>
               <div className="bg-slate-950/30 rounded-[4rem] border border-white/5 flex flex-col items-center justify-center group hover:bg-pink-600/5 transition-all">
                  <LineChart className="text-slate-800 mb-2 group-hover:text-pink-500" size={32} />
                  <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Active Plotter</span>
               </div>
            </div>
          </div>

          {/* CHAT INTERFACE */}
          <div className="flex-1 min-w-[420px] bg-slate-950/50 rounded-[5rem] border border-white/5 flex flex-col shadow-2xl overflow-hidden backdrop-blur-3xl">
            <div className="p-10 border-b border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-teal-500 rounded-full shadow-[0_0_15px_#14b8a6]" />
                  <span className="text-[11px] font-black text-white uppercase tracking-[0.5em]">Deep-Dive Hub</span>
               </div>
               <Volume2 size={20} className={isTyping ? "text-pink-500 animate-pulse" : "text-slate-800"} />
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-12 scrollbar-hide">
              {messages.map((m) => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col ${m.role === 'ai' ? 'items-start' : 'items-end'}`}>
                  {m.images && (
                    <div className="flex gap-2 mb-4 overflow-x-auto max-w-full">
                      {m.images.map((img: string, idx: number) => (
                        <img key={idx} src={img} className="w-32 h-32 object-cover rounded-[2rem] border-2 border-white/5" />
                      ))}
                    </div>
                  )}
                  <div className={`max-w-[95%] p-8 rounded-[3.5rem] text-[14.5px] leading-relaxed shadow-2xl ${m.role === 'ai' ? 'bg-slate-900 text-slate-100 border border-white/5 rounded-tl-none' : 'bg-indigo-600 text-white rounded-tr-none'}`}>
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{m.text}</ReactMarkdown>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* PREVIEW BOX */}
            <div className="px-10 flex gap-2">
              {selectedImages.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img src={img} className="w-20 h-20 object-cover rounded-[1.5rem] border-2 border-indigo-500" />
                  <button onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== idx))} className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"><X size={10}/></button>
                </div>
              ))}
            </div>

            {/* INPUT BOX */}
            <div className="p-10">
              <div className="flex items-center gap-2 bg-slate-900/80 border border-white/5 p-2 rounded-[4rem] shadow-inner focus-within:border-indigo-500/50 transition-all">
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" multiple className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="p-5 text-slate-500 hover:text-indigo-400"><ImageIcon size={24}/></button>
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask Mantu's Oracle..." className="flex-1 bg-transparent border-none py-5 px-3 text-sm text-white focus:outline-none" />
                <button onClick={handleSend} className="p-6 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-500 transition-all"><Send size={24}/></button>
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
    <div className={`flex items-center gap-5 p-5 rounded-[2rem] cursor-pointer border transition-all ${active ? 'bg-indigo-600/15 text-indigo-400 border-indigo-500/20 shadow-inner' : 'text-slate-700 hover:bg-slate-900/50 hover:text-slate-300 border-transparent'}`}>
      {icon} <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
    </div>
  );
}
