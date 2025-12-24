import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  { id: 0, layout: 'hero', title: '2026', sub: 'USOCIA REIS...', bg: '#1DB954' },
  { id: 1, layout: 'stats', title: '1.090', sub: 'KILOMETERS', desc: 'Zoveel kilometer ben je nog verwijderd.', bg: '#A294F9' },
  { id: 2, layout: 'genres', title: 'TOP GENRES', items: ['1. Europa', '2. Noord-Amerika', '3. Azië', '4. Oceanië'], bg: '#FFD300' },
  { id: 3, layout: 'mcd', title: '52', sub: 'GOUDEN BOGEN', desc: "Zoveel McDonald's telt deze stad.", bg: '#E30613' },
  { id: 4, layout: 'age', title: '2.010', sub: 'JAAR OUD', desc: 'De stad zijn luisterleeftijd is historisch.', bg: '#00E5FF' },
  { id: 5, layout: 'skip', title: 'MOST SKIPPED', sub: 'Krakau', desc: 'De vibe was net niet goed genoeg.', bg: '#121212' },
  { id: 6, layout: 'fact', title: 'WIJNSTAD', sub: 'LEUK FEITJE', desc: 'De enige hoofdstad met wijngaarden binnen de stadsgrenzen.', bg: '#7C5CFF' },
  { id: 7, layout: 'list', title: 'HOTSPOTS', items: ['Stephansdom', 'Prater', 'Schönbrunn', 'Hofburg'], bg: '#FF5F1F' },
  { id: 8, layout: 'weird', title: 'RAAR MAAR WAAR', sub: 'DOODSKISTEN', desc: 'Ze hebben hier een museum voor begrafenissen.', bg: '#A294F9' },
  { id: 9, layout: 'music', title: 'LOCAL BEATS', items: ['Mozart', 'Falco', 'Strauss'], bg: '#1DB954' },
  { id: 10, layout: 'race', title: 'DE FINALE', sub: 'WENEN WINT!', bg: '#000' },
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

  // 1. ALLEEN AUDIO STARTEN (Voorkomt iPhone Audio Conflict)
  const handleStart = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.muted = false;
      audioRef.current.play().catch(e => console.log("Audio start error:", e));
    }
    setStarted(true);
  };

  // 2. REGELT WISSEL TUSSEN MUZIEK EN VIDEO
  useEffect(() => {
    if (!started) return;

    // Is dit de video slide?
    if (current === 11) {
      // STOP muziek volledig (iPhone kan geen 2 dingen tegelijk horen)
      if (audioRef.current) {
        audioRef.current.pause();
      }
      // START video
      if (videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(e => console.log("Video autoplay blocked:", e));
      }
    } else {
      // Zorg dat muziek speelt voor alle andere slides
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      }
    }

    // Timer logica
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

  const s = slides[current];

  // Geoptimaliseerde animaties voor mobiel (Geen blur)
  const slideVariants = {
    initial: { opacity: 0, scale: 1 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  };

  if (!started) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-8 text-center z-[500]">
        <div className="text-9xl mb-12">🎁</div>
        <h1 className="text-white text-5xl font-black mb-8 italic uppercase tracking-tighter">USOCIA<br/><span className="text-[#1DB954]">UNWRAPPED</span></h1>
        <p className="text-white/50 mb-8 text-sm">Zet je geluid aan! 🔊</p>
        <button 
          onClick={handleStart} 
          className="bg-[#1DB954] text-black px-12 py-6 rounded-full font-black text-2xl uppercase tracking-widest active:scale-95 transition-transform shadow-2xl"
        >
          START STORY
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden touch-none select-none font-sans">
      
      {/* MEDIA ELEMENTEN */}
      <audio ref={audioRef} src="/muziek.mp3" loop playsInline preload="auto" />
      
      <video
        ref={videoRef}
        src="/video.mp4"
        playsInline
        webkit-playsinline="true"
        preload="auto"
        className={`fixed inset-0 w-full h-full object-cover transition-opacity duration-500 ${current === 11 ? 'opacity-100 z-[130]' : 'opacity-0 -z-10'}`}
      />

      {/* PROGRESS BARS */}
      <div className="absolute top-12 left-4 right-4 flex gap-1 z-[200]">
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

      {/* CONTENT */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={current}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.5 }}
          className="w-full h-full flex flex-col items-center justify-center p-6 text-center relative"
          style={{ backgroundColor: s.bg }}
        >
          
          {/* LAYOUT: SKIP (KRAKAU STREEP) */}
          {s.layout === 'skip' && (
            <div className="z-10 flex flex-col items-center px-6">
               <h1 className="text-5xl font-black text-white italic leading-[0.9] uppercase mb-10 tracking-tighter opacity-70">{s.title}</h1>
               <div className="relative inline-block mb-10 rotate-[-5deg]">
                 <h2 className="text-7xl font-black text-white uppercase">{s.sub}</h2>
                 {/* Rode Streep */}
                 <div className="absolute top-1/2 left-[-10%] w-[120%] h-3 bg-red-600 -translate-y-1/2 rotate-[-2deg] shadow-lg" />
               </div>
               <p className="text-xl font-bold text-white italic opacity-90 leading-tight">{s.desc}</p>
            </div>
          )}

          {/* LAYOUT: MCD */}
          {s.layout === 'mcd' && (
            <div className="z-10 flex flex-col items-center px-4">
              <div className="text-8xl mb-6">🍟</div>
              <h1 className="text-6xl font-black text-white mb-2 tracking-tighter uppercase leading-none">{s.title}</h1>
              <h2 className="text-xl font-black text-yellow-400 bg-black px-4 py-1 rotate-[-3deg] inline-block mb-10 uppercase tracking-widest">{s.sub}</h2>
              <p className="text-xl font-bold text-white italic leading-tight max-w-[280px]">{s.desc}</p>
            </div>
          )}

          {/* LAYOUT: RACE */}
          {s.layout === 'race' && (
            <div className="w-full h-full pt-28 pb-12 flex flex-col z-10 px-4">
              <h2 className="text-xl font-black text-white italic mb-10 uppercase tracking-widest">Wie wint 2026?</h2>
              <div className="space-y-6 flex-1 text-left">
                {cities.map((city, i) => (
                  <div key={i} className="relative">
                    <div className="text-[10px] font-black text-white/40 mb-1 uppercase px-1">{city.n}</div>
                    <div className="h-4 bg-white/5 rounded-full relative overflow-hidden border border-white/10">
                      <motion.div 
                        className="h-full absolute left-0 top-0 rounded-full"
                        style={{ backgroundColor: city.c }}
                        initial={{ width: '0%' }}
                        animate={{ 
                          width: city.n === 'Wenen' ? ['0%', '48%', '12%', '22%', '100%'] : ['0%', `${35 + i * 12}%`, `${72 + Math.random() * 10}%`, '92%'] 
                        }}
                        transition={{ duration: 19, times: [0, 0.2, 0.5, 0.8, 1], ease: "easeInOut" }}
                      />
                      <motion.div 
                        className="w-10 h-10 rounded-full absolute -top-3 flex items-center justify-center bg-white shadow-lg"
                        animate={{ 
                          left: city.n === 'Wenen' ? ['0%', '42%', '10%', '18%', '88%'] : ['0%', `${30 + i * 12}%`, `${65 + Math.random() * 10}%`, '80%'] 
                        }}
                        transition={{ duration: 19, times: [0, 0.2, 0.5, 0.8, 1], ease: "easeInOut" }}
                      >
                        <span className="text-xl">{city.icon}</span>
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 19.5 }}
                className="absolute inset-0 bg-red-600 flex flex-col items-center justify-center z-[140] p-6 text-white font-black"
              >
                <h1 className="text-8xl italic leading-none mb-4 uppercase text-shadow-lg">Wenen!</h1>
                <p className="bg-white text-black px-8 py-3 text-2xl uppercase rotate-3 shadow-2xl">GEWONNEN!</p>
              </motion.div>
            </div>
          )}

          {/* LAYOUT: VIDEO TEXT */}
          {s.layout === 'video' && (
            <div className="absolute bottom-24 left-6 right-6 text-left bg-[#1DB954] p-5 rounded-xl z-[150] rotate-[-2deg] shadow-2xl">
              <h2 className="text-black text-2xl font-black italic uppercase leading-tight tracking-tight">Sam heeft het<br/>laatste woord...</h2>
            </div>
          )}

          {/* OVERIGE SLIDES */}
          {['hero', 'stats', 'genres', 'fact', 'list', 'weird', 'music', 'age'].includes(s.layout) && s.layout !== 'mcd' && (
            <div className="z-10 flex flex-col items-center w-full px-6">
              <h1 className="text-6xl font-black text-white italic leading-[0.8] uppercase mb-8 tracking-tighter drop-shadow-md">{s.title}</h1>
              <h2 className="text-2xl font-black text-black bg-white px-6 py-2 inline-block mb-10 rotate-2 uppercase">{s.sub}</h2>
              {s.desc && <p className="text-xl font-bold text-white italic opacity-90 text-center mb-8 px-4 leading-tight">{s.desc}</p>}
              {s.items && (
                <div className="w-full space-y-4">
                  {s.items.map((it, idx) => (
                    <div key={idx} className="bg-white/10 border-2 border-white/20 p-5 rounded-3xl font-black text-2xl uppercase italic text-white shadow-xl text-center">
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