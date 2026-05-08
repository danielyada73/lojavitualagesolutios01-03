import { useMemo } from 'react';
import HeroCarousel from '../components/home/HeroCarousel';
import BenefitsBanner from '../components/home/BenefitsBanner';
import BestSellers from '../components/home/BestSellers';
import CategoryBanners from '../components/home/CategoryBanners';
import CelulliBurnSection from '../components/home/CelulliBurnSection';
import PromotionalBannerSection from '../components/home/PromotionalBannerSection';
import ColagenoVerisolSection from '../components/home/ColagenoVerisolSection';
import CoenzimaQ10Section from '../components/home/CoenzimaQ10Section';
import VideoGallery from '../components/home/VideoGallery';
import InstagramFeed from '../components/home/InstagramFeed';
import Newsletter from '../components/home/Newsletter';
import { differentialsImages, products as allProducts } from '../data/mock';
import ProductCard from '../components/ui/ProductCard';

export default function Home() {
  // Apenas produtos ColAH (1 pote cranberry, 1 pote limão, kit 2) — sem Verisol
  const colagenoProducts = useMemo(() =>
    allProducts
      .filter(p => p.category_id === 'colageno-po')
      .sort((a, b) => a.price - b.price)
      .slice(0, 3),
    []
  );

  return (
    <div className="animate-in fade-in duration-500">
      <HeroCarousel />
      <BenefitsBanner />
      <BestSellers />
      <CategoryBanners />

      {/* Products Section (Real Yampi with Mock Fallback) */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold uppercase tracking-tight text-age-gold mb-2">
              Colágeno com Ácido Hialurônico
            </h2>
            <p className="text-sm uppercase tracking-widest text-gray-500">
              RENOVE SUA PELE COM O COLÁGENO MAIS EFICAZ DO BRASIL!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {colagenoProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Differentials Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-center mb-8 text-gray-900">
            Diferenciais do Produto
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {differentialsImages.map((img, idx) => (
              <div key={idx} className={`w-full rounded-[20px] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group ${idx === differentialsImages.length - 1 && differentialsImages.length % 2 !== 0 ? 'col-span-2 sm:col-span-1' : ''}`}>
                <img
                  src={img}
                  alt={`Diferencial ${idx + 1}`}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <CelulliBurnSection />
      <PromotionalBannerSection />
      <ColagenoVerisolSection />
      <CoenzimaQ10Section />
      <VideoGallery />
      <InstagramFeed />
      <Newsletter />
    </div>
  );
}
