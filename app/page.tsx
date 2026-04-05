"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Box, Cylinder, MeshDistortMaterial, Stars, Grid, PresentationControls, ContactShadows, Points, PointMaterial } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Zap, BrainCircuit, FolderRoot, Trash2, X, Activity, 
  Box as BoxIcon, Binary, Volume2, Eye, Heart, Cpu, Image as ImageIcon, 
  Settings2, FlaskConical, History, Sparkles, SlidersHorizontal, VolumeX, Terminal
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import 'katex/dist/katex.min.css';

// --- 🌌 AR LASER & LOGIC MAP COMPONENT ---
function NeuralLogicBackground({ active }: { active: boolean }) {
  const points = useMemo(() => {
    const p = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      p[i * 3] = (Math.random() - 0.5) * 10;
      p[i * 3 + 1] = (Math.random() - 0.5) * 10;
      p[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return p;
  }, []);

  const ref = useRef<any>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += active ? 0.05 : 0.002;
      ref.current.position.z = Math.sin(state.clock.getElapsedTime()) * 0.5;
    }
  });

  return (
    <Points ref={ref} positions={points} stride={3}>
      <PointMaterial transparent color={active ? "#f43f5e" : "#6366f1"} size={0.05} sizeAttenuation={true} depthWrite={false} opacity={0.4} />
    </Points>
  );
}

