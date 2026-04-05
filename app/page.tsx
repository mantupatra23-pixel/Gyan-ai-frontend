"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Box, Cylinder, MeshDistortMaterial, Stars, Grid, PresentationControls, ContactShadows, Points, PointMaterial } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Zap, BrainCircuit, FolderRoot, Trash2, X, Activity, 
  Box as BoxIcon, Binary, Volume2, Eye, Heart, Cpu, Image as ImageIcon, 
  Settings2, FlaskConical, History, Sparkles, SlidersHorizontal, VolumeX, Menu, Home, BookOpen
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import 'katex/dist/katex.min.css';

// --- 🌌 NEURAL LOGIC BACKGROUND (Nodes) ---
function NeuralNodes({ active }: { active: boolean }) {
  const points = useMemo(() => {
    const p = new Float32Array(600 * 3);
    for (let i = 0; i < 600; i++) {
      p[i * 3] = (Math.random() - 0.5) * 12;
      p[i * 3 + 1] = (Math.random() - 0.5) * 12;
      p[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return p;
  }, []);

  const ref = useRef<any>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += active ? 0.04 : 0.001;
      ref.current.rotation.x += 0.0005;
    }
  });

  return (
    <Points ref={ref} positions={points} stride={3}>
      <PointMaterial transparent color={active ? "#f43f5e" : "#818cf8"} size={0.06} sizeAttenuation={true} depthWrite={false} opacity={0.5} />
    </Points>
  );
}

// --- 📐 ARCHITECT CORE ENGINE ---
function ArchitectCore({ isThinking, shapeType, labValue }: { isThinking: boolean, shapeType: string, labValue: number }) {
  const meshRef = useRef<any>(null);
  const laserRef = useRef<any>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const pulse = isThinking ? 1.1 + Math.sin(state.clock.getElapsedTime() * 12) * 0.06 : 1;
      meshRef.current.scale.setScalar(pulse * (labValue / 50));
      meshRef.current.rotation.y += 0.01;
    }
    if (laserRef.current) {
      laserRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 5) * 2.2;
    }
  });

  return (
    <Float speed={4} rotationIntensity={1} floatIntensity={2}>
      <group>
        {isThinking && (
          <mesh ref={laserRef} position={[0, 0, 1.8]}>
            <boxGeometry args={[4.5, 0.04, 0.04]} />
            <meshBasicMaterial color="#f43f5e" transparent opacity={0.9} />
          </mesh>
        )}
        <mesh ref={meshRef}>
          {shapeType === 'cylinder' ? <cylinderGeometry args={[1, 1, 2.5, 32]} /> : 
           shapeType === 'box' ? <boxGeometry args={[1.7, 1.7, 1.7]} /> : 
           <sphereGeometry args={[1.4, 64, 64]} />}
          
          <MeshDistortMaterial 
            color={isThinking ? "#f43f5e" : (labValue > 75 ? "#ef4444" : "#6366f1")} 
            speed={isThinking ? 15 : 2} 
            distort={0.4} 
            emissive={isThinking ? "#9f1239" : "#1e1b4b"}
            emissiveIntensity={0.8}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>
    </Float>
  );
}

