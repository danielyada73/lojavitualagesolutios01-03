import { useEffect, useState } from 'react';
import ProductCard from '../components/ui/ProductCard';
import { Product } from '../types';
import { getProductsByCategory } from '../lib/yampi';
import { Loader2 } from 'lucide-react';

export default function Kits() {
  const [kits, setKits] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadKits() {
      try {
        const data = await getProductsByCategory('kits', 50);
        setKits(data);
      } catch (error) {
        console.error('Erro ao buscar kits:', error);
      } finally {
        setLoading(false);
      }
    }
    loadKits();
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-4 uppercase italic tracking-tighter">
        Kits <span className="text-age-gold">Promocionais</span>
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto uppercase tracking-widest text-sm">
        Aproveite nossos descontos exclusivos em combos selecionados para maximizar seus resultados.
      </p>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-age-gold" size={40} />
        </div>
      ) : kits.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {kits.map((kit) => (
            <ProductCard key={kit.id} product={kit} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">
          Nenhum kit promocional encontrado no momento.
        </div>
      )}
    </div>
  );
}
