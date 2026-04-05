"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Stars } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, Image as ImageIcon, Send, Zap, BrainCircuit, LayoutDashboard, 
  Globe, Terminal, PenTool, Volume2, Trash2, X 
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

// --- 🌌 3D GALAXY ---
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
      <Stars radius={100} depth={50} count={2500} factor={4} saturation={0} fade speed={1} />
      <mesh ref={ref}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <MeshDistortMaterial color="#4338ca" speed={2} distort={0.5} radius={1} />
      </mesh>
    </group>
  );
}

// --- ⌨️ TYPEWRITER COMPONENT ---
const Typewriter = ({ text, onComplete }: { text: string, onComplete: () => void }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, 25);
      return () => clearTimeout(timeout);
    } else {
      onComplete();
    }
  }, [index, text]);

  return <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{displayedText}</ReactMarkdown>;
};

export default function GyanAIV8() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedChat = localStorage.getItem('gyanai_chat_mantu');
    if (savedChat) setMessages(JSON.parse(savedChat));
    else setMessages([{ id: 1, role: 'ai', text: 'Namaste Mantu! v8.0 Vision Core active. Photo bhejiye, main use dekh kar samjha dunga!' }]);
  }, []);

  useEffect(() => {
    localStorage.setItem('gyanai_chat_mantu', JSON.stringify(messages));
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;

    const userMsg = { 
        id: Date.now(), 
        role: 'user', 
        text: input, 
        image: selectedImage 
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setSelectedImage(null);
    setIsTyping(true);

    try {
      const response = await fetch('https://good-items-itch.loca.lt/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Bypass-Tunnel-Reminder': 'true' },
        body: JSON.stringify({ 
            text: input,
            image: userMsg.image // Sending base64 image to AWS
        }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: data.response, isNew: true }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: "Connection error. AWS check karein." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 flex flex-col lg:flex-row overflow-hidden font-sans relative">
      <nav className="hidden lg:flex w-72 flex-col bg-slate-950/90 backdrop-blur-3xl border-r border-indigo-500/10 p-6 z-20">
        <div className="flex items-center gap-3 mb-10">
          <BrainCircuit className="text-indigo-500 w-8 h-8" />
          <h1 className="text-2xl font-black text-white italic">GyanAI</h1>
        </div>
        <div className="space-y-1 flex-1">
          <SidebarItem icon={<LayoutDashboard size={18}/>} label="Neural Hub" active />
          <SidebarItem icon={<Globe size={18}/>} label="Vision Lab" />
          <button onClick={() => { localStorage.removeItem('gyanai_chat_mantu'); window.location.reload(); }} className="flex items-center gap-4 p-4 text-red-500 hover:bg-red-500/10 w-full rounded-2xl transition-all">
             <Trash2 size={18} /> <span className="text-[10px] font-black uppercase">Clear Data</span>
          </button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col p-4 md:p-6 gap-6 z-10">
        <div className="flex flex-col xl:flex-row gap-6 h-full max-h-[92vh]">
          <div className="flex-[2.5] flex flex-col gap-6 overflow-hidden text-center">
            <div className="relative aspect-video lg:h-[350px] bg-black rounded-[3rem] border border-indigo-500/20 overflow-hidden shadow-2xl">
              <Canvas camera={{ position: [0, 0, 5] }}>
                 <ambientLight intensity={0.5} />
                 <Float speed={4}>
                    <Sphere args={[1.2, 64, 64]}>
                       <MeshDistortMaterial color={selectedImage ? "#f59e0b" : isSpeaking ? "#ec4899" : "#6366f1"} speed={5} distort={0.5} />
                    </Sphere>
                 </Float>
              </Canvas>
              <div className="absolute top-6 left-6 text-[8px] font-black uppercase tracking-widest text-indigo-400">Vision Mode: Ready</div>
            </div>
          </div>

          <div className="flex-1 min-w-[360px] bg-[#0b0f1a] rounded-[3.5rem] border border-indigo-500/10 flex flex-col shadow-2xl overflow-hidden relative">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-900/10">
               <div className="flex items-center gap-3 font-bold text-white text-sm"><Zap size={18} className="text-indigo-500" /> ORACLE v8.0</div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.map((m) => (
                <div key={m.id} className={`flex flex-col ${m.role === 'ai' ? 'items-start' : 'items-end'}`}>
                  {m.image && <img src={m.image} alt="uploaded" className="max-w-[200px] rounded-2xl mb-2 border border-indigo-500/20 shadow-lg" />}
                  <div className={`max-w-[90%] p-5 rounded-[2.2rem] text-[13px] ${m.role === 'ai' ? 'bg-slate-900 text-indigo-50 border border-indigo-500/10 rounded-tl-none' : 'bg-indigo-600 text-white rounded-tr-none'}`}>
                    {m.role === 'ai' && m.isNew ? (
                      <Typewriter text={m.text} onComplete={() => { m.isNew = false; speak(m.text); }} />
                    ) : (
                      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{m.text}</ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && <div className="text-[9px] text-indigo-500 font-black animate-pulse ml-4 uppercase">Analyzing Vision Data...</div>}
            </div>

            {/* PREVIEW IMAGE WINDOW */}
            {selectedImage && (
                <div className="px-6 relative">
                    <div className="relative inline-block">
                        <img src={selectedImage} className="w-20 h-20 object-cover rounded-xl border-2 border-indigo-500 shadow-xl" />
                        <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"><X size={12}/></button>
                    </div>
                </div>
            )}

            <div className="p-6">
              <div className="flex items-center gap-2 bg-slate-900/60 border border-indigo-500/10 p-2 rounded-[2.5rem]">
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="p-3 text-slate-600 hover:text-indigo-400"><ImageIcon size={20}/></button>
                <button className="p-3 text-slate-600 hover:text-indigo-400"><Mic size={20}/></button>
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Upload image or type..." className="flex-1 bg-transparent border-none py-3 text-sm text-white focus:outline-none" />
                <button onClick={handleSend} className="p-4 bg-indigo-600 text-white rounded-full shadow-lg"><Send size={20}/></button>
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
    <div className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${active ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/10 shadow-inner' : 'text-slate-600 hover:bg-slate-900/50 hover:text-slate-300'}`}>
      {icon} <span className="text-[10px] font-black uppercase">{label}</span>
    </div>
  );
}
