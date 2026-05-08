import { useState } from 'react';
import { Product } from '../../types';
import { useCartStore } from '../../store/cart';
import { Minus, Plus, ShoppingCart, ChevronDown, ChevronRight, ShieldCheck, Truck, Zap, Target, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  product: Product;
}

export default function CreatinaTemplate({ product }: Props) {
  const addItem = useCartStore((state) => state.addItem);
  const toggleCart = useCartStore((state) => state.toggleCart);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const images = product.images?.length ? product.images : [product.thumbnail_url];
  const displayPrice = product.price;

  const handleAddToCart = () => {
    addItem(product, undefined, quantity);
    toggleCart();
  };

  const benefits = [
    { icon: <Zap size={24} />, title: 'Explosão Muscular', desc: 'Aumenta os níveis de ATP para treinos intensos.' },
    { icon: <Target size={24} />, title: 'Pura Monohidratada', desc: '100% de pureza garantida para máxima absorção.' },
    { icon: <Brain size={24} />, title: 'Foco Cognitivo', desc: 'Beneficia a clareza mental e o desempenho cerebral.' },
  ];

  const faqItems = [
    { question: 'Como tomar?', answer: 'Recomendamos 3g (1 dosador) por dia, todos os dias, preferencialmente após o treino.' },
    { question: 'Creatina retém líquido?', answer: 'A creatina retém líquido dentro do músculo, o que auxilia na síntese proteica e volume muscular, não causando "inchaço" abdominal.' },
  ];

  return (
    <div className="bg-white text-[#141414] min-h-screen font-sans">
      <div className="container mx-auto px-4 py-8 lg:py-16">
        <nav className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-12">
          <Link to="/" className="hover:text-black">Home</Link>
          <ChevronRight size={12} className="text-gray-300" />
          <span className="text-black uppercase">Creatina</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          <div className="space-y-6">
            <div className="bg-[#F9F8F6] rounded-[20px] overflow-hidden aspect-square flex items-center justify-center p-12 border border-[#E5E5E5]">
              <img src={images[selectedImage] || product.thumbnail_url} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
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

          <div className="flex flex-col">
            <h1 className="text-4xl lg:text-5xl font-black text-[#141414] leading-tight mb-4 tracking-tighter uppercase">{product.name}</h1>
            <p className="text-lg text-gray-500 mb-10 font-medium leading-relaxed">Alta pureza para atletas que buscam força e recuperação muscular acelerada.</p>

            <div className="mb-12">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-5xl font-black text-[#141414] tracking-tighter">R$ {displayPrice.toFixed(2).replace('.', ',')}</span>
                {product.original_price && (
                  <span className="text-xl text-gray-400 line-through">R$ {product.original_price.toFixed(2).replace('.', ',')}</span>
                )}
              </div>
              <p className="text-[#28A745] font-black text-xs uppercase tracking-widest">Até 12x sem juros ou 5% OFF no PIX</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <div className="flex items-center border border-[#141414] h-16 w-full sm:w-40">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="flex-1 h-full flex items-center justify-center hover:bg-gray-100"><Minus size={18} /></button>
                <span className="flex-1 text-center font-black text-xl">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="flex-1 h-full flex items-center justify-center hover:bg-gray-100"><Plus size={18} /></button>
              </div>
              <button onClick={handleAddToCart} className="flex-[2] h-16 bg-[#141414] text-white font-black uppercase tracking-[0.4em] text-[11px] hover:bg-gray-800 transition-all flex items-center justify-center gap-4 rounded-none">
                <ShoppingCart size={18} /> Adicionar ao Carrinho
              </button>
            </div>

            <div className="bg-[#F9F8F6] p-8 border border-[#E5E5E5] grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                <Truck size={24} className="text-[#141414]" />
                <div className="text-[10px] font-black uppercase tracking-widest">Frete Grátis<br/><span className="text-gray-400">Todo o Brasil</span></div>
              </div>
              <div className="flex items-center gap-4">
                <ShieldCheck size={24} className="text-[#141414]" />
                <div className="text-[10px] font-black uppercase tracking-widest">Compra Segura<br/><span className="text-gray-400">Certificada</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-32 grid lg:grid-cols-3 gap-8">
          {benefits.map((b, i) => (
            <div key={i} className="p-10 border border-[#E5E5E5] text-center hover:bg-[#F9F8F6] transition-colors">
              <div className="inline-flex w-16 h-16 bg-[#141414] text-white items-center justify-center mb-6">{b.icon}</div>
              <h4 className="text-lg font-black text-[#141414] uppercase tracking-widest mb-4">{b.title}</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-32 flex flex-col items-center">
          <div className="w-full max-w-2xl border border-[#E5E5E5] p-12 bg-[#F9F8F6]">
            <h3 className="text-2xl font-black text-[#141414] uppercase tracking-tighter mb-8 text-center">Tabela Nutricional</h3>
            <div className="border border-[#E5E5E5] bg-white text-xs">
              <div className="grid grid-cols-2 p-4 border-b border-[#E5E5E5] font-black uppercase">
                <span>Dose: 3g (1 scoop)</span>
                <span className="text-right">V.D. (%)</span>
              </div>
              <div className="grid grid-cols-2 p-4 border-b border-[#E5E5E5]">
                <span>Creatina Monohidratada</span>
                <span className="text-right font-black">3000mg (*)</span>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 mt-6 leading-relaxed">* Valor diário não estabelecido. Não contém glúten, lactose ou açúcares.</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-32 border-t border-[#E5E5E5] pt-20 pb-20">
          <h2 className="text-3xl font-black text-[#141414] mb-12 uppercase tracking-tighter text-center">Dúvidas Frequentes</h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <div key={i} className="border border-[#E5E5E5] overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-8 text-left hover:bg-[#F9F8F6] transition-colors">
                  <span className="font-black text-[#141414] text-sm uppercase tracking-widest">{item.question}</span>
                  <Plus size={20} className={`transition-transform duration-300 ${openFaq === i ? 'rotate-45' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-96' : 'max-h-0'}`}>
                  <div className="px-8 pb-8 text-gray-500 text-sm leading-relaxed border-t border-[#E5E5E5] pt-6 bg-white">{item.answer}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
