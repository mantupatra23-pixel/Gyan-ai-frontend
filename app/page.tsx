"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Box, Cylinder, MeshDistortMaterial, Stars, Grid, PresentationControls, ContactShadows, Points, PointMaterial } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Zap, BrainCircuit, FolderRoot, Trash2, X, Activity, 
  Box as BoxIcon, Binary, Volume2, Eye, Heart, Cpu, Image as ImageIcon, 
  Settings2, FlaskConical, History, Sparkles, SlidersHorizontal, VolumeX, Menu, Home, BookOpen, LineChart, FileText, ScanText
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
// For Graphing
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chartjs-2.js';

import 'katex/dist/katex.min.css';

// ChartJS setup
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// --- 📈 INTERACTIVE GRAPH COMPONENT ---
function FunctionPlotter({ functionStr }: { functionStr: string }) {
  const data = useMemo(() => {
    const labels = [];
    const points = [];
    try {
      // Basic math parsing logic (very simplified for this demo)
      const cleanFunc = functionStr.replace(/\$/g, '').toLowerCase();
      if (cleanFunc.includes('sin(x)')) {
        for (let x = -Math.PI * 2; x <= Math.PI * 2; x += 0.1) {
          labels.push(x.toFixed(1));
          points.push(Math.sin(x));
        }
      } else if (cleanFunc.includes('x^2')) {
        for (let x = -10; x <= 10; x += 0.5) {
          labels.push(x.toFixed(1));
          points.push(x * x);
        }
      }
    } catch (e) {
      console.log("Graphing error:", e);
    }

    return {
      labels: labels,
      datasets: [
        {
          label: functionStr,
          data: points,
          borderColor: '#4f46e5',
          backgroundColor: 'rgba(79, 70, 229, 0.2)',
          tension: 0.4,
          pointRadius: 0,
        },
      ],
    };
  }, [functionStr]);

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#64748b', font: { size: 9 } } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#64748b', font: { size: 9 } } },
    },
  };

  if (data.datasets[0].data.length === 0) return null; // Only plot if parsing succeeded

  return (
    <div className="mt-8 p-6 bg-slate-950/60 rounded-[2rem] border border-white/5 shadow-inner">
      <Line data={data} options={options} />
      <p className="text-[10px] text-slate-600 mt-4 text-center font-mono">Real-time Plot: {functionStr}</p>
    </div>
  );
}

// --- 🧬 PLASMA CORE ENGINE (Thinking Sync) ---
function PlasmaCore({ isThinking, shapeType, labValue }: { isThinking: boolean, shapeType: string, labValue: number }) {
  const meshRef = useRef<any>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const pulse = isThinking ? 1.1 + Math.sin(state.clock.getElapsedTime() * 15) * 0.08 : 1;
      meshRef.current.scale.setScalar(pulse * (labValue / 50));
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Float speed={5} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef}>
        {shapeType === 'cylinder' ? <cylinderGeometry args={[1, 1, 2.8, 32]} /> : 
         shapeType === 'box' ? <boxGeometry args={[1.8, 1.8, 1.8]} /> : 
         <sphereGeometry args={[1.5, 64, 64]} />}
        
        <MeshDistortMaterial 
          color={isThinking ? "#f59e0b" : "#6366f1"} // Yellow Thinking, Blue Normal
          speed={isThinking ? 15 : 2} 
          distort={0.4} 
          emissive={isThinking ? "#a16207" : "#1e1b4b"}
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </Float>
  );
}

