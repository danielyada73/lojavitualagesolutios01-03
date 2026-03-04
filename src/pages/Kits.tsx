import { promotionalKits } from '../data/mock';
import ProductCard from '../components/ui/ProductCard';
import { Product } from '../types';

export default function Kits() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-4 uppercase italic tracking-tighter">
        Kits <span className="text-orange-600">Promocionais</span>
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        Aproveite nossos descontos exclusivos em combos selecionados para maximizar seus resultados.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotionalKits.map((kit) => {
          const product: Product = {
            id: kit.id,
            category_id: 'kits',
            name: kit.name,
            description: kit.description,
            price: kit.base_price * (1 - kit.discount_percentage / 100),
            original_price: kit.base_price,
            discount_percentage: kit.discount_percentage,
            thumbnail_url: kit.thumbnail_url,
            is_popular: true
          };
          
          return <ProductCard key={kit.id} product={product} />;
        })}
      </div>
    </div>
  );
}
