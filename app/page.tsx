"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Stars } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, Image as ImageIcon, Send, Zap, BrainCircuit, LayoutDashboard, 
  Globe, Terminal, PenTool, Volume2, Trash2, X, Activity, SquareFunction
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

// --- 🌌 NEURAL GALAXY ---
function KnowledgeStars() {
  const ref = useRef<any>(null);
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 30;
      ref.current.rotation.y -= delta / 35;
    }
  });
  return (
    <group>
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      <mesh ref={ref}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <MeshDistortMaterial color="#4338ca" speed={2} distort={0.5} radius={1} />
      </mesh>
    </group>
  );
}

// --- 🎙️ AUDIO VISUALIZER COMPONENT ---
const AudioVisualizer = ({ active }: { active: boolean }) => {
  return (
    <div className="flex items-center gap-1 h-6">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <motion.div
          key={i}
          animate={{ height: active ? [4, 18, 6, 22, 4] : 4 }}
          transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.05 }}
          className={`w-1 rounded-full ${active ? 'bg-indigo-500 shadow-[0_0_8px_#6366f1]' : 'bg-slate-800'}`}
        />
      ))}
    </div>
  );
};

export default function GyanAIV9() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedChat = localStorage.getItem('gyanai_chat_v9');
    if (savedChat) setMessages(JSON.parse(savedChat));
    else setMessages([{ id: 1, role: 'ai', text: 'Namaste Mantu! v9.0 Seer Mode active. Main aapki Physics aur Math problems dekhne ke liye taiyar hoon.' }]);
  }, []);

  useEffect(() => {
    localStorage.setItem('gyanai_chat_v9', JSON.stringify(messages));
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

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() && !selectedImage) return;

    const userMsg = { id: Date.now(), role: 'user', text: textToSend, image: selectedImage };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setSelectedImage(null);
    setIsTyping(true);

    try {
      const response = await fetch('https://good-items-itch.loca.lt/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Bypass-Tunnel-Reminder': 'true' },
        body: JSON.stringify({ text: textToSend, image: userMsg.image }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: data.response }]);
      speak(data.response);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: "Connection error Mantu. AWS check karein." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 flex flex-col lg:flex-row overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* --- SIDEBAR --- */}
      <nav className="hidden lg:flex w-72 flex-col bg-slate-950/80 backdrop-blur-2xl border-r border-white/5 p-6 z-20">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 bg-indigo-600 rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.5)]">
            <BrainCircuit className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-black text-white tracking-tighter italic">GyanAI <span className="text-indigo-500 text-xs font-mono not-italic">v9.0</span></h1>
        </div>
        
        <div className="space-y-1 flex-1">
          <SidebarItem icon={<LayoutDashboard size={18}/>} label="The Oracle" active />
          <div className="py-4">
             <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">Quick Formulae</p>
             <div className="grid grid-cols-1 gap-2">
                <button onClick={() => setInput("Speed ka formula kya hai?")} className="text-left text-[11px] p-3 rounded-xl bg-slate-900/50 border border-white/5 hover:border-indigo-500/30 transition-all flex items-center gap-2">
                   <SquareFunction size={14} className="text-indigo-400" /> Speed (v=d/t)
                </button>
                <button onClick={() => setInput("Work ka formula samjhao.")} className="text-left text-[11px] p-3 rounded-xl bg-slate-900/50 border border-white/5 hover:border-indigo-500/30 transition-all flex items-center gap-2">
                   <Zap size={14} className="text-indigo-400" /> Work (W=F*d)
                </button>
             </div>
          </div>
        </div>

        <button onClick={() => { localStorage.removeItem('gyanai_chat_v9'); window.location.reload(); }} className="mt-4 flex items-center gap-3 p-4 text-red-500/70 hover:text-red-500 hover:bg-red-500/5 rounded-2xl transition-all">
          <Trash2 size={16} /> <span className="text-[10px] font-black uppercase">Wipe Memory</span>
        </button>
      </nav>

      {/* --- MAIN CORE --- */}
      <main className="flex-1 flex flex-col p-4 md:p-6 gap-6 relative">
        <div className="flex flex-col xl:flex-row gap-6 h-full max-h-[92vh]">
          
          <div className="flex-[2.2] flex flex-col gap-6 overflow-hidden">
            {/* 3D TEACHER SCREEN */}
            <div className="relative aspect-video lg:h-[350px] bg-black rounded-[3.5rem] border border-white/5 overflow-hidden shadow-2xl">
              <Canvas camera={{ position: [0, 0, 5] }}>
                 <ambientLight intensity={0.4} />
                 <Float speed={4}>
                    <Sphere args={[1.2, 64, 64]}>
                       <MeshDistortMaterial color={isSpeaking ? "#ec4899" : "#4f46e5"} speed={isSpeaking ? 10 : 2} distort={isSpeaking ? 0.6 : 0.3} emissive={isSpeaking ? "#db2777" : "#312e81"} emissiveIntensity={0.5} />
                    </Sphere>
                 </Float>
              </Canvas>
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
                 <AudioVisualizer active={isSpeaking} />
              </div>
            </div>

            {/* NEURAL STATUS */}
            <div className="flex-1 bg-slate-950/20 rounded-[3rem] border border-white/5 p-8 flex flex-col justify-center items-center">
               <Activity className={`mb-2 ${isTyping ? 'text-teal-500 animate-spin' : 'text-slate-800'}`} size={24} />
               <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.5em]">{isTyping ? "Neural Processing" : "Link Stable - Mantu"}</p>
            </div>
          </div>

          {/* CHAT HUB */}
          <div className="flex-1 min-w-[380px] bg-slate-950/40 rounded-[4rem] border border-white/5 flex flex-col shadow-2xl overflow-hidden relative backdrop-blur-3xl">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Oracle Node 01</span>
               </div>
               <Volume2 size={16} className={isSpeaking ? "text-pink-500" : "text-slate-800"} />
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
              {messages.map((m) => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col ${m.role === 'ai' ? 'items-start' : 'items-end'}`}>
                  {m.image && <img src={m.image} alt="upload" className="max-w-[180px] rounded-3xl mb-3 border border-white/10 shadow-2xl" />}
                  <div className={`max-w-[90%] p-6 rounded-[2.5rem] text-[13.5px] leading-relaxed transition-all ${m.role === 'ai' ? 'bg-slate-900/80 text-indigo-50 border border-white/5 rounded-tl-none' : 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-600/20'}`}>
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{m.text}</ReactMarkdown>
                  </div>
                </motion.div>
              ))}
              {isTyping && <div className="text-[9px] text-indigo-500 font-black animate-pulse ml-4 uppercase tracking-widest">Consulting Knowledge Base...</div>}
            </div>

            {/* PREVIEW BOX */}
            <AnimatePresence>
              {selectedImage && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="px-8 pb-4">
                  <div className="relative inline-block group">
                    <img src={selectedImage} className="w-24 h-24 object-cover rounded-[2rem] border-2 border-indigo-500 shadow-2xl" />
                    <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-xl hover:scale-110 transition-all"><X size={12}/></button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-8">
              <div className="flex items-center gap-2 bg-slate-900/60 border border-white/5 p-2 rounded-[2.8rem] focus-within:border-indigo-500/30 transition-all shadow-inner">
                <input type="file" ref={fileInputRef} onChange={(e) => {
                  const file = e.target.files?.[0];
                  if(file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setSelectedImage(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }} accept="image/*" className="hidden" />
                
                <button onClick={() => fileInputRef.current?.click()} className="p-4 text-slate-500 hover:text-indigo-400"><ImageIcon size={20}/></button>
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask Mantu's AI..." className="flex-1 bg-transparent border-none py-3 text-sm text-white focus:outline-none placeholder:text-slate-700" />
                <button onClick={() => handleSend()} className="p-5 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-500 active:scale-95 transition-all"><Send size={20}/></button>
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
    <div className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border ${active ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/20 shadow-inner' : 'text-slate-600 hover:bg-slate-900/50 hover:text-slate-300 border-transparent'}`}>
      {icon} <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
  );
}
