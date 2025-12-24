import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  { id: 0, layout: 'hero', title: '2026', sub: 'USOCIA REIS...', bg: '#1DB954', accent: '#000' },
  { id: 1, layout: 'stats', title: '1.090', sub: 'KILOMETERS', desc: 'Zoveel kilometer ben je nog verwijderd.', bg: '#A294F9', accent: '#fff' },
  { id: 2, layout: 'genres', title: 'TOP GENRES', items: ['1. Europa', '2. Noord-Amerika', '3. Azië', '4. Oceanië'], bg: '#FFD300', accent: '#000' },
  { id: 3, layout: 'mcd', title: '52', sub: 'GOUDEN BOGEN', desc: "Zoveel McDonald's telt deze stad.", bg: '#E30613', accent: '#fff' },
  { id: 4, layout: 'age', title: '2.010', sub: 'JAAR OUD', desc: 'De stad zijn luisterleeftijd is historisch.', bg: '#00E5FF', accent: '#000' },
  { id: 5, layout: 'skip', title: 'MOST SKIPPED', sub: 'Krakau', desc: 'De vibe was net niet goed genoeg.', bg: '#121212', accent: '#FF4FD8' },
  { id: 6, layout: 'fact', title: 'WIJNSTAD', sub: 'LEUK FEITJE', desc: 'De enige hoofdstad met wijngaarden binnen de stadsgrenzen.', bg: '#7C5CFF', accent: '#fff' },
  { id: 7, layout: 'list', title: 'HOTSPOTS', items: ['Stephansdom', 'Prater', 'Schönbrunn', 'Hofburg'], bg: '#FF5F1F', accent: '#fff' },
  { id: 8, layout: 'weird', title: 'RAAR MAAR WAAR', sub: 'DOODSKISTEN', desc: 'Ze hebben hier een museum voor begrafenissen.', bg: '#A294F9', accent: '#000' },
  { id: 9, layout: 'music', title: 'LOCAL BEATS', items: ['Mozart', 'Falco', 'Strauss'], bg: '#1DB954', accent: '#000' },
  { id: 10, layout: 'race', title: 'DE FINALE', sub: 'WENEN WINT!', bg: '#000', accent: '#fff' },
  { id: 11, layout: 'video', title: 'SAM SAYS', bg: '#000' },
];

const cities = [
  { n: 'Parijs', c: '#ff4757', icon: '🇫🇷' },
  { n: 'Ljubljana', c: '#3742fa', icon: '🇸🇮' },
  { n: 'Barcelona', c: '#ffa502', icon: '🇪🇸' },
  { n: 'Florence', c: '#2ed573', icon: '🇮🇹' },
  { n: 'Wenen', c: '#E30613', icon: '🇦🇹' }
];

