import React from 'react';
import { motion } from 'framer-motion';

export default function FinalSummary({ onRestart }) {
  return (
    <motion.div 
      initial={{ scale: 0.5, opacity: 0 }} 
      animate={{ scale: 1, opacity: 1 }}
      className="w-full max-w-[440px] h-full max-h-[850px] bg-[#1DB954] p-6 flex flex-col items-center justify-between text-black relative"
    >
      {/* Achtergrond Patroon */}
      <div className="absolute inset-0 opacity-10 [background:repeating-radial-gradient(circle,transparent,transparent_20px,#000_20px,#000_40px)]" />

      <div className="z-10 text-center mt-12">
        <p className="text-xs font-black tracking-widest uppercase mb-2">Jouw Reis Samengevat</p>
        <h1 className="text-6xl font-black leading-none tracking-tighter">WENEN<br/>2025</h1>
      </div>

      {/* Bento Grid */}
      <div className="z-10 grid grid-cols-2 gap-3 w-full">
        <StatCard label="Afstand" val="1.090" unit="KM" color="#000" text="#fff" rot="-3deg" />
        <StatCard label="Stappen" val="64K" unit="WALKED" color="#fff" text="#000" rot="2deg" />
        <StatCard label="Foto's" val="412" unit="PICS" color="#E30613" text="#fff" rot="1deg" />
        <StatCard label="Tijd" val="72" unit="UUR" color="#A294F9" text="#000" rot="-2deg" />
      </div>

      <div className="z-10 flex flex-col items-center gap-6 mb-8 w-full">
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }}
          className="bg-black text-[#1DB954] py-4 px-8 rounded-full shadow-2xl"
        >
          <h2 className="text-2xl font-black italic tracking-tighter">WE GAAN NAAR WENEN!! 🇦🇹</h2>
        </motion.div>
        
        <button onClick={onRestart} className="text-[10px] font-bold uppercase opacity-50 hover:opacity-100 transition-opacity">
          Bekijk opnieuw
        </button>
      </div>
    </motion.div>
  );
}

function StatCard({ label, val, unit, color, text, rot }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.05, rotate: 0 }}
      style={{ backgroundColor: color, color: text, rotate: rot }}
      className="p-4 rounded-3xl aspect-square flex flex-col justify-center shadow-lg"
    >
      <span className="text-[9px] font-bold opacity-60 uppercase mb-1">{label}</span>
      <span className="text-4xl font-black leading-none">{val}</span>
      <span className="text-[10px] font-bold mt-1">{unit}</span>
    </motion.div>
  );
}