import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { banners } from '../../data/mock';
import { Link } from 'react-router-dom';

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % banners.length);
  const prev = () => setCurrent((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="relative w-full overflow-hidden bg-black">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`relative w-full transition-opacity duration-1000 ${index === current ? 'opacity-100 block' : 'opacity-0 hidden'
            }`}
        >
          <Link to={banner.target_url} className="block w-full">
            {/* Desktop Banner */}
            <img
              src={banner.image_url}
              alt={banner.title}
              className={`w-full h-auto object-cover ${banner.mobile_image_url ? 'hidden md:block' : 'block'}`}
            />

            {/* Mobile Banner */}
            {banner.mobile_image_url && (
              <img
                src={banner.mobile_image_url}
                alt={banner.title}
                className="w-full aspect-[4/5] object-cover block md:hidden"
              />
            )}
          </Link>
        </div>
      ))}

      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-colors z-30"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-colors z-30"
          >
            <ChevronRight size={32} />
          </button>
        </>
      )}
    </div>
  );
}
