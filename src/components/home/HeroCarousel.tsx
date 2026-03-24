import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { banners } from '../../data/mock';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % banners.length);
  const prev = () => setCurrent((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="relative w-full h-[600px] md:h-[800px] overflow-hidden bg-age-dark">
      <AnimatePresence mode="wait">
        <motion.div
          key={banners[current].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <Link to={banners[current].target_url} className="relative block w-full h-full group">
            {/* Background Image / Placeholder */}
            {banners[current].image_url ? (
              <img
                src={banners[current].image_url}
                alt={banners[current].title}
                className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[10s]"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-age-dark to-neutral-800" />
            )}
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-age-dark via-transparent to-transparent opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-r from-age-dark/60 via-transparent to-transparent" />

            {/* Content Overlay */}
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4 md:px-8">
                <motion.div 
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="max-w-3xl"
                >
                  <span className="inline-block bg-age-gold text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[0.3em] mb-6 shadow-lg">
                    Destaque da Temporada
                  </span>
                  <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.9] mb-8 drop-shadow-2xl">
                    {banners[current].title}
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-300 font-bold mb-10 max-w-xl leading-relaxed drop-shadow-md">
                    {banners[current].description}
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                    <div className="btn-premium px-12 py-6 flex items-center gap-3">
                      <span>APROVEITAR AGORA</span>
                      <ArrowRight size={20} />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </Link>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-1.5 rounded-full transition-all duration-500 ${idx === current 
              ? 'w-12 bg-age-gold' 
              : 'w-4 bg-white/30 hover:bg-white/50'}`}
          />
        ))}
      </div>

      {banners.length > 1 && (
        <>
          <button
            onClick={(e) => { e.preventDefault(); prev(); }}
            className="absolute left-8 top-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center rounded-full border border-white/10 hover:bg-white/10 text-white backdrop-blur-sm transition-all z-30 group"
          >
            <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); next(); }}
            className="absolute right-8 top-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center rounded-full border border-white/10 hover:bg-white/10 text-white backdrop-blur-sm transition-all z-30 group"
          >
            <ChevronRight size={32} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </>
      )}
    </div>
  );
}
