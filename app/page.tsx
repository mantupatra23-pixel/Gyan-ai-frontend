"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, Stars, Grid, OrbitControls, ContactShadows } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { 
  Send, Zap, Trash2, X, Activity, 
  Volume2, Eye, Cpu, Image as ImageIcon, 
  Menu, Home, FlaskConical, MousePointer2, Power, 
  RefreshCw, UserPlus, UserCircle, Bot, GraduationCap, ChevronUp, ChevronDown, Mic, VolumeX, Layers
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import 'katex/dist/katex.min.css';

// --- 🌌 INTERACTIVE BACKGROUND ---
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

// --- 🧪 MOLECULE LAB ---
function MoleculeLab({ accent }: { accent: string }) {
  const groupRef = useRef<any>(null);
  const colorMap: any = { indigo: "#6366f1", rose: "#e11d48", teal: "#14b8a6", amber: "#f59e0b" };
  useFrame(() => { if (groupRef.current) groupRef.current.rotation.y += 0.015; });

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

// --- 🧑‍🏫 AVATAR 1: PROFESSOR ---
function AvatarProfessor({ isSpeaking }: { isSpeaking: boolean }) {
  const mouthRef = useRef<any>(null);
  const eyeRef = useRef<any>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (eyeRef.current) eyeRef.current.scale.y = Math.sin(t * 3.5) > 0.95 ? 0.1 : 1;
    if (mouthRef.current) mouthRef.current.scale.y = isSpeaking ? 1 + Math.abs(Math.sin(t * 20)) * 2.5 : 1;
  });

  return (
    <group position={[0, -0.5, 0]}>
      <mesh position={[0, -1.2, 0]}><cylinderGeometry args={[0.8, 0.9, 1.5]} /><meshStandardMaterial color="#334155" /></mesh>
      <mesh position={[0, 0, 0]}><sphereGeometry args={[0.65, 32, 32]} /><meshStandardMaterial color="#fcd5ce" roughness={0.4} /></mesh>
      <mesh position={[0, 0.4, -0.1]}><sphereGeometry args={[0.7, 32, 32]} /><meshStandardMaterial color="#e2e8f0" roughness={0.9} /></mesh>
      <mesh position={[-0.25, 0.1, 0.6]} rotation={[Math.PI/2, 0, 0]}><torusGeometry args={[0.15, 0.02, 16, 100]} /><meshStandardMaterial color="#000" /></mesh>
      <mesh position={[0.25, 0.1, 0.6]} rotation={[Math.PI/2, 0, 0]}><torusGeometry args={[0.15, 0.02, 16, 100]} /><meshStandardMaterial color="#000" /></mesh>
      <group ref={eyeRef}>
        <mesh position={[-0.25, 0.1, 0.6]}><sphereGeometry args={[0.08]} /><meshStandardMaterial color="#fff" /></mesh>
        <mesh position={[-0.25, 0.1, 0.66]}><sphereGeometry args={[0.04]} /><meshStandardMaterial color="#000" /></mesh>
        <mesh position={[0.25, 0.1, 0.6]}><sphereGeometry args={[0.08]} /><meshStandardMaterial color="#fff" /></mesh>
        <mesh position={[0.25, 0.1, 0.66]}><sphereGeometry args={[0.04]} /><meshStandardMaterial color="#000" /></mesh>
      </group>
      <mesh ref={mouthRef} position={[0, -0.25, 0.62]}><boxGeometry args={[0.25, 0.04, 0.05]} /><meshStandardMaterial color="#9f1239" /></mesh>
    </group>
  );
}

