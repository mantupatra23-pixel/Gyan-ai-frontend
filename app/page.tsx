"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Box, Cylinder, MeshDistortMaterial, Stars, Grid, OrbitControls, ContactShadows, Points, PointMaterial } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Zap, BrainCircuit, Trash2, X, Activity, 
  Box as BoxIcon, Binary, Volume2, Eye, Heart, Cpu, Image as ImageIcon, 
  FlaskConical, History, Sparkles, SlidersHorizontal, VolumeX, Menu, Home, Pin, Waves
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import 'katex/dist/katex.min.css';

// --- 🌊 BIO-LUMINESCENT FLUID ENGINE ---
function FluidBackground({ active, speaking }: { active: boolean, speaking: boolean }) {
  const ref = useRef<any>(null);
  const points = useMemo(() => {
    const p = new Float32Array(1500 * 3);
    for (let i = 0; i < 1500; i++) {
      p[i * 3] = (Math.random() - 0.5) * 15;
      p[i * 3 + 1] = (Math.random() - 0.5) * 15;
      p[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return p;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += active ? 0.05 : 0.002;
      // Fluid wave motion
      ref.current.position.y = Math.sin(state.clock.getElapsedTime() * 2) * (speaking ? 0.5 : 0.1);
    }
  });

  return (
    <Points ref={ref} positions={points} stride={3}>
      <PointMaterial transparent color={speaking ? "#ec4899" : "#6366f1"} size={0.04} sizeAttenuation={true} depthWrite={false} opacity={0.6} />
    </Points>
  );
}

// --- 🧪 NEURAL WORKSPACE CORE (Fluid + Touch) ---
function WorkspaceCore({ isThinking, shapeType, labValue, isSpeaking }: { isThinking: boolean, shapeType: string, labValue: number, isSpeaking: boolean }) {
  const meshRef = useRef<any>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const pulse = isSpeaking ? 1.15 + Math.sin(state.clock.getElapsedTime() * 15) * 0.05 : 1;
      meshRef.current.scale.setScalar(pulse * (labValue / 50));
      if (!isThinking) meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef}>
        {shapeType === 'cylinder' ? <cylinderGeometry args={[1, 1, 2.8, 32]} /> : 
         shapeType === 'box' ? <boxGeometry args={[1.8, 1.8, 1.8]} /> : 
         <sphereGeometry args={[1.5, 64, 64]} />}
        
        <MeshDistortMaterial 
          color={isSpeaking ? "#f43f5e" : (isThinking ? "#f59e0b" : "#6366f1")} 
          speed={isThinking ? 10 : 2} 
          distort={isThinking ? 0.6 : 0.3} 
          emissive={isSpeaking ? "#9f1239" : "#1e1b4b"}
          emissiveIntensity={isSpeaking ? 1.5 : 0.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </Float>
  );
}