export default function GyanAIV19() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [currentShape, setCurrentShape] = useState("sphere");
  const [labValue, setLabValue] = useState(50);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOcrScan, setIsOcrScan] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const API_URL = "https://scott-zoloft-seriously-appear.trycloudflare.com/ask";

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    const saved = localStorage.getItem('gyanai_v19_mantu');
    if (saved) setMessages(JSON.parse(saved));
    else setMessages([{ id: 1, role: 'ai', text: 'Namaste Mantu! v19.0 Lab Mode Active. Main mathematical functions plot aur documents analyze karne ke liye taiyar hoon.' }]);
  }, []);

  useEffect(() => {
    localStorage.setItem('gyanai_v19_mantu', JSON.stringify(messages));
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    
    // Auto-Shape Switcher
    const lastMsg = messages[messages.length - 1]?.text.toLowerCase() || "";
    if (lastMsg.includes("cylinder")) setCurrentShape("cylinder");
    else if (lastMsg.includes("box") || lastMsg.includes("cube")) setCurrentShape("box");
    else setCurrentShape("sphere");
  }, [messages]);

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
    setInput(""); setSelectedImage(null); setIsTyping(true); setIsOcrScan(!!selectedImage);

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
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: "❌ Connection Error. Backend unreachable." }]);
    } finally { setIsTyping(false); setIsOcrScan(false); }
  };

  return (
    <div className="min-h-screen bg-[#010204] text-slate-300 flex flex-col overflow-hidden relative font-sans">
      
      {/* ☰ HAMBURGER TRIGGER */}
      <div className="absolute top-8 left-8 z-[100]">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-5 bg-indigo-600/20 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] hover:bg-indigo-600/40 transition-all shadow-2xl">
          {isSidebarOpen ? <X size={20} className="text-white"/> : <Menu size={20} className="text-white"/>}
        </button>
      </div>

      {/* 📟 MULTI-MODAL SIDEBAR */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[80]" />
            <motion.nav initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25 }} className="fixed top-0 left-0 h-full w-80 bg-slate-950/90 border-r border-white/5 backdrop-blur-3xl z-[90] p-10 pt-36 flex flex-col gap-8 shadow-3xl shadow-black/80">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3.5 bg-indigo-600 rounded-[2rem]"><FlaskConical size={24} className="text-white animate-pulse"/></div>
                <h1 className="text-2xl font-black italic text-white tracking-tighterleading-none">GyanAI <span className="text-[9px] text-indigo-400 block not-italic font-mono">LAB v19</span></h1>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto scrollbar-hide">
                <SidebarItem icon={<Home size={18}/>} label="Neural Hub" active />
                <SidebarItem icon={<FileText size={18}/>} label="Document Intel" />
                <SidebarItem icon={<History size={18}/>} label="ExamprepVault" />
                <SidebarItem icon={<Volume2 size={18}/>} label="Voice Mod" />
                
                <div className="mt-10 p-6 bg-slate-900/50 rounded-[3rem] border border-white/5">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">Neural Complexity</p>
                  <input type="range" min="0" max="100" value={labValue} onChange={(e) => setLabValue(parseInt(e.target.value))} className="w-full accent-indigo-500 h-1.5 rounded-full" />
                </div>
              </div>
              <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="flex items-center gap-4 p-5 text-slate-500 hover:text-red-500 transition-all rounded-3xl"><Trash2 size={18} /> <span className="text-xs font-black uppercase tracking-widest">Wipe AI</span></button>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* 🖥️ MAIN LAB HUB */}
      <main className={`flex-1 flex flex-col p-4 md:p-10 gap-8 transition-all duration-700 ${isSidebarOpen ? 'blur-2xl scale-90 translate-x-20 opacity-30' : ''}`}>
        <div className="flex flex-col xl:flex-row gap-8 h-full max-h-[92vh] z-10">
          
          <div className="flex-[2.8] flex flex-col gap-8">
            {/* HOLOGRAPHIC VIEWER (Plasma Energy) */}
            <div className="relative aspect-video lg:h-[480px] bg-black rounded-[6rem] border border-white/10 overflow-hidden shadow-2xl">
              <Canvas camera={{ position: [0, 2, 8], fov: 40 }}>
                 <ambientLight intensity={0.5} />
                 <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={isTyping ? 10 : 1} />
                 <Grid infiniteGrid fadeDistance={50} fadeStrength={5} sectionSize={3} sectionColor="#4338ca" cellColor="#1e1b4b" />
                 <PresentationControls global config={{ mass: 2, tension: 500 }} snap={{ mass: 4, tension: 1500 }}>
                    <PlasmaCore isThinking={isTyping} shapeType={currentShape} labValue={labValue} />
                 </PresentationControls>
                 <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4.5} />
              </Canvas>
              
              <div className="absolute top-12 left-12 flex items-center gap-3 bg-black/40 backdrop-blur-xl px-6 py-2.5 rounded-full border border-white/5">
                 <Sparkles className={`w-4 h-4 ${isTyping ? 'text-amber-500 animate-spin' : 'text-teal-500'}`} />
                 <p className="text-[10px] font-black text-white uppercase tracking-[0.4em] italic leading-none">Status: {isTyping ? 'Analyzing' : 'Stable'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 flex-1">
               <div className="bg-slate-950/20 rounded-[4.5rem] border border-white/5 p-8 flex flex-col justify-center items-center group transition-all hover:bg-rose-500/5">
                  <Activity className={`mb-3 ${isTyping ? 'text-amber-500animate-pulse' : 'text-slate-800'}`} size={36} />
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest leading-none">CognitiveSync</p>
               </div>
               <div className="bg-slate-950/20 rounded-[4.5rem] border border-white/5 p-8 flex flex-col justify-center items-center group transition-all hover:bg-indigo-500/5">
                  <LineChart className="text-slate-800 mb-3 group-hover:text-indigo-500 transition-colors" size={36} />
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest leading-none">Live Plotter</p>
               </div>
            </div>
          </div>

          {/* CHAT COMMAND CENTER (Multi-Modal) */}
          <div className="flex-1 min-w-[440px] bg-slate-950/80 rounded-[6.5rem] border border-white/5 flex flex-col shadow-2xl overflow-hidden backdrop-blur-4xl relative">
            <div className="p-12 border-b border-white/10 flex items-center justify-between bg-white/5">
               <div className="flex items-center gap-3 text-rose-500 font-black italic">
                  <Eye size={22} />
                  <span className="text-[12px] uppercase tracking-[0.4em] text-white">Eye Interface</span>
               </div>
               <Volume2 size={22} className={isSpeaking ? "text-indigo-500" : "text-slate-800"} />
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-12 space-y-12 scrollbar-hide">
              <AnimatePresence>
                {messages.map((m) => {
                  const hasGraph = m.text.match(/\$.*?\$/g); // Simplified check
                  return (
                    <motion.div key={m.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col ${m.role === 'ai' ? 'items-start' : 'items-end'}`}>
                      {m.image && <img src={m.image} alt="study" className="max-w-[260px] rounded-[3.5rem] mb-8 border-4 border-white/10 shadow-3xl" />}
                      <div className={`max-w-[95%] p-10 rounded-[4rem] text-[15px] leading-relaxed tracking-tight shadow-3xl ${m.role === 'ai' ? 'bg-slate-900/90 text-slate-100 border border-white/5 rounded-tl-none' : 'bg-indigo-600 text-white rounded-tr-none'}`}>
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{m.text}</ReactMarkdown>
                        {m.role === 'ai' && hasGraph && <FunctionPlotter functionStr={hasGraph[0]} />}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {isOcrScan && (
                <div className="flex items-center gap-4 ml-10 text-rose-500 p-6 bg-slate-900 rounded-3xl">
                   <ScanText size={24} className="animate-spin" />
                   <span className="text-[11px] font-black uppercase tracking-[0.3em] italic">Deep Scan: Extracting Handwriting Patterns...</span>
                </div>
              )}
            </div>

            {/* INPUT HUB */}
            <div className="p-12 pt-4 relative z-50">
              <div className="flex items-center gap-3 bg-slate-900/80 border border-white/10 p-3 rounded-[5rem] shadow-inner focus-within:border-indigo-500/50 transition-all">
                <input type="file" id="fileIn" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if(file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setSelectedImage(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }} />
                <button onClick={() => document.getElementById('fileIn')?.click()} className="p-5 text-slate-500 hover:text-rose-400 transition-all"><ImageIcon size={24}/></button>
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask Lab Oracle..." className="flex-1 bg-transparent border-none py-6 px-4 text-sm text-white focus:outline-none placeholder:text-slate-800 font-medium" />
                <button onClick={handleSend} className="p-7 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 active:scale-95 transition-all"><Send size={26}/></button>
              </div>
              {selectedImage && <div className="mt-4 flex gap-4"><img src={selectedImage} className="w-16 h-16 rounded-3xl border-2 border-indigo-500 object-cover shadow-2xl" /><button onClick={() => setSelectedImage(null)} className="text-red-500 text-[10px] font-bold">Remove</button></div>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active = false }: any) {
  return (
    <button className={`flex items-center gap-6 p-6 w-full rounded-[3.5rem] border transition-all ${active ? 'bg-indigo-600 text-white border-indigo-400 shadow-[0_20px_40px_rgba(79,70,229,0.3)]' : 'text-slate-700 hover:bg-slate-900/50 hover:text-slate-300 border-transparent'}`}>
      {icon} <span className="text-xs font-black uppercase tracking-widest leading-none">{label}</span>
    </button>
  );
}
