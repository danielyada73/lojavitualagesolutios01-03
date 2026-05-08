import { useState } from 'react';
import { Product } from '../../types';
import { useCartStore } from '../../store/cart';
import { Star, ShoppingCart, ChevronDown, ChevronRight, Shield, Truck } from 'lucide-react';
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

  // Mocking the kits based on standard landing page logic
  const kits = [
    { pots: 6, discount: 0.80, label: 'KIT MAIS COMPLETO', popular: false },
    { pots: 3, discount: 0.77, label: 'MAIS ECONOMIA', popular: true },
    { pots: 2, discount: 0.74, label: 'O MAIS VENDIDO', popular: false },
    { pots: 1, discount: 0.60, label: 'PARA EXPERIMENTAR', popular: false },
  ];

  const currentKit = kits.find(k => k.pots === selectedKit) || kits[1];
  
  // Calculate specific kit prices
  const kitOriginalTotal = originalBasePrice * currentKit.pots;
  const kitFinalTotal = kitOriginalTotal * (1 - currentKit.discount);
  const kitInstallment = kitFinalTotal / 12;

  const handleAddToCart = () => {
    // Add the base product with the selected quantity
    addItem(product, undefined, selectedKit);
    toggleCart();
  };

  const faqItems = [
    { question: 'Em quanto tempo começa a aparecer os resultados?', answer: 'A maioria dos estudos demonstram que os resultados são visíveis a partir de 8 semanas, mas começam a ser notados a partir de 4 semanas. Resultados podem variar de organismo para organismo.' },
    { question: 'Como devo tomar?', answer: 'O consumo é indicado sempre após as refeições. Podendo ser após seu café da manhã ou após o almoço.' },
    { question: 'Qual o prazo de entrega?', answer: 'Em média despachamos o produto em até 24hs após comprovação do pagamento.' },
    { question: 'Contém alguma contraindicação?', answer: 'Recomendamos buscar orientação médica para gestantes e lactantes.' },
    { question: 'Os ingredientes são naturais?', answer: 'Sim, suplemento alimentar 100% natural.' },
  ];

  return (
    <div className="bg-[#f9f8f6] min-h-screen">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-xs text-gray-400">
          <Link to="/" className="hover:text-age-gold transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link to={`/category/${product.category_id}`} className="hover:text-age-gold transition-colors capitalize">
            {product.category_id?.replace(/-/g, ' ')}
          </Link>
          <ChevronRight size={12} />
          <span className="text-gray-600 font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Esquerda: Imagens */}
          <div className="flex flex-col-reverse md:flex-row gap-4">
            {images.length > 1 && (
              <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[600px] pb-2 md:pb-0 md:pr-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)} className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-age-gold' : 'border-gray-200'}`}>
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div className="flex-1 relative">
              <div className="bg-white rounded-[20px] overflow-hidden shadow-lg aspect-square flex items-center justify-center p-4">
                <img src={images[selectedImage] || product.thumbnail_url} alt={product.name} className="w-full h-full object-contain" />
              </div>
            </div>
          </div>

          {/* Direita: Info Principal */}
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-2">{product.name}</h1>
            <p className="text-sm text-gray-500 mb-6">Suplemento 100% natural de alta performance.</p>

            <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100 shadow-sm text-center">
              <p className="text-gray-500 mb-1">De R$ {kitOriginalTotal.toFixed(2).replace('.', ',')} por apenas</p>
              <p className="text-sm text-gray-600">12x sem juros de</p>
              <div className="text-5xl font-black text-age-gold my-2">R$ {kitInstallment.toFixed(2).replace('.', ',')}</div>
              <p className="text-sm text-gray-500">ou R$ {kitFinalTotal.toFixed(2).replace('.', ',')} à vista</p>
            </div>

            {/* SELETOR DE KITS */}
            <div className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 text-center">Selecione o Kit:</h3>
              <div className="flex flex-col gap-3">
                {kits.map((kit) => (
                  <button
                    key={kit.pots}
                    onClick={() => setSelectedKit(kit.pots)}
                    className={`relative w-full rounded-xl border-2 transition-all overflow-hidden text-left flex items-center justify-between p-4 ${
                      selectedKit === kit.pots
                        ? 'border-age-gold bg-[#fff8e1]'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    {selectedKit === kit.pots && (
                      <div className="absolute top-0 right-0 bg-age-gold text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-lg">
                        Selecionado
                      </div>
                    )}
                    
                    <div>
                      <div className="font-black text-gray-900 text-lg uppercase">{kit.pots} {product.name.split(' ')[0]}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Economize R$ {(kitOriginalTotal - kitFinalTotal).toFixed(2).replace('.', ',')}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-black text-[#2E7D32]">
                        {Math.round(kit.discount * 100)}% OFF
                      </div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                        {kit.label}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Comprar */}
            <button onClick={handleAddToCart} className="w-full h-16 bg-[#2E7D32] hover:bg-[#1b5e20] text-white font-black uppercase tracking-widest text-lg rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 animate-pulse">
              <ShoppingCart size={24} /> COMPRAR AGORA
            </button>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-2 justify-center text-xs text-gray-600 font-medium">
                <Truck size={16} className="text-age-gold" /> Frete Grátis Brasil
              </div>
              <div className="flex items-center gap-2 justify-center text-xs text-gray-600 font-medium">
                <Shield size={16} className="text-age-gold" /> Compra 100% Segura
              </div>
            </div>
          </div>
        </div>

        {/* Informações Extras */}
        <div className="mt-16 bg-white rounded-[20px] p-8 md:p-12 shadow-sm border border-gray-100">
          
          <div className="text-center mb-12">
            <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase">Suplemento 100% Natural</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-bold">0% Açúcar</span>
              <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-bold">0% Lactose</span>
              <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-bold">0% Glúten</span>
            </div>
          </div>

          <hr className="border-gray-100 mb-12" />

          {/* FAQ */}
          <h2 className="text-2xl font-black text-gray-900 mb-6 text-center uppercase">Perguntas Frequentes</h2>
          <div className="space-y-3 max-w-3xl mx-auto">
            {faqItems.map((item, i) => (
              <div key={i} className="border border-gray-100 rounded-xl overflow-hidden bg-white">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50">
                  <span className="font-bold text-sm text-gray-800 pr-4">{item.question}</span>
                  <ChevronDown size={18} className={`text-gray-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-4">{item.answer}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
