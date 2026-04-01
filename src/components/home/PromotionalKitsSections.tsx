import { useEffect, useState } from 'react';
import { Product } from '../../types';
import ProductCard from '../ui/ProductCard';
import { getProductsByCategory, getAllProducts } from '../../lib/yampi';
import { Loader2 } from 'lucide-react';

export default function PromotionalKitsSections() {
  const [kits, setKits] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadKits() {
      try {
        const data = await getProductsByCategory('kits-promocionais', 50);
        setKits(data);
      } catch (error) {
        console.error('Erro ao carregar kits:', error);
      } finally {
        setLoading(false);
      }
    }
    loadKits();
  }, []);

  const colagenoKits = kits.filter(k => k.name.toLowerCase().includes('colágeno') && !k.name.toLowerCase().includes('verisol'));
  const celluliKits = kits.filter(k => k.name.toLowerCase().includes('celluli') || k.name.toLowerCase().includes('cellulli'));
  const verisolKits = kits.filter(k => k.name.toLowerCase().includes('verisol'));
  const coenzimaKits = kits.filter(k => k.name.toLowerCase().includes('coenzima'));

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-age-gold" size={40} />
      </div>
    );
  }

  const renderSection = (title: string, subtitle: string, products: Product[], bgColor = "bg-white") => {
    if (products.length === 0) return null;
    return (
      <section className={`container mx-auto px-4 py-12 ${bgColor === 'bg-gray-50' ? 'bg-gray-50 rounded-3xl' : ''}`}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold uppercase tracking-wide text-age-gold">
            {title}
          </h2>
          <p className="text-sm uppercase tracking-widest text-gray-500">
            {subtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="space-y-16 py-16 bg-white">
      {renderSection("Colágeno com Ácido Hialurônico", "RENOVE SUA PELE COM O COLÁGENO MAIS EFICAZ DO BRASIL!", colagenoKits)}
      {renderSection("Celulli Burn", "ELIMINE AS CELULITES COM NOSSO SUPLEMENTO 100% NATURAL!", celluliKits, "bg-gray-50")}
      {renderSection("Colágeno Verisol", "RENOVE SUA PELE COM O COLÁGENO MAIS EFICAZ DO BRASIL!", verisolKits)}
      {renderSection("Coenzima Q10", "CONTROLE DO COLESTEROL E AÇÃO ANTIOXIDANTE", coenzimaKits, "bg-gray-50")}
    </div>
  );
}
