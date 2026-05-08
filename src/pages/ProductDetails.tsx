import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/mock';
import { getProductBySlug } from '../lib/yampi';
import { Product } from '../types';

// Importando os Templates Dinâmicos
import ColagenoTemplate from './ProductTemplates/ColagenoTemplate';
import CreatinaTemplate from './ProductTemplates/CreatinaTemplate';
import KitSaleTemplate from './ProductTemplates/KitSaleTemplate';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      setLoading(true);
      try {
        let target: Product | null | undefined = null;
        try {
          // Tenta buscar da API Proxy Yampi primeiro
          target = await getProductBySlug(id);
          // Se não achar por ID direto, tenta fazer um fallback pro nome base se existir no mock
          if (!target && products.find(p => p.id === id)) {
            const mockP = products.find(p => p.id === id);
            if (mockP) {
              const searchName = mockP.name.split(' ')[0];
              const yampiSearch = await getProductBySlug(searchName);
              if (yampiSearch) target = yampiSearch;
            }
          }
        } catch { /* API Fail fallback */ }
        
        // Fallback pro MOCK se não encontrar na Yampi
        if (!target) { target = products.find(p => p.id === id) || null; }
        
        if (target) {
          setProduct(target);
        }
      } catch (err) {
        console.error(err);
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
      <p className="text-gray-500 text-lg">Produto não encontrado.</p>
      <Link to="/" className="text-age-gold font-bold hover:underline">Voltar para a loja</Link>
    </div>
  );

  // ==========================================
  // ORQUESTRADOR DE TEMPLATES DE PRODUTO
  // ==========================================
  
  // Categorias que usam venda por Kits e grande volume
  const kitSaleCategories = ['coenzima', 'celluli'];
  
  // Roteamento baseado em category_id
  if (product.category_id === 'creatina') {
    return <CreatinaTemplate product={product} />;
  }
  
  if (kitSaleCategories.includes(product.category_id)) {
    return <KitSaleTemplate product={product} />;
  }

  // Fallback / Padrão: Layout do Colágeno (Com variantes de Sabor)
  return <ColagenoTemplate product={product} />;
}