export default function GyanAIV20() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [notes, setNotes] = useState<string[]>([]);
  const [currentShape, setCurrentShape] = useState("sphere");
  const [labValue, setLabValue] = useState(50);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const API_URL = "https://scott-zoloft-seriously-appear.trycloudflare.com/ask";

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    const savedChat = localStorage.getItem('gyanai_v20_mantu');
    const savedNotes = localStorage.getItem('gyanai_notes_v20');
    if (savedChat) setMessages(JSON.parse(savedChat));
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    else setMessages([{ id: 1, role: 'ai', text: 'Namaste Mantu! v20.0 Neural Workspace Active. Ab aap 3D shapes ko touch se control kar sakte hain.' }]);
  }, []);

  useEffect(() => {
    localStorage.setItem('gyanai_v20_mantu', JSON.stringify(messages));
    localStorage.setItem('gyanai_notes_v20', JSON.stringify(notes));
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    
    const lastMsg = messages[messages.length - 1]?.text.toLowerCase() || "";
    if (lastMsg.includes("cylinder")) setCurrentShape("cylinder");
    else if (lastMsg.includes("box") || lastMsg.includes("cube")) setCurrentShape("box");
    else setCurrentShape("sphere");
  }, [messages, notes]);

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
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: "Neural Link Offline." }]);
    } finally { setIsTyping(false); }
  };

  return (
    <div className="min-h-screen bg-[#010206] text-slate-300 flex flex-col overflow-hidden relative font-sans">
      
      {/* ☰ HAMBURGER MENU */}
      <div className="absolute top-8 left-8 z-[100]">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-5 bg-indigo-600/30 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] hover:scale-110 transition-all shadow-2xl">
          {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* 📟 NEURAL SIDEBAR (Smart Notes) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[80]" />
            <motion.nav initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25 }} className="fixed top-0 left-0 h-full w-85 bg-slate-950/90 border-r border-white/5 backdrop-blur-3xl z-[90] p-10 pt-36 flex flex-col gap-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-indigo-600 rounded-[2rem] shadow-xl shadow-indigo-500/40"><BrainCircuit size={28}/></div>
                <h1 className="text-2xl font-black italic">GyanAI <span className="text-[10px] block text-indigo-400 not-italic">WORKSPACE v20</span></h1>
              </div>
              <div className="flex-1 space-y-4 overflow-y-auto scrollbar-hide">
                <SidebarItem icon={<Home size={20}/>} label="Workstation" active />
                <SidebarItem icon={<Waves size={20}/>} label="Fluid Dynamics" />
                
                <div className="mt-8 border-t border-white/5 pt-6">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                    <Pin size={12}/> Smart Sticky Notes
                  </p>
                  <div className="space-y-3">
                    {notes.length > 0 ? notes.map((n, i) => (
                      <div key={i} className="p-4 bg-white/5 rounded-3xl border border-white/5 text-xs font-medium leading-relaxed italic">
                        {n}
                      </div>
                    )) : <p className="text-[10px] text-slate-700 italic px-4">No pinned notes yet...</p>}
                  </div>
                </div>
              </div>
              <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="p-6 text-slate-600 hover:text-red-500 text-xs font-black uppercase tracking-widest flex items-center gap-4 transition-all">
                <Trash2 size={18}/> Wipe System
              </button>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* 🖥️ MAIN WORKSPACE */}
      <main className={`flex-1 flex flex-col p-4 md:p-10 gap-8 transition-all duration-700 ${isSidebarOpen ? 'blur-2xl scale-90 translate-x-20' : ''}`}>
        <div className="flex flex-col xl:flex-row gap-8 h-full max-h-[92vh] z-10">
          
          <div className="flex-[2.8] flex flex-col gap-8">
            {/* INTERACTIVE 3D HUB (Gesture Enabled) */}
            <div className={`relative aspect-video lg:h-[480px] bg-black rounded-[6rem] border border-white/10 overflow-hidden shadow-2xl transition-all duration-1000 ${isSpeaking ? 'shadow-[0_0_80px_rgba(236,72,153,0.3)]' : ''}`}>
              <Canvas camera={{ position: [0, 2, 8], fov: 40 }}>
                 <ambientLight intensity={0.5} />
                 <FluidBackground active={isTyping} speaking={isSpeaking} />
                 <Grid infiniteGrid fadeDistance={50} fadeStrength={5} sectionSize={3} sectionColor="#4338ca" cellColor="#1e1b4b" />
                 <OrbitControls enablePan={false} minDistance={5} maxDistance={12} />
                 <WorkspaceCore isThinking={isTyping} shapeType={currentShape} labValue={labValue} isSpeaking={isSpeaking} />
                 <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4.5} />
              </Canvas>
              
              <div className="absolute top-12 left-12 flex items-center gap-4 bg-black/40 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10">
                 <div className={`w-3 h-3 rounded-full ${isSpeaking ? 'bg-pink-500 animate-pulse' : (isTyping ? 'bg-amber-500 animate-spin' : 'bg-teal-500 shadow-[0_0_15px_#14b8a6]')}`} />
                 <p className="text-[11px] font-black text-white uppercase tracking-[0.4em] leading-none">Neural State: {isSpeaking ? 'Narrating' : (isTyping ? 'Simulating' : 'Listening')}</p>
              </div>

              <div className="absolute bottom-12 right-12 flex items-center gap-6">
                 <div className="p-3 bg-indigo-600/20 backdrop-blur-md rounded-full border border-white/5 text-slate-500"><Sparkles size={16}/></div>
                 <div className="bg-black/60 backdrop-blur-xl p-2 rounded-[3rem] border border-white/10 flex gap-2">
                    <button onClick={() => setCurrentShape('sphere')} className={`p-3 rounded-full ${currentShape === 'sphere' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-300'}`}><Activity size={18}/></button>
                    <button onClick={() => setCurrentShape('box')} className={`p-3 rounded-full ${currentShape === 'box' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-300'}`}><BoxIcon size={18}/></button>
                    <button onClick={() => setCurrentShape('cylinder')} className={`p-3 rounded-full ${currentShape === 'cylinder' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-300'}`}><Binary size={18}/></button>
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 flex-1">
               <div className="bg-slate-950/20 rounded-[4.5rem] border border-white/5 p-8 flex flex-col justify-center items-center group hover:bg-pink-600/5 transition-all">
                  <Heart className={`mb-3 ${isSpeaking ? 'text-pink-500 animate-bounce' : 'text-slate-800'}`} size={38} />
                  <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest leading-none">Biometric Sync</p>
               </div>
               <div className="bg-slate-950/20 rounded-[4.5rem] border border-white/5 p-8 flex flex-col justify-center items-center group transition-all">
                  <SlidersHorizontal className="text-slate-800 mb-3 group-hover:text-indigo-500" size={38} />
                  <input type="range" min="20" max="100" value={labValue} onChange={(e) => setLabValue(parseInt(e.target.value))} className="w-2/3 accent-indigo-500" />
               </div>
            </div>
          </div>

          {/* CHAT COMMAND CENTER */}
          <div className="flex-1 min-w-[440px] bg-slate-950/80 rounded-[7rem] border border-white/5 flex flex-col shadow-2xl overflow-hidden backdrop-blur-4xl relative">
            <div className="p-12 border-b border-white/10 flex items-center justify-between bg-white/5">
               <div className="flex items-center gap-4 text-indigo-400 font-black italic">
                  <Eye size={24} />
                  <span className="text-[13px] uppercase tracking-[0.5em] text-white">Neural Eye</span>
               </div>
               <div className="flex items-center gap-4">
                 {isSpeaking && <button onClick={() => window.speechSynthesis.cancel()} className="text-pink-500 font-black text-[9px] uppercase tracking-widest animate-pulse">Silence AI</button>}
                 <Volume2 size={24} className={isSpeaking ? "text-pink-500" : "text-slate-800"} />
               </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-12 space-y-12 scrollbar-hide">
              <AnimatePresence>
                {messages.map((m) => (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col ${m.role === 'ai' ? 'items-start' : 'items-end'}`}>
                    {m.image && <img src={m.image} alt="scan" className="max-w-[260px] rounded-[3.5rem] mb-8 border-4 border-white/5 shadow-3xl" />}
                    <div className={`max-w-[95%] p-10 rounded-[4.5rem] text-[15px] leading-relaxed shadow-3xl ${m.role === 'ai' ? 'bg-slate-900/95 text-slate-100 border border-white/5 rounded-tl-none' : 'bg-indigo-600 text-white rounded-tr-none'}`}>
                      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{m.text}</ReactMarkdown>
                      {m.role === 'ai' && (
                        <button onClick={() => setNotes(prev => [m.text.substring(0, 80) + "...", ...prev].slice(0, 3))} className="mt-6 flex items-center gap-2 text-[10px] text-slate-600 hover:text-indigo-400 font-bold uppercase transition-all">
                          <Pin size={12}/> Pin to Sticky Notes
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isTyping && (
                <div className="flex items-center gap-4 ml-10 text-amber-500">
                   <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
                   <span className="text-[11px] font-black uppercase tracking-[0.6em] italic leading-none">Scanning Workspace...</span>
                </div>
              )}
            </div>

            {/* COMMAND INPUT */}
            <div className="p-12 pt-4">
              <div className="flex items-center gap-3 bg-slate-900/90 border border-white/10 p-3 rounded-[5rem] shadow-inner focus-within:border-indigo-500/50 transition-all">
                <input type="file" id="fileIn" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if(file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setSelectedImage(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }} />
                <button onClick={() => document.getElementById('fileIn')?.click()} className="p-5 text-slate-500 hover:text-indigo-400"><ImageIcon size={26}/></button>
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Issue Workspace command..." className="flex-1 bg-transparent border-none py-6 px-6 text-sm text-white focus:outline-none placeholder:text-slate-800 font-medium" />
                <button onClick={handleSend} className="p-8 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-500 hover:scale-105 active:scale-95 transition-all"><Send size={28}/></button>
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
    <button className={`flex items-center gap-6 p-6 w-full rounded-[3.5rem] border transition-all ${active ? 'bg-indigo-600 text-white border-indigo-400 shadow-[0_20px_40px_rgba(79,70,229,0.3)]' : 'text-slate-700 hover:bg-slate-900/50 hover:text-slate-200 border-transparent'}`}>
      {icon} <span className="text-xs font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}
