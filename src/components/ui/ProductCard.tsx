import { useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, ArrowRight } from 'lucide-react';
import { useCartStore } from '../../store/cart';
import { Product } from '../../types';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const discount = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100) 
    : 0;

  return (
    <motion.div
      whileHover={{ y: -12 }}
      className="group relative bg-white rounded-[32px] p-2 border border-gray-100 shadow-sm hover:shadow-premium transition-all duration-500 cursor-pointer flex flex-col h-full overflow-hidden"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Badge de Desconto Flutuante */}
      {discount > 0 && (
        <div className="absolute top-6 right-6 z-20 bg-age-dark text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-xl">
          -{discount}%
        </div>
      )}

      {/* Galeria / Imagem */}
      <div className="relative aspect-square overflow-hidden rounded-[24px] bg-gray-50 flex items-center justify-center p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-age-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {product.thumbnail_url ? (
          <img
            src={product.thumbnail_url}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-xl"
          />
        ) : (
          <ShoppingCart size={48} className="text-gray-200" strokeWidth={1} />
        )}
        
        {/* Quick Add Overlay */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-12 group-hover:translate-y-0 transition-all duration-500 opacity-0 group-hover:opacity-100 w-full px-4">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              addItem(product);
            }}
            className="w-full bg-white/90 backdrop-blur text-age-dark text-[10px] font-black py-3 rounded-full shadow-lg border border-white/20 hover:bg-age-gold hover:text-white transition-colors"
          >
            ADICIONAR RÁPIDO
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex text-age-gold">
            {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
          </div>
          <span className="text-[10px] font-black text-gray-400">4.9</span>
        </div>

        <h3 className="text-lg font-black leading-tight text-age-dark mb-2 tracking-tight line-clamp-2 uppercase group-hover:text-age-gold transition-colors">
          {product.name}
        </h3>

        <p className="text-xs text-gray-400 font-medium mb-6 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="mt-auto pt-6 border-t border-gray-50 flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 line-through mb-1">
              R$ {product.original_price?.toFixed(2).replace('.', ',')}
            </span>
            <span className="text-2xl font-black text-age-dark leading-none">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
            <p className="text-[10px] font-black text-age-green mt-2 uppercase tracking-tighter">
              12x de R$ {(product.price / 12).toFixed(2).replace('.', ',')}
            </p>
          </div>
          
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-age-dark group-hover:bg-age-gold group-hover:text-white transition-all duration-500 shadow-sm">
            <ArrowRight size={20} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
