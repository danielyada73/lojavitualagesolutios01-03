import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/mock';
import { getProductBySlug } from '../lib/yampi';
import { Product } from '../types';

// Importando os Templates Dinâmicos
import ColagenoTemplate from './ProductTemplates/ColagenoTemplate';
import ModeloMaeTemplate from './ProductTemplates/ModeloMaeTemplate';
import HighPerformanceTemplate from './ProductTemplates/HighPerformanceTemplate';

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

  const cat = (product.category_id || '').toLowerCase();
  const pid = product.id.toLowerCase();
  const pname = product.name.toLowerCase();

  // 1. Creatina → HighPerformanceTemplate (kit selector com tokens corretos)
  if (cat.includes('creatina') || pid.includes('cre') || pname.includes('creatina')) {
    return <HighPerformanceTemplate product={product} />;
  }

  // 2. Verisol → HighPerformanceTemplate
  if (cat.includes('verisol') || pid.includes('verisol') || pname.includes('verisol')) {
    return <HighPerformanceTemplate product={product} />;
  }

  // 3. Coenzima → HighPerformanceTemplate
  if (cat.includes('coenzima') || pid.includes('coenz') || pname.includes('coenzima')) {
    return <HighPerformanceTemplate product={product} />;
  }

  // 4. Celluli → HighPerformanceTemplate
  if (cat.includes('celluli') || pid.includes('cell') || pname.includes('celluli')) {
    return <HighPerformanceTemplate product={product} />;
  }

  // 5. Colágeno com Ácido Hialurônico → ColagenoTemplate (kit + sabor selector)
  if (cat.includes('colageno') || pid.includes('col') || pname.includes('colágeno')) {
    return <ColagenoTemplate product={product} />;
  }

  // 6. Fallback universal
  return <ModeloMaeTemplate product={product} />;
}
