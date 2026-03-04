import React from 'react';
import { Link } from 'react-router-dom';

interface SingleBannerSectionProps {
  desktopImage: string;
  mobileImage: string;
  targetUrl?: string;
  altText?: string;
}

export default function SingleBannerSection({ 
  desktopImage, 
  mobileImage, 
  targetUrl = '/category/colageno-po',
  altText = 'Promoção Especial'
}: SingleBannerSectionProps) {
  return (
    <section className="w-full bg-black overflow-hidden min-h-[100px] md:min-h-[200px] flex items-center justify-center">
      <Link to={targetUrl} className="block w-full h-full">
        {/* Desktop Image */}
        <img
          src={desktopImage}
          alt={altText}
          className="w-full h-auto object-cover hidden md:block min-h-[200px]"
          loading="lazy"
        />
        
        {/* Mobile Image */}
        <img
          src={mobileImage}
          alt={altText}
          className="w-full h-auto object-cover md:hidden min-h-[400px]"
          loading="lazy"
        />
      </Link>
    </section>
  );
}
