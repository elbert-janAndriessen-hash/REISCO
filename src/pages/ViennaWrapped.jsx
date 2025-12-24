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

  useEffect(() => {
    if (!started) return;

    if (audioRef.current) {
      if (current === 11) { // Sam Video (laatste slide)
        audioRef.current.volume = 0.05; 
      } else {
        audioRef.current.volume = 0.5;
        audioRef.current.play().catch(() => {});
      }
    }

    // Timings: Race (10) duurt lang, Video (11) precies 11 seconden
    const duration = current === 10 ? 22000 : (current === 11 ? 11000 : 5000);
    
    const timer = setTimeout(() => {
      if (current < slides.length - 1) setCurrent(current + 1);
      else if (onComplete) onComplete();
    }, duration);

    return () => clearTimeout(timer);
  }, [current, started, onComplete]);

  const handleStart = () => {
    setStarted(true);
  };

  const s = slides[current];

  // Zoom + Blur varianten voor Spotify Look
  const slideVariants = {
    initial: { scale: 1.6, filter: 'blur(25px)', opacity: 0 },
    animate: { scale: 1, filter: 'blur(0px)', opacity: 1 },
    exit: { scale: 0.7, filter: 'blur(20px)', opacity: 0 }
  };

  if (!started) {
    return (
      <div className="w-full max-w-[440px] h-[850px] bg-black flex flex-col items-center justify-center p-10 text-center mx-auto shadow-2xl border-4 border-white/10">
        <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="text-9xl mb-12">🎁</motion.div>
        <h1 className="text-white text-5xl font-[1000] mb-12 italic uppercase leading-none tracking-tighter">Jouw Jaar<br/><span className="text-[#1DB954]">Unwrapped</span></h1>
        <button onClick={handleStart} className="bg-[#1DB954] text-black px-12 py-6 rounded-full font-black text-2xl uppercase tracking-widest hover:scale-110 transition-transform shadow-[0_0_30px_rgba(29,185,84,0.5)]">
          Ontdek het nu
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[440px] h-[850px] overflow-hidden mx-auto bg-black shadow-2xl">
      <audio ref={audioRef} src="/muziek.mp3" loop />
      
      {/* Progress Bars */}
      <div className="absolute top-6 left-4 right-4 flex gap-1.5 z-[100]">
        {slides.map((_, i) => (
          <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-white shadow-[0_0_10px_white]" 
              initial={{ width: 0 }} 
              animate={{ width: i === current ? '100%' : (i < current ? '100%' : '0%') }}
              transition={{ duration: i === current ? (current === 10 ? 22 : (current === 11 ? 11 : 5)) : 0, ease: 'linear' }}
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
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-full flex flex-col items-center justify-center p-10 text-center relative"
          style={{ backgroundColor: s.bg }}
        >
          {/* ACHTERGROND DYNAMIEK */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
            <motion.div animate={{ rotate: 360, scale: [1, 1.5, 1] }} transition={{ duration: 20, repeat: Infinity }} className="absolute -top-20 -right-20 w-96 h-96 bg-white/20 blur-[100px] rounded-full" />
            <motion.div animate={{ x: [-100, 100, -100] }} transition={{ duration: 15, repeat: Infinity }} className="absolute bottom-10 -left-20 w-80 h-80 bg-black/40 blur-[120px] rounded-full" />
          </div>

          {/* LAYOUT: HERO */}
          {s.layout === 'hero' && (
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }}>
              <h2 className="text-2xl font-black tracking-[0.5em] text-black mb-6 uppercase">{s.sub}</h2>
              <h1 className="text-[120px] font-[1000] text-black italic leading-[0.75] tracking-tighter uppercase">{s.title}</h1>
            </motion.div>
          )}

          {/* LAYOUT: STATS (KMS) */}
          {s.layout === 'stats' && (
            <div className="z-10">
              <h1 className="text-[110px] font-black text-white leading-none mb-6 tracking-tighter">{s.title}</h1>
              <h2 className="text-4xl font-black bg-white text-black px-6 py-2 uppercase rotate-3 inline-block shadow-xl">{s.sub}</h2>
              <p className="mt-12 text-2xl font-bold text-white uppercase italic tracking-widest">{s.desc}</p>
            </div>
          )}

          {/* LAYOUT: GENRES */}
          {s.layout === 'genres' && (
            <div className="w-full text-left z-10">
              <h2 className="text-3xl font-black mb-12 text-black/40 uppercase italic">Top Werelddelen</h2>
              {s.items.map((item, i) => (
                <motion.div 
                  key={i} initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 + i * 0.1 }}
                  className={`text-6xl font-[1000] leading-[0.9] mb-5 uppercase ${i === 0 ? 'text-black' : 'text-black/20 italic'}`}
                >
                  {item}
                </motion.div>
              ))}
            </div>
          )}

          {/* LAYOUT: MCD */}
          {s.layout === 'mcd' && (
            <div className="z-10">
              <motion.div animate={{ y: [-20, 20, -20] }} transition={{ repeat: Infinity, duration: 2 }} className="text-[180px] leading-none mb-4">🍟</motion.div>
              <h1 className="text-9xl font-black text-white drop-shadow-2xl">{s.title}</h1>
              <h2 className="text-3xl font-black text-yellow-400 bg-black px-6 py-2 rotate-[-4deg] inline-block">{s.sub}</h2>
            </div>
          )}

          {/* LAYOUT: SKIP (Ljubljana) */}
          {s.layout === 'skip' && (
             <div className="z-10">
                <h2 className="text-2xl font-black mb-10 text-white/40 uppercase tracking-widest">Meest Geskipt</h2>
                <motion.h1 animate={{ x: [-8, 8, -8] }} transition={{ repeat: Infinity, duration: 0.1 }} className="text-7xl font-[1000] text-pink-500 line-through italic mb-12 uppercase tracking-tighter">{s.sub}</motion.h1>
                <div className="bg-pink-500 text-black p-6 font-black text-2xl rotate-2 uppercase shadow-[15px_15px_0px_white]">{s.desc}</div>
             </div>
          )}

          {/* LAYOUT: RACE (Slide 10) */}
          {s.layout === 'race' && (
            <div className="w-full h-full pt-20 flex flex-col z-10">
               <h2 className="text-2xl font-black text-white italic mb-12 uppercase tracking-widest">De Grote Finale...</h2>
               <div className="space-y-8 flex-1 px-4">
                 {cities.map((city, i) => (
                   <div key={i} className="relative">
                      <div className="flex justify-between text-[11px] font-black text-white/40 mb-1 uppercase tracking-widest">
                        <span>{city.n}</span>
                      </div>
                      <div className="h-6 bg-white/5 rounded-full relative overflow-hidden border border-white/10">
                          <motion.div 
                            className="h-full absolute left-0 top-0"
                            style={{ backgroundColor: city.c }}
                            initial={{ width: '0%' }}
                            animate={{ 
                              width: city.n === 'Wenen' 
                                ? ['0%', '48%', '12%', '22%', '100%'] 
                                : ['0%', `${35 + i * 12}%`, `${72 + Math.random() * 15}%`, '95%'] 
                            }}
                            transition={{ duration: 19, times: [0, 0.2, 0.5, 0.8, 1], ease: "easeInOut" }}
                          />
                          <motion.div 
                            className="w-12 h-12 rounded-full absolute -top-3 flex items-center justify-center bg-white shadow-[0_0_20px_white] border-2 border-black"
                            animate={{ 
                              left: city.n === 'Wenen' 
                                ? ['0%', '44%', '10%', '19%', '91%'] 
                                : ['0%', `${33 + i * 12}%`, `${68 + Math.random() * 15}%`, '88%'] 
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
                 initial={{ opacity: 0, scale: 4, filter: 'blur(40px)' }}
                 animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                 transition={{ delay: 19.8, type: 'spring', damping: 10 }}
                 className="absolute inset-0 bg-red-600 flex flex-col items-center justify-center z-[120] p-10"
               >
                 <motion.h1 animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.4 }} className="text-[110px] font-[1000] text-white italic leading-none drop-shadow-2xl">WENEN!</motion.h1>
                 <p className="bg-white text-black px-12 py-4 mt-8 font-black text-3xl uppercase tracking-tighter rotate-3 shadow-2xl">GEWONNEN!</p>
               </motion.div>
            </div>
          )}

          {/* LAYOUT: VIDEO (Slide 11 - Finale) */}
          {s.layout === 'video' && (
            <div className="absolute inset-0 bg-black flex items-center justify-center z-[130]">
              <video 
                ref={videoRef} src="/video.mp4" autoPlay playsInline
                className="w-full h-full object-cover"
              />
              <motion.div 
                initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }}
                className="absolute top-20 left-8 right-8 text-left bg-[#1DB954] p-6 rounded-2xl shadow-2xl rotate-[-2deg]"
              >
                <h2 className="text-black text-4xl font-black italic uppercase leading-tight">Sam heeft het<br/>laatste woord...</h2>
              </motion.div>
            </div>
          )}

          {/* FALLBACK (Music, Facts, Weird, List) */}
          {['music', 'fact', 'weird', 'list', 'age'].includes(s.layout) && (
            <div className="z-10 flex flex-col items-center w-full">
               <motion.h1 className="text-8xl font-[1000] text-white italic leading-[0.8] uppercase mb-8 tracking-tighter drop-shadow-lg">{s.title}</motion.h1>
               <h2 className="text-3xl font-black text-black bg-white px-6 py-2 inline-block mb-10 rotate-2 uppercase shadow-xl">{s.sub}</h2>
               <p className="text-2xl font-bold leading-tight mb-10 text-white italic">{s.desc}</p>
               {s.items && (
                 <div className="w-full space-y-4">
                   {s.items.map((it, idx) => (
                     <motion.div 
                        key={idx} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + idx * 0.1 }}
                        className="bg-white/10 backdrop-blur-xl border-2 border-white/20 p-6 rounded-[35px] font-black text-3xl uppercase italic text-white shadow-2xl"
                     >
                       {it}
                     </motion.div>
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