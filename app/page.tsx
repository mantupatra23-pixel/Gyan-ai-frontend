"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float, Sphere, MeshDistortMaterial, Stars } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, Image as ImageIcon, Send, Sparkles, Zap, Bot, 
  Activity, Cpu, Globe, Terminal, BrainCircuit, LayoutDashboard, 
  Database, Radio, Gauge, PenTool 
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

// --- 🌌 3D KNOWLEDGE GALAXY ---
function KnowledgeStars() {
  const ref = useRef<any>(null);
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 15;
      ref.current.rotation.y -= delta / 20;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <mesh ref={ref}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <MeshDistortMaterial color="#4f46e5" speed={2} distort={0.4} radius={1} />
      </mesh>
    </group>
  );
}

export default function GyanAIFinalSecure() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    { id: 1, role: 'ai', text: 'Neural-Sync v5.0 Active. Secure HTTPS Tunnel established. Main taiyar hoon, Mantu!' }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  // --- 🧠 SECURE BACKEND CONNECTION LOGIC ---
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // Using your Secure Localtunnel Link
      const response = await fetch('https://odd-years-see.loca.lt/ask', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Bypass-Tunnel-Reminder': 'true' // Standard header for localtunnel
        },
        body: JSON.stringify({ text: input }),
      });

      if (!response.ok) throw new Error("Tunnel Offline");

      const data = await response.json();
      
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        role: 'ai', 
        text: data.response 
      }]);
    } catch (error) {
      console.error("Tunnel Error:", error);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        role: 'ai', 
        text: "Neural Core Error: Please open https://odd-years-see.loca.lt in a new tab first and click 'Submit' if prompted." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 flex flex-col lg:flex-row overflow-hidden font-sans relative">
      
      {/* --- SIDEBAR --- */}
      <nav className="hidden lg:flex w-80 flex-col bg-slate-950/90 backdrop-blur-2xl border-r border-indigo-500/10 p-6 z-20 relative">
        <div className="z-10 relative">
          <div className="flex items-center gap-3 mb-12">
            <div className="p-2 bg-indigo-600 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.6)]">
              <BrainCircuit className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-widest uppercase italic">GyanAI</h1>
          </div>
          
          <div className="space-y-2 mb-10">
            <SidebarItem icon={<LayoutDashboard size={18}/>} label="Console" active />
            <SidebarItem icon={<Globe size={18}/>} label="Galaxy Hub" />
            <SidebarItem icon={<Terminal size={18}/>} label="Logic Lab" />
          </div>

          <div className="p-4 bg-indigo-950/20 rounded-3xl border border-indigo-500/20 space-y-4 font-mono text-[10px]">
             <div className="flex justify-between items-center text-indigo-400">
                <span>TUNNEL STATUS</span><span className="text-teal-400 font-black animate-pulse">SECURE</span>
             </div>
             <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <motion.div animate={{ width: '100%' }} className="h-full bg-teal-500"></motion.div>
             </div>
          </div>
        </div>

        <div className="absolute inset-0 h-full w-full opacity-30 pointer-events-none">
           <Canvas><KnowledgeStars /></Canvas>
        </div>
      </nav>

      {/* --- MAIN COMMAND CENTER --- */}
      <main className="flex-1 flex flex-col p-2 md:p-6 gap-6 relative z-10">
        <div className="flex flex-col xl:flex-row gap-6 h-full max-h-[92vh]">
          
          {/* LEFT: 3D VISUALIZER */}
          <div className="flex-[2.8] flex flex-col gap-6 overflow-hidden">
            <div className="relative aspect-video lg:h-[400px] bg-black rounded-[3rem] border border-indigo-500/20 overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#4338ca22_0%,_transparent_70%)]"></div>
              
              <div className="h-full w-full flex items-center justify-center">
                 <Canvas camera={{ position: [0, 0, 5] }}>
                    <ambientLight intensity={0.5} />
                    <Float speed={4} rotationIntensity={1} floatIntensity={2}>
                       <Sphere args={[1.2, 64, 64]}>
                          <MeshDistortMaterial color="#6366f1" speed={isTyping ? 10 : 2} distort={isTyping ? 0.6 : 0.3} roughness={0} emissive="#4f46e5" emissiveIntensity={0.5} />
                       </Sphere>
                    </Float>
                 </Canvas>
              </div>
            </div>

            <div className="flex-1 bg-slate-950/40 rounded-[3rem] border border-slate-800/60 p-8 relative overflow-hidden flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <PenTool size={14} className="text-indigo-500" />
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Neural Render Canvas</span>
                </div>
                <div className="flex-1 border border-indigo-500/10 rounded-[2rem] flex items-center justify-center bg-slate-900/10">
                    <motion.div animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ repeat: Infinity, duration: 4 }} className="text-indigo-900 font-mono text-[10px]">
                       {isTyping ? "LLAMA-3 IS PROCESSING DATA..." : "SECURE BRIDGE ACTIVE"}
                    </motion.div>
                </div>
            </div>
          </div>

          {/* RIGHT: COMMAND HUB */}
          <div className="flex-1 min-w-[360px] bg-[#0b0f1a] rounded-[3.5rem] border border-indigo-500/20 flex flex-col shadow-2xl relative overflow-hidden">
            <div className="p-8 border-b border-white/5 bg-slate-900/10 flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center border border-indigo-500/20 shadow-inner">
                  <Zap size={22} className="text-indigo-500" />
               </div>
               <div>
                  <h3 className="font-bold text-white tracking-tight">AI Command Center</h3>
                  <p className="text-[9px] text-indigo-400 font-black uppercase tracking-widest italic tracking-tighter">Secure Tunnel Mode</p>
               </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
              <AnimatePresence mode="popLayout">
                {messages.map((m) => (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[90%] p-5 rounded-[2.2rem] text-sm ${m.role === 'ai' ? 'bg-slate-900 text-indigo-50 border border-indigo-500/10 rounded-tl-none' : 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-600/10'}`}>
                        <div className="markdown-content prose prose-invert max-w-none text-sm leading-relaxed">
                          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{m.text}</ReactMarkdown>
                        </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isTyping && <div className="ml-4 text-[9px] font-black text-indigo-500 uppercase animate-pulse">Neural Core Processing...</div>}
            </div>

            <div className="p-8 bg-slate-950/50 backdrop-blur-3xl">
              <div className="flex items-center gap-3 bg-slate-900/80 border border-indigo-500/10 p-3 rounded-[2.5rem] focus-within:border-indigo-500/40 transition-all shadow-inner">
                <button className="p-3 text-slate-600 hover:text-indigo-400 transition-colors"><ImageIcon size={20}/></button>
                <button className="p-3 text-slate-600 hover:text-indigo-400 transition-colors"><Mic size={20}/></button>
                <input 
                   value={input} 
                   onChange={(e) => setInput(e.target.value)} 
                   onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
                   placeholder="Enter your query..." 
                   className="flex-1 bg-transparent border-none py-3 px-2 text-sm text-white focus:outline-none placeholder:text-slate-700" 
                />
                <button onClick={handleSend} className="p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-500 active:scale-95 transition-all"><Send size={20}/></button>
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
      <div className={`${active ? 'text-indigo-500' : ''}`}>{icon}</div>
      <span className="text-[10px] font-black tracking-widest uppercase">{label}</span>
    </div>
  );
}
