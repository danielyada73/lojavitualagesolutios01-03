import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, X } from 'lucide-react';

interface VideoItem {
  id: string;
  driveId: string;
  title: string;
}

const videoData: VideoItem[] = [
  { id: '1', driveId: '1N42sLtQkKn5z-lkUbrTF1Egsc-Q6bqMg', title: 'Resultados 1' },
  { id: '2', driveId: '1m6Zaf29goqWhFa2qQ6cmI0OJ3ndR34cs', title: 'Resultados 2' },
  { id: '3', driveId: '1MRM11c2dUm0Pk21RmCkGn7ehU3pFywKf', title: 'Resultados 3' },
  { id: '4', driveId: '1bW4hxFuyH19ejUBco3C2b247gZQBn6jE', title: 'Resultados 4' },
];

export default function VideoGallery() {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const extendedVideos = [...videoData, ...videoData, ...videoData];

  // Use the export=download format for direct video file access which works better with <video> tags
  const getVideoUrl = (id: string) => `https://drive.google.com/uc?export=download&id=${id}`;
  const getEmbedUrl = (id: string) => `https://drive.google.com/file/d/${id}/preview?autoplay=1`;
  const getThumbnailUrl = (id: string) => `https://lh3.googleusercontent.com/d/${id}`;

  useEffect(() => {
    // Force play on all videos when component mounts
    videoRefs.current.forEach(video => {
      if (video) {
        video.play().catch(e => console.log("Autoplay prevented:", e));
      }
    });
  }, []);

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 mb-10 text-center">
        <h2 className="text-3xl font-bold uppercase tracking-tight text-age-gold mb-2">
          Resultados Reais
        </h2>
        <p className="text-xs uppercase tracking-widest text-gray-500">
          VEJA O QUE NOSSOS CLIENTES ESTÃO DIZENDO
        </p>
      </div>

      <div className="relative w-full">
        <div className="flex animate-video-marquee gap-4 md:gap-6 hover:[animation-play-state:paused]">
          {extendedVideos.map((video, index) => (
            <div
              key={`${video.id}-${index}`}
              className="relative flex-shrink-0 w-[calc(45vw)] md:w-[calc(20vw-1.5rem)] aspect-[9/16] rounded-[24px] md:rounded-[32px] overflow-hidden cursor-pointer group shadow-lg border border-gray-100 bg-gray-100"
              onClick={() => setSelectedVideo(video)}
            >
              <video
                ref={el => videoRefs.current[index] = el}
                src={getVideoUrl(video.driveId)}
                className="w-full h-full object-cover"
                muted
                autoPlay
                loop
                playsInline
                poster={getThumbnailUrl(video.driveId)}
                onMouseOver={(e) => e.currentTarget.play()}
                onMouseOut={(e) => e.currentTarget.play()} // Keep playing
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 transform group-hover:scale-110 transition-transform">
                  <Play size={28} className="md:w-8 md:h-8" fill="currentColor" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white p-2 bg-white/10 rounded-full transition-colors z-[110]"
            >
              <X size={32} />
            </button>

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg aspect-[9/16] bg-black rounded-[30px] md:rounded-[40px] overflow-hidden shadow-2xl border border-white/10"
            >
              <iframe
                src={getEmbedUrl(selectedVideo.driveId)}
                className="w-full h-full border-0"
                allow="autoplay; fullscreen"
                allowFullScreen
              />

              <div className="absolute top-4 left-8 right-8 pointer-events-none">
                <div className="text-white">
                  <h3 className="font-bold text-lg md:text-xl uppercase tracking-tight drop-shadow-lg">{selectedVideo.title}</h3>
                  <p className="text-white/60 text-xs md:text-sm drop-shadow-md">Age Solutions - Resultados Reais</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes video-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-video-marquee {
          animation: video-marquee 60s linear infinite;
        }
      `}} />
    </section>
  );
}
