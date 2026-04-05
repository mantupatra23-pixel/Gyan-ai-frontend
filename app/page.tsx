"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Box, Cylinder, MeshDistortMaterial, Stars, Grid, PresentationControls, ContactShadows, OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Zap, BrainCircuit, FolderRoot, Trash2, X, Activity, 
  Box as BoxIcon, Binary, Volume2, Eye, Heart, Cpu, Image as ImageIcon, 
  Settings2, FlaskConical, History, Sparkles, SlidersHorizontal
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import 'katex/dist/katex.min.css';

// --- 🌌 NEURAL NEBULA ENGINE (Energy Sync) ---
function NebulaEngine({ isThinking }: { isThinking: boolean }) {
  const meshRef = useRef<any>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.001;
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.2;
    }
  });

  return (
    <group>
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={isThinking ? 8 : 1} />
      <mesh ref={meshRef} scale={15}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color={isThinking ? "#4c1d95" : "#020617"} side={1} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// --- 📐 LAB MASTER CORE (Multi-Shape + Pulse) ---
function LabCore({ isThinking, shapeType, labValue }: { isThinking: boolean, shapeType: string, labValue: number }) {
  const meshRef = useRef<any>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const pulse = isThinking ? 1.2 + Math.sin(state.clock.getElapsedTime() * 10) * 0.1 : 1;
      meshRef.current.scale.setScalar(pulse * (labValue / 50)); // Slider controls scale
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Float speed={5} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef}>
        {shapeType === 'cylinder' ? <cylinderGeometry args={[1, 1, 2.5, 32]} /> : 
         shapeType === 'box' ? <boxGeometry args={[1.7, 1.7, 1.7]} /> : 
         <sphereGeometry args={[1.4, 64, 64]} />}
        
        <MeshDistortMaterial 
          color={isThinking ? "#f43f5e" : "#6366f1"} 
          speed={isThinking ? 12 : 2} 
          distort={0.4} 
          emissive={isThinking ? "#9f1239" : "#1e1b4b"}
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </Float>
  );
}

