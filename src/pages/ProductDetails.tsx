import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/mock';
import { getProductBySlug } from '../lib/yampi';
import { Product } from '../types';

// Importando os Templates Dinâmicos
import ColagenoTemplate from './ProductTemplates/ColagenoTemplate';
import CreatinaTemplate from './ProductTemplates/CreatinaTemplate';
import KitSaleTemplate from './ProductTemplates/KitSaleTemplate';
import ModeloMaeTemplate from './ProductTemplates/ModeloMaeTemplate'; // NOVO: Modelo Mãe

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      setLoading(true);
      try {
        let target: Product | null = null;
        
        // 1. Tenta API Yampi com o slug/id exato
        try {
          target = await getProductBySlug(id);
        } catch { /* ignora */ }
        
        // 2. Fallback: Procura no MOCK pelo ID exato
        if (!target) {
          target = products.find(p => p.id === id) || null;
        }

        // 3. Fallback Agressivo (Fuzzy Search): Procura qualquer produto onde o slug ou nome contenha o ID
        if (!target) {
          // Ex: se id for "omega-3", acha o "omega-ind"
          const cleanId = id.toLowerCase().replace(/[^a-z0-9]/g, '');
          target = products.find(p => {
            const cleanName = p.name.toLowerCase().replace(/[^a-z0-9]/g, '');
            const cleanPid = p.id.toLowerCase().replace(/[^a-z0-9]/g, '');
            return cleanName.includes(cleanId) || cleanPid.includes(cleanId) || cleanId.includes(cleanPid);
          }) || null;
        }

        if (target) {
          setProduct(target);
        }
      } catch (err) {
        console.error('Erro ao buscar produto:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f8f6]">
      <div className="w-12 h-12 border-4 border-age-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f9f8f6] gap-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
        <h2 className="text-2xl font-black text-gray-900 mb-2">Ops!</h2>
        <p className="text-gray-500 mb-6">Não conseguimos encontrar este produto. Ele pode ter saído de linha ou o link está incorreto.</p>
        <Link to="/" className="inline-block bg-age-gold text-white font-bold py-3 px-8 rounded-xl hover:bg-yellow-600 transition-colors">Voltar para a loja</Link>
      </div>
    </div>
  );

  // ==========================================
  // ORQUESTRADOR DE TEMPLATES DE PRODUTO
  // ==========================================
  
  // Analisa o ID da categoria com segurança
  const cat = (product.category_id || '').toLowerCase();

  // 1. Creatina
  if (cat.includes('creatina')) {
    return <CreatinaTemplate product={product} />;
  }
  
  // 2. Kits (Coenzima, Celluli, Verisol)
  const kitSaleCategories = ['coenzima', 'celluli', 'verisol'];
  if (kitSaleCategories.some(k => cat.includes(k))) {
    return <KitSaleTemplate product={product} />;
  }

  // 3. Colágeno (Foco em Sabor)
  if (cat.includes('colageno')) {
    return <ColagenoTemplate product={product} />;
  }

  // 4. MODELO MÃE: O Fallback Premium Universal para qualquer outro produto (ex: Ômega 3)
  return <ModeloMaeTemplate product={product} />;
}
