"use client";
import React, { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Namaste Mantu! Main GyanAI hoon. Aaj hum kya seekhenge?' }
  ]);

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col md:flex-row p-4 gap-4 overflow-hidden">
      {/* Left Section: AI Teacher & Whiteboard */}
      <div className="flex-[2] flex flex-col gap-4">
        <div className="bg-slate-900 rounded-3xl h-[250px] md:h-[350px] flex items-center justify-center relative shadow-2xl">
          <div className="text-white font-medium opacity-60">GyanAI Live Teacher Screen</div>
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-bold animate-pulse">LIVE</div>
        </div>

        <div className="flex-1 bg-white border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-8 shadow-inner">
          <p className="text-slate-400 font-bold text-lg">GyanAI Interactive Whiteboard</p>
          <p className="text-slate-300 text-sm">AI will explain concepts here...</p>
        </div>
      </div>

      {/* Right Section: Chat */}
      <div className="flex-1 bg-white rounded-3xl shadow-xl flex flex-col border border-slate-100 overflow-hidden">
        <div className="p-5 bg-indigo-600 text-white flex justify-between items-center">
          <h2 className="font-bold text-xl">GyanAI Doubt Solver</h2>
          <div className="w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
        </div>

        <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-slate-50">
          {messages.map((m, i) => (
            <div key={i} className={`p-4 rounded-2xl max-w-[85%] shadow-sm ${m.role === 'ai' ? 'bg-white text-slate-800 rounded-tl-none border-l-4 border-indigo-500' : 'bg-indigo-600 text-white self-end ml-auto rounded-tr-none'}`}>
              {m.text}
            </div>
          ))}
        </div>

        <div className="p-4 bg-white border-t">
          <div className="flex gap-2">
            <button className="p-3 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">📸</button>
            <input type="text" placeholder="Type your doubt..." className="flex-1 bg-slate-100 rounded-xl px-4 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700" />
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 active:scale-95 transition-all">Ask</button>
          </div>
        </div>
      </div>
    </main>
  );
}
