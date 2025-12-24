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

  // Timer-beheer
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
  }, [current, started]);

  // Volume en Video trigger tijdens de slides
  useEffect(() => {
    if (!started) return;

    if (audioRef.current) {
      audioRef.current.volume = current === 11 ? 0.05 : 0.5;
    }

    if (current === 11 && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(e => console.log("Video fail:", e));
    }
  }, [current, started]);

  const handleStart = () => {
    // ESSENTIEEL: Direct de media aanroepen in de click handler
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio failed", e));
    }
    
    if (videoRef.current) {
      // "Prime" de video voor later gebruik op iPhone
      videoRef.current.play().then(() => {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }).catch(e => console.error("Video priming failed", e));
    }

    setStarted(true);
  };

  const s = slides[current];

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden touch-none select-none font-sans">
      {/* MEDIA ELEMENTEN: Altijd aanwezig in de DOM voor autorisatie */}
      <audio 
        ref={audioRef} 
        src="/muziek.mp3" 
        loop 
        playsInline 
        style={{ display: 'none' }} 
      />
      <video
        ref={videoRef}
        src="/video.mp4"
        playsInline
        webkit-playsinline="true"
        style={{ 
          display: started && current === 11 ? 'block' : 'none',
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          objectFit: 'cover',
          zIndex: 130
        }}
      />

      {/* START SCREEN */}
      <AnimatePresence>
        {!started && (
          <motion.div 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black flex flex-col items-center justify-center p-8 text-center z-[300]"
          >
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-9xl mb-12">🎁</motion.div>
            <h1 className="text-white text-5xl font-black mb-8 italic uppercase tracking-tighter">USOCIA<br/><span className="text-[#1DB954]">UNWRAPPED</span></h1>
            <button 
              onClick={handleStart} 
              className="bg-[#1DB954] text-black px-12 py-6 rounded-full font-black text-2xl uppercase tracking-widest active:scale-95 transition-transform"
            >
              BEKIJK STORY
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PROGRESS BARS */}
      {started && (
        <div className="absolute top-12 left-4 right-4 flex gap-1 z-[100]">
          {slides.map((_, i) => (
            <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-white" 
                initial={{ width: 0 }} 
                animate={{ width: i === current ? '100%' : (i < current ? '100%' : '0%') }}
                transition={{ duration: i === current ? (current === 10 ? 22 : (current === 11 ? 11 : 7)) : 0, ease: 'linear' }}
              />
            </div>
          ))}
        </div>
      )}

      {/* SLIDES CONTENT */}
      {started && (
        <AnimatePresence mode="wait">
          <motion.div 
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
            style={{ backgroundColor: s.bg }}
          >
            {/* MCD LAYOUT: Tekst expliciet toegevoegd */}
            {s.layout === 'mcd' && (
              <div className="z-10 flex flex-col items-center px-6">
                <div className="text-8xl mb-4">🍟</div>
                <h1 className="text-6xl font-black text-white mb-2 tracking-tighter uppercase leading-none">{s.title}</h1>
                <h2 className="text-xl font-black text-yellow-400 bg-black px-4 py-1 rotate-[-3deg] inline-block mb-8 uppercase tracking-widest">{s.sub}</h2>
                <p className="text-xl font-bold text-white italic leading-tight">{s.desc}</p>
              </div>
            )}

            {/* RACE LAYOUT */}
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
                            left: city.n === 'Wenen' ? ['0%', '42%', '10%', '18%', '88%'] : ['0%', `${30 + i * 12}%`, `${65 + Math.random() * 10}%`, '82%'] 
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
                  initial={{ opacity: 0, scale: 0.5 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  transition={{ delay: 19.5 }}
                  className="absolute inset-0 bg-red-600 flex flex-col items-center justify-center z-[120] p-6"
                >
                  <h1 className="text-7xl font-black text-white italic leading-none mb-4 uppercase">Wenen!</h1>
                  <p className="bg-white text-black px-8 py-3 font-black text-2xl uppercase rotate-3">GEWONNEN!</p>
                </motion.div>
              </div>
            )}

            {/* VIDEO OVERLAY TEXT */}
            {s.layout === 'video' && (
              <div className="absolute bottom-20 left-6 right-6 text-left bg-[#1DB954] p-5 rounded-xl z-[140] rotate-[-2deg]">
                <h2 className="text-black text-2xl font-black italic uppercase leading-tight tracking-tight">Sam heeft het<br/>laatste woord...</h2>
              </div>
            )}

            {/* STANDAARD LAYOUTS */}
            {['hero', 'stats', 'genres', 'skip', 'fact', 'list', 'weird', 'music', 'age'].includes(s.layout) && s.layout !== 'mcd' && (
              <div className="z-10 flex flex-col items-center w-full px-4">
                <h1 className="text-6xl font-black text-white italic leading-[0.9] uppercase mb-6 tracking-tighter">{s.title}</h1>
                <h2 className="text-2xl font-black text-black bg-white px-4 py-1 inline-block mb-6 rotate-2 uppercase">{s.sub}</h2>
                {s.desc && <p className="text-lg font-bold text-white italic opacity-90 leading-snug mb-8 text-center px-4">{s.desc}</p>}
                {s.items && (
                  <div className="w-full space-y-3 px-4">
                    {s.items.map((it, idx) => (
                      <div key={idx} className="bg-white/10 border border-white/20 p-4 rounded-2xl font-black text-lg uppercase italic text-white">
                        {it}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}