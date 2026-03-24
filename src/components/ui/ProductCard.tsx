import { useNavigate } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../../store/cart';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  key?: string | number;
}


export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col relative h-full"
    >
      {/* Tags */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
        <div className="bg-black text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
          FRETE GRÁTIS
        </div>
        {product.discount_percentage && (
          <div className="bg-[#E8F5E9] text-[#2E7D32] text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
            {product.discount_percentage}% OFF
          </div>
        )}
        {product.is_available === false && (
          <div className="bg-red-100 text-red-600 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
            ESGOTADO
          </div>
        )}
      </div>

      {/* Image */}
      <div className="aspect-square overflow-hidden mb-6 rounded-xl bg-gray-50">
        {product.thumbnail_url ? (
          <img
            src={product.thumbnail_url}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <ShoppingCart size={40} strokeWidth={1} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col text-left">
        <div className="flex gap-0.5 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={10} className="fill-age-gold text-age-gold" />
          ))}
          <span className="text-[10px] text-gray-400 font-bold ml-1">4.9</span>
        </div>

        <h3 className="font-bold text-sm md:text-base mb-2 leading-tight text-black uppercase tracking-tight group-hover:text-age-gold transition-colors line-clamp-2">
          {product.name}
        </h3>

        <p className="text-[11px] text-gray-500 mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="mt-auto pt-4 border-t border-gray-50">
          <div className="flex flex-col mb-4">
            <span className="text-[10px] text-gray-400 line-through mb-0.5">
              De R$ {product.original_price?.toFixed(2).replace('.', ',')} por apenas
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-black">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <p className="text-[11px] text-[#2E7D32] font-bold mt-1">
              ou 12x sem juros de R$ {(product.price / 12).toFixed(2).replace('.', ',')}
            </p>
          </div>

          <button
            disabled={product.is_available === false}
            onClick={(e) => {
              e.stopPropagation();
              if (product.is_available !== false) addItem(product);
            }}
            className={`w-full font-bold uppercase text-[11px] tracking-widest py-3.5 rounded-full transition-all duration-300 shadow-lg ${product.is_available === false
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-black hover:bg-age-gold text-white hover:shadow-age-gold/20'
              }`}
          >
            {product.is_available === false ? 'Indisponível' : 'Comprar Agora'}
          </button>
        </div>
      </div>
    </div>
  );
}
