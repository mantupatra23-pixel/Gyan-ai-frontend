"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Stars, Grid, ContactShadows } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, Image as ImageIcon, Send, Zap, BrainCircuit, LayoutDashboard, 
  Trash2, X, Activity, Beaker, BarChart3, LineChart, Binary, Volume2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// KaTeX CSS for beautiful math rendering
import 'katex/dist/katex.min.css';

// --- 🌌 NEURAL SIMULATION SCENE ---
function SimulationScene({ active }: { active: boolean }) {
  const sphereRef = useRef<any>(null);
  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.01;
      if (active) {
        sphereRef.current.scale.setScalar(1 + Math.sin(state.clock.getElapsedTime() * 10) * 0.05);
      }
    }
  });

  return (
    <group>
      <Stars radius={100} depth={50} count={1200} factor={4} saturation={0} fade speed={1} />
      <Grid infiniteGrid fadeDistance={40} fadeStrength={5} sectionSize={2} sectionColor="#4338ca" cellColor="#1e1b4b" />
      <Float speed={5} rotationIntensity={2} floatIntensity={2}>
        <mesh ref={sphereRef}>
          <sphereGeometry args={[1.3, 64, 64]} />
          <MeshDistortMaterial 
            color={active ? "#ec4899" : "#6366f1"} 
            speed={active ? 12 : 3} 
            distort={0.5} 
            emissive={active ? "#be185d" : "#312e81"}
            emissiveIntensity={0.6}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      </Float>
      <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2} far={4.5} />
    </group>
  );
}

