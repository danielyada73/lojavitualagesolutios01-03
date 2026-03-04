import React from 'react';

const promotionalImages = [
  'https://lh3.googleusercontent.com/d/107tijOuDRXfK4M6iH2xfFRLYkOzevOLK',
  'https://lh3.googleusercontent.com/d/16sctqgtQ40tyD2CPq8St7k_maoyu7S2-'
];

export default function PromotionalBannerSection() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-gray-900">
            Diferenciais do Produto
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {promotionalImages.map((img, idx) => (
            <div key={idx} className="w-full rounded-[20px] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <img 
                src={img} 
                alt={`Diferencial ${idx + 1}`} 
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" 
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