// --- 📐 ARCHITECT CORE (Laser + Thermal) ---
function ArchitectCore({ isThinking, shapeType, labValue }: { isThinking: boolean, shapeType: string, labValue: number }) {
  const meshRef = useRef<any>(null);
  const laserRef = useRef<any>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const pulse = isThinking ? 1.1 + Math.sin(state.clock.getElapsedTime() * 10) * 0.05 : 1;
      meshRef.current.scale.setScalar(pulse * (labValue / 50));
      meshRef.current.rotation.y += 0.01;
    }
    if (laserRef.current) {
      laserRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 4) * 2;
    }
  });

  return (
    <Float speed={5} rotationIntensity={1} floatIntensity={2}>
      <group>
        {isThinking && (
          <mesh ref={laserRef} position={[0, 0, 1.5]}>
            <boxGeometry args={[4, 0.05, 0.1]} />
            <meshBasicMaterial color="#f43f5e" transparent opacity={0.8} />
          </mesh>
        )}
        <mesh ref={meshRef}>
          {shapeType === 'cylinder' ? <cylinderGeometry args={[1, 1, 2.5, 32]} /> : 
           shapeType === 'box' ? <boxGeometry args={[1.7, 1.7, 1.7]} /> : 
           <sphereGeometry args={[1.4, 64, 64]} />}
          
          <MeshDistortMaterial 
            color={isThinking ? "#f43f5e" : (labValue > 75 ? "#ef4444" : "#6366f1")} 
            speed={isThinking ? 12 : 2} 
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

export default function GyanAIV18() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [currentShape, setCurrentShape] = useState("sphere");
  const [labValue, setLabValue] = useState(50);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const API_URL = "https://scott-zoloft-seriously-appear.trycloudflare.com/ask";

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    const saved = localStorage.getItem('gyanai_v18_mantu');
    if (saved) setMessages(JSON.parse(saved));
    else setMessages([{ id: 1, role: 'ai', text: 'Namaste Mantu! v18.0 Architect Hub Active. Main images scan karne aur bol kar samjhne ke liye taiyar hoon.' }]);
  }, []);

  useEffect(() => {
    localStorage.setItem('gyanai_v18_mantu', JSON.stringify(messages));
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    
    const lastMsg = messages[messages.length - 1]?.text.toLowerCase() || "";
    if (lastMsg.includes("cylinder")) setCurrentShape("cylinder");
    else if (lastMsg.includes("box") || lastMsg.includes("cube")) setCurrentShape("box");
    else if (lastMsg.includes("sphere")) setCurrentShape("sphere");
  }, [messages]);

  const speak = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const cleanText = text.replace(/[*#_\[\]\(\)$]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
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
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: "❌ Connection Failure." }]);
    } finally { setIsTyping(false); }
  };

  return (
    <div className="min-h-screen bg-[#010205] text-slate-300 flex flex-col lg:flex-row overflow-hidden font-sans">
      
      {/* --- 📂 SMART WORKSPACE SIDEBAR --- */}
      <nav className="hidden lg:flex w-80 flex-col bg-black/90 backdrop-blur-3xl border-r border-white/5 p-8 z-20">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-500/20">
            <BrainCircuit className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white italic tracking-tighter">GyanAI <span className="text-[10px] text-rose-500 block not-italic font-mono">ARCHITECT v18</span></h1>
        </div>
        
        <div className="space-y-2 flex-1 overflow-y-auto scrollbar-hide">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">Workspace</p>
          <SidebarItem icon={<FolderRoot size={16}/>} label="Project Hub" active />
          <SidebarItem icon={<Terminal size={16}/>} label="Neural Logic" />
          <SidebarItem icon={<History size={16}/>} label="Study Memory" />
          
          <div className="mt-10 p-6 bg-slate-900/50 rounded-[3rem] border border-white/5">
             <div className="flex items-center justify-between mb-4 text-rose-500 font-black">
                <span className="text-[10px] uppercase">Thermal Load</span>
                <Activity size={14} />
             </div>
             <input type="range" min="0" max="100" value={labValue} onChange={(e) => setLabValue(parseInt(e.target.value))} className="w-full accent-rose-500 bg-slate-800 rounded-lg h-1.5" />
             <p className="text-[9px] text-slate-500 mt-2 text-center uppercase tracking-widest">Heat: {labValue}°C</p>
          </div>
        </div>

        <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="mt-6 flex items-center gap-4 p-4 text-slate-700 hover:text-red-500 transition-all rounded-2xl">
          <Trash2 size={16} /> <span className="text-[10px] font-black uppercase">Deep Format</span>
        </button>
      </nav>

      {/* --- 🖥️ CORE ARCHITECT UI --- */}
      <main className="flex-1 flex flex-col p-4 md:p-6 gap-6 relative overflow-hidden">
        <div className="flex flex-col xl:flex-row gap-6 h-full max-h-[94vh] z-10">
          
          <div className="flex-[2.6] flex flex-col gap-6">
            {/* HOLOGRAPHIC SCAN VIEWER */}
            <div className="relative aspect-video lg:h-[460px] bg-black rounded-[5.5rem] border border-white/10 overflow-hidden shadow-2xl">
              <Canvas camera={{ position: [0, 2, 8], fov: 40 }}>
                 <ambientLight intensity={0.5} />
                 <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
                 <NeuralLogicBackground active={isTyping} />
                 <Grid infiniteGrid fadeDistance={50} fadeStrength={5} sectionSize={3} sectionColor="#4338ca" cellColor="#1e1b4b" />
                 <PresentationControls global config={{ mass: 2, tension: 500 }} snap={{ mass: 4, tension: 1500 }}>
                    <ArchitectCore isThinking={isTyping} shapeType={currentShape} labValue={labValue} />
                 </PresentationControls>
                 <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2} far={4.5} />
              </Canvas>
              
              <div className="absolute top-12 left-12 flex items-center gap-3 bg-black/40 backdrop-blur-xl px-5 py-2 rounded-full border border-white/5">
                 <div className={`w-2 h-2 rounded-full ${isTyping ? 'bg-rose-500 animate-ping' : 'bg-teal-500'}`} />
                 <p className="text-[10px] font-black text-white uppercase tracking-[0.4em] italic">Architect Scan: {isTyping ? 'Scanning' : 'Ready'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 flex-1">
               <div className="bg-slate-950/20 rounded-[4rem] border border-white/5 p-8 flex flex-col justify-center items-center group hover:bg-rose-500/5 transition-all">
                  <Heart className={`mb-3 ${isTyping ? 'text-rose-500 animate-bounce' : 'text-slate-800'}`} size={32} />
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Neural Pulse</p>
               </div>
               <div className="bg-slate-950/20 rounded-[4rem] border border-white/5 p-8 flex flex-col justify-center items-center group hover:bg-indigo-500/5">
                  <SlidersHorizontal className="text-slate-800 mb-3 group-hover:text-indigo-500" size={32} />
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Logic Control</p>
               </div>
            </div>
          </div>

          {/* CHAT HUB - WITH LOGIC MAP BACKDROP */}
          <div className="flex-1 min-w-[420px] bg-slate-950/70 rounded-[6rem] border border-white/5 flex flex-col shadow-2xl overflow-hidden backdrop-blur-4xl relative">
            <div className="p-10 border-b border-white/10 flex items-center justify-between bg-white/5">
               <div className="flex items-center gap-3 text-rose-500 font-black italic">
                  <Eye size={20} />
                  <span className="text-[11px] uppercase tracking-[0.4em]">Neural Architect Interface</span>
               </div>
               <div className="flex items-center gap-2">
                 {isSpeaking && <VolumeX size={18} className="text-rose-500 animate-pulse cursor-pointer" onClick={() => window.speechSynthesis.cancel()} />}
                 <Volume2 size={20} className={isSpeaking ? "text-indigo-500" : "text-slate-800"} />
               </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-12 scrollbar-hide">
              <AnimatePresence>
                {messages.map((m) => (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col ${m.role === 'ai' ? 'items-start' : 'items-end'}`}>
                    {m.image && <img src={m.image} alt="scan" className="max-w-[240px] rounded-[3.5rem] mb-6 border-4 border-white/5 shadow-2xl" />}
                    <div className={`max-w-[95%] p-8 rounded-[3.5rem] text-[15px] leading-relaxed tracking-tight shadow-2xl ${m.role === 'ai' ? 'bg-slate-900/90 text-slate-100 border border-white/5 rounded-tl-none' : 'bg-rose-600 text-white rounded-tr-none'}`}>
                      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{m.text}</ReactMarkdown>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isTyping && (
                <div className="flex items-center gap-3 ml-8 text-rose-500">
                   <div className="flex gap-1 animate-pulse"><div className="w-1.5 h-1.5 bg-rose-500 rounded-full" /></div>
                   <span className="text-[10px] font-black uppercase tracking-[0.6em] italic">Building Logic Map...</span>
                </div>
              )}
            </div>

            {/* INPUT BOX */}
            <div className="p-10 pt-4">
              <div className="flex items-center gap-2 bg-slate-900/80 border border-white/10 p-2 rounded-[4.5rem] shadow-inner focus-within:border-rose-500/40 transition-all">
                <input type="file" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if(file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setSelectedImage(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }} className="hidden" id="fileIn" />
                <button onClick={() => document.getElementById('fileIn')?.click()} className="p-5 text-slate-500 hover:text-rose-400"><ImageIcon size={22}/></button>
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Issue architectural command..." className="flex-1 bg-transparent border-none py-5 px-6 text-sm text-white focus:outline-none placeholder:text-slate-800 font-medium" />
                <button onClick={handleSend} className="p-6 bg-rose-600 text-white rounded-full shadow-2xl hover:bg-rose-500 active:scale-90 transition-all"><Send size={24}/></button>
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
    <div className={`flex items-center gap-5 p-5 rounded-[2.8rem] cursor-pointer transition-all border ${active ? 'bg-rose-600/15 text-rose-400 border-rose-500/20 shadow-inner' : 'text-slate-700 hover:bg-slate-900/50 hover:text-slate-300 border-transparent'}`}>
      {icon} <span className="text-[11px] font-black uppercase tracking-widest leading-none">{label}</span>
    </div>
  );
}