export default function GyanAIV17() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [currentShape, setCurrentShape] = useState("sphere");
  const [activeFolder, setActiveFolder] = useState("General");
  const [labValue, setLabValue] = useState(50); // LAB SLIDER STATE
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const API_URL = "https://scott-zoloft-seriously-appear.trycloudflare.com/ask";

  useEffect(() => {
    const saved = localStorage.getItem('gyanai_v17_mantu');
    if (saved) setMessages(JSON.parse(saved));
    else setMessages([{ id: 1, role: 'ai', text: 'Namaste Mantu! v17.0 Lab Master Active. Ab aap sliders se mere simulations control kar sakte hain.' }]);
  }, []);

  useEffect(() => {
    localStorage.setItem('gyanai_v17_mantu', JSON.stringify(messages));
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    
    // Auto-Shape Switcher
    const lastMsg = messages[messages.length - 1]?.text.toLowerCase() || "";
    if (lastMsg.includes("cylinder")) setCurrentShape("cylinder");
    else if (lastMsg.includes("box") || lastMsg.includes("cube")) setCurrentShape("box");
    else if (lastMsg.includes("sphere")) setCurrentShape("sphere");
  }, [messages]);

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
    } catch (e) {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: "❌ Connection Lost. Check AWS." }]);
    } finally { setIsTyping(false); }
  };

  return (
    <div className="min-h-screen bg-[#020308] text-slate-300 flex flex-col lg:flex-row overflow-hidden font-sans">
      
      {/* --- 🛡️ MEMORY VAULT SIDEBAR --- */}
      <nav className="hidden lg:flex w-80 flex-col bg-black/90 backdrop-blur-3xl border-r border-white/5 p-8 z-20">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-500/20">
            <FlaskConical className="text-white w-6 h-6 animate-bounce" />
          </div>
          <h1 className="text-2xl font-black text-white italic tracking-tighter">GyanAI <span className="text-[10px] text-indigo-400 block not-italic font-mono">LAB v17</span></h1>
        </div>
        
        <div className="space-y-2 flex-1 overflow-y-auto scrollbar-hide">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">Memory Vault</p>
          <FolderItem icon={<FolderRoot size={16}/>} label="General" active={activeFolder === "General"} onClick={() => setActiveFolder("General")} />
          <FolderItem icon={<History size={16}/>} label="Exam Prep" active={activeFolder === "Exam"} onClick={() => setActiveFolder("Exam")} />
          <FolderItem icon={<Zap size={16}/>} label="Physics Lab" active={activeFolder === "Physics"} onClick={() => setActiveFolder("Physics")} />
          
          <div className="mt-10 p-6 bg-indigo-900/10 rounded-[3rem] border border-indigo-500/10">
             <div className="flex items-center justify-between mb-4 text-indigo-400">
                <span className="text-[10px] font-black uppercase">Lab Variables</span>
                <Settings2 size={14} />
             </div>
             <input type="range" min="20" max="100" value={labValue} onChange={(e) => setLabValue(parseInt(e.target.value))} className="w-full accent-indigo-500 bg-slate-800 rounded-lg cursor-pointer h-1.5" />
             <p className="text-[9px] text-slate-500 mt-2 text-center uppercase font-bold tracking-widest">Intensity: {labValue}%</p>
          </div>
        </div>

        <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="mt-6 flex items-center gap-4 p-4 text-slate-700 hover:text-red-500 transition-all rounded-2xl">
          <Trash2 size={16} /> <span className="text-[10px] font-black uppercase">Deep Wipe</span>
        </button>
      </nav>

      {/* --- 🖥️ LAB HUB --- */}
      <main className="flex-1 flex flex-col p-4 md:p-6 gap-6 relative overflow-hidden">
        <div className="flex flex-col xl:flex-row gap-6 h-full max-h-[94vh] z-10">
          
          <div className="flex-[2.6] flex flex-col gap-6">
            {/* INTERACTIVE NEBULA VIEWER */}
            <div className="relative aspect-video lg:h-[460px] bg-black rounded-[5.5rem] border border-white/10 overflow-hidden shadow-2xl">
              <Canvas camera={{ position: [0, 2, 8], fov: 40 }}>
                 <ambientLight intensity={0.5} />
                 <NebulaEngine isThinking={isTyping} />
                 <Grid infiniteGrid fadeDistance={50} fadeStrength={5} sectionSize={3} sectionColor="#4338ca" cellColor="#1e1b4b" />
                 <PresentationControls global config={{ mass: 2, tension: 500 }} snap={{ mass: 4, tension: 1500 }}>
                    <LabCore isThinking={isTyping} shapeType={currentShape} labValue={labValue} />
                 </PresentationControls>
                 <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2} far={4.5} />
              </Canvas>
              
              <div className="absolute top-12 left-12 flex items-center gap-3 bg-black/40 backdrop-blur-xl px-5 py-2 rounded-full border border-white/5">
                 <Sparkles className={`w-4 h-4 ${isTyping ? 'text-rose-500 animate-spin' : 'text-teal-500'}`} />
                 <p className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Lab Status: {isTyping ? 'Simulating' : 'Stable'}</p>
              </div>

              <div className="absolute bottom-12 right-12 flex items-center gap-4">
                 <div className="flex gap-2 bg-black/60 p-2 rounded-full border border-white/5">
                    <button onClick={() => setCurrentShape('sphere')} className={`p-2 rounded-full transition-all ${currentShape === 'sphere' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}><Activity size={14}/></button>
                    <button onClick={() => setCurrentShape('box')} className={`p-2 rounded-full transition-all ${currentShape === 'box' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}><BoxIcon size={14}/></button>
                    <button onClick={() => setCurrentShape('cylinder')} className={`p-2 rounded-full transition-all ${currentShape === 'cylinder' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}><Binary size={14}/></button>
                 </div>
              </div>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-2 gap-6 flex-1">
               <div className="bg-slate-950/20 rounded-[4rem] border border-white/5 p-8 flex flex-col justify-center items-center group transition-all hover:bg-rose-500/5">
                  <Heart className={`mb-3 ${isTyping ? 'text-rose-500 animate-bounce' : 'text-slate-800'}`} size={32} />
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Neural Heartbeat</p>
               </div>
               <div className="bg-slate-950/20 rounded-[4rem] border border-white/5 p-8 flex flex-col justify-center items-center group transition-all hover:bg-indigo-500/5">
                  <SlidersHorizontal className="text-slate-800 mb-3 group-hover:text-indigo-500" size={32} />
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Interactive Mod</p>
               </div>
            </div>
          </div>

          {/* CHAT INTERFACE */}
          <div className="flex-1 min-w-[420px] bg-slate-950/70 rounded-[6rem] border border-white/5 flex flex-col shadow-2xl overflow-hidden backdrop-blur-4xl relative">
            <div className="p-10 border-b border-white/10 flex items-center justify-between bg-white/5">
               <div className="flex items-center gap-3 text-indigo-500 font-black italic">
                  <Eye size={20} />
                  <span className="text-[11px] uppercase tracking-[0.4em]">Master Interface</span>
               </div>
               <Volume2 size={20} className={isTyping ? "text-indigo-500 animate-pulse" : "text-slate-800"} />
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-12 scrollbar-hide">
              <AnimatePresence>
                {messages.map((m) => (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col ${m.role === 'ai' ? 'items-start' : 'items-end'}`}>
                    {m.image && <img src={m.image} alt="scan" className="max-w-[240px] rounded-[3rem] mb-6 border-4 border-white/5" />}
                    <div className={`max-w-[95%] p-8 rounded-[3.5rem] text-[15px] leading-relaxed tracking-tight shadow-2xl ${m.role === 'ai' ? 'bg-slate-900/90 text-slate-100 border border-white/5 rounded-tl-none' : 'bg-indigo-600 text-white rounded-tr-none'}`}>
                      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{m.text}</ReactMarkdown>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isTyping && (
                <div className="flex items-center gap-3 ml-8 text-indigo-500">
                   <div className="flex gap-1 animate-pulse">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-[0.6em] italic">Simulating Lab Data...</span>
                </div>
              )}
            </div>

            {/* INPUT COMMAND */}
            <div className="p-10 pt-4">
              <div className="flex items-center gap-2 bg-slate-900/80 border border-white/10 p-2 rounded-[4.5rem] shadow-inner focus-within:border-indigo-500/40 transition-all">
                <input type="file" ref={fileInputRef} onChange={(e) => {
                  const file = e.target.files?.[0];
                  if(file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setSelectedImage(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }} accept="image/*" className="hidden" />
                
                <button onClick={() => fileInputRef.current?.click()} className="p-5 text-slate-500 hover:text-indigo-400"><ImageIcon size={22}/></button>
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Issue a lab command..." className="flex-1 bg-transparent border-none py-5 px-8 text-sm text-white focus:outline-none placeholder:text-slate-800 font-medium" />
                <button onClick={handleSend} className="p-6 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-500 active:scale-90 transition-all"><Send size={24}/></button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function FolderItem({ icon, label, active = false, onClick }: any) {
  return (
    <div onClick={onClick} className={`flex items-center gap-5 p-5 rounded-[2.8rem] cursor-pointer transition-all border ${active ? 'bg-indigo-600/15 text-indigo-400 border-indigo-500/20 shadow-inner' : 'text-slate-700 hover:bg-slate-900/50 hover:text-slate-300 border-transparent'}`}>
      {icon} <span className="text-[11px] font-black uppercase tracking-widest leading-none">{label}</span>
    </div>
  );
}
