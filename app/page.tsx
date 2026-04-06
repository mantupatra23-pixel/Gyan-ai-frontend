"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, Stars, Grid, OrbitControls, ContactShadows, MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { 
  Send, Zap, BrainCircuit, Trash2, X, Activity, 
  Binary, Volume2, Eye, Heart, Cpu, Image as ImageIcon, 
  Menu, Home, GraduationCap, Dna, Globe, 
  Atom, Satellite, Mic, VolumeX, Network, ChevronUp, ChevronDown, 
  Layers, BoxSelect, FlaskConical, MousePointer2, Settings, Power, HardDrive, RefreshCw
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import 'katex/dist/katex.min.css';

// --- 🌌 INTERACTIVE BACKGROUND PHYSICS ---
function InteractiveStars() {
  const pointsRef = useRef<any>(null);
  const { mouse } = useThree();
  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0008;
      pointsRef.current.position.x = THREE.MathUtils.lerp(pointsRef.current.position.x, mouse.x * 0.8, 0.05);
      pointsRef.current.position.y = THREE.MathUtils.lerp(pointsRef.current.position.y, mouse.y * 0.8, 0.05);
    }
  });
  return <Stars ref={pointsRef} radius={100} depth={60} count={6000} factor={4} saturation={0} fade speed={1.5} />;
}

// --- 🧪 MOLECULE LAB ENGINE ---
function MoleculeLab({ accent }: { accent: string }) {
  const groupRef = useRef<any>(null);
  const colorMap: any = { indigo: "#6366f1", rose: "#e11d48", teal: "#14b8a6", amber: "#f59e0b" };
  
  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y += 0.015;
  });

  return (
    <group ref={groupRef}>
      <Sphere args={[0.7, 32, 32]}><meshStandardMaterial color={colorMap[accent]} emissive={colorMap[accent]} emissiveIntensity={0.5} /></Sphere>
      {[0, 1, 2, 3].map((i) => (
        <group key={i} rotation={[0, (i * Math.PI * 2) / 4, i % 2 === 0 ? 0.5 : -0.5]}>
          <mesh position={[1.6, 0, 0]}><sphereGeometry args={[0.35, 32, 32]} /><meshStandardMaterial color="#ffffff" /></mesh>
          <mesh position={[0.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.06, 0.06, 1.6]} /><meshStandardMaterial color="#334155" /></mesh>
        </group>
      ))}
    </group>
  );
}

