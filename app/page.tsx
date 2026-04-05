"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Stars, Grid, OrbitControls, ContactShadows, MeshDistortMaterial, Points, PointMaterial } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Zap, BrainCircuit, Trash2, X, Activity, 
  Binary, Volume2, Eye, Heart, Cpu, Image as ImageIcon, 
  FlaskConical, History, Sparkles, Menu, Home, 
  GraduationCap, Dna, BarChart3, Globe, Atom, Satellite, Mic, VolumeX, Scan
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import 'katex/dist/katex.min.css';

// --- 🌌 SPACE-TIME WARP GRID ---
function WarpGrid({ isWarped }: { isWarped: boolean }) {
  return (
    <Grid 
      infiniteGrid 
      fadeDistance={50} 
      fadeStrength={5} 
      sectionSize={3} 
      sectionColor={isWarped ? "#f43f5e" : "#4338ca"} 
      cellColor={isWarped ? "#9f1239" : "#1e1b4b"} 
      position={[0, isWarped ? -1.2 : 0, 0]}
    />
  );
}

// --- ⚛️ ATOMIC/DNA/CORE HYBRID ENGINE ---
function NeuralCore({ isThinking, shapeType, isSpeaking, isWarped }: { isThinking: boolean, shapeType: string, isSpeaking: boolean, isWarped: boolean }) {
  const meshRef = useRef<any>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.rotation.y += 0.01;
      const pulse = isSpeaking ? 1.2 + Math.sin(time * 12) * 0.08 : 1;
      meshRef.current.scale.setScalar(pulse);
      if (isWarped) meshRef.current.position.y = Math.sin(time * 2) * 0.2 - 0.5;
    }
  });

  // DNA Render Logic
  if (shapeType === 'dna') {
    return (
      <group rotation={[0, 0, Math.PI / 4]}>
        {[...Array(40)].map((_, i) => (
          <mesh key={i} position={[Math.cos(i * 0.5) * 1.2, (i / 5) - 4, Math.sin(i * 0.5) * 1.2]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color={i % 2 === 0 ? "#f43f5e" : "#6366f1"} emissive={i % 2 === 0 ? "#9f1239" : "#1e1b4b"} emissiveIntensity={0.5} />
          </mesh>
        ))}
      </group>
    );
  }

  // Atomic/Molecular Logic
  if (shapeType === 'atom') {
    return (
      <group>
        <Sphere args={[0.8, 32, 32]}><meshStandardMaterial color="#ef4444" emissive="#7f1d1d" emissiveIntensity={0.5} /></Sphere>
        <mesh position={[1.2, 0.8, 0]}><sphereGeometry args={[0.4, 32, 32]} /><meshStandardMaterial color="#ffffff" /></mesh>
        <mesh position={[-1.2, 0.8, 0]}><sphereGeometry args={[0.4, 32, 32]} /><meshStandardMaterial color="#ffffff" /></mesh>
      </group>
    );
  }

  return (
    <Float speed={isWarped ? 1 : 4}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <MeshDistortMaterial 
          color={isWarped ? "#1e1b4b" : (isSpeaking ? "#ec4899" : "#6366f1")} 
          speed={isThinking ? 12 : 2} 
          distort={isWarped ? 0.6 : 0.4} 
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </Float>
  );
}

