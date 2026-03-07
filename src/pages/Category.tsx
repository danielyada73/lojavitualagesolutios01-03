import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { categories, products as mockProducts } from '../data/mock';
import { Filter } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { getProductsByCollection } from '../lib/shopify';
import { Product } from '../types';

export default function Category() {
  const { slug } = useParams();
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const category = categories.find((c) => c.slug === slug);

  useEffect(() => {
    async function loadCategoryData() {
      if (!slug) return;

      setLoading(true);
      try {
        const fetchedProducts = await getProductsByCollection(slug, 20);

        if (fetchedProducts && fetchedProducts.length > 0) {
          setCategoryProducts(fetchedProducts);
        } else {
          // Fallback para dados mockados
          const mocks = slug === 'kits'
            ? mockProducts.filter((p) => p.is_kit)
            : mockProducts.filter((p) => {
              const cat = categories.find((c) => c.slug === slug);
              return p.category_id === cat?.id;
            });
          setCategoryProducts(mocks);
        }
      } catch (error) {
        console.error('Erro ao buscar categoria na Shopify:', error);
        // Fallback em caso de erro
        const mocks = slug === 'kits'
          ? mockProducts.filter((p) => p.is_kit)
          : mockProducts.filter((p) => {
            const cat = categories.find((c) => c.slug === slug);
            return p.category_id === cat?.id;
          });
        setCategoryProducts(mocks);
      } finally {
        setLoading(false);
      }
    }

    loadCategoryData();
  }, [slug]);

  if (!category && !loading && categoryProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Categoria não encontrada</h1>
        <Link to="/" className="text-orange-600 hover:underline">Voltar para a home</Link>
      </div>
    );
  }

  const displayName = category?.name || (slug ? slug.toUpperCase().replace('-', ' ') : 'Categoria');
  const bannerUrl = category?.banner_url || 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?q=80&w=1200&auto=format&fit=crop';

  return (
    <div>
      {/* Category Banner */}
      <div className="relative h-64 md:h-80 bg-gray-900 overflow-hidden">
        <img
          src={bannerUrl}
          alt={displayName}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white uppercase italic tracking-tighter">
            {displayName}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Filters & Sort */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 mb-4 md:mb-0">
            <Filter size={20} />
            <span className="font-medium">
              {loading ? 'Buscando produtos...' : `${categoryProducts.length} produtos encontrados`}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <label className="text-sm text-gray-500">Ordenar por:</label>
            <select className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500 bg-white">
              <option>Mais Populares</option>
              <option>Menor Preço</option>
              <option>Maior Preço</option>
              <option>Novidades</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-age-gold"></div>
          </div>
        ) : categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Nenhum produto encontrado nesta categoria.</p>
          </div>
        )}
      </div>
    </div>
  );
}