export default function GyanAIV29Final() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChemistry, setIsChemistry] = useState(false);
  const [accent, setAccent] = useState("indigo");
  const [latency, setLatency] = useState(0);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // 🔄 AUTO-SYNC API URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://holders-den-improvements-quantity.trycloudflare.com/ask";

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    const saved = localStorage.getItem('gyanai_v29_final');
    if (saved) setMessages(JSON.parse(saved));
    else setMessages([{ id: 1, role: 'ai', text: 'Namaste Mantu! v29.1 Matrix Engine Live. Sidebar tools se theme badlein ya molecule simulate karein.' }]);
  }, []);

  useEffect(() => {
    localStorage.setItem('gyanai_v29_final', JSON.stringify(messages));
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    const lastMsg = messages[messages.length - 1]?.text.toLowerCase() || "";
    setIsChemistry(lastMsg.includes("chemistry") || lastMsg.includes("molecule") || lastMsg.includes("atom"));
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const start = Date.now();
    const userMsg = { id: Date.now(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput(""); setIsTyping(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: userMsg.text }),
      });
      const data = await response.json();
      setLatency(Date.now() - start);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: data.response }]);
      if (synthRef.current) {
        synthRef.current.cancel();
        const ut = new SpeechSynthesisUtterance(data.response.replace(/[*#_\[\]\(\)$]/g, ''));
        ut.onstart = () => setIsSpeaking(true);
        ut.onend = () => setIsSpeaking(false);
        synthRef.current.speak(ut);
      }
    } catch (e) {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: "❌ Connection Broken. Check AWS IP/Tunnel." }]);
    } finally { setIsTyping(false); }
  };

  const themeColors: any = {
    indigo: "bg-indigo-600 border-indigo-400 text-indigo-400 shadow-indigo-600/30",
    rose: "bg-rose-600 border-rose-400 text-rose-400 shadow-rose-600/30",
    teal: "bg-teal-600 border-teal-400 text-teal-400 shadow-teal-600/30",
    amber: "bg-amber-600 border-amber-400 text-amber-400 shadow-amber-600/30",
  };

  return (
    <div className="min-h-screen bg-[#010206] text-slate-300 flex flex-col overflow-hidden relative font-sans select-none">
      
      {/* 🚀 MENU & METRICS */}
      <div className="absolute top-8 left-8 z-[150] flex gap-4">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl transition-all hover:scale-110 active:scale-95 ${themeColors[accent].split(' ')[0]}`}>
          {isSidebarOpen ? <X size={22} className="text-white"/> : <Menu size={22} className="text-white" />}
        </button>
      </div>

      <div className="absolute top-8 right-8 z-[150] bg-black/40 backdrop-blur-2xl border border-white/5 px-6 py-3 rounded-full flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full animate-pulse ${themeColors[accent].split(' ')[0]}`} />
        <span className="text-[10px] font-black tracking-[0.3em] text-white uppercase italic">{latency}ms Latency</span>
      </div>

      {/* 📟 POWER SIDEBAR 6.0 */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.nav initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="fixed top-0 left-0 h-full w-85 bg-slate-950/98 backdrop-blur-4xl z-[140] p-10 pt-36 border-r border-white/5 flex flex-col gap-6 shadow-[50px_0_100px_rgba(0,0,0,0.9)]">
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-4 rounded-[2.2rem] shadow-2xl animate-pulse ${themeColors[accent].split(' ')[0]}`}><Cpu size={26} className="text-white"/></div>
              <h1 className="text-2xl font-black italic text-white tracking-tighter uppercase">GyanAI <span className={`text-[9px] block not-italic font-mono ${themeColors[accent].split(' ')[2]}`}>MATRIX v29.1</span></h1>
            </div>
            
            <div className="flex-1 space-y-3 overflow-y-auto scrollbar-hide">
              <SidebarItem icon={<Home size={18}/>} label="Neural Hub" active accent={accent} themeClasses={themeColors[accent]} />
              <div className="pt-6 pb-2 px-4 text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">Power Tools</div>
              <SidebarItem icon={<Layers size={18}/>} label="Cycle Theme" onClick={() => {
                const colors = ["indigo", "rose", "teal", "amber"];
                setAccent(colors[(colors.indexOf(accent) + 1) % colors.length]);
              }} accent={accent} themeClasses={themeColors[accent]} />
              <SidebarItem icon={<FlaskConical size={18}/>} label="Molecule Lab" onClick={() => setIsChemistry(!isChemistry)} accent={accent} themeClasses={themeColors[accent]} />
              <SidebarItem icon={<RefreshCw size={18}/>} label="Sync Server" onClick={() => window.location.reload()} accent={accent} themeClasses={themeColors[accent]} />
              <SidebarItem icon={<Settings size={18}/>} label="Matrix Config" accent={accent} themeClasses={themeColors[accent]} />
            </div>

            <button onClick={() => {localStorage.clear(); window.location.reload();}} className="p-6 text-red-500 border border-red-500/10 rounded-[3.5rem] text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-4 hover:bg-red-500/10 transition-all"><Power size={18}/> System Off</button>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* 🖥️ MAIN WORKSPACE */}
      <main className={`flex-1 flex flex-col p-4 md:p-10 gap-8 transition-all duration-700 ${isSidebarOpen ? 'blur-3xl scale-95 opacity-40 translate-x-12' : ''}`}>
        <div className="flex flex-col xl:flex-row gap-8 h-full max-h-[92vh] z-10">
          
          <div className="flex-[2.8] flex flex-col gap-8">
            {/* 🌌 DYNAMIC VIEWER */}
            <div className="relative aspect-video lg:h-[480px] bg-black rounded-[7.5rem] border border-white/5 overflow-hidden shadow-3xl">
              <Canvas camera={{ position: [0, 2, 8], fov: 40 }}>
                 <ambientLight intensity={0.5} />
                 <InteractiveStars />
                 <Grid infiniteGrid sectionSize={3} sectionColor="#1e1b4b" cellColor="#020617" />
                 <OrbitControls enablePan={false} />
                 <Float speed={4}>
                    {isChemistry ? <MoleculeLab accent={accent} /> : (
                      <mesh>
                        <sphereGeometry args={[1.5, 64, 64]} />
                        <MeshDistortMaterial color={accent === 'indigo' ? "#6366f1" : (accent === 'rose' ? "#e11d48" : (accent === 'teal' ? "#14b8a6" : "#f59e0b"))} speed={isTyping ? 10 : 2} distort={0.4} metalness={1} roughness={0} />
                      </mesh>
                    )}
                 </Float>
                 <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4.5} />
              </Canvas>
              <div className="absolute top-12 left-12 flex items-center gap-4 bg-black/40 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10">
                 <MousePointer2 size={14} className="text-white animate-bounce" />
                 <p className="text-[10px] font-black text-white uppercase tracking-[0.4em] italic">Horizon {isChemistry ? 'Lab' : 'Active'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 flex-1">
               <div className="bg-slate-950/30 rounded-[5rem] border border-white/5 p-8 flex flex-col justify-center items-center group transition-all hover:bg-white/5">
                  <Activity className={`mb-3 ${isSpeaking ? 'text-rose-500 animate-bounce' : 'text-slate-800'}`} size={38} />
                  <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest leading-none">Neural Pulse</p>
               </div>
               <div className="bg-slate-950/30 rounded-[5rem] border border-white/5 p-8 flex flex-col justify-center items-center group transition-all hover:bg-white/5">
                  <Zap className={`mb-3 ${isTyping ? 'text-amber-500 animate-pulse' : 'text-slate-800'}`} size={38} />
                  <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest italic">Syncing Token</p>
               </div>
            </div>
          </div>

          {/* CHAT HUB */}
          <div className="flex-1 min-w-[440px] bg-slate-950/90 rounded-[8rem] border border-white/5 flex flex-col shadow-2xl overflow-hidden backdrop-blur-4xl relative group">
            
            <button onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })} className="absolute top-[130px] right-8 z-[100] p-4 bg-white/5 hover:bg-indigo-600 rounded-full border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all">
              <ChevronUp size={20} />
            </button>

            <div className="p-12 border-b border-white/10 flex items-center justify-between">
               <div className={`flex items-center gap-4 font-black italic text-xs tracking-[0.4em] ${themeColors[accent].split(' ')[2]}`}>
                  <Eye size={20} className="animate-pulse" /> MATRIX HUB
               </div>
               <div className="flex items-center gap-4">
                 {isSpeaking && <VolumeX size={22} className="text-rose-500 cursor-pointer" onClick={() => window.speechSynthesis.cancel()} />}
                 <Volume2 size={24} className={isSpeaking ? themeColors[accent].split(' ')[2] : "text-slate-800"} />
               </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-12 space-y-12 scrollbar-hide relative pt-24">
              <AnimatePresence>
                {messages.map((m) => (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col ${m.role === 'ai' ? 'items-start' : 'items-end'}`}>
                    <div className={`max-w-[95%] p-10 rounded-[5rem] text-[15.5px] leading-relaxed shadow-3xl ${m.role === 'ai' ? 'bg-slate-900/98 text-slate-100 border border-white/5 rounded-tl-none' : `${themeColors[accent].split(' ')[0]} text-white rounded-tr-none ${themeColors[accent].split(' ')[3]}`}`}>
                      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{m.text}</ReactMarkdown>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <button onClick={() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })} className="absolute bottom-[160px] right-8 z-[100] p-4 bg-white/5 hover:bg-indigo-600 rounded-full border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all">
              <ChevronDown size={20} />
            </button>

            {/* COMMAND HUB */}
            <div className="p-12 pt-4 relative z-[150]">
              <div className="flex items-center gap-3 bg-slate-900/90 border border-white/10 p-3 rounded-[7rem] shadow-inner focus-within:border-white/20 transition-all">
                <button className="p-6 text-slate-600 hover:text-white"><Mic size={24}/></button>
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Issue Neural Command..." className="flex-1 bg-transparent border-none py-6 px-4 text-sm text-white focus:outline-none placeholder:text-slate-800 font-medium" />
                <button onClick={handleSend} className={`p-8 rounded-full shadow-2xl active:scale-95 transition-all ${themeColors[accent].split(' ')[0]} text-white`}><Send size={28}/></button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active = false, onClick, accent, themeClasses }: any) {
  const getColors = () => {
    if (active) return `${themeClasses.split(' ')[0]} text-white shadow-xl`;
    if (accent === "rose") return "text-slate-600 hover:text-rose-400";
    if (accent === "teal") return "text-slate-600 hover:text-teal-400";
    if (accent === "amber") return "text-slate-600 hover:text-amber-400";
    return "text-slate-600 hover:text-indigo-400";
  };

  return (
    <button onClick={onClick} className={`flex items-center gap-6 p-6 w-full rounded-[4.5rem] border border-transparent transition-all ${getColors()}`}>
      {icon} <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
    </button>
  );
}