export default function GyanAIV24() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [currentShape, setCurrentShape] = useState("sphere");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isWarped, setIsWarped] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const API_URL = "https://scott-zoloft-seriously-appear.trycloudflare.com/ask";

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    const saved = localStorage.getItem('gyanai_v24_final');
    if (saved) setMessages(JSON.parse(saved));
    else setMessages([{ id: 1, role: 'ai', text: 'Namaste Mantu! Einstein Engine v24.0 Active. Main Physics warp karne aur Biology simulate karne ke liye taiyar hoon.' }]);
  }, []);

  useEffect(() => {
    localStorage.setItem('gyanai_v24_final', JSON.stringify(messages));
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    
    const lastMsg = messages[messages.length - 1]?.text.toLowerCase() || "";
    if (lastMsg.includes("gravity") || lastMsg.includes("warp")) setIsWarped(true); else setIsWarped(false);
    if (lastMsg.includes("dna") || lastMsg.includes("biology")) setCurrentShape("dna");
    else if (lastMsg.includes("atom") || lastMsg.includes("chemistry")) setCurrentShape("atom");
    else setCurrentShape("sphere");
  }, [messages]);

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
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: "❌ Connection Lost." }]);
    } finally { setIsTyping(false); }
  };

  return (
    <div className="min-h-screen bg-[#010204] text-slate-300 flex flex-col overflow-hidden relative font-sans">
      
      {/* ☰ HAMBURGER */}
      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="absolute top-8 left-8 z-[100] p-5 bg-indigo-600/30 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl">
        {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* 📟 IQ RADAR SIDEBAR */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.nav initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="fixed top-0 left-0 h-full w-85 bg-slate-950/98 backdrop-blur-3xl z-[90] p-10 pt-36 border-r border-white/5 flex flex-col gap-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-indigo-600 rounded-[2.2rem] shadow-xl shadow-indigo-500/40"><Cpu className="text-white" size={26}/></div>
              <h1 className="text-2xl font-black italic text-white tracking-tighter leading-none">GyanAI <span className="text-[9px] block text-indigo-400 not-italic font-mono mt-1">EINSTEIN v24</span></h1>
            </div>
            
            <div className="flex-1 space-y-4 overflow-y-auto scrollbar-hide">
              <SidebarItem icon={<Home size={18}/>} label="Neural Hub" active />
              <SidebarItem icon={<BarChart3 size={18}/>} label="IQ Performance" />
              <div className="mt-8 p-6 bg-slate-900/40 rounded-[3rem] border border-white/5 space-y-4">
                <StatBar label="Physics" val={75} color="bg-rose-500" />
                <StatBar label="Mathematics" val={90} color="bg-indigo-500" />
                <StatBar label="Logic" val={85} color="bg-teal-500" />
              </div>
            </div>
            <button onClick={() => {localStorage.clear(); window.location.reload();}} className="p-6 text-red-500 hover:bg-red-500/10 rounded-[3rem] text-xs font-black uppercase tracking-widest flex items-center gap-4 transition-all"><Trash2 size={18}/> Reset</button>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* 🖥️ MAIN WORKSPACE */}
      <main className={`flex-1 flex flex-col p-4 md:p-10 gap-8 transition-all duration-700 ${isSidebarOpen ? 'blur-3xl scale-95 opacity-30' : ''}`}>
        <div className="flex flex-col xl:flex-row gap-8 h-full max-h-[92vh] z-10">
          
          <div className="flex-[2.8] flex flex-col gap-8">
            {/* 🌌 WARP VIEWER */}
            <div className="relative aspect-video lg:h-[480px] bg-black rounded-[7rem] border border-white/10 overflow-hidden shadow-3xl">
              <Canvas camera={{ position: [0, 2, 8], fov: 40 }}>
                 <ambientLight intensity={0.5} />
                 <Stars radius={100} depth={50} count={2500} factor={4} fade speed={1} />
                 <WarpGrid isWarped={isWarped} />
                 <OrbitControls enablePan={false} />
                 <NeuralCore isThinking={isTyping} shapeType={currentShape} isSpeaking={isSpeaking} isWarped={isWarped} />
                 <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4.5} />
              </Canvas>
              
              <div className="absolute top-12 left-12 flex items-center gap-4 bg-black/40 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10">
                 <div className={`w-3 h-3 rounded-full ${isSpeaking ? 'bg-rose-500 animate-pulse' : (isTyping ? 'bg-amber-500 animate-spin' : 'bg-teal-500')}`} />
                 <p className="text-[10px] font-black text-white uppercase tracking-[0.4em] italic leading-none">Hub Status: {isWarped ? 'Warped' : 'Stable'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 flex-1">
               <div className="bg-slate-950/30 rounded-[5rem] border border-white/5 p-8 flex flex-col justify-center items-center">
                  <Mic className={`mb-3 ${isSpeaking ? 'text-rose-500 animate-bounce' : 'text-slate-800'}`} size={38} />
                  <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest leading-none">Talk-Back 3.0</p>
               </div>
               <div className="bg-slate-950/30 rounded-[5rem] border border-white/5 p-8 flex flex-col justify-center items-center">
                  <Heart className={`mb-3 ${isSpeaking ? 'text-rose-500 animate-ping' : 'text-slate-800'}`} size={38} />
                  <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest leading-none text-center">Neural Pulse</p>
               </div>
            </div>
          </div>

          {/* CHAT HUB */}
          <div className="flex-1 min-w-[440px] bg-slate-950/80 rounded-[7.5rem] border border-white/5 flex flex-col shadow-2xl overflow-hidden backdrop-blur-4xl relative">
            <div className="p-12 border-b border-white/10 flex items-center justify-between">
               <div className="flex items-center gap-4 text-indigo-400 font-black italic text-sm tracking-widest">
                  <Eye size={22} /> EINSTEIN EYE v24
               </div>
               <div className="flex items-center gap-4">
                 {isSpeaking && <VolumeX size={22} className="text-rose-500 cursor-pointer animate-pulse" onClick={() => window.speechSynthesis.cancel()} />}
                 <Volume2 size={24} className={isSpeaking ? "text-rose-500" : "text-slate-800"} />
               </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-12 space-y-12 scrollbar-hide">
              <AnimatePresence>
                {messages.map((m) => (
                  <motion.div key={m.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`flex flex-col ${m.role === 'ai' ? 'items-start' : 'items-end'}`}>
                    {m.image && <img src={m.image} alt="scan" className="max-w-[260px] rounded-[3.5rem] mb-8 border-4 border-white/10" />}
                    <div className={`max-w-[95%] p-10 rounded-[4.5rem] text-[15.5px] leading-relaxed shadow-3xl ${m.role === 'ai' ? 'bg-slate-900/98 text-slate-100 border border-white/5 rounded-tl-none shadow-black' : 'bg-indigo-600 text-white rounded-tr-none'}`}>
                      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{m.text}</ReactMarkdown>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* INPUT HUB */}
            <div className="p-12 pt-4">
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
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask Oracle..." className="flex-1 bg-transparent border-none py-6 px-4 text-sm text-white focus:outline-none placeholder:text-slate-800 font-medium" />
                <button onClick={handleSend} className="p-8 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-500 active:scale-95 transition-all"><Send size={28}/></button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarButton({ icon, label, active = false }: any) {
  return (
    <button className={`flex items-center gap-6 p-6 w-full rounded-[4rem] border transition-all ${active ? 'bg-indigo-600 text-white border-indigo-400 shadow-xl' : 'text-slate-600 border-transparent hover:bg-white/5 hover:text-slate-200'}`}>
      {icon} <span className="text-xs font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}

function StatBar({ label, val, color }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-500"><span>{label}</span><span>{val}%</span></div>
      <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${val}%` }} className={`h-full ${color}`} />
      </div>
    </div>
  );
}
