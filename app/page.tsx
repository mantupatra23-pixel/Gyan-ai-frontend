"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Stars, Grid, ContactShadows } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, Image as ImageIcon, Send, Zap, BrainCircuit, LayoutDashboard, 
  Trash2, X, Activity, Beaker, Binary, Volume2, VolumeX, PlayCircle, Cpu
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import 'katex/dist/katex.min.css';

// --- 🎙️ VOICE WAVEFORM COMPONENT ---
const VoiceWaveform = ({ active }: { active: boolean }) => {
  return (
    <div className="flex items-center gap-1.5 h-8 px-4 bg-indigo-500/10 rounded-full border border-indigo-500/20">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <motion.div
          key={i}
          animate={{ height: active ? [4, 20, 8, 24, 4] : 4 }}
          transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05 }}
          className={`w-1 rounded-full ${active ? 'bg-indigo-400 shadow-[0_0_10px_#818cf8]' : 'bg-slate-800'}`}
        />
      ))}
    </div>
  );
};

export default function GyanAIV14() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const API_URL = "https://scott-zoloft-seriously-appear.trycloudflare.com/ask";

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    const savedChat = localStorage.getItem('gyanai_v14_mantu');
    if (savedChat) setMessages(JSON.parse(savedChat));
    else setMessages([{ id: 1, role: 'ai', text: 'Namaste Mantu! v14.0 Sonic Vision active. Main ab har sawal ka jawab bol kar samjhaunga.' }]);
  }, []);

  useEffect(() => {
    localStorage.setItem('gyanai_v14_mantu', JSON.stringify(messages));
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const speak = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel(); // Stop any current speech
    
    // Clean text for speech (remove markdown symbols)
    const cleanText = text.replace(/[*#_\[\]\(\)]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    utterance.pitch = 1.1;
    utterance.rate = 1;
    synthRef.current.speak(utterance);
  };

  const stopSpeech = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
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
      speak(data.response); // AUTO-NARRATOR
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: "Voice Link Broken. AWS Terminal check karein." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#010204] text-slate-300 flex flex-col lg:flex-row overflow-hidden font-sans">
      
      {/* --- SONIC SIDEBAR --- */}
      <nav className="hidden lg:flex w-80 flex-col bg-slate-950/90 backdrop-blur-3xl border-r border-white/5 p-8 z-20">
        <div className="flex items-center gap-4 mb-12">
          <div className="p-3 bg-indigo-600 rounded-[2rem] shadow-[0_0_20px_rgba(79,70,229,0.5)]">
            <Cpu className="text-white w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-2xl font-black text-white italic tracking-tighter">GyanAI <span className="text-[10px] text-teal-400 block not-italic font-mono">SONIC v14</span></h1>
        </div>
        
        <div className="space-y-4 flex-1">
          <SidebarItem icon={<LayoutDashboard size={18}/>} label="Thought Center" active />
          <SidebarItem icon={<Beaker size={18}/>} label="Scientific Lab" />
          <SidebarItem icon={<Binary size={18}/>} label="Math Oracle" />
        </div>

        <div className="mt-8 p-6 bg-indigo-600/5 rounded-[2.5rem] border border-indigo-500/10 text-center">
           <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">Audio Feedback</p>
           <VoiceWaveform active={isSpeaking} />
        </div>

        <button onClick={() => { localStorage.removeItem('gyanai_v14_mantu'); window.location.reload(); }} className="mt-6 flex items-center gap-4 p-4 text-slate-600 hover:text-red-500 transition-all rounded-2xl">
          <Trash2 size={16} /> <span className="text-[10px] font-black uppercase">Format Memory</span>
        </button>
      </nav>

      {/* --- CORE INTERFACE --- */}
      <main className="flex-1 flex flex-col p-4 md:p-6 gap-6 relative">
        <div className="flex flex-col xl:flex-row gap-6 h-full max-h-[92vh]">
          
          <div className="flex-[2.8] flex flex-col gap-6 overflow-hidden">
            {/* HOLOGRAPHIC VIEWER */}
            <div className="relative aspect-video lg:h-[430px] bg-black rounded-[5rem] border border-white/5 overflow-hidden shadow-2xl">
              <Canvas camera={{ position: [0, 2, 7], fov: 40 }}>
                 <ambientLight intensity={0.5} />
                 <Stars radius={100} depth={50} count={1500} factor={4} saturation={0} fade speed={1} />
                 <Grid infiniteGrid fadeDistance={45} fadeStrength={5} sectionSize={3} sectionColor="#4338ca" cellColor="#1e1b4b" />
                 <Float speed={5} rotationIntensity={2}>
                    <Sphere args={[1.3, 64, 64]}>
                       <MeshDistortMaterial color={isSpeaking ? "#ec4899" : "#6366f1"} speed={isSpeaking ? 10 : 2} distort={0.5} emissive={isSpeaking ? "#be185d" : "#312e81"} emissiveIntensity={0.6} />
                    </Sphere>
                 </Float>
              </Canvas>
              <div className="absolute top-10 left-10 flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                 <p className="text-[11px] font-black text-white uppercase tracking-[0.4em] italic leading-none">Neural Link Active</p>
              </div>
            </div>

            {/* STATUS CARDS */}
            <div className="flex gap-6 flex-1">
               <div className="flex-1 bg-slate-950/20 rounded-[3.5rem] border border-white/5 p-8 flex flex-col justify-center items-center group">
                  <Activity className={`mb-3 ${isTyping ? 'text-indigo-400' : 'text-slate-800'}`} size={28} />
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Processing</p>
               </div>
               <div className="flex-1 bg-indigo-600/5 rounded-[3.5rem] border border-indigo-500/10 p-8 flex flex-col justify-center items-center">
                  <Volume2 className={`mb-3 ${isSpeaking ? 'text-pink-500 animate-bounce' : 'text-slate-800'}`} size={28} />
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Narrating</p>
               </div>
            </div>
          </div>

          {/* CHAT INTERFACE */}
          <div className="flex-1 min-w-[420px] bg-slate-950/50 rounded-[5rem] border border-white/5 flex flex-col shadow-2xl overflow-hidden backdrop-blur-3xl relative">
            <div className="p-10 border-b border-white/5 flex items-center justify-between">
               <span className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Sonic Hub 14</span>
               <div className="flex items-center gap-4">
                  {isSpeaking && (
                    <button onClick={stopSpeech} className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full text-red-500 text-[10px] font-black hover:bg-red-500/30 transition-all">
                       <VolumeX size={14} /> STOP VOICE
                    </button>
                  )}
               </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-12 scrollbar-hide">
              {messages.map((m) => (
                <motion.div key={m.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`flex flex-col ${m.role === 'ai' ? 'items-start' : 'items-end'}`}>
                  {m.image && <img src={m.image} alt="study" className="max-w-[240px] rounded-[3rem] mb-6 border-4 border-white/5 shadow-2xl" />}
                  <div className={`max-w-[95%] p-8 rounded-[3.5rem] text-[14.5px] leading-relaxed tracking-tight ${m.role === 'ai' ? 'bg-slate-900 text-indigo-50 border border-white/5 rounded-tl-none shadow-2xl shadow-black/50' : 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-600/20'}`}>
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{m.text}</ReactMarkdown>
                    {m.role === 'ai' && (
                       <button onClick={() => speak(m.text)} className="mt-4 p-2 rounded-full hover:bg-white/5 transition-all text-slate-500">
                          <PlayCircle size={18} />
                       </button>
                    )}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-3 ml-8">
                   <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
                   <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest italic">Thinking Deeply...</span>
                </div>
              )}
            </div>

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
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask Mantu's AI Voice..." className="flex-1 bg-transparent border-none py-5 px-3 text-sm text-white focus:outline-none placeholder:text-slate-800 font-medium" />
                <button onClick={handleSend} className="p-6 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-500 transition-all"><Send size={24}/></button>
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
    <div className={`flex items-center gap-5 p-5 rounded-[2.5rem] cursor-pointer transition-all border ${active ? 'bg-indigo-600/15 text-indigo-400 border-indigo-500/20 shadow-inner' : 'text-slate-700 hover:bg-slate-900/50 hover:text-slate-300 border-transparent'}`}>
      {icon} <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
    </div>
  );
}
