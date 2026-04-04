"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Stars } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, Image as ImageIcon, Send, Zap, BrainCircuit, LayoutDashboard, 
  Globe, Terminal, PenTool, Volume2, Trash2 
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
      }, 30); // Typing speed: 30ms per letter
      return () => clearTimeout(timeout);
    } else {
      onComplete(); // Trigger voice after typing is done
    }
  }, [index, text]);

  return <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{displayedText}</ReactMarkdown>;
};

export default function GyanAIV7_5() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedChat = localStorage.getItem('gyanai_chat_mantu');
    if (savedChat) setMessages(JSON.parse(savedChat));
    else setMessages([{ id: 1, role: 'ai', text: 'Namaste Mantu! v7.5 Typewriter Core active. Puchiye, aaj kya seekhna hai?' }]);
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

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch('https://odd-years-see.loca.lt/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Bypass-Tunnel-Reminder': 'true' },
        body: JSON.stringify({ text: input }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: data.response, isNew: true }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: "Error: Tunnel connection failed." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 flex flex-col lg:flex-row overflow-hidden font-sans relative">
      <nav className="hidden lg:flex w-72 flex-col bg-slate-950/90 backdrop-blur-3xl border-r border-indigo-500/10 p-6 z-20 relative">
        <div className="flex items-center gap-3 mb-10">
          <BrainCircuit className="text-indigo-500 w-8 h-8" />
          <h1 className="text-2xl font-black text-white tracking-widest italic">GyanAI</h1>
        </div>
        <div className="space-y-1 flex-1">
          <SidebarItem icon={<LayoutDashboard size={18}/>} label="The Oracle" active />
          <SidebarItem icon={<Globe size={18}/>} label="Galaxy Hub" />
          <SidebarItem icon={<Terminal size={18}/>} label="Logic Lab" />
          <button onClick={() => { localStorage.removeItem('gyanai_chat_mantu'); window.location.reload(); }} className="flex items-center gap-4 p-4 text-red-500 hover:bg-red-500/10 w-full rounded-2xl transition-all">
             <Trash2 size={18} /> <span className="text-[10px] font-black uppercase">Clear Chat</span>
          </button>
        </div>
        <div className="absolute inset-0 opacity-10 pointer-events-none -z-10"><Canvas><KnowledgeStars /></Canvas></div>
      </nav>

      <main className="flex-1 flex flex-col p-4 md:p-6 gap-6 z-10">
        <div className="flex flex-col xl:flex-row gap-6 h-full max-h-[92vh]">
          <div className="flex-[2.5] flex flex-col gap-6 overflow-hidden">
            <div className="relative aspect-video lg:h-[350px] bg-black rounded-[3rem] border border-indigo-500/20 overflow-hidden shadow-2xl">
              <Canvas camera={{ position: [0, 0, 5] }}>
                 <ambientLight intensity={0.5} />
                 <Float speed={4}>
                    <Sphere args={[1.2, 64, 64]}>
                       <MeshDistortMaterial color={isSpeaking ? "#ec4899" : "#6366f1"} speed={isTyping || isSpeaking ? 10 : 2} distort={0.5} />
                    </Sphere>
                 </Float>
              </Canvas>
            </div>
            <div className="flex-1 bg-slate-950/40 rounded-[3rem] border border-slate-800/60 p-8 flex flex-col justify-center items-center">
               <PenTool className="text-indigo-900 mb-2" />
               <p className="text-[9px] font-black text-indigo-950 uppercase tracking-[0.4em]">Neural Pad Active</p>
            </div>
          </div>

          <div className="flex-1 min-w-[360px] bg-[#0b0f1a] rounded-[3.5rem] border border-indigo-500/10 flex flex-col shadow-2xl overflow-hidden relative">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-900/10">
               <div className="flex items-center gap-3 font-bold text-white text-sm"><Zap size={18} className="text-indigo-500" /> SYSTEM v7.5</div>
               <Volume2 size={16} className={isSpeaking ? "text-pink-500 animate-pulse" : "text-slate-800"} />
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[90%] p-5 rounded-[2.2rem] text-[13px] ${m.role === 'ai' ? 'bg-slate-900 text-indigo-50 border border-indigo-500/10 rounded-tl-none' : 'bg-indigo-600 text-white rounded-tr-none'}`}>
                    {m.role === 'ai' && m.isNew ? (
                      <Typewriter text={m.text} onComplete={() => { m.isNew = false; speak(m.text); }} />
                    ) : (
                      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{m.text}</ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && <div className="text-[9px] text-indigo-500 font-black animate-pulse ml-4 uppercase">Neural Processing...</div>}
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 bg-slate-900/60 border border-indigo-500/10 p-2 rounded-[2.5rem]">
                <button className="p-3 text-slate-600 hover:text-indigo-400"><ImageIcon size={18}/></button>
                <button className="p-3 text-slate-600 hover:text-indigo-400"><Mic size={18}/></button>
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask Mantu's Oracle..." className="flex-1 bg-transparent border-none py-3 text-sm text-white focus:outline-none" />
                <button onClick={handleSend} className="p-4 bg-indigo-600 text-white rounded-full shadow-lg"><Send size={18}/></button>
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
    <div className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${active ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/10' : 'text-slate-600 hover:bg-slate-900/50 hover:text-slate-300'}`}>
      {icon} <span className="text-[10px] font-black uppercase">{label}</span>
    </div>
  );
}
