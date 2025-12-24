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

  // 1. De cruciale start-functie (Unlock media)
  const handleStart = () => {
    // AUDIO UNLOCK
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio unlock failed", e));
    }
    
    // VIDEO UNLOCK (Priming)
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }).catch(e => console.log("Video priming failed", e));
    }

    setStarted(true);
  };

  // 2. Timer en Volume beheer
  useEffect(() => {
    if (!started) return;

    // Volume zachter tijdens de video slide
    if (audioRef.current) {
      audioRef.current.volume = current === 11 ? 0.05 : 0.5;
    }

    // Video afspelen als we bij de laatste slide zijn
    if (current === 11 && videoRef.current) {
      videoRef.current.play().catch(e => console.log("Video playback error", e));
    }

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

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden touch-none select-none font-sans">
      
      {/* MEDIA ELEMENTEN: Altijd aanwezig buiten de condities voor autorisatie */}
      <audio 
        ref={audioRef} 
        src="/muziek.mp3" 
        loop 
        playsInline 
      />
      
      <video
        ref={videoRef}
        src="/video.mp4"
        playsInline
        webkit-playsinline="true"
        preload="auto"
        className={`fixed inset-0 w-full h-full object-cover transition-opacity duration-500 ${started && current === 11 ? 'opacity-100 z-[130]' : 'opacity-0 -z-10'}`}
      />

      {/* START SCHERM OVERLAY */}
      <AnimatePresence>
        {!started && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black flex flex-col items-center justify-center p-8 text-center z-[500]"
          >
            <div className="text-9xl mb-12">🎁</div>
            <h1 className="text-white text-5xl font-black mb-8 italic uppercase tracking-tighter">USOCIA<br/><span className="text-[#1DB954]">UNWRAPPED</span></h1>
            <button 
              onClick={handleStart} 
              className="bg-[#1DB954] text-black px-12 py-6 rounded-full font-black text-2xl uppercase tracking-widest active:scale-95 shadow-2xl"
            >
              START STORY
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PROGRESS BARS */}
      {started && (
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
            className="w-full h-full flex flex-col items-center justify-center p-6 text-center relative"
            style={{ backgroundColor: s.bg }}
          >
            {/* MCD LAYOUT */}
            {s.layout === 'mcd' && (
              <div className="z-10 flex flex-col items-center px-4">
                <div className="text-8xl mb-6">🍟</div>
                <h1 className="text-6xl font-black text-white mb-2 tracking-tighter uppercase leading-none">{s.title}</h1>
                <h2 className="text-xl font-black text-yellow-400 bg-black px-4 py-1 rotate-[-3deg] inline-block mb-10 uppercase tracking-widest">{s.sub}</h2>
                <p className="text-xl font-bold text-white italic leading-tight max-w-[280px]">{s.desc}</p>
              </div>
            )}

            {/* RACE LAYOUT */}
            {s.layout === 'race' && (
              <div className="w-full h-full pt-28 pb-12 flex flex-col z-10 px-4 text-left">
                <h2 className="text-xl font-black text-white italic mb-10 uppercase tracking-widest text-center">Wie wint 2026?</h2>
                <div className="space-y-6 flex-1">
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
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ delay: 19.5 }}
                  className="absolute inset-0 bg-red-600 flex flex-col items-center justify-center z-[120] p-10"
                >
                  <h1 className="text-7xl font-black text-white italic leading-none mb-4 uppercase">Wenen!</h1>
                  <p className="bg-white text-black px-8 py-3 text-2xl font-black uppercase rotate-3">GEWONNEN!</p>
                </motion.div>
              </div>
            )}

            {/* VIDEO OVERLAY TEXT */}
            {s.layout === 'video' && (
              <div className="absolute bottom-24 left-6 right-6 text-left bg-[#1DB954] p-5 rounded-xl z-[150] rotate-[-2deg]">
                <h2 className="text-black text-2xl font-black italic uppercase leading-tight tracking-tight">Sam heeft het<br/>laatste woord...</h2>
              </div>
            )}

            {/* STANDAARD LAYOUTS */}
            {['hero', 'stats', 'genres', 'skip', 'fact', 'list', 'weird', 'music', 'age'].includes(s.layout) && s.layout !== 'mcd' && (
              <div className="z-10 flex flex-col items-center w-full px-6">
                <h1 className="text-6xl font-black text-white italic leading-[0.8] uppercase mb-8 tracking-tighter drop-shadow-md">{s.title}</h1>
                <h2 className="text-2xl font-black text-black bg-white px-4 py-1 inline-block mb-10 rotate-2 uppercase">{s.sub}</h2>
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
      )}
    </div>
  );
}