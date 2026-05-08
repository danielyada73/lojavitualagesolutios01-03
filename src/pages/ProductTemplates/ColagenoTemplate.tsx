import { useState } from 'react';
import { Product } from '../../types';
import { useCartStore } from '../../store/cart';
import { Star, Minus, Plus, ShoppingCart, ChevronDown, ChevronRight, Sparkles, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  product: Product;
}

export default function ColagenoTemplate({ product }: Props) {
  const addItem = useCartStore((state) => state.addItem);
  const toggleCart = useCartStore((state) => state.toggleCart);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState<number>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const images = product.images?.length ? product.images : [product.thumbnail_url];
  const currentVariation = product.variations?.[selectedVariation];
  const displayPrice = currentVariation?.price || product.price;

  const handleAddToCart = () => {
    addItem(product, currentVariation, quantity);
    toggleCart();
  };

  const faqItems = [
    { question: 'Em quanto tempo começa a aparecer os resultados?', answer: 'A maioria dos estudos demonstram que os resultados são visíveis a partir de 8 semanas, mas começam a ser notados a partir de 4 semanas.' },
    { question: 'Como devo tomar?', answer: 'Misture 1 colher de sopa (aprox.12g) em 150ml de água, consumir uma vez ao dia.' },
    { question: 'Qual o prazo de entrega?', answer: 'Em média despachamos o produto em até 24hs após comprovação do pagamento.' },
  ];

  const benefits = [
    { title: 'Ácido hialurônico 50mg', desc: 'Contribui para a elasticidade e resistência da pele e unhas.' },
    { title: 'PROTEÍNA 10g', desc: 'Regenera tecidos e desempenha um papel importante no sistema imunológico.' },
    { title: 'Vitamina B6, C e E', desc: 'Antioxidante que beneficia a luminosidade da pele, deixando-a viçosa.' },
    { title: 'Zinco', desc: 'Diminui radicais livres e protege células produtoras de colágeno.' },
  ];

  return (
    <div className="bg-white text-[#141414] min-h-screen font-sans">
      {/* Top Banner Promoção */}
      <div className="bg-[#141414] text-white py-3 text-center text-[10px] font-black uppercase tracking-[0.3em] overflow-hidden whitespace-nowrap">
        <div className="animate-marquee inline-block">
          PROMOÇÃO ESPECIAL! FRETE GRÁTIS PARA TODO O BRASIL! • PROMOÇÃO ESPECIAL! FRETE GRÁTIS PARA TODO O BRASIL!
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-12">
          <Link to="/" className="hover:text-black">Home</Link>
          <ChevronRight size={12} className="text-gray-300" />
          <span className="text-black">Colágeno</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* GALERIA CLINICAL */}
          <div className="space-y-6">
            <div className="bg-[#F9F8F6] rounded-[20px] overflow-hidden aspect-square flex items-center justify-center p-8 border border-[#E5E5E5] relative">
              <img src={images[selectedImage] || product.thumbnail_url} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
              <div className="absolute top-6 left-6 bg-[#141414] text-white px-4 py-1.5 text-[10px] font-black tracking-widest uppercase">Original</div>
            </div>
            
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)} className={`flex-shrink-0 w-24 h-24 rounded-xl border-2 transition-all ${selectedImage === i ? 'border-[#141414] opacity-100' : 'border-transparent opacity-50'}`}>
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* INFORMAÇÕES DE COMPRA */}
          <div className="flex flex-col">
            <h1 className="text-4xl md:text-6xl font-black text-[#141414] leading-[1.1] mb-6 tracking-tighter">
              {product.name}
            </h1>
            <p className="text-xl text-gray-500 mb-10 font-medium leading-relaxed italic">
              "Renove sua pele com o colágeno mais eficaz do Brasil!"
            </p>

            {/* Sabores / Variações */}
            {product.variations && product.variations.length > 1 && (
              <div className="mb-10">
                <span className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-4 block">Selecione o Sabor:</span>
                <div className="flex flex-wrap gap-3">
                  {product.variations.map((v, i) => (
                    <button 
                      key={v.id} 
                      onClick={() => setSelectedVariation(i)} 
                      className={`px-8 py-4 text-xs font-black uppercase tracking-widest transition-all border ${
                        selectedVariation === i ? 'bg-[#141414] text-white border-[#141414]' : 'bg-white text-[#141414] border-[#E5E5E5] hover:border-[#141414]'
                      }`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* PREÇO */}
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-5xl font-black text-[#141414] tracking-tighter">R$ {displayPrice.toFixed(2).replace('.', ',')}</span>
                {product.original_price && (
                  <span className="text-xl text-gray-400 line-through">R$ {product.original_price.toFixed(2).replace('.', ',')}</span>
                )}
              </div>
              <p className="text-[#28A745] font-black text-sm uppercase tracking-widest">Até 12x sem juros no cartão</p>
            </div>

            {/* BOTÕES QUADRADOS (Design Manual) */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <div className="flex items-center border border-[#141414] h-16 w-full sm:w-40">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="flex-1 h-full flex items-center justify-center hover:bg-gray-100"><Minus size={18} /></button>
                <span className="flex-1 text-center font-black text-xl">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="flex-1 h-full flex items-center justify-center hover:bg-gray-100"><Plus size={18} /></button>
              </div>
              
              <button 
                onClick={handleAddToCart} 
                className="flex-[2] h-16 bg-[#141414] text-white font-black uppercase tracking-[0.4em] text-[11px] hover:bg-gray-800 transition-all flex items-center justify-center gap-4"
              >
                <ShoppingCart size={18} /> Adicionar ao Carrinho
              </button>
            </div>

            {/* Selos de Confiança */}
            <div className="grid grid-cols-2 gap-8 border-t border-[#E5E5E5] pt-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#F9F8F6] flex items-center justify-center text-[#141414]"><Truck size={24} /></div>
                <div className="text-[10px] font-black uppercase tracking-widest">Frete Grátis<br/><span className="text-gray-400 font-bold">Todo o Brasil</span></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#F9F8F6] flex items-center justify-center text-[#141414]"><ShieldCheck size={24} /></div>
                <div className="text-[10px] font-black uppercase tracking-widest">Compra Segura<br/><span className="text-gray-400 font-bold">Checkout Protegido</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTEÚDO TÉCNICO / BENEFÍCIOS */}
        <div className="mt-32">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-black text-[#141414] uppercase tracking-tighter mb-6">Fórmula Exclusiva e Poderosa</h2>
            <p className="text-gray-500 text-lg leading-relaxed">Combinamos ciência e estética para criar um suplemento único que atua de dentro para fora na regeneração da sua pele.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
            {benefits.map((b, i) => (
              <div key={i} className="bg-[#F9F8F6] p-10 border border-[#E5E5E5] hover:border-[#141414] transition-all group">
                <Sparkles size={32} className="text-[#141414] mb-8 group-hover:scale-110 transition-transform" />
                <h4 className="text-lg font-black text-[#141414] uppercase tracking-tight mb-4">{b.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>

          {/* FAQ Minimalista */}
          <div className="max-w-4xl mx-auto border-t border-[#E5E5E5] pt-20">
            <h2 className="text-3xl font-black text-[#141414] mb-12 uppercase tracking-tighter text-center">Dúvidas Frequentes</h2>
            <div className="space-y-4">
              {faqItems.map((item, i) => (
                <div key={i} className="border border-[#E5E5E5] overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-8 text-left hover:bg-[#F9F8F6] transition-colors">
                    <span className="font-black text-[#141414] text-sm uppercase tracking-widest">{item.question}</span>
                    <Plus size={20} className={`transition-transform duration-300 ${openFaq === i ? 'rotate-45' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-96' : 'max-h-0'}`}>
                    <div className="px-8 pb-8 text-gray-500 text-sm leading-relaxed border-t border-[#E5E5E5] pt-6 bg-white">
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
