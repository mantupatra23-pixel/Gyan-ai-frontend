"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Box, Cylinder, MeshDistortMaterial, Stars, Grid, PresentationControls, ContactShadows } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Zap, BrainCircuit, FolderRoot, Trash2, X, Activity, 
  Box as BoxIcon, Binary, Volume2, Eye, Heart, Cpu, Image as ImageIcon, StopCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// KaTeX CSS for beautiful math formulas
import 'katex/dist/katex.min.css';

// --- 📐 DYNAMIC GEOMETRY ENGINE (The Neural Core) ---
function NeuralCore({ isThinking, shapeType }: { isThinking: boolean, shapeType: string }) {
  const meshRef = useRef<any>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // BIOMETRIC PULSE: AI "Heartbeat" logic
      const pulse = isThinking ? 1.2 + Math.sin(state.clock.getElapsedTime() * 10) * 0.1 : 1;
      meshRef.current.scale.setScalar(pulse);
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.z += 0.005;
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

export default function GyanAIV16() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [currentShape, setCurrentShape] = useState("sphere");
  const [activeFolder, setActiveFolder] = useState("General");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // YOUR PERMANENT CLOUDFLARE LINK
  const API_URL = "https://scott-zoloft-seriously-appear.trycloudflare.com/ask";

  useEffect(() => {
    const saved = localStorage.getItem('gyanai_v16_mantu');
    if (saved) setMessages(JSON.parse(saved));
    else setMessages([{ id: 1, role: 'ai', text: 'Namaste Mantu! v16.0 Neural Eye Active. Main aapke math aur physics ko 3D mein simulate karne ke liye taiyar hoon.' }]);
  }, []);

  useEffect(() => {
    localStorage.setItem('gyanai_v16_mantu', JSON.stringify(messages));
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    
    // Auto-Shape Switcher logic based on AI response keywords
    const lastMsg = messages[messages.length - 1]?.text.toLowerCase() || "";
    if (lastMsg.includes("cylinder")) setCurrentShape("cylinder");
    else if (lastMsg.includes("box") || lastMsg.includes("cube") || lastMsg.includes("square")) setCurrentShape("box");
    else setCurrentShape("sphere");
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;

    const userMsg = { id: Date.now(), role: 'user', text: input, image: selectedImage };
    setMessages(prev => [...prev, userMsg]);
    
    const currentInput = input;
    const currentImg = selectedImage;

    setInput("");
    setSelectedImage(null);
    setIsTyping(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: currentInput, image: currentImg }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: "❌ Neural Bridge Offline. AWS Terminal check karein." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#010208] text-slate-300 flex flex-col lg:flex-row overflow-hidden font-sans">
      
      {/* --- 🗂️ PROJECT SIDEBAR --- */}
      <nav className="hidden lg:flex w-80 flex-col bg-black/80 backdrop-blur-3xl border-r border-white/5 p-8 z-20">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-rose-600 rounded-2xl shadow-xl shadow-rose-500/20 animate-pulse">
            <Heart className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white italic tracking-tighter">GyanAI <span className="text-[10px] text-rose-500 block not-italic font-mono">EYE v16</span></h1>
        </div>
        
        <div className="space-y-2 flex-1 overflow-y-auto scrollbar-hide">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">Study Folders</p>
          <FolderItem icon={<FolderRoot size={16}/>} label="General Hub" active={activeFolder === "General"} onClick={() => setActiveFolder("General")} />
          <FolderItem icon={<Zap size={16}/>} label="Physics Master" active={activeFolder === "Physics"} onClick={() => setActiveFolder("Physics")} />
          <FolderItem icon={<Binary size={16}/>} label="Math Wizard" active={activeFolder === "Math"} onClick={() => setActiveFolder("Math")} />
          
          <div className="mt-10 p-6 bg-slate-900/40 rounded-[3rem] border border-white/5">
             <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-indigo-400 uppercase">Neural Sync</span>
                <Eye size={14} className="text-indigo-400" />
             </div>
             <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div animate={{ width: isTyping ? "100%" : "65%" }} className="h-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" />
             </div>
          </div>
        </div>

        <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="mt-6 flex items-center gap-4 p-4 text-slate-700 hover:text-red-500 transition-all rounded-2xl">
          <Trash2 size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Wipe Core</span>
        </button>
      </nav>

      {/* --- 🖥️ NEURAL INTERFACE --- */}
      <main className="flex-1 flex flex-col p-4 md:p-6 gap-6 relative overflow-hidden">
        <div className="flex flex-col xl:flex-row gap-6 h-full max-h-[94vh] z-10">
          
          <div className="flex-[2.6] flex flex-col gap-6">
            {/* 3D GEOMETRY VIEWER */}
            <div className="relative aspect-video lg:h-[460px] bg-black rounded-[5.5rem] border border-white/10 overflow-hidden shadow-2xl group">
              <Canvas camera={{ position: [0, 2, 8], fov: 40 }}>
                 <ambientLight intensity={0.5} />
                 <pointLight position={[10, 10, 10]} intensity={1.5} />
                 <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
                 <Grid infiniteGrid fadeDistance={50} fadeStrength={5} sectionSize={3} sectionColor="#4338ca" cellColor="#1e1b4b" />
                 <PresentationControls global config={{ mass: 2, tension: 500 }} snap={{ mass: 4, tension: 1500 }}>
                    <NeuralCore isThinking={isTyping} shapeType={currentShape} />
                 </PresentationControls>
                 <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2} far={4.5} />
              </Canvas>
              
              <div className="absolute top-12 left-12 flex items-center gap-3 bg-black/40 backdrop-blur-xl px-5 py-2 rounded-full border border-white/5">
                 <div className={`w-2 h-2 rounded-full ${isTyping ? 'bg-rose-500 animate-ping' : 'bg-teal-500 shadow-[0_0_10px_#14b8a6]'}`} />
                 <p className="text-[10px] font-black text-white uppercase tracking-[0.4em] italic">Neural Scan: {isTyping ? 'Processing' : 'Stable'}</p>
              </div>

              <div className="absolute bottom-12 right-12 flex flex-col items-end gap-2">
                 <div className="bg-indigo-600/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-indigo-500/30">
                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest leading-none">Model: {currentShape}</span>
                 </div>
              </div>
            </div>

            {/* PULSE DATA CARDS */}
            <div className="grid grid-cols-2 gap-6 flex-1">
               <div className="bg-slate-950/20 rounded-[4rem] border border-white/5 p-8 flex flex-col justify-center items-center group transition-all hover:bg-rose-500/5">
                  <Heart className={`mb-3 ${isTyping ? 'text-rose-500 animate-bounce' : 'text-slate-800'}`} size={32} />
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Biometric Pulse</p>
               </div>
               <div className="bg-slate-950/20 rounded-[4rem] border border-white/5 p-8 flex flex-col justify-center items-center group transition-all hover:bg-indigo-500/5">
                  <BoxIcon className="text-slate-800 mb-3 group-hover:text-indigo-500 transition-colors" size={32} />
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Active Sim</p>
               </div>
            </div>
          </div>

          {/* CHAT COMMAND CENTER */}
          <div className="flex-1 min-w-[420px] bg-slate-950/70 rounded-[6rem] border border-white/5 flex flex-col shadow-2xl overflow-hidden backdrop-blur-3xl">
            <div className="p-10 border-b border-white/10 flex items-center justify-between bg-white/5">
               <div className="flex items-center gap-3 text-rose-500">
                  <Eye size={20} />
                  <span className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Eye Interface</span>
               </div>
               <Volume2 size={20} className={isTyping ? "text-rose-500 animate-pulse" : "text-slate-800"} />
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-12 scrollbar-hide">
              <AnimatePresence>
                {messages.map((m) => (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col ${m.role === 'ai' ? 'items-start' : 'items-end'}`}>
                    {m.image && <img src={m.image} alt="scan" className="max-w-[240px] rounded-[3rem] mb-6 border-4 border-white/5 shadow-2xl" />}
                    <div className={`max-w-[95%] p-8 rounded-[3.5rem] text-[15px] leading-relaxed tracking-tight ${m.role === 'ai' ? 'bg-slate-900/90 text-slate-100 border border-white/5 rounded-tl-none' : 'bg-rose-600 text-white rounded-tr-none shadow-lg shadow-rose-600/30'}`}>
                      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{m.text}</ReactMarkdown>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isTyping && (
                <div className="flex items-center gap-3 ml-8 text-rose-500">
                   <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-[0.5em] italic">Scanning Deep Patterns...</span>
                </div>
              )}
            </div>

            {/* PREVIEW IMAGE */}
            <AnimatePresence>
              {selectedImage && (
                <div className="px-10 pb-4">
                  <div className="relative inline-block group">
                    <img src={selectedImage} className="w-24 h-24 object-cover rounded-[2.5rem] border-2 border-rose-500 shadow-2xl" />
                    <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:scale-110 transition-all"><X size={12}/></button>
                  </div>
                </div>
              )}
            </AnimatePresence>

            {/* INPUT BOX */}
            <div className="p-10 pt-4">
              <div className="flex items-center gap-2 bg-slate-900/80 border border-white/10 p-2 rounded-[4.5rem] shadow-inner focus-within:border-rose-500/40 transition-all">
                <input type="file" ref={fileInputRef} onChange={(e) => {
                  const file = e.target.files?.[0];
                  if(file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setSelectedImage(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }} accept="image/*" className="hidden" />
                
                <button onClick={() => fileInputRef.current?.click()} className="p-5 text-slate-500 hover:text-rose-400"><ImageIcon size={22}/></button>
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Issue a vision command..." className="flex-1 bg-transparent border-none py-5 px-6 text-sm text-white focus:outline-none placeholder:text-slate-800 font-medium" />
                <button onClick={handleSend} className="p-6 bg-rose-600 text-white rounded-full shadow-2xl hover:bg-rose-500 active:scale-90 transition-all"><Send size={24}/></button>
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
    <div onClick={onClick} className={`flex items-center gap-5 p-5 rounded-[2.8rem] cursor-pointer transition-all border ${active ? 'bg-rose-600/15 text-rose-400 border-rose-500/20 shadow-inner' : 'text-slate-700 hover:bg-slate-900/50 hover:text-slate-300 border-transparent'}`}>
      {icon} <span className="text-[11px] font-black uppercase tracking-widest leading-none">{label}</span>
    </div>
  );
}
