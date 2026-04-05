"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Box, Cylinder, MeshDistortMaterial, Stars, Grid, OrbitControls, ContactShadows, Points, PointMaterial } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Zap, BrainCircuit, Trash2, X, Activity, 
  Box as BoxIcon, Binary, Volume2, Eye, Heart, Cpu, Image as ImageIcon, 
  FlaskConical, History, Sparkles, Menu, Home, Pin, 
  GraduationCap, Dna, BarChart3, VolumeX, Terminal, CheckCircle2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import 'katex/dist/katex.min.css';

// --- 🧬 DNA HELIX GEOMETRY COMPONENT ---
function DNAHelix({ isThinking }: { isThinking: boolean }) {
  const points = useMemo(() => {
    const p = [];
    for (let i = 0; i < 50; i++) {
      const y = (i / 5) - 5;
      const angle = i * 0.5;
      p.push([Math.cos(angle) * 1.5, y, Math.sin(angle) * 1.5]);
      p.push([Math.cos(angle + Math.PI) * 1.5, y, Math.sin(angle + Math.PI) * 1.5]);
    }
    return p;
  }, []);

  const ref = useRef<any>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += isThinking ? 0.05 : 0.01;
    }
  });

  return (
    <group ref={ref}>
      {points.map((pos, i) => (
        <mesh key={i} position={[pos[0], pos[1], pos[2]]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#f43f5e" : "#6366f1"} emissive={i % 2 === 0 ? "#9f1239" : "#1e1b4b"} emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

// --- 📐 NEURAL CORE (The Master Viewer) ---
function NeuralCore({ isThinking, shapeType, isSpeaking }: { isThinking: boolean, shapeType: string, isSpeaking: boolean }) {
  const meshRef = useRef<any>(null);
  useFrame((state) => {
    if (meshRef.current) {
      const pulse = isSpeaking ? 1.1 + Math.sin(state.clock.getElapsedTime() * 10) * 0.05 : 1;
      meshRef.current.scale.setScalar(pulse);
      meshRef.current.rotation.y += 0.01;
    }
  });

  if (shapeType === 'dna') return <DNAHelix isThinking={isThinking} />;

  return (
    <Float speed={4}>
      <mesh ref={meshRef}>
        {shapeType === 'cylinder' ? <cylinderGeometry args={[1, 1, 2.5, 32]} /> : 
         shapeType === 'box' ? <boxGeometry args={[1.7, 1.7, 1.7]} /> : 
         <sphereGeometry args={[1.5, 64, 64]} />}
        <MeshDistortMaterial 
          color={isSpeaking ? "#ec4899" : (isThinking ? "#f59e0b" : "#6366f1")} 
          speed={isThinking ? 12 : 2} 
          distort={0.4} 
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </Float>
  );
}

export default function GyanAIV22() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [quizMode, setQuizMode] = useState(false);
  const [currentShape, setCurrentShape] = useState("sphere");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const API_URL = "https://scott-zoloft-seriously-appear.trycloudflare.com/ask";

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    const saved = localStorage.getItem('gyanai_v22');
    if (saved) setMessages(JSON.parse(saved));
    else setMessages([{ id: 1, role: 'ai', text: 'Namaste Mantu! v22.0 Teacher Mode active. Aaj kuch naya seekhein ya Quiz dein?' }]);
  }, []);

  useEffect(() => {
    localStorage.setItem('gyanai_v22', JSON.stringify(messages));
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    
    const lastMsg = messages[messages.length - 1]?.text.toLowerCase() || "";
    if (lastMsg.includes("dna") || lastMsg.includes("biology")) setCurrentShape("dna");
    else if (lastMsg.includes("cylinder")) setCurrentShape("cylinder");
    else if (lastMsg.includes("box")) setCurrentShape("box");
    else setCurrentShape("sphere");
  }, [messages]);

  const speak = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[*#_\[\]\(\)$]/g, ''));
    // Hinglish optimization
    utterance.lang = 'hi-IN';
    utterance.rate = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    synthRef.current.speak(utterance);
  };

  const handleSend = async (customInput?: string) => {
    const textToSend = customInput || input;
    if (!textToSend.trim() && !selectedImage) return;

    const userMsg = { id: Date.now(), role: 'user', text: textToSend, image: selectedImage };
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
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: "Server Offline." }]);
    } finally { setIsTyping(false); }
  };

  return (
    <div className="min-h-screen bg-[#010204] text-slate-300 flex flex-col overflow-hidden relative">
      
      {/* ☰ MENU */}
      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="absolute top-8 left-8 z-[100] p-5 bg-indigo-600/20 backdrop-blur-3xl border border-white/10 rounded-[2rem]">
        {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* 📟 SIDEBAR (The Teacher's Desk) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.nav initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="fixed top-0 left-0 h-full w-80 bg-slate-950/95 backdrop-blur-3xl z-[90] p-10 pt-36 border-r border-white/5 flex flex-col gap-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-indigo-600 rounded-2xl"><GraduationCap className="text-white" size={24}/></div>
              <h1 className="text-2xl font-black italic text-white tracking-tighter">GyanAI</h1>
            </div>
            
            <SidebarItem icon={<Home size={18}/>} label="Workstation" active onClick={() => setIsSidebarOpen(false)} />
            <SidebarItem icon={<Dna size={18}/>} label="Biology Lab" onClick={() => {setCurrentShape('dna'); setIsSidebarOpen(false);}} />
            <SidebarItem icon={<CheckCircle2 size={18}/>} label="Start Quiz" onClick={() => {setQuizMode(true); handleSend("Mantu ka Viva shuru karo, mujhse Physics ka sawal pucho!"); setIsSidebarOpen(false);}} />
            
            <div className="mt-8 border-t border-white/5 pt-6">
               <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4 flex items-center gap-2"><BarChart3 size={12}/> Weekly Heatmap</p>
               <div className="grid grid-cols-7 gap-1">
                 {[...Array(21)].map((_, i) => (
                   <div key={i} className={`h-3 w-3 rounded-sm ${i > 15 ? 'bg-indigo-500' : 'bg-slate-800'}`} />
                 ))}
               </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* 🖥️ MAIN INTERFACE */}
      <main className={`flex-1 flex flex-col p-4 md:p-10 gap-8 transition-all duration-700 ${isSidebarOpen ? 'blur-3xl scale-90' : ''}`}>
        <div className="flex flex-col xl:flex-row gap-8 h-full max-h-[92vh] z-10">
          
          <div className="flex-[2.8] flex flex-col gap-8">
            {/* 3D TEACHER VIEWER */}
            <div className="relative aspect-video lg:h-[480px] bg-black rounded-[6rem] border border-white/10 overflow-hidden shadow-2xl shadow-indigo-500/10">
              <Canvas camera={{ position: [0, 2, 8], fov: 40 }}>
                 <ambientLight intensity={0.5} />
                 <Stars radius={100} depth={50} count={2000} factor={4} fade speed={1} />
                 <Grid infiniteGrid fadeDistance={50} fadeStrength={5} sectionSize={3} sectionColor="#4338ca" cellColor="#1e1b4b" />
                 <OrbitControls enablePan={false} />
                 <NeuralCore isThinking={isTyping} shapeType={currentShape} isSpeaking={isSpeaking} />
                 <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4.5} />
              </Canvas>
              
              <div className="absolute top-12 left-12 flex items-center gap-3 bg-black/40 backdrop-blur-xl px-6 py-2.5 rounded-full border border-white/5">
                 <div className={`w-2.5 h-2.5 rounded-full ${isSpeaking ? 'bg-pink-500 animate-pulse' : 'bg-teal-500 shadow-[0_0_10px_#14b8a6]'}`} />
                 <p className="text-[10px] font-black text-white uppercase tracking-[0.4em] italic">Mode: {currentShape.toUpperCase()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 flex-1">
               <div className="bg-slate-950/20 rounded-[4.5rem] border border-white/5 p-8 flex flex-col justify-center items-center">
                  <Activity className={`mb-3 ${isSpeaking ? 'text-pink-500' : 'text-slate-800'}`} size={38} />
                  <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Voice Sync 2.0</p>
               </div>
               <div className="bg-slate-950/20 rounded-[4.5rem] border border-white/5 p-8 flex flex-col justify-center items-center">
                  <BrainCircuit className={`mb-3 ${isTyping ? 'text-indigo-400 animate-pulse' : 'text-slate-800'}`} size={38} />
                  <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Neural Logic</p>
               </div>
            </div>
          </div>

          {/* CHAT HUB */}
          <div className="flex-1 min-w-[440px] bg-slate-950/80 rounded-[6.5rem] border border-white/5 flex flex-col shadow-2xl overflow-hidden backdrop-blur-4xl relative">
            <div className="p-12 border-b border-white/10 flex items-center justify-between">
               <div className="flex items-center gap-4 text-indigo-400 font-black italic text-sm tracking-widest">
                  <Eye size={20} /> NEURAL EYE v22
               </div>
               <div className="flex items-center gap-4">
                 {isSpeaking && <VolumeX size={20} className="text-pink-500 cursor-pointer" onClick={() => window.speechSynthesis.cancel()} />}
                 <Volume2 size={24} className={isSpeaking ? "text-indigo-500" : "text-slate-800"} />
               </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-12 space-y-12 scrollbar-hide">
              <AnimatePresence>
                {messages.map((m) => (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col ${m.role === 'ai' ? 'items-start' : 'items-end'}`}>
                    <div className={`max-w-[95%] p-10 rounded-[4rem] text-[15.5px] leading-relaxed tracking-tight ${m.role === 'ai' ? 'bg-slate-900 text-slate-100 border border-white/5 rounded-tl-none' : 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-600/30'}`}>
                      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{m.text}</ReactMarkdown>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* INPUT HUB */}
            <div className="p-12 pt-4">
              <div className="flex items-center gap-3 bg-slate-900/90 border border-white/10 p-3 rounded-[5rem] shadow-inner focus-within:border-indigo-500/50 transition-all">
                <input type="file" id="file" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if(file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setSelectedImage(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }} />
                <button onClick={() => document.getElementById('file')?.click()} className="p-6 text-slate-600 hover:text-indigo-400"><ImageIcon size={26}/></button>
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask Professor Mantu..." className="flex-1 bg-transparent border-none py-6 px-4 text-sm text-white focus:outline-none" />
                <button onClick={() => handleSend()} className="p-8 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-500 transition-all active:scale-95"><Send size={28}/></button>
              </div>
              {selectedImage && <div className="mt-4"><img src={selectedImage} className="w-16 h-16 rounded-2xl border-2 border-indigo-500 object-cover" /></div>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active = false, onClick }: any) {
  return (
    <button onClick={onClick} className={`flex items-center gap-6 p-6 w-full rounded-[3.5rem] border transition-all ${active ? 'bg-indigo-600 text-white border-indigo-400 shadow-xl' : 'text-slate-600 border-transparent hover:bg-white/5 hover:text-slate-200'}`}>
      {icon} <span className="text-xs font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}
