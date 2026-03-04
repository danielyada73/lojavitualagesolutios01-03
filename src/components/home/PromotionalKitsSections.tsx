import { Link } from 'react-router-dom';
import React from 'react';
import { promotionalKits } from '../../data/mock';
import { PromotionalKit, Product } from '../../types';
import ProductCard from '../ui/ProductCard';

export default function PromotionalKitsSections() {
  // Splitting kits (Mock logic based on ID/Index for now)
  const colagenoKits = promotionalKits.filter(k => k.name.includes('Colágeno') && !k.name.includes('Verisol'));
  const celluliKits = promotionalKits.filter(k => k.name.includes('Celulli Burn'));
  const verisolKits = promotionalKits.filter(k => k.name.includes('Colágeno Verisol'));
  const coenzimaKits = promotionalKits.filter(k => k.name.includes('Coenzima Q10'));

  const renderKitCard = (kit: PromotionalKit) => {
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
  };

  return (
    <div className="space-y-16 py-16 bg-white">
      {/* Section 1: Colágeno com Ácido Hialurônico */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold uppercase tracking-wide text-age-gold">
            Colágeno com Ácido Hialurônico
          </h2>
          <p className="text-sm uppercase tracking-widest text-gray-500">
            RENOVE SUA PELE COM O COLÁGENO MAIS EFICAZ DO BRASIL!
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
          {colagenoKits.map(kit => renderKitCard(kit))}
        </div>
      </section>

      {/* Section 2: Celulli Burn */}
      <section className="container mx-auto px-4 bg-gray-50 py-12 rounded-3xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold uppercase tracking-wide text-age-gold">
            Celulli Burn
          </h2>
          <p className="text-sm uppercase tracking-widest text-gray-500">
            ELIMINE AS CELULITES COM NOSSO SUPLEMENTO 100% NATURAL!
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
          {celluliKits.map(kit => renderKitCard(kit))}
        </div>
      </section>

      {/* Section 3: Colágeno Verisol */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold uppercase tracking-wide text-age-gold">
            Colágeno Verisol
          </h2>
          <p className="text-sm uppercase tracking-widest text-gray-500">
            RENOVE SUA PELE COM O COLÁGENO MAIS EFICAZ DO BRASIL!
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
          {verisolKits.map(kit => renderKitCard(kit))}
        </div>
      </section>

      {/* Section 4: Coenzima Q10 */}
      <section className="container mx-auto px-4 bg-gray-50 py-12 rounded-3xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold uppercase tracking-wide text-age-gold">
            Coenzima Q10
          </h2>
          <p className="text-sm uppercase tracking-widest text-gray-500">
            CONTROLE DO COLESTEROL E AÇÃO ANTIOXIDANTE
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
          {coenzimaKits.map(kit => renderKitCard(kit))}
        </div>
      </section>
    </div>
  );
}