export default function GyanAIV12() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [userLevel, setUserLevel] = useState("Beginner");

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // YOUR PERMANENT CLOUDFLARE LINK
  const API_URL = "https://scott-zoloft-seriously-appear.trycloudflare.com/ask";

  useEffect(() => {
    const savedChat = localStorage.getItem('gyanai_v12_mantu');
    if (savedChat) {
      const parsed = JSON.parse(savedChat);
      setMessages(parsed);
      if (parsed.length > 10) setUserLevel("Pro Learner");
    } else {
      setMessages([{ id: 1, role: 'ai', text: 'Namaste Mantu! v12.0 Simulation Hub active. Aapka permanent link set ho gaya hai. Aaj kya sikhenge?' }]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('gyanai_v12_mantu', JSON.stringify(messages));
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
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: currentInput, image: currentImage }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: data.response }]);
      speak(data.response);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: "❌ Connection Error: Backend not reachable. AWS terminal check karein." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-slate-300 flex flex-col lg:flex-row overflow-hidden font-sans">
      
      {/* --- SIDEBAR --- */}
      <nav className="hidden lg:flex w-80 flex-col bg-black/60 backdrop-blur-3xl border-r border-white/5 p-8 z-20">
        <div className="flex items-center gap-4 mb-12">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/20">
            <BrainCircuit className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white italic tracking-tighter leading-none">GyanAI <span className="text-[9px] text-indigo-400 block not-italic font-mono mt-1">v12.0 PRO</span></h1>
        </div>
        
        <div className="space-y-4 flex-1">
          <SidebarItem icon={<LayoutDashboard size={18}/>} label="Neural Hub" active />
          <SidebarItem icon={<Beaker size={18}/>} label="Simulation Lab" />
          <SidebarItem icon={<LineChart size={18}/>} label="Math Plotter" />
          
          <div className="pt-8 border-t border-white/5">
             <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">Student Status</p>
             <div className="bg-slate-900/50 p-4 rounded-3xl border border-white/5">
                <div className="flex items-center justify-between mb-2">
                   <span className="text-[11px] font-bold text-indigo-400">{userLevel}</span>
                   <Binary size={14} className="text-indigo-400" />
                </div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                   <div className="h-full bg-indigo-500 w-2/3 shadow-[0_0_10px_#6366f1]" />
                </div>
             </div>
          </div>
        </div>

        <button onClick={() => { localStorage.removeItem('gyanai_v12_mantu'); window.location.reload(); }} className="flex items-center gap-4 p-4 text-slate-600 hover:text-red-500 transition-all rounded-2xl">
          <Trash2 size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Wipe Memory</span>
        </button>
      </nav>

      {/* --- MAIN CORE --- */}
      <main className="flex-1 flex flex-col p-4 md:p-6 gap-6 relative">
        <div className="flex flex-col xl:flex-row gap-6 h-full max-h-[92vh]">
          
          <div className="flex-[2.8] flex flex-col gap-6 overflow-hidden">
            {/* LAB VIEWER */}
            <div className="relative aspect-video lg:h-[420px] bg-black rounded-[4.5rem] border border-white/5 overflow-hidden shadow-2xl">
              <Canvas camera={{ position: [0, 2, 6], fov: 45 }}>
                 <ambientLight intensity={0.5} />
                 <SimulationScene active={isTyping || isSpeaking} />
              </Canvas>
              <div className="absolute top-10 left-10 border-l-4 border-indigo-500 pl-6">
                 <p className="text-[12px] font-black text-white uppercase tracking-[0.5em]">Simulation Mode</p>
                 <p className="text-[10px] text-indigo-500 font-bold uppercase mt-1 animate-pulse">Syncing with Cloudflare</p>
              </div>
            </div>

            <div className="flex gap-6 flex-1">
               <div className="flex-1 bg-slate-950/20 rounded-[3.5rem] border border-white/5 p-8 flex flex-col justify-center items-center group hover:bg-indigo-500/5 transition-all">
                  <BarChart3 className="text-slate-800 mb-3 group-hover:text-indigo-400" size={28} />
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Visual Data</p>
               </div>
               <div className="flex-1 bg-slate-950/20 rounded-[3.5rem] border border-white/5 p-8 flex flex-col justify-center items-center group">
                  <Activity className={`mb-3 ${isTyping ? 'text-pink-500 animate-bounce' : 'text-slate-800'}`} size={28} />
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Neural Load</p>
               </div>
            </div>
          </div>

          {/* CHAT HUB */}
          <div className="flex-1 min-w-[400px] bg-slate-950/40 rounded-[5rem] border border-white/5 flex flex-col shadow-2xl overflow-hidden backdrop-blur-3xl relative">
            <div className="p-10 border-b border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-teal-500 shadow-[0_0_10px_#14b8a6]" />
                  <span className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Hub Online</span>
               </div>
               <Volume2 size={18} className={isSpeaking ? "text-pink-500 animate-pulse" : "text-slate-800"} />
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-12 scrollbar-hide">
              {messages.map((m) => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col ${m.role === 'ai' ? 'items-start' : 'items-end'}`}>
                  {m.image && <img src={m.image} alt="study" className="max-w-[240px] rounded-[3rem] mb-6 border-4 border-white/5 shadow-2xl" />}
                  <div className={`max-w-[95%] p-8 rounded-[3.5rem] text-[14px] leading-relaxed ${m.role === 'ai' ? 'bg-slate-900/90 text-slate-200 border border-white/5 rounded-tl-none shadow-xl' : 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-600/30'}`}>
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{m.text}</ReactMarkdown>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-3 ml-8 text-indigo-400">
                  <div className="flex gap-1.5 animate-pulse">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.5em]">Analyzing...</span>
                </div>
              )}
            </div>

            {/* PREVIEW IMAGE */}
            <AnimatePresence>
              {selectedImage && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="px-10 pb-4">
                  <div className="relative inline-block">
                    <img src={selectedImage} className="w-28 h-28 object-cover rounded-[2.5rem] border-2 border-indigo-500 shadow-2xl" />
                    <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2.5 shadow-xl hover:scale-110 transition-all"><X size={14}/></button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* INPUT HUB */}
            <div className="p-10">
              <div className="flex items-center gap-2 bg-slate-900/80 border border-white/5 p-2 rounded-[4rem] shadow-inner focus-within:border-indigo-500/50 transition-all">
                <input type="file" ref={fileInputRef} onChange={(e) => {
                  const file = e.target.files?.[0];
                  if(file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setSelectedImage(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }} accept="image/*" className="hidden" />
                
                <button onClick={() => fileInputRef.current?.click()} className="p-5 text-slate-500 hover:text-indigo-400"><ImageIcon size={22}/></button>
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask Mantu's Oracle..." className="flex-1 bg-transparent border-none py-5 px-3 text-base text-white focus:outline-none placeholder:text-slate-800" />
                <button onClick={handleSend} className="p-6 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-500 active:scale-90 transition-all"><Send size={24}/></button>
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
    <div className={`flex items-center gap-4 p-5 rounded-3xl cursor-pointer transition-all border ${active ? 'bg-indigo-600/15 text-indigo-400 border-indigo-500/20 shadow-inner' : 'text-slate-700 hover:bg-slate-900/50 hover:text-slate-300 border-transparent'}`}>
      {icon} <span className="text-[11px] font-black uppercase tracking-widest leading-none">{label}</span>
    </div>
  );
}
