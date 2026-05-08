import { useState } from 'react';
import { Product } from '../../types';
import { getDirectCheckoutUrl } from '../../lib/yampi';
import { Star, Minus, Plus, ShoppingCart, ChevronRight, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  product: Product;
}

export default function ModeloMaeTemplate({ product }: Props) {

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const images = product.images?.length ? product.images : [product.thumbnail_url];
  const displayPrice = product.price;

  const handleBuyNow = () => {
    const url = getDirectCheckoutUrl(product.id, quantity);
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white text-[#141414] min-h-screen font-sans selection:bg-[#141414] selection:text-white">
      {/* Breadcrumb Minimalista */}
      <div className="container mx-auto px-4 py-6 border-b border-[#E5E5E5]">
        <nav className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <ChevronRight size={12} className="text-gray-300" />
          <Link to={`/category/${product.category_id}`} className="hover:text-black transition-colors">
            {product.category_id?.replace(/-/g, ' ')}
          </Link>
          <ChevronRight size={12} className="text-gray-300" />
          <span className="text-black truncate max-w-[200px]">{product.name}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* Esquerda: Galeria Clean */}
          <div className="space-y-6">
            <div className="bg-[#F9F8F6] rounded-[20px] overflow-hidden aspect-square flex items-center justify-center p-8 border border-[#E5E5E5]">
              <img 
                src={images[selectedImage] || product.thumbnail_url} 
                alt={product.name} 
                className="w-full h-full object-contain mix-blend-multiply" 
              />
            </div>
            
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedImage(i)} 
                    className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === i ? 'border-[#141414] opacity-100' : 'border-transparent opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Direita: Detalhes Farmacêuticos */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-[#FFC107] text-[#FFC107]" />)}
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Qualidade Garantida</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-[#141414] leading-tight mb-6 tracking-tight">
              {product.name}
            </h1>
            
            <p className="text-base text-gray-500 mb-10 leading-relaxed max-w-lg">
              {product.description || 'Desenvolvido com tecnologia de ponta para entregar os melhores resultados para sua saúde e beleza. Produto autêntico Age Solutions.'}
            </p>

            {/* Preço e Compra */}
            <div className="border-t border-[#E5E5E5] pt-10 mb-10">
              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-4xl font-bold text-[#141414]">
                  R$ {displayPrice.toFixed(2).replace('.', ',')}
                </span>
                {product.original_price && (
                  <span className="text-lg text-gray-400 line-through">
                    R$ {product.original_price.toFixed(2).replace('.', ',')}
                  </span>
                )}
              </div>
              <p className="text-sm font-bold text-[#28A745] mb-8 flex items-center gap-2 uppercase tracking-widest">
                <ShieldCheck size={16} /> Frete Grátis para todo o Brasil
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center border border-[#141414] h-14 w-full sm:w-36">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-12 h-full flex items-center justify-center hover:bg-gray-100 transition-colors"><Minus size={18} /></button>
                  <span className="flex-1 text-center font-bold text-lg">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="w-12 h-full flex items-center justify-center hover:bg-gray-100 transition-colors"><Plus size={18} /></button>
                </div>
                
                <button 
                  onClick={handleBuyNow} 
                  className="flex-1 h-14 bg-[#141414] text-white font-black uppercase tracking-[0.3em] text-xs hover:bg-gray-800 transition-all flex items-center justify-center gap-3"
                >
                  <ShoppingCart size={18} /> COMPRAR AGORA
                </button>
              </div>
            </div>
            
            {/* Benefícios Rápidos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#F9F8F6] p-8 rounded-[20px] border border-[#E5E5E5]">
              <div className="flex items-start gap-4">
                <div className="text-[#141414] mt-1"><Truck size={20} /></div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest mb-1">Entrega Rápida</p>
                  <p className="text-[11px] text-gray-500 leading-tight">Enviamos em até 24h úteis para todo país.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-[#141414] mt-1"><ShieldCheck size={20} /></div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest mb-1">Compra Segura</p>
                  <p className="text-[11px] text-gray-500 leading-tight">Garantia de satisfação ou seu dinheiro de volta.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
