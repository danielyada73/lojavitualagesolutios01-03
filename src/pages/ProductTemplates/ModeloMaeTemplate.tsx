import { useState } from 'react';
import { Product } from '../../types';
import { useCartStore } from '../../store/cart';
import { Star, Minus, Plus, ShoppingCart, ChevronRight, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  product: Product;
}

export default function ModeloMaeTemplate({ product }: Props) {
  const addItem = useCartStore((state) => state.addItem);
  const toggleCart = useCartStore((state) => state.toggleCart);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const images = product.images?.length ? product.images : [product.thumbnail_url];
  const discount = product.discount_percentage || (product.original_price ? Math.round(((product.original_price - product.price) / product.original_price) * 100) : 0);
  const displayPrice = product.price;

  const handleAddToCart = () => {
    addItem(product, undefined, quantity);
    toggleCart();
  };

  return (
    <div className="bg-[#111] text-white min-h-screen selection:bg-age-gold selection:text-black">
      {/* Breadcrumb Premium */}
      <div className="container mx-auto px-4 py-6">
        <nav className="flex items-center gap-2 text-xs text-gray-400 font-medium tracking-wide">
          <Link to="/" className="hover:text-age-gold transition-colors uppercase">Home</Link>
          <ChevronRight size={14} className="text-gray-600" />
          <Link to={`/category/${product.category_id}`} className="hover:text-age-gold transition-colors uppercase">
            {product.category_id?.replace(/-/g, ' ') || 'Categoria'}
          </Link>
          <ChevronRight size={14} className="text-gray-600" />
          <span className="text-age-gold truncate max-w-[200px] uppercase">{product.name}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          
          {/* Esquerda: Galeria Premium (Glassmorphism) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative bg-gradient-to-br from-gray-800 to-black rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] flex items-center justify-center p-8 border border-white/5 group">
              {/* Efeito de brilho no fundo */}
              <div className="absolute inset-0 bg-age-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl rounded-full scale-150" />
              <img 
                src={images[selectedImage] || product.thumbnail_url} 
                alt={product.name} 
                className="w-full h-full object-contain drop-shadow-2xl z-10 hover:scale-105 transition-transform duration-500" 
              />
            </div>
            
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x custom-scrollbar">
                {images.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedImage(i)} 
                    className={`snap-start flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden transition-all duration-300 ${
                      selectedImage === i 
                        ? 'ring-2 ring-age-gold opacity-100 scale-100 bg-white/10' 
                        : 'ring-1 ring-white/10 opacity-50 hover:opacity-80 scale-95 bg-black'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Direita: Info e Compra */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            
            {/* Avaliações */}
            <div className="flex items-center gap-3 mb-6 bg-white/5 inline-flex w-fit px-4 py-2 rounded-full border border-white/10">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-age-gold text-age-gold" />)}
              </div>
              <span className="text-xs text-gray-300 font-bold uppercase tracking-wider">Premium Quality</span>
            </div>

            {/* Título Principal */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 leading-[1.1] mb-6 tracking-tighter">
              {product.name}
            </h1>
            
            <p className="text-lg text-gray-400 mb-8 font-light leading-relaxed">
              {product.description || 'Suplementação premium para resultados visíveis. Qualidade superior garantida pela Age Solutions.'}
            </p>

            {/* Caixa de Preço Glassmorphism */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-age-gold/20 blur-3xl rounded-full" />
              
              {product.original_price && (
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm text-gray-500 line-through">De R$ {product.original_price.toFixed(2).replace('.', ',')}</span>
                  <span className="text-xs font-black text-black bg-age-gold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-age-gold/20">
                    -{discount}% OFF
                  </span>
                </div>
              )}
              
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-5xl md:text-6xl font-black text-white tracking-tighter">
                  R$ {displayPrice.toFixed(2).replace('.', ',')}
                </span>
              </div>
              <p className="text-age-gold font-bold text-lg mb-1">
                R$ {(displayPrice * 0.95).toFixed(2).replace('.', ',')} no PIX
              </p>
              <p className="text-sm text-gray-400">ou 12x de R$ {(displayPrice / 12).toFixed(2).replace('.', ',')} sem juros no cartão</p>
            </div>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl overflow-hidden h-16 w-full sm:w-32 backdrop-blur-md">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-full flex items-center justify-center hover:bg-white/10 transition-colors text-gray-400 hover:text-white"><Minus size={18} /></button>
                <span className="flex-1 text-center font-black text-xl">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-full flex items-center justify-center hover:bg-white/10 transition-colors text-gray-400 hover:text-white"><Plus size={18} /></button>
              </div>
              
              <button 
                onClick={handleAddToCart} 
                className="flex-1 h-16 bg-gradient-to-r from-[#c9a15c] to-[#e6c887] hover:from-[#e6c887] hover:to-[#c9a15c] text-black font-black uppercase tracking-[0.2em] text-sm rounded-2xl transition-all shadow-[0_0_40px_-10px_rgba(201,161,92,0.6)] hover:shadow-[0_0_60px_-10px_rgba(201,161,92,0.8)] flex items-center justify-center gap-3 transform hover:-translate-y-1"
              >
                <ShoppingCart size={20} /> ADICIONAR AO CARRINHO
              </button>
            </div>
            
            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-8">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-age-gold border border-white/10">
                  <Truck size={18} />
                </div>
                <span className="font-medium">Frete Grátis<br/><span className="text-gray-500 text-xs">Para todo o Brasil</span></span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-age-gold border border-white/10">
                  <ShieldCheck size={18} />
                </div>
                <span className="font-medium">Compra Segura<br/><span className="text-gray-500 text-xs">100% Protegida</span></span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