export default function GyanAIV18_5() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [currentShape, setCurrentShape] = useState("sphere");
  const [labValue, setLabValue] = useState(50);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const API_URL = "https://scott-zoloft-seriously-appear.trycloudflare.com/ask";

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    const saved = localStorage.getItem('gyanai_v18_mantu');
    if (saved) setMessages(JSON.parse(saved));
    else setMessages([{ id: 1, role: 'ai', text: 'Namaste Mantu! v18.5 Architect Live. Sidebar menu se mere logic aur memory ko control karein.' }]);
  }, []);

  useEffect(() => {
    localStorage.setItem('gyanai_v18_mantu', JSON.stringify(messages));
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    
    const lastMsg = messages[messages.length - 1]?.text.toLowerCase() || "";
    if (lastMsg.includes("cylinder")) setCurrentShape("cylinder");
    else if (lastMsg.includes("box") || lastMsg.includes("cube")) setCurrentShape("box");
    else setCurrentShape("sphere");
  }, [messages]);

  const speak = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[*#_\[\]\(\)$]/g, ''));
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
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: "❌ Neural Bridge Offline." }]);
    } finally { setIsTyping(false); }
  };

  return (
    <div className="min-h-screen bg-[#010204] text-slate-300 flex flex-col overflow-hidden relative font-sans">
      
      {/* ☰ HAMBURGER TRIGGER */}
      <div className="absolute top-8 left-8 z-[100]">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-4 bg-indigo-600/20 backdrop-blur-2xl border border-white/10 rounded-[2rem] hover:bg-indigo-600/40 transition-all shadow-2xl"
        >
          {isSidebarOpen ? <X size={22} className="text-white"/> : <Menu size={22} className="text-white"/>}
        </button>
      </div>

      {/* 📟 SLIDE-IN SIDEBAR */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[80]" />
            <motion.nav initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25 }} className="fixed top-0 left-0 h-full w-80 bg-slate-950/90 border-r border-white/5 backdrop-blur-3xl z-[90] p-10 pt-32 flex flex-col gap-8 shadow-[50px_0_100px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-indigo-600 rounded-2xl"><BrainCircuit size={24} className="text-white"/></div>
                <h1 className="text-2xl font-black italic text-white tracking-tighter">GyanAI</h1>
              </div>
              <div className="flex-1 space-y-3">
                <SidebarItem icon={<Home size={18}/>} label="Neural Hub" active onClick={() => setIsSidebarOpen(false)} />
                <SidebarItem icon={<FlaskConical size={18}/>} label="Simulation Lab" onClick={() => setIsSidebarOpen(false)} />
                <SidebarItem icon={<BookOpen size={18}/>} label="Study Memory" onClick={() => setIsSidebarOpen(false)} />
                <SidebarItem icon={<Volume2 size={18}/>} label="Voice Config" onClick={() => setIsSidebarOpen(false)} />
                
                <div className="mt-10 p-6 bg-rose-600/5 rounded-[3rem] border border-rose-500/10">
                  <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-4">Thermal Control</p>
                  <input type="range" min="0" max="100" value={labValue} onChange={(e) => setLabValue(parseInt(e.target.value))} className="w-full accent-rose-500 h-1.5" />
                </div>
              </div>
              <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="flex items-center gap-4 p-5 text-slate-500 hover:text-red-500 transition-all">
                <Trash2 size={18} /> <span className="text-xs font-black uppercase tracking-widest">Wipe AI</span>
              </button>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* 🖥️ MAIN ARCHITECT HUB */}
      <main className={`flex-1 flex flex-col p-4 md:p-10 gap-8 transition-all duration-700 ${isSidebarOpen ? 'blur-2xl scale-90 translate-x-20 opacity-30' : ''}`}>
        <div className="flex flex-col xl:flex-row gap-8 h-full max-h-[92vh] z-10">
          
          <div className="flex-[2.8] flex flex-col gap-8">
            {/* HOLOGRAPHIC VIEWER */}
            <div className="relative aspect-video lg:h-[480px] bg-black rounded-[6rem] border border-white/10 overflow-hidden shadow-2xl">
              <Canvas camera={{ position: [0, 2, 8], fov: 40 }}>
                 <ambientLight intensity={0.5} />
                 <Stars radius={100} depth={50} count={2500} factor={4} saturation={0} fade speed={1} />
                 <NeuralNodes active={isTyping} />
                 <Grid infiniteGrid fadeDistance={50} fadeStrength={5} sectionSize={3} sectionColor="#4338ca" cellColor="#1e1b4b" />
                 <PresentationControls global config={{ mass: 2, tension: 500 }} snap={{ mass: 4, tension: 1500 }}>
                    <ArchitectCore isThinking={isTyping} shapeType={currentShape} labValue={labValue} />
                 </PresentationControls>
                 <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4.5} />
              </Canvas>
              
              <div className="absolute top-12 left-12 flex items-center gap-3 bg-black/40 backdrop-blur-xl px-6 py-2.5 rounded-full border border-white/5">
                 <div className={`w-2 h-2 rounded-full ${isTyping ? 'bg-rose-500 animate-ping' : 'bg-teal-500'}`} />
                 <p className="text-[10px] font-black text-white uppercase tracking-[0.5em] italic leading-none">Architect Scan Active</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 flex-1">
               <div className="bg-slate-950/20 rounded-[4.5rem] border border-white/5 p-8 flex flex-col justify-center items-center group hover:bg-rose-500/5 transition-all">
                  <Heart className={`mb-3 ${isTyping ? 'text-rose-500 animate-bounce' : 'text-slate-800'}`} size={36} />
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest leading-none">Pulse</p>
               </div>
               <div className="bg-slate-950/20 rounded-[4.5rem] border border-white/5 p-8 flex flex-col justify-center items-center group hover:bg-indigo-500/5 transition-all">
                  <SlidersHorizontal className="text-slate-800 mb-3 group-hover:text-indigo-500" size={36} />
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest leading-none">Lab Mod</p>
               </div>
            </div>
          </div>

          {/* CHAT COMMAND CENTER */}
          <div className="flex-1 min-w-[440px] bg-slate-950/80 rounded-[6.5rem] border border-white/5 flex flex-col shadow-2xl overflow-hidden backdrop-blur-4xl relative">
            <div className="p-12 border-b border-white/10 flex items-center justify-between">
               <div className="flex items-center gap-3 text-rose-500 font-black italic">
                  <Eye size={22} />
                  <span className="text-[12px] uppercase tracking-[0.4em] text-white">Neural Hub</span>
               </div>
               <div className="flex items-center gap-4">
                 {isSpeaking && <button onClick={() => window.speechSynthesis.cancel()} className="text-rose-500 animate-pulse font-black text-[9px] uppercase">Stop Voice</button>}
                 <Volume2 size={22} className={isSpeaking ? "text-indigo-500" : "text-slate-800"} />
               </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-12 space-y-12 scrollbar-hide">
              <AnimatePresence>
                {messages.map((m) => (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col ${m.role === 'ai' ? 'items-start' : 'items-end'}`}>
                    {m.image && <img src={m.image} alt="scan" className="max-w-[260px] rounded-[3.5rem] mb-8 border-4 border-white/10 shadow-3xl" />}
                    <div className={`max-w-[95%] p-10 rounded-[4rem] text-[15px] leading-relaxed shadow-3xl ${m.role === 'ai' ? 'bg-slate-900/90 text-slate-100 border border-white/5 rounded-tl-none shadow-black/80' : 'bg-indigo-600 text-white rounded-tr-none'}`}>
                      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{m.text}</ReactMarkdown>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isTyping && (
                <div className="flex items-center gap-4 ml-10 text-rose-500">
                   <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                   <span className="text-[10px] font-black uppercase tracking-[0.6em] italic">Building Logic...</span>
                </div>
              )}
            </div>

            {/* INPUT HUB */}
            <div className="p-12 pt-4">
              <div className="flex items-center gap-3 bg-slate-900/80 border border-white/10 p-3 rounded-[5rem] shadow-inner focus-within:border-rose-500/40 transition-all">
                <input type="file" id="fileIn" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if(file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setSelectedImage(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }} />
                <button onClick={() => document.getElementById('fileIn')?.click()} className="p-5 text-slate-600 hover:text-rose-400 transition-all"><ImageIcon size={24}/></button>
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Issue Lab Command..." className="flex-1 bg-transparent border-none py-6 px-4 text-sm text-white focus:outline-none placeholder:text-slate-800 font-medium" />
                <button onClick={handleSend} className="p-7 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-500 hover:scale-105 active:scale-95 transition-all"><Send size={26}/></button>
              </div>
              {selectedImage && <div className="mt-4 flex gap-4"><img src={selectedImage} className="w-16 h-16 rounded-3xl border-2 border-rose-500 object-cover" /><button onClick={() => setSelectedImage(null)} className="text-red-500 text-[10px] font-bold">Remove</button></div>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active = false, onClick }: any) {
  return (
    <button onClick={onClick} className={`flex items-center gap-6 p-6 w-full rounded-[3.5rem] border transition-all ${active ? 'bg-indigo-600 text-white border-indigo-400 shadow-[0_20px_40px_rgba(79,70,229,0.3)]' : 'text-slate-500 border-transparent hover:bg-white/5 hover:text-slate-200'}`}>
      {icon} <span className="text-xs font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}