export default function WrappedStory({ onComplete }) {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const audioRef = useRef(null);
  const videoRef = useRef(null);

  // Timer beheer
  useEffect(() => {
    if (!started) return;

    const duration = current === 10 ? 22000 : (current === 11 ? 11000 : 7000);
    const timer = setTimeout(() => {
      if (current < slides.length - 1) {
        setCurrent(prev => prev + 1);
      } else if (onComplete) {
        onComplete();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [current, started, onComplete]);

  // Audio volume en Video play trigger
  useEffect(() => {
    if (!started) return;

    if (audioRef.current) {
      audioRef.current.volume = current === 11 ? 0.05 : 0.5;
    }

    if (current === 11 && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(e => console.log("Video playback error:", e));
    }
  }, [current, started]);

  const handleStart = () => {
    // 1. Toestand bijwerken
    setStarted(true);

    // 2. Audio ontgrendelen en afspelen
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio unlock failed:", e));
    }

    // 3. Video ontgrendelen (kort afspelen en pauzeren voor buffering)
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }).catch(e => console.log("Video priming failed:", e));
    }
  };

  const s = slides[current];

  // Geoptimaliseerde iPhone animaties (geen blur!)
  const slideVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  if (!started) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-8 text-center z-[300]">
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-9xl mb-12 text-white">🎁</motion.div>
        <h1 className="text-white text-5xl font-black mb-8 italic uppercase tracking-tighter leading-none">Jouw 2026<br/><span className="text-[#1DB954]">Unwrapped</span></h1>
        <button 
          onClick={handleStart} 
          className="bg-[#1DB954] text-black px-12 py-6 rounded-full font-black text-2xl uppercase tracking-widest active:scale-95 transition-transform shadow-[0_0_40px_rgba(29,185,84,0.4)]"
        >
          START DE STORY
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden touch-none select-none">
      {/* Verborgen Media Elementen */}
      <audio ref={audioRef} src="/muziek.mp3" loop playsInline preload="auto" />
      
      {/* Progress Bars */}
      <div className="absolute top-12 left-4 right-4 flex gap-1 z-[100]">
        {slides.map((_, i) => (
          <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-white shadow-[0_0_5px_white]" 
              initial={{ width: 0 }} 
              animate={{ width: i === current ? '100%' : (i < current ? '100%' : '0%') }}
              transition={{ duration: i === current ? (current === 10 ? 22 : (current === 11 ? 11 : 7)) : 0, ease: 'linear' }}
            />
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={current}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.4 }}
          className="w-full h-full flex flex-col items-center justify-center p-6 text-center relative overflow-hidden"
          style={{ backgroundColor: s.bg }}
        >
          {/* LAYOUT: MCD (Gefixed: Tekst nu 100% zichtbaar) */}
          {s.layout === 'mcd' && (
            <div className="z-10 flex flex-col items-center">
              <div className="text-9xl mb-4">🍟</div>
              <h1 className="text-7xl font-black text-white mb-2 tracking-tighter drop-shadow-lg">{s.title}</h1>
              <h2 className="text-2xl font-black text-yellow-400 bg-black px-4 py-1 rotate-[-3deg] inline-block mb-8 uppercase tracking-widest">{s.sub}</h2>
              <p className="text-xl font-bold text-white italic max-w-[280px] leading-tight px-4">{s.desc}</p>
            </div>
          )}

          {/* LAYOUT: RACE */}
          {s.layout === 'race' && (
            <div className="w-full h-full pt-28 pb-12 flex flex-col z-10 px-4">
               <h2 className="text-2xl font-black text-white italic mb-10 uppercase tracking-widest">Wie wint 2026?</h2>
               <div className="space-y-6 flex-1">
                 {cities.map((city, i) => (
                   <div key={i} className="relative">
                      <div className="text-[11px] font-black text-white/50 mb-1 uppercase tracking-tighter px-2">{city.n}</div>
                      <div className="h-5 bg-white/10 rounded-full relative overflow-hidden border border-white/20">
                          <motion.div 
                            className="h-full absolute left-0 top-0 rounded-full"
                            style={{ backgroundColor: city.c }}
                            initial={{ width: '0%' }}
                            animate={{ 
                              width: city.n === 'Wenen' 
                                ? ['0%', '48%', '12%', '22%', '100%'] 
                                : ['0%', `${35 + i * 12}%`, `${72 + Math.random() * 10}%`, '92%'] 
                            }}
                            transition={{ duration: 19, times: [0, 0.2, 0.5, 0.8, 1], ease: "easeInOut" }}
                          />
                          <motion.div 
                            className="w-12 h-12 rounded-full absolute -top-3.5 flex items-center justify-center bg-white shadow-xl border-2 border-black"
                            animate={{ 
                              left: city.n === 'Wenen' 
                                ? ['0%', '44%', '10%', '19%', '89%'] 
                                : ['0%', `${30 + i * 12}%`, `${65 + Math.random() * 10}%`, '80%'] 
                            }}
                            transition={{ duration: 19, times: [0, 0.2, 0.5, 0.8, 1], ease: "easeInOut" }}
                          >
                            <span className="text-2xl">{city.icon}</span>
                          </motion.div>
                      </div>
                   </div>
                 ))}
               </div>
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 19.5 }}
                 className="absolute inset-0 bg-red-600 flex flex-col items-center justify-center z-[120] p-10"
               >
                 <h1 className="text-8xl font-black text-white italic leading-none mb-6">WENEN!</h1>
                 <p className="bg-white text-black px-10 py-4 font-black text-3xl uppercase rotate-3 shadow-2xl">GEWONNEN!</p>
               </motion.div>
            </div>
          )}

          {/* LAYOUT: VIDEO (Slide 11) */}
          {s.layout === 'video' && (
            <div className="absolute inset-0 bg-black flex items-center justify-center z-[130]">
              <video 
                ref={videoRef} 
                src="/video.mp4" 
                playsInline 
                webkit-playsinline="true"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-24 left-6 right-6 text-left bg-[#1DB954] p-6 rounded-2xl shadow-2xl rotate-[-2deg]">
                <h2 className="text-black text-3xl font-black italic uppercase leading-none">Sam heeft het<br/>laatste woord...</h2>
              </div>
            </div>
          )}

          {/* OVERIGE LAYOUTS */}
          {['hero', 'stats', 'genres', 'skip', 'fact', 'list', 'weird', 'music', 'age'].includes(s.layout) && s.layout !== 'mcd' && (
            <div className="z-10 flex flex-col items-center w-full px-6">
               <motion.h1 className="text-7xl font-black text-white italic leading-[0.8] uppercase mb-8 tracking-tighter drop-shadow-md">{s.title}</motion.h1>
               <h2 className="text-2xl font-black text-black bg-white px-6 py-2 inline-block mb-10 rotate-2 uppercase">{s.sub}</h2>
               {s.desc && <p className="text-xl font-bold text-white italic opacity-90 text-center mb-8 px-4 leading-tight">{s.desc}</p>}
               {s.items && (
                 <div className="w-full space-y-4">
                   {s.items.map((it, idx) => (
                     <div key={idx} className="bg-white/10 border-2 border-white/20 p-5 rounded-3xl font-black text-2xl uppercase italic text-white shadow-xl">
                       {it}
                     </div>
                   ))}
                 </div>
               )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}