// --- 👩‍🏫 AVATAR 2: ALICE ---
function AvatarAlice({ isSpeaking }: { isSpeaking: boolean }) {
  const mouthRef = useRef<any>(null);
  const eyeRef = useRef<any>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (eyeRef.current) eyeRef.current.scale.y = Math.sin(t * 4) > 0.95 ? 0.1 : 1;
    if (mouthRef.current) mouthRef.current.scale.y = isSpeaking ? 1 + Math.abs(Math.sin(t * 25)) * 2 : 1;
  });

  return (
    <group position={[0, -0.5, 0]}>
      <mesh position={[0, -1.2, 0]}><cylinderGeometry args={[0.7, 0.8, 1.5]} /><meshStandardMaterial color="#0284c7" /></mesh>
      <mesh position={[0, 0, 0]}><sphereGeometry args={[0.6, 32, 32]} /><meshStandardMaterial color="#ffb5a7" roughness={0.4} /></mesh>
      <mesh position={[0, 0.1, -0.2]}><sphereGeometry args={[0.65, 32, 32]} /><meshStandardMaterial color="#271c19" roughness={0.9} /></mesh>
      <group ref={eyeRef}>
        <mesh position={[-0.22, 0.1, 0.55]}><sphereGeometry args={[0.09]} /><meshStandardMaterial color="#fff" /></mesh>
        <mesh position={[-0.22, 0.1, 0.62]}><sphereGeometry args={[0.04]} /><meshStandardMaterial color="#065f46" /></mesh>
        <mesh position={[0.22, 0.1, 0.55]}><sphereGeometry args={[0.09]} /><meshStandardMaterial color="#fff" /></mesh>
        <mesh position={[0.22, 0.1, 0.62]}><sphereGeometry args={[0.04]} /><meshStandardMaterial color="#065f46" /></mesh>
      </group>
      <mesh ref={mouthRef} position={[0, -0.2, 0.58]}><boxGeometry args={[0.18, 0.05, 0.05]} /><meshStandardMaterial color="#be123c" /></mesh>
    </group>
  );
}

// --- 🤖 AVATAR 3: CYBER BOT ---
function AvatarCyber({ isSpeaking, accent }: { isSpeaking: boolean, accent: string }) {
  const mouthRef = useRef<any>(null);
  const colorMap: any = { indigo: "#6366f1", rose: "#e11d48", teal: "#14b8a6", amber: "#f59e0b" };

  useFrame((state) => {
    if (mouthRef.current) mouthRef.current.scale.y = isSpeaking ? 1 + Math.abs(Math.sin(state.clock.getElapsedTime() * 20)) * 3 : 1;
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh><boxGeometry args={[1.2, 1.4, 1.2]} /><meshStandardMaterial color="#0f172a" metalness={0.8} /></mesh>
      <mesh position={[0, 0.2, 0.61]}><boxGeometry args={[0.8, 0.3, 0.05]} /><meshStandardMaterial color="#000" /></mesh>
      <mesh position={[-0.2, 0.2, 0.63]}><sphereGeometry args={[0.08]} /><meshStandardMaterial color={colorMap[accent]} emissive={colorMap[accent]} emissiveIntensity={2} /></mesh>
      <mesh position={[0.2, 0.2, 0.63]}><sphereGeometry args={[0.08]} /><meshStandardMaterial color={colorMap[accent]} emissive={colorMap[accent]} emissiveIntensity={2} /></mesh>
      <mesh ref={mouthRef} position={[0, -0.3, 0.61]}><boxGeometry args={[0.4, 0.05, 0.05]} /><meshStandardMaterial color={colorMap[accent]} emissive={colorMap[accent]} emissiveIntensity={2} /></mesh>
    </group>
  );
}

// --- 🎓 TUTOR WRAPPER ---
function TutorEngine({ mode, isSpeaking, accent }: { mode: string, isSpeaking: boolean, accent: string }) {
  const groupRef = useRef<any>(null);
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 2) * 0.1; 
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.15; 
    }
  });

  return (
    <Float speed={2} rotationIntensity={0}>
      <group ref={groupRef}>
        {mode === 'professor' && <AvatarProfessor isSpeaking={isSpeaking} />}
        {mode === 'alice' && <AvatarAlice isSpeaking={isSpeaking} />}
        {mode === 'cyber' && <AvatarCyber isSpeaking={isSpeaking} accent={accent} />}
      </group>
    </Float>
  );
}

