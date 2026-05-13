import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { categories, products as mockProducts } from '../data/mock';
import { Filter } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';

export default function Category() {
  const { slug } = useParams();
  const [sortOrder, setSortOrder] = useState('Mais Populares');

  const category = categories.find((c) => c.slug === slug);

  const categoryProducts = useMemo(() => {
    if (!slug) return [];
    if (slug === 'kits' || slug === 'kits-promocionais') {
      return mockProducts.filter((p) => p.is_kit);
    }
    const cat = categories.find((c) => c.slug === slug);
    return cat ? mockProducts.filter((p) => p.category_id === cat.id) : [];
  }, [slug]);

  if (!category && categoryProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Categoria não encontrada</h1>
        <Link to="/" className="text-orange-600 hover:underline">Voltar para a home</Link>
      </div>
    );
  }

  const sortedProducts = useMemo(() => {
    const list = [...categoryProducts];
    if (sortOrder === 'Menor Preço') {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortOrder === 'Maior Preço') {
      return list.sort((a, b) => b.price - a.price);
    }
    // Para Mais Populares / Novidades, mantemos a ordem padrão ou adicionamos a lógica necessária futuramente.
    return list;
  }, [categoryProducts, sortOrder]);

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
              {`${categoryProducts.length} produtos encontrados`}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <label className="text-sm text-gray-500">Ordenar por:</label>
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500 bg-white"
            >
              <option>Mais Populares</option>
              <option>Menor Preço</option>
              <option>Maior Preço</option>
              <option>Novidades</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {sortedProducts.map((product) => (
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

