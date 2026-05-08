import { useState } from 'react';
import { Product } from '../../types';
import { useCartStore } from '../../store/cart';
import { ShoppingCart, ChevronDown, ChevronRight, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  product: Product;
}

export default function KitSaleTemplate({ product }: Props) {
  const addItem = useCartStore((state) => state.addItem);
  const toggleCart = useCartStore((state) => state.toggleCart);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedKit, setSelectedKit] = useState<number>(3); // Default to 3 pots
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const images = product.images?.length ? product.images : [product.thumbnail_url];
  const basePrice = product.price;
  const originalBasePrice = product.original_price || basePrice * 1.5;

  const kits = [
    { pots: 6, discount: 0.80, label: 'KIT MAIS COMPLETO', popular: false },
    { pots: 3, discount: 0.77, label: 'MAIS ECONOMIA', popular: true },
    { pots: 2, discount: 0.74, label: 'O MAIS VENDIDO', popular: false },
    { pots: 1, discount: 0.60, label: 'PARA EXPERIMENTAR', popular: false },
  ];

  const currentKit = kits.find(k => k.pots === selectedKit) || kits[1];
  const kitOriginalTotal = originalBasePrice * currentKit.pots;
  const kitFinalTotal = kitOriginalTotal * (1 - currentKit.discount);
  const kitInstallment = kitFinalTotal / 12;

  const handleAddToCart = () => {
    addItem(product, undefined, selectedKit);
    toggleCart();
  };

  const faqItems = [
    { question: 'Em quanto tempo começa a aparecer os resultados?', answer: 'A maioria dos estudos demonstram que os resultados são visíveis a partir de 8 semanas, mas começam a ser notados a partir de 4 semanas.' },
    { question: 'Como devo tomar?', answer: 'O consumo é indicado sempre após as refeições.' },
    { question: 'Qual o prazo de entrega?', answer: 'Em média despachamos o produto em até 24hs após comprovação do pagamento.' },
  ];

  return (
    <div className="bg-[#111] text-white min-h-screen selection:bg-[#ff3333] selection:text-white font-sans">
      <div className="container mx-auto px-4 py-6">
        <nav className="flex items-center gap-2 text-xs text-gray-500 font-medium tracking-wide">
          <Link to="/" className="hover:text-red-500 transition-colors uppercase">Home</Link>
          <ChevronRight size={14} className="text-gray-700" />
          <Link to={`/category/${product.category_id}`} className="hover:text-red-500 transition-colors uppercase">
            {product.category_id?.replace(/-/g, ' ')}
          </Link>
          <ChevronRight size={14} className="text-gray-700" />
          <span className="text-red-500 truncate max-w-[200px] uppercase">{product.name}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          
          {/* GALERIA */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="relative bg-gradient-to-tr from-gray-900 to-black rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/5] lg:aspect-square flex items-center justify-center p-8 border border-white/5 group">
              <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl rounded-full scale-150" />
              <img 
                src={images[selectedImage] || product.thumbnail_url} 
                alt={product.name} 
                className="w-full h-full object-contain drop-shadow-2xl z-10 group-hover:scale-105 transition-transform duration-700 ease-out" 
              />
            </div>
          </div>

          {/* COMPRA: KITS PREMIUM */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 leading-[1.1] mb-4 tracking-tighter">
              {product.name}
            </h1>
            <p className="text-lg text-gray-400 mb-8 font-light">Suplemento 100% natural de alta performance.</p>

            {/* SELETOR DE KITS - OFERTAS AGRESSIVAS */}
            <div className="mb-8 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-4 flex items-center gap-2">
                <Sparkles size={14} className="text-red-500" /> Selecione seu Kit:
              </h3>
              
              <div className="flex flex-col gap-4">
                {kits.map((kit) => (
                  <button
                    key={kit.pots}
                    onClick={() => setSelectedKit(kit.pots)}
                    className={`relative w-full rounded-3xl transition-all duration-300 text-left p-6 border ${
                      selectedKit === kit.pots
                        ? 'bg-gradient-to-br from-red-600/10 to-transparent border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.15)] scale-[1.02]'
                        : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                    }`}
                  >
                    {/* Tag de Destaque */}
                    {kit.popular && (
                      <div className="absolute -top-3 right-6 bg-red-600 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full tracking-widest shadow-lg shadow-red-600/30 animate-pulse">
                        Escolha Mais Inteligente
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-black text-white text-xl md:text-2xl tracking-tight uppercase flex items-center gap-3">
                          {kit.pots} POTES
                          {selectedKit === kit.pots && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                        </div>
                        <div className="text-sm text-gray-400 mt-1 font-light">
                          Economia de <span className="text-white font-bold tracking-wide">R$ {(kitOriginalTotal - kitFinalTotal).toFixed(2).replace('.', ',')}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 tracking-tighter">
                          {Math.round(kit.discount * 100)}% OFF
                        </div>
                        <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">
                          {kit.label}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* PREÇO FINAL EM DESTAQUE */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-6 mb-8 border border-white/5 shadow-2xl text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-3xl rounded-full" />
              <p className="text-gray-400 mb-1 font-light">De <span className="line-through">R$ {kitOriginalTotal.toFixed(2).replace('.', ',')}</span> por apenas</p>
              <div className="text-sm text-gray-500 font-medium">12x sem juros de</div>
              <div className="text-6xl font-black text-white tracking-tighter my-2 drop-shadow-lg">
                <span className="text-3xl text-gray-400">R$</span> {kitInstallment.toFixed(2).replace('.', ',')}
              </div>
              <p className="text-sm text-gray-500">ou R$ {kitFinalTotal.toFixed(2).replace('.', ',')} à vista</p>
            </div>

            <button 
              onClick={handleAddToCart} 
              className="w-full h-20 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-[0.2em] text-lg rounded-2xl transition-all duration-300 shadow-[0_0_40px_-10px_rgba(220,38,38,0.5)] hover:shadow-[0_0_60px_-10px_rgba(220,38,38,0.7)] flex items-center justify-center gap-4 transform hover:-translate-y-1 animate-pulse"
            >
              <ShoppingCart size={24} /> FINALIZAR COMPRA
            </button>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="flex items-center gap-3 justify-center text-xs text-gray-400 font-medium tracking-wide">
                <Truck size={18} className="text-red-500" /> Frete Grátis Brasil
              </div>
              <div className="flex items-center gap-3 justify-center text-xs text-gray-400 font-medium tracking-wide">
                <ShieldCheck size={18} className="text-red-500" /> Compra 100% Segura
              </div>
            </div>
          </div>
        </div>

        {/* EXTRAS */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-8">
              Fórmula <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">100% Natural</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="bg-white/5 border border-white/10 text-gray-300 px-6 py-3 rounded-full text-sm font-bold tracking-widest uppercase shadow-lg">0% Açúcar</span>
              <span className="bg-white/5 border border-white/10 text-gray-300 px-6 py-3 rounded-full text-sm font-bold tracking-widest uppercase shadow-lg">0% Lactose</span>
              <span className="bg-white/5 border border-white/10 text-gray-300 px-6 py-3 rounded-full text-sm font-bold tracking-widest uppercase shadow-lg">0% Glúten</span>
            </div>
          </div>

          <div className="max-w-4xl mx-auto mt-24">
            <h2 className="text-3xl font-black text-white mb-10 text-center uppercase tracking-tighter">Dúvidas Frequentes</h2>
            <div className="space-y-4">
              {faqItems.map((item, i) => (
                <div key={i} className="border border-white/10 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-white/20">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-6 text-left">
                    <span className="font-bold text-gray-200 pr-4 tracking-wide">{item.question}</span>
                    <ChevronDown size={20} className={`text-red-500 transition-transform duration-500 ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-6 pb-6 text-gray-400 leading-relaxed font-light border-t border-white/5 pt-4">
                      {item.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
