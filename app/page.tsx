"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Stars, Grid } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, Image as ImageIcon, Send, Zap, BrainCircuit, LayoutDashboard, 
  Globe, Terminal, PenTool, Volume2, Trash2, X, Activity, Beaker, BarChart3
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

// --- 🌌 HOLOGRAPHIC GRID ENGINE ---
function HolographicScene({ isTyping }: { isTyping: boolean }) {
  const gridRef = useRef<any>(null);
  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.rotation.z = state.clock.getElapsedTime() * 0.1;
      if (isTyping) gridRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 5) * 0.1;
    }
  });

  return (
    <group>
      <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
      <Grid
        ref={gridRef}
        infiniteGrid
        fadeDistance={50}
        fadeStrength={5}
        sectionSize={3}
        sectionColor="#4338ca"
        cellColor="#1e1b4b"
      />
      <Float speed={4} rotationIntensity={2}>
        <Sphere args={[1.2, 64, 64]}>
          <MeshDistortMaterial 
            color={isTyping ? "#ec4899" : "#6366f1"} 
            speed={isTyping ? 10 : 2} 
            distort={0.4} 
            emissive="#312e81"
            emissiveIntensity={0.5}
          />
        </Sphere>
      </Float>
    </group>
  );
}

export default function GyanAIV11() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedChat = localStorage.getItem('gyanai_v11_mantu');
    if (savedChat) setMessages(JSON.parse(savedChat));
    else setMessages([{ id: 1, role: 'ai', text: 'Namaste Mantu! v11.0 Visual Architect active. Aaj hum complex physics ko diagrams ke saath samjhenge.' }]);
  }, []);

  useEffect(() => {
    localStorage.setItem('gyanai_v11_mantu', JSON.stringify(messages));
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;

    const userMsg = { id: Date.now(), role: 'user', text: input, image: selectedImage };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    const currentImage = selectedImage;

    setInput("");
    setSelectedImage(null);
    setIsTyping(true);

    try {
      const response = await fetch('https://good-items-itch.loca.lt/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Bypass-Tunnel-Reminder': 'true' },
        body: JSON.stringify({ text: currentInput, image: currentImage }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: data.response }]);
      speak(data.response);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: "Critical Error: Neural Link Broken." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#010409] text-slate-300 flex flex-col lg:flex-row overflow-hidden font-sans">
      
      {/* --- SIDEBAR v11 --- */}
      <nav className="hidden lg:flex w-72 flex-col bg-black/40 backdrop-blur-3xl border-r border-white/5 p-6 z-20">
        <div className="flex items-center gap-4 mb-12">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-40 animate-pulse" />
            <BrainCircuit className="text-white w-8 h-8 relative z-10" />
          </div>
          <h1 className="text-2xl font-black text-white italic tracking-tighter">GyanAI</h1>
        </div>
        
        <div className="space-y-2 flex-1">
          <SidebarItem icon={<LayoutDashboard size={18}/>} label="Neural Hub" active />
          <SidebarItem icon={<Beaker size={18}/>} label="Physics Lab" />
          <SidebarItem icon={<BarChart3 size={18}/>} label="Data Analytics" />
          
          <div className="mt-12 p-5 rounded-[2rem] bg-gradient-to-br from-indigo-900/20 to-transparent border border-indigo-500/10">
             <p className="text-[10px] font-black text-indigo-400 uppercase mb-2">Visual Sync</p>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Architect Ready</span>
             </div>
          </div>
        </div>

        <button onClick={() => { localStorage.removeItem('gyanai_v11_mantu'); window.location.reload(); }} className="flex items-center gap-4 p-4 text-slate-600 hover:text-red-500 transition-all rounded-2xl">
          <Trash2 size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Wipe Core</span>
        </button>
      </nav>

      {/* --- CORE v11 INTERFACE --- */}
      <main className="flex-1 flex flex-col p-4 md:p-6 gap-6 relative">
        <div className="flex flex-col xl:flex-row gap-6 h-full max-h-[92vh]">
          
          <div className="flex-[2.5] flex flex-col gap-6 overflow-hidden">
            {/* HOLOGRAPHIC VIEWER */}
            <div className="relative aspect-video lg:h-[400px] bg-[#000] rounded-[4rem] border border-white/5 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <Canvas camera={{ position: [0, 2, 5] }}>
                 <ambientLight intensity={0.5} />
                 <HolographicScene isTyping={isTyping} />
              </Canvas>
              <div className="absolute top-8 left-8 border-l-2 border-indigo-500 pl-4">
                 <p className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Visual Architect v11</p>
                 <p className="text-[8px] text-indigo-500 font-bold uppercase mt-1">Status: Stable Sync</p>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4">
               <div className="bg-slate-950/20 rounded-[3rem] border border-white/5 p-6 flex flex-col justify-center items-center text-center group hover:border-indigo-500/20 transition-all">
                  <Activity className={`mb-2 ${isTyping ? 'text-pink-500' : 'text-slate-800'}`} size={24} />
                  <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest group-hover:text-slate-500">Neural Response</p>
               </div>
               <div className="bg-slate-950/20 rounded-[3rem] border border-white/5 p-6 flex flex-col justify-center items-center text-center group hover:border-teal-500/20 transition-all">
                  <PenTool className="text-slate-800 mb-2" size={24} />
                  <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest group-hover:text-slate-500">Architect Mode</p>
               </div>
            </div>
          </div>

          {/* CHAT COMMAND CENTER */}
          <div className="flex-1 min-w-[380px] bg-slate-950/40 rounded-[4.5rem] border border-white/5 flex flex-col shadow-2xl overflow-hidden backdrop-blur-3xl relative">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
               <div className="flex items-center gap-3">
                  <Zap size={16} className="text-indigo-500" />
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Neural Hub 11</span>
               </div>
               <Volume2 size={16} className={isSpeaking ? "text-pink-500 animate-pulse" : "text-slate-800"} />
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
              {messages.map((m) => (
                <motion.div key={m.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`flex flex-col ${m.role === 'ai' ? 'items-start' : 'items-end'}`}>
                  {m.image && <img src={m.image} alt="visual" className="max-w-[200px] rounded-[2.5rem] mb-4 border border-indigo-500/20 shadow-2xl" />}
                  <div className={`max-w-[92%] p-7 rounded-[3rem] text-[13px] leading-relaxed shadow-2xl transition-all ${m.role === 'ai' ? 'bg-slate-900/90 text-indigo-50 border border-white/5 rounded-tl-none' : 'bg-indigo-600 text-white rounded-tr-none'}`}>
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{m.text}</ReactMarkdown>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-3 ml-6 text-indigo-500">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
                  <span className="text-[9px] font-black uppercase tracking-[0.5em]">Architect Thinking...</span>
                </div>
              )}
            </div>

            {/* PREVIEW IMAGE */}
            <AnimatePresence>
              {selectedImage && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="px-8 pb-4">
                  <div className="relative inline-block">
                    <img src={selectedImage} className="w-24 h-24 object-cover rounded-[2.2rem] border-2 border-indigo-500 shadow-2xl" />
                    <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:scale-110 transition-all shadow-xl"><X size={12}/></button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* INPUT COMMAND */}
            <div className="p-8">
              <div className="flex items-center gap-2 bg-slate-900/80 border border-white/5 p-2 rounded-[3.5rem] shadow-inner focus-within:border-indigo-500/40 transition-all">
                <input type="file" ref={fileInputRef} onChange={(e) => {
                  const file = e.target.files?.[0];
                  if(file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setSelectedImage(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }} accept="image/*" className="hidden" />
                
                <button onClick={() => fileInputRef.current?.click()} className="p-4 text-slate-600 hover:text-indigo-400"><ImageIcon size={20}/></button>
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Issue a visual command..." className="flex-1 bg-transparent border-none py-4 px-2 text-sm text-white focus:outline-none placeholder:text-slate-800" />
                <button onClick={handleSend} className="p-5 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-500 active:scale-95 transition-all"><Send size={20}/></button>
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
    <div className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border ${active ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/20 shadow-inner' : 'text-slate-700 hover:bg-slate-900/50 hover:text-slate-300 border-transparent'}`}>
      {icon} <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
  );
}
