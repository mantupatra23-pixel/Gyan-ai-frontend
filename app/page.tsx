"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Stars, Grid, OrbitControls, ContactShadows, MeshDistortMaterial, PerspectiveCamera } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Zap, BrainCircuit, Trash2, X, Activity, 
  Binary, Volume2, Eye, Heart, Cpu, Image as ImageIcon, 
  FlaskConical, History, Sparkles, Menu, Home, 
  GraduationCap, Dna, BarChart3, Globe, Atom, Satellite, Pencil
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import 'katex/dist/katex.min.css';

// --- ⚛️ ATOMIC MOLECULE COMPONENT (H2O Example) ---
function MolecularLab({ isThinking }: { isThinking: boolean }) {
  const ref = useRef<any>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += isThinking ? 0.06 : 0.01;
      ref.current.rotation.x += 0.005;
    }
  });

  return (
    <group ref={ref}>
      {/* Central Atom (Oxygen) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#ef4444" emissive="#7f1d1d" emissiveIntensity={0.5} />
      </mesh>
      {/* Hydrogen 1 */}
      <mesh position={[1.2, 0.8, 0]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Hydrogen 2 */}
      <mesh position={[-1.2, 0.8, 0]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Bonds */}
      <mesh position={[0.6, 0.4, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <cylinderGeometry args={[0.05, 0.05, 1.2]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
      <mesh position={[-0.6, 0.4, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.05, 0.05, 1.2]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
    </group>
  );
}

// --- 📐 UNIVERSAL VIEWER CORE ---
function UniversalViewer({ isThinking, shapeType, isSpeaking }: { isThinking: boolean, shapeType: string, isSpeaking: boolean }) {
  const meshRef = useRef<any>(null);
  useFrame((state) => {
    if (meshRef.current) {
      const pulse = isSpeaking ? 1.1 + Math.sin(state.clock.getElapsedTime() * 12) * 0.05 : 1;
      meshRef.current.scale.setScalar(pulse);
      meshRef.current.rotation.y += 0.01;
    }
  });

  if (shapeType === 'atom' || shapeType === 'chemistry') return <MolecularLab isThinking={isThinking} />;
  
  return (
    <Float speed={4}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <MeshDistortMaterial 
          color={isSpeaking ? "#ec4899" : (isThinking ? "#f59e0b" : "#6366f1")} 
          speed={isThinking ? 15 : 2} 
          distort={0.4} 
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </Float>
  );
}

export default function GyanAIV23() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [currentShape, setCurrentShape] = useState("sphere");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [lang, setLang] = useState("hi-IN");
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const API_URL = "https://scott-zoloft-seriously-appear.trycloudflare.com/ask";

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    const saved = localStorage.getItem('gyanai_v23');
    if (saved) setMessages(JSON.parse(saved));
    else setMessages([{ id: 1, role: 'ai', text: 'Namaste Mantu! v23.0 Global Classroom active. Aaj Chemistry Lab mein Atoms dekhein ya Satellite News?' }]);
  }, []);

  useEffect(() => {
    localStorage.setItem('gyanai_v23', JSON.stringify(messages));
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    
    const lastMsg = messages[messages.length - 1]?.text.toLowerCase() || "";
    if (lastMsg.includes("atom") || lastMsg.includes("chemistry") || lastMsg.includes("molecule")) setCurrentShape("atom");
    else if (lastMsg.includes("dna")) setCurrentShape("dna");
    else setCurrentShape("sphere");
  }, [messages]);

  const speak = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[*#_\[\]\(\)$]/g, ''));
    utterance.lang = lang;
    utterance.rate = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    synthRef.current.speak(utterance);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
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
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: data.response }]);
      speak(data.response);
    } catch (e) {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: "Satellite Link Offline." }]);
    } finally { setIsTyping(false); }
  };

  return (
    <div className="min-h-screen bg-[#010204] text-slate-300 flex flex-col overflow-hidden relative font-sans">
      
      {/* ☰ GLOBAL MENU */}
      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="absolute top-8 left-8 z-[100] p-5 bg-indigo-600/30 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl">
        {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* 📟 SATELLITE SIDEBAR */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.nav initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="fixed top-0 left-0 h-full w-85 bg-slate-950/95 backdrop-blur-3xl z-[90] p-10 pt-36 border-r border-white/5 flex flex-col gap-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-indigo-600 rounded-[2rem] shadow-xl shadow-indigo-500/40"><Satellite className="text-white" size={24}/></div>
              <h1 className="text-2xl font-black italic text-white tracking-tighter leading-none">GyanAI <span className="text-[10px] block text-indigo-400 not-italic font-mono mt-1">GLOBAL v23</span></h1>
            </div>
            
            <div className="flex-1 space-y-3 overflow-y-auto scrollbar-hide">
              <SidebarItem icon={<Home size={18}/>} label="Neural Hub" active onClick={() => setIsSidebarOpen(false)} />
              <SidebarItem icon={<Atom size={18}/>} label="Chemistry Lab" onClick={() => {setCurrentShape('atom'); setIsSidebarOpen(false);}} />
              <SidebarItem icon={<Globe size={18}/>} label="Language Hub" onClick={() => setLang(lang === 'hi-IN' ? 'en-US' : 'hi-IN')} />
              
              <div className="mt-8 p-6 bg-slate-900/40 rounded-[3rem] border border-white/5">
                 <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2 animate-pulse"><Zap size={12}/> Satellite News</p>
                 <p className="text-[11px] text-slate-400 leading-relaxed italic">NASA's Artemis III mission plans landing near Lunar South Pole...</p>
              </div>
            </div>

            <button onClick={() => {localStorage.clear(); window.location.reload();}} className="p-6 text-red-500 hover:bg-red-500/10 rounded-[3rem] text-xs font-black uppercase tracking-widest flex items-center gap-4 transition-all">
              <Trash2 size={18}/> Reset Hub
            </button>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* 🖥️ GLOBAL INTERFACE */}
      <main className={`flex-1 flex flex-col p-4 md:p-10 gap-8 transition-all duration-700 ${isSidebarOpen ? 'blur-3xl scale-95 opacity-50' : ''}`}>
        <div className="flex flex-col xl:flex-row gap-8 h-full max-h-[92vh] z-10">
          
          <div className="flex-[2.8] flex flex-col gap-8">
            {/* 3D ATOMIC VIEWER */}
            <div className="relative aspect-video lg:h-[480px] bg-black rounded-[6.5rem] border border-white/10 overflow-hidden shadow-3xl shadow-indigo-500/5">
              <Canvas camera={{ position: [0, 2, 8], fov: 40 }}>
                 <ambientLight intensity={0.5} />
                 <Stars radius={100} depth={50} count={2500} factor={4} fade speed={1} />
                 <Grid infiniteGrid fadeDistance={50} fadeStrength={5} sectionSize={3} sectionColor="#4338ca" cellColor="#1e1b4b" />
                 <OrbitControls enablePan={false} />
                 <UniversalViewer isThinking={isTyping} shapeType={currentShape} isSpeaking={isSpeaking} />
                 <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4.5} />
              </Canvas>
              
              <div className="absolute top-12 left-12 flex items-center gap-3 bg-black/40 backdrop-blur-xl px-6 py-2.5 rounded-full border border-white/5">
                 <div className={`w-2.5 h-2.5 rounded-full ${isSpeaking ? 'bg-pink-500 animate-pulse' : 'bg-teal-500 shadow-[0_0_15px_#14b8a6]'}`} />
                 <p className="text-[10px] font-black text-white uppercase tracking-[0.4em] italic leading-none">Classroom: {currentShape.toUpperCase()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 flex-1">
               <div className="bg-slate-950/20 rounded-[4.5rem] border border-white/5 p-8 flex flex-col justify-center items-center group hover:bg-indigo-500/5 transition-all">
                  <Pencil className="text-slate-800 mb-3 group-hover:text-indigo-400" size={38} />
                  <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest leading-none">AI Sketcher</p>
               </div>
               <div className="bg-slate-950/20 rounded-[4.5rem] border border-white/5 p-8 flex flex-col justify-center items-center group hover:bg-pink-600/5 transition-all">
                  <Activity className={`mb-3 ${isSpeaking ? 'text-pink-500 animate-bounce' : 'text-slate-800'}`} size={38} />
                  <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest leading-none">Speech Sync</p>
               </div>
            </div>
          </div>

          {/* CHAT HUB */}
          <div className="flex-1 min-w-[440px] bg-slate-950/80 rounded-[7rem] border border-white/5 flex flex-col shadow-2xl overflow-hidden backdrop-blur-4xl relative">
            <div className="p-12 border-b border-white/10 flex items-center justify-between bg-white/5">
               <div className="flex items-center gap-4 text-indigo-400 font-black italic text-sm tracking-widest">
                  <Eye size={20} /> GLOBAL HUB v23
               </div>
               <div className="flex items-center gap-4">
                 <Globe size={20} className={lang === 'hi-IN' ? "text-teal-400" : "text-slate-800"} />
                 <Volume2 size={24} className={isSpeaking ? "text-indigo-500" : "text-slate-800"} />
               </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-12 space-y-12 scrollbar-hide">
              <AnimatePresence>
                {messages.map((m) => (
                  <motion.div key={m.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`flex flex-col ${m.role === 'ai' ? 'items-start' : 'items-end'}`}>
                    <div className={`max-w-[95%] p-10 rounded-[4.5rem] text-[15.5px] leading-relaxed shadow-3xl ${m.role === 'ai' ? 'bg-slate-900 text-slate-100 border border-white/5 rounded-tl-none' : 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-600/30'}`}>
                      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{m.text}</ReactMarkdown>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isTyping && <div className="ml-12 w-2 h-2 bg-indigo-500 rounded-full animate-ping" />}
            </div>

            {/* INPUT HUB */}
            <div className="p-12 pt-4">
              <div className="flex items-center gap-3 bg-slate-900/90 border border-white/10 p-3 rounded-[5.5rem] shadow-inner focus-within:border-indigo-500/50 transition-all">
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask Global Oracle..." className="flex-1 bg-transparent border-none py-6 px-6 text-sm text-white focus:outline-none placeholder:text-slate-800 font-medium" />
                <button onClick={handleSend} className="p-8 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-500 active:scale-95 transition-all"><Send size={28}/></button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active = false, onClick }: any) {
  return (
    <button onClick={onClick} className={`flex items-center gap-6 p-6 w-full rounded-[4rem] border transition-all ${active ? 'bg-indigo-600 text-white border-indigo-400 shadow-xl' : 'text-slate-600 border-transparent hover:bg-white/5 hover:text-slate-200'}`}>
      {icon} <span className="text-xs font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}