export default function GyanAIV30Full() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChemistry, setIsChemistry] = useState(false);
  const [accent, setAccent] = useState("indigo");
  const [latency, setLatency] = useState(0);
  const [avatarMode, setAvatarMode] = useState("alice"); 
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://holders-den-improvements-quantity.trycloudflare.com/ask";

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    const saved = localStorage.getItem('gyanai_v30_full');
    if (saved) setMessages(JSON.parse(saved));
    else setMessages([{ id: 1, role: 'ai', text: 'Namaste Mantu! Virtual Academy Active. Aap image upload kar sakte hain aur Tutor select kar sakte hain.' }]);
  }, []);

  useEffect(() => {
    localStorage.setItem('gyanai_v30_full', JSON.stringify(messages));
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    const lastMsg = messages[messages.length - 1]?.text.toLowerCase() || "";
    setIsChemistry(lastMsg.includes("chemistry") || lastMsg.includes("molecule"));
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;
    const start = Date.now();
    const userMsg = { id: Date.now(), role: 'user', text: input, image: selectedImage };
    setMessages(prev => [...prev, userMsg]);
    setInput(""); 
    setSelectedImage(null); 
    setIsTyping(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: userMsg.text, image: userMsg.image }),
      });
      const data = await response.json();
      setLatency(Date.now() - start);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: data.response }]);
      if (synthRef.current) {
        synthRef.current.cancel();
        const ut = new SpeechSynthesisUtterance(data.response.replace(/[*#_\[\]\(\)$]/g, ''));
        if (avatarMode === 'alice') ut.pitch = 1.2; 
        if (avatarMode === 'professor') ut.pitch = 0.8; 
        if (avatarMode === 'cyber') ut.pitch = 1.0;
        ut.onstart = () => setIsSpeaking(true);
        ut.onend = () => setIsSpeaking(false);
        synthRef.current.speak(ut);
      }
    } catch (e) {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: "❌ System Disconnected. Server Check Karein." }]);
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
      
      {/* 🚀 MENU BUTTON */}
      <div className="absolute top-8 left-8 z-[150] flex gap-4">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl transition-all hover:scale-110 ${themeColors[accent].split(' ')[0]}`}>
          {isSidebarOpen ? <X size={22} className="text-white"/> : <Menu size={22} className="text-white" />}
        </button>
      </div>

      {/* 📟 SIDEBAR */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.nav initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="fixed top-0 left-0 h-full w-85 bg-slate-950/98 backdrop-blur-4xl z-[140] p-10 pt-36 border-r border-white/5 flex flex-col gap-6 overflow-y-auto scrollbar-hide shadow-[50px_0_100px_rgba(0,0,0,0.8)]">
            <div className="flex items-center gap-4 mb-2">
              <div className={`p-4 rounded-[2.2rem] shadow-2xl ${themeColors[accent].split(' ')[0]}`}><GraduationCap size={26} className="text-white"/></div>
              <h1 className="text-2xl font-black italic text-white tracking-tighter uppercase">Virtual <span className={`text-[9px] block not-italic font-mono ${themeColors[accent].split(' ')[2]}`}>ACADEMY v30.0</span></h1>
            </div>
            
            <div className="pt-4 pb-2 px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] border-t border-white/5">Select Your Tutor</div>
            <SidebarItem icon={<UserCircle size={18}/>} label="Tutor Alice" active={avatarMode === 'alice'} onClick={() => {setAvatarMode('alice'); setIsChemistry(false);}} accent={accent} />
            <SidebarItem icon={<UserPlus size={18}/>} label="Prof. Einstein" active={avatarMode === 'professor'} onClick={() => {setAvatarMode('professor'); setIsChemistry(false);}} accent={accent} />
            <SidebarItem icon={<Bot size={18}/>} label="Cyber Node" active={avatarMode === 'cyber'} onClick={() => {setAvatarMode('cyber'); setIsChemistry(false);}} accent={accent} />
            
            <div className="pt-4 pb-2 px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] border-t border-white/5">Environment Tools</div>
            <SidebarItem icon={<Layers size={18}/>} label="Cycle Theme" onClick={() => setAccent(accent === "indigo" ? "rose" : (accent === "rose" ? "teal" : (accent === "teal" ? "amber" : "indigo")))} accent={accent} />
            <SidebarItem icon={<FlaskConical size={18}/>} label="Chemistry Lab" active={isChemistry} onClick={() => setIsChemistry(!isChemistry)} accent={accent} />
            
            <button onClick={() => {localStorage.clear(); window.location.reload();}} className="mt-8 p-6 text-red-500 border border-red-500/10 rounded-[3rem] text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-4 hover:bg-red-500/10 transition-all"><Power size={18}/> Clear Memory</button>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* 🖥️ MAIN WORKSPACE */}
      <main className={`flex-1 flex flex-col p-4 md:p-10 gap-8 transition-all duration-700 ${isSidebarOpen ? 'blur-3xl scale-95 opacity-40 translate-x-12' : ''}`}>
        <div className="flex flex-col xl:flex-row gap-8 h-full max-h-[92vh] z-10">
          
          <div className="flex-[2.8] flex flex-col gap-8">
            {/* 🧑‍🏫 AVATAR / LAB VIEWER */}
            <div className="relative aspect-video lg:h-[480px] bg-black rounded-[7.5rem] border border-white/5 overflow-hidden shadow-3xl">
              <Canvas camera={{ position: [0, 1, 5], fov: 45 }}>
                 <ambientLight intensity={1.5} />
                 <directionalLight position={[2, 5, 2]} intensity={2} />
                 <InteractiveStars />
                 <Grid infiniteGrid sectionSize={3} sectionColor="#1e1b4b" cellColor="#020617" position={[0, -2, 0]} />
                 <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2} minDistance={3} maxDistance={8} />
                 {isChemistry ? <MoleculeLab accent={accent} /> : <TutorEngine mode={avatarMode} isSpeaking={isSpeaking} accent={accent} />}
                 <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2.5} far={4.5} />
              </Canvas>
              <div className="absolute top-12 left-12 flex items-center gap-4 bg-black/40 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10">
                 <div className={`w-2 h-2 rounded-full animate-pulse ${themeColors[accent].split(' ')[0]}`} />
                 <p className="text-[10px] font-black text-white uppercase tracking-[0.4em] italic">{isChemistry ? 'Chemistry Lab' : `Active Tutor: ${avatarMode}`}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 flex-1">
               <div className="bg-slate-950/30 rounded-[5rem] border border-white/5 p-8 flex flex-col justify-center items-center">
                  <Activity className={`mb-3 ${isSpeaking ? 'text-rose-500 animate-bounce' : 'text-slate-800'}`} size={38} />
                  <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest leading-none">Voice Engine</p>
               </div>
               <div className="bg-slate-950/30 rounded-[5rem] border border-white/5 p-8 flex flex-col justify-center items-center">
                  <Zap className={`mb-3 ${isTyping ? 'text-amber-500 animate-pulse' : 'text-slate-800'}`} size={38} />
                  <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest italic">{latency}ms Latency</p>
               </div>
            </div>
          </div>

          {/* CHAT HUB */}
          <div className="flex-1 min-w-[440px] bg-slate-950/90 rounded-[8rem] border border-white/5 flex flex-col shadow-2xl overflow-hidden backdrop-blur-4xl relative group">
            
            {/* 🔝 SCROLL UP */}
            <button onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })} className="absolute top-[130px] right-8 z-[100] p-4 bg-white/5 hover:bg-indigo-600 rounded-full border border-white/10 text-white shadow-xl opacity-0 group-hover:opacity-100 transition-all">
              <ChevronUp size={20} />
            </button>

            <div className="p-12 border-b border-white/10 flex items-center justify-between">
               <div className={`flex items-center gap-4 font-black italic text-xs tracking-[0.4em] ${themeColors[accent].split(' ')[2]}`}>
                  <Eye size={20} className="animate-pulse" /> CLASSROOM
               </div>
               <div className="flex items-center gap-4">
                 {isSpeaking && <VolumeX size={22} className="text-rose-500 cursor-pointer" onClick={() => window.speechSynthesis.cancel()} />}
                 <Volume2 size={24} className={isSpeaking ? themeColors[accent].split(' ')[2] : "text-slate-800"} />
               </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-12 space-y-12 scrollbar-hide pt-10">
              <AnimatePresence>
                {messages.map((m) => (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col ${m.role === 'ai' ? 'items-start' : 'items-end'}`}>
                    {/* VISUAL IMAGE PREVIEW */}
                    {m.image && <img src={m.image} alt="scan" className="max-w-[240px] rounded-[3.5rem] mb-6 border-4 border-white/10 shadow-2xl" />}
                    <div className={`max-w-[95%] p-10 rounded-[5rem] text-[15.5px] leading-relaxed shadow-3xl ${m.role === 'ai' ? 'bg-slate-900/98 text-slate-100 border border-white/5 rounded-tl-none' : `${themeColors[accent].split(' ')[0]} text-white rounded-tr-none ${themeColors[accent].split(' ')[3]}`}`}>
                      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{m.text}</ReactMarkdown>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isTyping && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 p-10"><div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"/><div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-.3s]"/><div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-.5s]"/></motion.div>}
            </div>

            {/* 🔽 SCROLL DOWN */}
            <button onClick={() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })} className="absolute bottom-[160px] right-8 z-[100] p-4 bg-white/5 hover:bg-indigo-600 rounded-full border border-white/10 text-white shadow-xl opacity-0 group-hover:opacity-100 transition-all">
              <ChevronDown size={20} />
            </button>

            {/* COMMAND HUB WITH IMAGE UPLOAD */}
            <div className="p-12 pt-4 relative z-[150]">
              <div className="flex items-center gap-3 bg-slate-900/90 border border-white/10 p-3 rounded-[7rem] shadow-inner focus-within:border-white/20 transition-all">
                
                {/* IMAGE UPLOAD LOGIC RESTORED */}
                <input type="file" id="file" className="hidden" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if(file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setSelectedImage(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }} />
                <button onClick={() => document.getElementById('file')?.click()} className={`p-6 hover:${themeColors[accent].split(' ')[2]} ${selectedImage ? themeColors[accent].split(' ')[2] : 'text-slate-600'}`}>
                  <ImageIcon size={24} className={selectedImage ? 'animate-pulse' : ''} />
                </button>
                
                <button className="p-4 text-slate-600 hover:text-white"><Mic size={24}/></button>
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask Tutor..." className="flex-1 bg-transparent border-none py-6 px-4 text-sm text-white focus:outline-none placeholder:text-slate-700 font-medium" />
                <button onClick={handleSend} className={`p-8 rounded-full shadow-2xl active:scale-95 transition-all ${themeColors[accent].split(' ')[0]} text-white`}><Send size={28}/></button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active = false, onClick, accent }: any) {
  const getActiveColor = () => {
    if (accent === "rose") return "bg-rose-600 text-white shadow-xl shadow-rose-500/30";
    if (accent === "teal") return "bg-teal-600 text-white shadow-xl shadow-teal-500/30";
    if (accent === "amber") return "bg-amber-600 text-white shadow-xl shadow-amber-500/30";
    return "bg-indigo-600 text-white shadow-xl shadow-indigo-500/30";
  };
  return (
    <button onClick={onClick} className={`flex items-center gap-6 p-5 w-full rounded-[4.5rem] border border-transparent transition-all ${active ? getActiveColor() : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'}`}>
      {icon} <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
    </button>
  );
}
