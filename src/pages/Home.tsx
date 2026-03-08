import { useEffect, useState } from 'react';
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
import { differentialsImages, colagenoOffers } from '../data/mock';
import { getProductsByCollection } from '../lib/shopify';
import ProductCard from '../components/ui/ProductCard';
import { Product } from '../types';

export default function Home() {
  const [colagenoProducts, setColagenoProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const products = await getProductsByCollection('colageno', 10);
        if (products && products.length > 0) {
          // Buscamos produtos específicos se existirem
          const pote1 = products.find(p => p.handle === 'col-cran' || p.handle === 'colageno');
          const kit2 = products.find(p => p.handle === 'col-kit-2');
          const kit3 = products.find(p => p.handle === 'col-kit-3');

          const foundSpecific = [pote1, kit2, kit3].filter(Boolean) as Product[];

          // Se não encontrou todos os 3 específicos, preenche com os restantes da coleção
          if (foundSpecific.length < 3) {
            const others = products.filter(p => !foundSpecific.find(fs => fs.id === p.id));
            setColagenoProducts([...foundSpecific, ...others].slice(0, 3));
          } else {
            setColagenoProducts(foundSpecific);
          }
        } else {
          // Fallback para dados mockados se a Shopify retornar vazio
          const mappedMocks: Product[] = colagenoOffers.map(offer => ({
            id: offer.id,
            category_id: 'colageno',
            name: offer.name,
            description: offer.description,
            price: offer.price,
            original_price: offer.original_price,
            discount_percentage: offer.discount_percentage,
            thumbnail_url: offer.thumbnail_url,
            is_popular: true,
            handle: offer.id,
            images: [offer.thumbnail_url],
            variations: []
          }));
          setColagenoProducts(mappedMocks);
        }
      } catch (error) {
        console.error('Erro ao carregar produtos da Shopify:', error);
        // Fallback em caso de erro na API
        const mappedMocks: Product[] = colagenoOffers.map(offer => ({
          id: offer.id,
          category_id: 'colageno',
          name: offer.name,
          description: offer.description,
          price: offer.price,
          original_price: offer.original_price,
          discount_percentage: offer.discount_percentage,
          thumbnail_url: offer.thumbnail_url,
          is_popular: true,
          handle: offer.id,
          images: [offer.thumbnail_url],
          variations: []
        }));
        setColagenoProducts(mappedMocks);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

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

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-age-gold"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {colagenoProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
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
