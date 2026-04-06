"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Box, Stars, Grid, OrbitControls, ContactShadows, MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Zap, BrainCircuit, Trash2, X, Activity, 
  Binary, Volume2, Eye, Heart, Cpu, Image as ImageIcon, 
  FlaskConical, Menu, Home, GraduationCap, Dna, Globe, 
  Atom, Satellite, Mic, VolumeX, Network, ChevronUp, ChevronDown 
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import 'katex/dist/katex.min.css';

// --- ⚛️ QUANTUM SUPERPOSITION ENGINE ---
function QuantumCore({ isThinking, isQuantum, isSpeaking }: { isThinking: boolean, isQuantum: boolean, isSpeaking: boolean }) {
  const meshRef1 = useRef<any>(null);
  const meshRef2 = useRef<any>(null);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef1.current) {
      meshRef1.current.rotation.y += 0.01;
      meshRef1.current.scale.setScalar(isQuantum ? 1 + Math.sin(t * 10) * 0.05 : 1);
    }
    if (meshRef2.current) {
      meshRef2.current.rotation.x += 0.02;
      meshRef2.current.position.x = Math.sin(t * 5) * 0.1;
    }
  });

  return (
    <group>
      <Float speed={5}>
        <mesh ref={meshRef1}>
          <sphereGeometry args={[1.5, 64, 64]} />
          <MeshDistortMaterial 
            color={isQuantum ? "#6366f1" : (isSpeaking ? "#ec4899" : "#4f46e5")} 
            speed={isThinking ? 10 : 2} 
            distort={0.4} 
            transparent={isQuantum}
            opacity={isQuantum ? 0.6 : 1}
          />
        </mesh>
      </Float>
      
      {isQuantum && (
        <mesh ref={meshRef2}>
          <boxGeometry args={[1.8, 1.8, 1.8]} />
          <MeshWobbleMaterial color="#f43f5e" speed={5} factor={0.6} transparent opacity={0.4} />
        </mesh>
      )}
    </group>
  );
}

