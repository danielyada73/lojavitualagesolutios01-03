import { useState } from 'react';
import { Product } from '../../types';
import { useCartStore } from '../../store/cart';
import { Star, Minus, Plus, ShoppingCart, ChevronDown, ChevronRight, Zap, Target, RefreshCcw, Brain, ShieldCheck, Truck } from 'lucide-react';
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
  const discount = product.discount_percentage || (product.original_price ? Math.round(((product.original_price - product.price) / product.original_price) * 100) : 0);
  const displayPrice = product.price;

  const handleAddToCart = () => {
    addItem(product, undefined, quantity);
    toggleCart();
  };

  const faqItems = [
    { question: 'Quem pode tomar creatina?', answer: 'Todos podem e devem tomar creatina! Ela não é apenas para atletas, mas para qualquer pessoa que deseja mais energia, força e desempenho – tanto físico quanto mental.' },
    { question: 'Creatina causa pedras nos rins?', answer: 'Não há evidências científicas que comprovem isso em pessoas saudáveis.' },
    { question: 'Preciso fazer a fase de saturação?', answer: 'Não é estritamente necessário. O consumo de 3g a 5g por dia já promove o acúmulo muscular ao longo dos dias.' },
    { question: 'Devo tomar creatina mesmo nos dias que não treino?', answer: 'Sim, a creatina tem efeito crônico (acumulativo), portanto deve ser ingerida todos os dias.' },
    { question: 'A creatina engorda?', answer: 'Não, a creatina não possui calorias. O que pode ocorrer é um ganho de peso pela hidratação intramuscular, o que é benéfico para o músculo.' },
  ];

  const benefits = [
    { icon: <Target size={32} />, title: 'Aumento de Força', desc: 'Eleve sua capacidade de levantar mais peso e ter mais resistência nos treinos.' },
    { icon: <RefreshCcw size={32} />, title: 'Recuperação Muscular', desc: 'Reduz a fadiga e acelera a regeneração dos músculos após treinos intensos.' },
    { icon: <Zap size={32} />, title: 'Desempenho Máximo', desc: 'A creatina aumenta os níveis de ATP, garantindo mais potência para suas atividades.' },
    { icon: <Brain size={32} />, title: 'Melhoria Cognitiva', desc: 'Estudos comprovam que a creatina melhora o foco, a memória e a clareza mental.' },
  ];

  return (
    <div className="bg-[#111] text-white min-h-screen selection:bg-age-gold selection:text-black font-sans">
      <div className="container mx-auto px-4 py-6">
        <nav className="flex items-center gap-2 text-xs text-gray-500 font-medium tracking-wide">
          <Link to="/" className="hover:text-age-gold transition-colors uppercase">Home</Link>
          <ChevronRight size={14} className="text-gray-700" />
          <Link to={`/category/${product.category_id}`} className="hover:text-age-gold transition-colors uppercase">
            {product.category_id?.replace(/-/g, ' ')}
          </Link>
          <ChevronRight size={14} className="text-gray-700" />
          <span className="text-age-gold truncate max-w-[200px] uppercase">{product.name}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          
          {/* GALERIA */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="relative bg-gradient-to-tr from-gray-900 to-black rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/5] lg:aspect-square flex items-center justify-center p-8 border border-white/5 group">
              <div className="absolute inset-0 bg-age-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl rounded-full scale-150" />
              <img 
                src={images[selectedImage] || product.thumbnail_url} 
                alt={product.name} 
                className="w-full h-full object-contain drop-shadow-2xl z-10 group-hover:scale-105 transition-transform duration-700 ease-out" 
              />
            </div>
            
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar">
                {images.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedImage(i)} 
                    className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden transition-all duration-300 ${
                      selectedImage === i 
                        ? 'ring-2 ring-age-gold opacity-100 bg-white/10' 
                        : 'ring-1 ring-white/5 opacity-40 hover:opacity-100 bg-black'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* INFORMAÇÕES DE COMPRA */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            <div className="flex items-center gap-3 mb-6 bg-white/5 inline-flex w-fit px-4 py-2 rounded-full border border-white/10">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-age-gold text-age-gold" />)}
              </div>
              <span className="text-xs text-gray-300 font-bold uppercase tracking-wider">Altíssima Pureza</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 leading-[1.1] mb-6 tracking-tighter">
              {product.name}
            </h1>
            
            <p className="text-lg text-gray-400 mb-8 font-light leading-relaxed">
              Diminui a fadiga e aumenta a resistência e força em exercícios físicos de alta intensidade. 100% Pura Monohidratada. Dose diária recomendada: 3g.
            </p>

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
              <p className="text-sm text-gray-400">ou 12x de R$ {(displayPrice / 12).toFixed(2).replace('.', ',')} sem juros</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl overflow-hidden h-16 w-full sm:w-36 backdrop-blur-md">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-12 h-full flex items-center justify-center hover:bg-white/10 transition-colors text-gray-400 hover:text-white"><Minus size={18} /></button>
                <span className="flex-1 text-center font-black text-xl">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="w-12 h-full flex items-center justify-center hover:bg-white/10 transition-colors text-gray-400 hover:text-white"><Plus size={18} /></button>
              </div>
              
              <button 
                onClick={handleAddToCart} 
                className="flex-1 h-16 bg-gradient-to-r from-[#c9a15c] to-[#e6c887] hover:from-[#e6c887] hover:to-[#c9a15c] text-black font-black uppercase tracking-[0.2em] text-sm rounded-2xl transition-all shadow-[0_0_40px_-10px_rgba(201,161,92,0.6)] hover:shadow-[0_0_60px_-10px_rgba(201,161,92,0.8)] flex items-center justify-center gap-3 transform hover:-translate-y-1 animate-pulse"
              >
                <ShoppingCart size={20} /> GARANTIR MEU POTENCIAL
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-8">
              <div className="flex items-center gap-3 justify-center sm:justify-start text-xs text-gray-300 font-medium tracking-wide">
                <Truck size={18} className="text-age-gold" /> Frete Grátis Brasil
              </div>
              <div className="flex items-center gap-3 justify-center sm:justify-start text-xs text-gray-300 font-medium tracking-wide">
                <ShieldCheck size={18} className="text-age-gold" /> Compra Segura
              </div>
            </div>
          </div>
        </div>

        {/* INFORMAÇÕES EXTRAS - PERFORMANCE */}
        <div className="mt-32">
          
          {/* Benefícios */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
              Benefícios da <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c9a15c] to-[#e6c887]">Creatina</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
            {benefits.map((b, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all duration-300 group text-center">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-age-gold/10 border border-age-gold/20 flex items-center justify-center text-age-gold mb-6 group-hover:scale-110 transition-transform">
                  {b.icon}
                </div>
                <h4 className="text-xl font-black text-white mb-3 tracking-tight uppercase">{b.title}</h4>
                <p className="text-gray-400 font-light leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>

          {/* Como Tomar & Tabela Nutricional */}
          <div className="grid lg:grid-cols-2 gap-12 mb-24 items-start">
            <div>
              <h2 className="text-3xl font-black text-white mb-8 uppercase tracking-tighter">Como devo tomar?</h2>
              <p className="text-gray-400 mb-8 font-light leading-relaxed text-lg">
                Muitas pessoas têm dúvidas sobre como tomar creatina, mas o mais importante é entender que o consumo diário é essencial para garantir seus benefícios acumulativos.
              </p>
              
              <div className="space-y-8">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <h4 className="font-bold text-white mb-2 uppercase tracking-widest text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-age-gold"></span> Preciso tomar todos os dias?
                  </h4>
                  <p className="text-gray-400 font-light">Sim. A creatina deve ser consumida diariamente, mesmo nos dias em que você não treina. Seu efeito é crônico.</p>
                </div>
                
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <h4 className="font-bold text-white mb-2 uppercase tracking-widest text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-age-gold"></span> Qual a quantidade ideal?
                  </h4>
                  <p className="text-gray-400 font-light">A recomendação é consumir 3g de creatina por dia para obter todos os benefícios. Não é estritamente necessário fazer fase de saturação.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-black p-10 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-age-gold/5 blur-3xl rounded-full" />
              <h2 className="text-2xl font-black text-white mb-6 text-center uppercase tracking-tighter">Informação Nutricional</h2>
              <p className="text-sm text-age-gold mb-6 text-center font-bold tracking-widest uppercase">Porção de 3g (1 dosador)</p>
              
              <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm">
                <div className="grid grid-cols-2 bg-white/10 px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-300">
                  <span>Quantidade por porção</span>
                  <span className="text-right">%VD (*)</span>
                </div>
                <div className="grid grid-cols-2 px-6 py-5 text-sm border-b border-white/5">
                  <span className="text-gray-300">Creatina Monohidratada</span>
                  <span className="text-right text-white font-black text-lg">3000mg</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-6 text-center font-light leading-relaxed">
                Não contém quantidades significativas de valor energético, carboidratos, açúcares, proteínas, gorduras totais, gorduras saturadas, gorduras trans, fibra alimentar e sódio.
              </p>
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-black text-white mb-10 text-center uppercase tracking-tighter">Perguntas Frequentes</h2>
            <div className="space-y-4">
              {faqItems.map((item, i) => (
                <div key={i} className="border border-white/10 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-white/20">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-6 text-left">
                    <span className="font-bold text-gray-200 pr-4 tracking-wide">{item.question}</span>
                    <ChevronDown size={20} className={`text-age-gold transition-transform duration-500 ${openFaq === i ? 'rotate-180' : ''}`} />
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
