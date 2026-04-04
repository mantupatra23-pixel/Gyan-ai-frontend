"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Stars } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, Image as ImageIcon, Send, Sparkles, Zap, Bot, 
  BrainCircuit, LayoutDashboard, Globe, Terminal, PenTool, Volume2, Activity
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

// --- 🌌 3D KNOWLEDGE GALAXY BACKGROUND ---
function KnowledgeStars() {
  const ref = useRef<any>(null);
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 20;
      ref.current.rotation.y -= delta / 25;
    }
  });
  return (
    <group>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <mesh ref={ref}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <MeshDistortMaterial color="#4f46e5" speed={2} distort={0.4} radius={1} />
      </mesh>
    </group>
  );
}

export default function GyanAIV6Final() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    { id: 1, role: 'ai', text: 'Namaste Mantu! v6.0 Oracle System active. Main taiyar hoon aapke sawalon ka jawab dene ke liye.' }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  // --- 🎙️ VOICE ENGINE (Text-to-Speech) ---
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); 
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.pitch = 1.1;
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  // --- 🧠 BACKEND CONNECTION ---
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // Connect to your Localtunnel Link
      const response = await fetch('https://odd-years-see.loca.lt/ask', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Bypass-Tunnel-Reminder': 'true' 
        },
        body: JSON.stringify({ text: input }),
      });

      if (!response.ok) throw new Error("Tunnel Offline");

      const data = await response.json();
      const aiResponse = data.response;
      
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: aiResponse }]);
      speak(aiResponse); // AI will speak the answer

    } catch (error) {
      console.error("Error:", error);
      const errorMsg = "Mantu, lagta hai AWS server se connection toot gaya hai. Ek baar tunnel check karein.";
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: errorMsg }]);
      speak(errorMsg);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 flex flex-col lg:flex-row overflow-hidden font-sans relative">
      
      {/* --- SIDEBAR NAVIGATION --- */}
      <nav className="hidden lg:flex w-72 flex-col bg-slate-950/90 backdrop-blur-3xl border-r border-indigo-500/10 p-6 z-20 relative">
        <div className="flex items-center gap-3 mb-12">
          <BrainCircuit className="text-indigo-500 w-8 h-8 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
          <h1 className="text-2xl font-black text-white tracking-widest uppercase italic">Gyan<span className="text-indigo-500">AI</span></h1>
        </div>
        
        <div className="space-y-2 flex-1">
          <SidebarItem icon={<LayoutDashboard size={18}/>} label="The Oracle" active />
          <SidebarItem icon={<Globe size={18}/>} label="Galaxy Maps" />
          <SidebarItem icon={<Terminal size={18}/>} label="Code Engine" />
          <SidebarItem icon={<Activity size={18}/>} label="Neural Load" />
        </div>

        {/* VOICE HUD */}
        <div className="p-4 bg-indigo-950/20 rounded-3xl border border-indigo-500/20 text-[10px] font-mono">
           <div className="flex justify-between items-center text-teal-400 mb-2">
              <span>VOICE SYNC</span>
              <span className={isSpeaking ? "animate-pulse" : ""}>{isSpeaking ? "ACTIVE" : "IDLE"}</span>
           </div>
           <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                    animate={{ width: isSpeaking ? '100%' : '0%' }} 
                    className="h-full bg-teal-500" 
                />
           </div>
        </div>

        <div className="absolute inset-0 opacity-20 pointer-events-none -z-10">
            <Canvas><KnowledgeStars /></Canvas>
        </div>
      </nav>

      {/* --- MAIN CORE INTERFACE --- */}
      <main className="flex-1 flex flex-col p-4 md:p-6 gap-6 relative z-10">
        <div className="flex flex-col xl:flex-row gap-6 h-full max-h-[92vh]">
          
          {/* TEACHER VISUALIZER (3D) */}
          <div className="flex-[2.5] flex flex-col gap-6 overflow-hidden">
            <div className="relative aspect-video lg:h-[380px] bg-black rounded-[3.5rem] border border-indigo-500/20 overflow-hidden shadow-2xl">
              <div className="h-full w-full flex items-center justify-center">
                 <Canvas camera={{ position: [0, 0, 5] }}>
                    <ambientLight intensity={0.5} />
                    <Float speed={4}>
                       <Sphere args={[1.2, 64, 64]}>
                          <MeshDistortMaterial 
                            color={isSpeaking ? "#ec4899" : "#6366f1"} 
                            speed={isTyping || isSpeaking ? 10 : 2} 
                            distort={isTyping || isSpeaking ? 0.7 : 0.3} 
                            emissive={isSpeaking ? "#db2777" : "#4f46e5"}
                            emissiveIntensity={0.6}
                          />
                       </Sphere>
                    </Float>
                 </Canvas>
              </div>
              
              {/* VOICE WAVES ANIMATION */}
              <div className="absolute bottom-10 w-full flex justify-center gap-1">
                  <AnimatePresence>
                    {isSpeaking && [1,2,3,4,5].map(i => (
                        <motion.div 
                            key={i} 
                            initial={{ height: 4 }} 
                            animate={{ height: [4, 20, 4] }} 
                            transition={{ repeat: Infinity, duration: 0.4, delay: i*0.1 }} 
                            className="w-1.5 bg-pink-500 rounded-full" 
                        />
                    ))}
                  </AnimatePresence>
              </div>
            </div>

            {/* NEURAL RENDER CANVAS */}
            <div className="flex-1 bg-slate-950/40 rounded-[3.5rem] border border-slate-800/60 p-8 flex flex-col">
               <div className="flex items-center gap-2 mb-4 text-slate-600">
                  <PenTool size={14} />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Neural Sketch Pad</span>
               </div>
               <div className="flex-1 border border-dashed border-indigo-500/10 rounded-[2rem] flex items-center justify-center">
                  <p className="text-[10px] font-mono text-indigo-900 uppercase animate-pulse tracking-widest">System Ready Mantu</p>
               </div>
            </div>
          </div>

          {/* CHAT COMMAND CENTER */}
          <div className="flex-1 min-w-[360px] bg-[#0b0f1a] rounded-[4rem] border border-indigo-500/10 flex flex-col shadow-2xl relative overflow-hidden">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-slate-900/10">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 flex items-center justify-center border border-indigo-500/20">
                     <Zap size={20} className="text-indigo-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm uppercase tracking-tight">Oracle Interface</h3>
                    <p className="text-[8px] text-indigo-400 font-black uppercase tracking-widest italic">Live Llama-3 Node</p>
                  </div>
               </div>
               <Volume2 size={18} className={isSpeaking ? "text-pink-500 animate-pulse" : "text-slate-800"} />
            </div>

            {/* CHAT MESSAGES */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
              {messages.map((m) => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[92%] p-5 rounded-[2.5rem] text-[13px] leading-relaxed shadow-xl ${
                    m.role === 'ai' 
                    ? 'bg-slate-900 text-indigo-50 border border-indigo-500/10 rounded-tl-none backdrop-blur-xl' 
                    : 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-600/20'
                  }`}>
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                        {m.text}
                    </ReactMarkdown>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 ml-4">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                    <span className="text-[9px] font-black text-indigo-900 uppercase tracking-widest">Processing Data...</span>
                </div>
              )}
            </div>

            {/* INPUT HUB */}
            <div className="p-8 bg-slate-950/30 backdrop-blur-3xl">
              <div className="flex items-center gap-3 bg-slate-900/60 border border-indigo-500/10 p-2 rounded-[3rem] shadow-inner focus-within:border-indigo-500/40 transition-all">
                <button className="p-4 text-slate-600 hover:text-indigo-400"><ImageIcon size={20}/></button>
                <button className="p-4 text-slate-600 hover:text-indigo-400"><Mic size={20}/></button>
                <input 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
                    placeholder="Ask Mantu's AI Oracle..." 
                    className="flex-1 bg-transparent border-none py-3 text-sm text-white focus:outline-none placeholder:text-slate-700" 
                />
                <button onClick={handleSend} className="p-4 bg-indigo-600 text-white rounded-full shadow-lg active:scale-90 transition-all">
                    <Send size={20} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

// Sidebar Component
function SidebarItem({ icon, label, active = false }: any) {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border ${
        active ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/20 shadow-inner' : 'text-slate-600 hover:bg-slate-900/50 hover:text-slate-300 border-transparent'
    }`}>
      <div className={active ? "text-indigo-500" : ""}>{icon}</div>
      <span className="text-[10px] font-black tracking-[0.2em] uppercase">{label}</span>
    </div>
  );
}