export default function GyanAIV25Final() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [isQuantum, setIsQuantum] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isWormholeActive, setIsWormholeActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const API_URL = "https://scott-zoloft-seriously-appear.trycloudflare.com/ask";

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    const saved = localStorage.getItem('gyanai_v25_ultra');
    if (saved) setMessages(JSON.parse(saved));
    else setMessages([{ id: 1, role: 'ai', text: 'Namaste Mantu! v25.0 Ultra Final Build active. Navigation aur Quantum mode ready hai.' }]);
  }, []);

  useEffect(() => {
    localStorage.setItem('gyanai_v25_ultra', JSON.stringify(messages));
    scrollToBottom();
    
    const lastMsg = messages[messages.length - 1]?.text.toLowerCase() || "";
    setIsQuantum(lastMsg.includes("quantum") || lastMsg.includes("superposition"));
  }, [messages]);

  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const speak = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[*#_\[\]\(\)$]/g, ''));
    utterance.lang = 'hi-IN';
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    synthRef.current.speak(utterance);
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;
    const userMsg = { id: Date.now(), role: 'user', text: input, image: selectedImage };
    setMessages(prev => [...prev, userMsg]);
    setInput(""); setSelectedImage(null); setIsTyping(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: userMsg.text, image: userMsg.image }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: data.response }]);
      speak(data.response);
    } catch (e) {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: "Quantum Bridge Error." }]);
    } finally { setIsTyping(false); }
  };

  return (
    <div className="min-h-screen bg-[#010204] text-slate-300 flex flex-col overflow-hidden relative font-sans">
      
      {/* 🌀 WORMHOLE TELEPORT EFFECT */}
      <AnimatePresence>
        {isWormholeActive && (
          <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 100 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }} className="fixed inset-0 z-[200] bg-indigo-600 rounded-full mix-blend-screen pointer-events-none" />
        )}
      </AnimatePresence>

      {/* ☰ MENU BUTTON */}
      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="absolute top-8 left-8 z-[100] p-5 bg-indigo-600/30 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl">
        {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* 🧠 NEURAL SIDEBAR */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.nav initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="fixed top-0 left-0 h-full w-85 bg-slate-950/98 backdrop-blur-3xl z-[90] p-10 pt-36 border-r border-white/5 flex flex-col gap-8 shadow-3xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-indigo-600 rounded-[2.2rem] shadow-xl shadow-indigo-500/40"><Network className="text-white" size={26}/></div>
              <h1 className="text-2xl font-black italic text-white tracking-tighter">GyanAI <span className="text-[9px] block text-indigo-400 not-italic font-mono mt-1">MULTIVERSE v25</span></h1>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto scrollbar-hide">
              <SidebarItem icon={<Home size={18}/>} label="Quantum Hub" active />
              <SidebarItem icon={<Zap size={18}/>} label="Teleport" onClick={() => { setIsWormholeActive(true); setTimeout(()=>setIsWormholeActive(false), 1500); }} />
              <div className="mt-8 p-6 bg-slate-900/40 rounded-[3rem] border border-white/5">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Synapse Map</p>
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(12)].map((_, i) => <div key={i} className={`h-4 rounded-full ${i < 7 ? 'bg-indigo-500' : 'bg-slate-800'}`} />)}
                </div>
              </div>
            </div>
            <button onClick={() => {localStorage.clear(); window.location.reload();}} className="p-6 text-red-500 border border-red-500/20 rounded-[3rem] text-xs font-black uppercase tracking-widest flex items-center gap-4 hover:bg-red-500/10 transition-all"><Trash2 size={18}/> Wipe Engine</button>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* 🖥️ MAIN WORKSPACE */}
      <main className={`flex-1 flex flex-col p-4 md:p-10 gap-8 transition-all duration-700 ${isSidebarOpen ? 'blur-3xl scale-95 opacity-40' : ''}`}>
        <div className="flex flex-col xl:flex-row gap-8 h-full max-h-[92vh] z-10">
          
          <div className="flex-[2.8] flex flex-col gap-8">
            {/* ⚛️ QUANTUM VIEWER */}
            <div className="relative aspect-video lg:h-[480px] bg-black rounded-[7rem] border border-white/10 overflow-hidden shadow-3xl">
              <Canvas camera={{ position: [0, 2, 8], fov: 40 }}>
                 <ambientLight intensity={0.5} />
                 <Stars radius={100} depth={50} count={3500} factor={4} fade speed={isQuantum ? 4 : 1} />
                 <Grid infiniteGrid sectionColor={isQuantum ? "#f43f5e" : "#4338ca"} cellColor={isQuantum ? "#9f1239" : "#1e1b4b"} />
                 <OrbitControls enablePan={false} />
                 <QuantumCore isThinking={isTyping} isQuantum={isQuantum} isSpeaking={isSpeaking} />
                 <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4.5} />
              </Canvas>
              <div className="absolute top-12 left-12 flex items-center gap-4 bg-black/40 backdrop-blur-xl px-6 py-3 rounded-full border border-white/5">
                 <div className={`w-3 h-3 rounded-full ${isQuantum ? 'bg-amber-500 animate-pulse' : 'bg-teal-500'}`} />
                 <p className="text-[10px] font-black text-white uppercase tracking-[0.4em] leading-none">Status: {isQuantum ? 'Quantum Superposition' : 'Stable State'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 flex-1">
               <div className="bg-slate-950/30 rounded-[5rem] border border-white/5 p-8 flex flex-col justify-center items-center group hover:bg-rose-500/5 transition-all">
                  <Activity className={`mb-3 ${isSpeaking ? 'text-rose-500 animate-bounce' : 'text-slate-800'}`} size={38} />
                  <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest leading-none">Voice Pulse</p>
               </div>
               <div className="bg-slate-950/30 rounded-[5rem] border border-white/5 p-8 flex flex-col justify-center items-center group hover:bg-indigo-500/5 transition-all">
                  <BrainCircuit className={`mb-3 ${isTyping ? 'text-indigo-400 animate-pulse' : 'text-slate-800'}`} size={38} />
                  <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest leading-none">Neural Link</p>
               </div>
            </div>
          </div>

          {/* CHAT HUB */}
          <div className="flex-1 min-w-[440px] bg-slate-950/80 rounded-[7.5rem] border border-white/5 flex flex-col shadow-2xl overflow-hidden backdrop-blur-4xl relative">
            
            {/* 🔝 UP BUTTON (New) */}
            <button onClick={scrollToTop} className="absolute top-[120px] right-6 z-50 p-3 bg-white/5 hover:bg-indigo-600 rounded-full border border-white/10 text-white transition-all">
              <ChevronUp size={20} />
            </button>

            <div className="p-12 border-b border-white/10 flex items-center justify-between">
               <div className="flex items-center gap-4 text-indigo-400 font-black italic text-sm tracking-widest leading-none">
                  <Eye size={22} /> MULTIVERSE HUB v25
               </div>
               <div className="flex items-center gap-4">
                 {isSpeaking && <VolumeX size={22} className="text-rose-500 cursor-pointer animate-pulse" onClick={() => window.speechSynthesis.cancel()} />}
                 <Volume2 size={24} className={isSpeaking ? "text-rose-500" : "text-slate-800"} />
               </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-12 space-y-12 scrollbar-hide relative pt-20">
              <AnimatePresence>
                {messages.map((m) => (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col ${m.role === 'ai' ? 'items-start' : 'items-end'}`}>
                    {m.image && <img src={m.image} alt="scan" className="max-w-[200px] rounded-[3rem] mb-6 border-2 border-white/10" />}
                    <div className={`max-w-[95%] p-10 rounded-[4.5rem] text-[15.5px] leading-relaxed shadow-3xl ${m.role === 'ai' ? 'bg-slate-900/98 text-slate-100 border border-white/5 rounded-tl-none shadow-black' : 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-600/30'}`}>
                      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{m.text}</ReactMarkdown>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* 🔽 DOWN BUTTON (New) */}
            <button onClick={scrollToBottom} className="absolute bottom-[160px] right-6 z-50 p-3 bg-white/5 hover:bg-indigo-600 rounded-full border border-white/10 text-white transition-all">
              <ChevronDown size={20} />
            </button>

            {/* INPUT HUB */}
            <div className="p-12 pt-4 relative z-[60]">
              <div className="flex items-center gap-3 bg-slate-900/90 border border-white/10 p-3 rounded-[6rem] shadow-inner focus-within:border-indigo-500/50 transition-all">
                <input type="file" id="file" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if(file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setSelectedImage(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }} />
                <button onClick={() => document.getElementById('file')?.click()} className="p-6 text-slate-600 hover:text-indigo-400"><ImageIcon size={24}/></button>
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask Multiverse..." className="flex-1 bg-transparent border-none py-6 px-4 text-sm text-white focus:outline-none placeholder:text-slate-800 font-medium" />
                <button onClick={handleSend} className="p-8 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-500 active:scale-95 transition-all"><Send size={28}/></button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active = false, onClick }: any) {
  return (
    <button onClick={onClick} className={`flex items-center gap-6 p-6 w-full rounded-[4.5rem] border transition-all ${active ? 'bg-indigo-600 text-white border-indigo-400 shadow-xl shadow-indigo-500/20' : 'text-slate-600 border-transparent hover:bg-white/5 hover:text-slate-200'}`}>
      {icon} <span className="text-xs font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}
