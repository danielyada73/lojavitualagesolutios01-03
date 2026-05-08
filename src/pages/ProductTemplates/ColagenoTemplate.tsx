import { useState } from 'react';
import { Product } from '../../types';
import { useCartStore } from '../../store/cart';
import { Star, Minus, Plus, ShoppingCart, ChevronDown, ChevronRight, Sparkles, ShieldCheck } from 'lucide-react';
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
  const discount = product.discount_percentage || (product.original_price ? Math.round(((product.original_price - product.price) / product.original_price) * 100) : 0);
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
    <div className="bg-[#111] text-white min-h-screen selection:bg-age-gold selection:text-black font-sans">
      <div className="container mx-auto px-4 py-6">
        <nav className="flex items-center gap-2 text-xs text-gray-500 font-medium tracking-wide">
          <Link to="/" className="hover:text-age-gold transition-colors uppercase">Home</Link>
          <ChevronRight size={14} className="text-gray-700" />
          <Link to={`/category/${product.category_id}`} className="hover:text-age-gold transition-colors uppercase">Colágeno</Link>
          <ChevronRight size={14} className="text-gray-700" />
          <span className="text-age-gold truncate max-w-[200px] uppercase">{product.name}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          
          {/* GALERIA */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="relative bg-gradient-to-tr from-gray-900 to-black rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/5] lg:aspect-square flex items-center justify-center p-8 border border-white/5 group">
              <div className="absolute inset-0 bg-age-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl rounded-full scale-150" />
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
            <div className="inline-flex items-center gap-2 bg-age-gold/10 border border-age-gold/20 text-age-gold px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 w-fit shadow-[0_0_15px_rgba(201,161,92,0.2)]">
              <Sparkles size={14} /> Tratamento Anti-idade
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 leading-[1.1] mb-6 tracking-tighter">
              {product.name}
            </h1>
            
            <p className="text-lg text-gray-400 mb-8 font-light leading-relaxed">
              Tenha uma pele mais jovem, sem rugas e sem linha de expressão! Renove sua pele com o colágeno mais eficaz do Brasil.
            </p>

            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-age-gold/10 blur-3xl rounded-full" />
              
              {product.original_price && (
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm text-gray-500 line-through">De R$ {product.original_price.toFixed(2).replace('.', ',')}</span>
                  <span className="text-xs font-black text-black bg-age-gold px-3 py-1 rounded-full uppercase tracking-widest">
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

            {/* Variações (Sabores) */}
            {product.variations && product.variations.length > 1 && (
              <div className="mb-8">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 block">Selecione o Sabor:</label>
                <div className="flex flex-wrap gap-3">
                  {product.variations.map((v, i) => (
                    <button 
                      key={v.id} 
                      onClick={() => setSelectedVariation(i)} 
                      className={`px-6 py-4 rounded-2xl text-sm font-bold uppercase tracking-wider transition-all duration-300 border ${
                        selectedVariation === i 
                          ? 'bg-age-gold text-black border-age-gold shadow-[0_0_20px_rgba(201,161,92,0.3)]' 
                          : 'bg-white/5 text-gray-300 border-white/10 hover:border-white/30 hover:bg-white/10'
                      }`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantidade e Botão */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl overflow-hidden h-16 w-full sm:w-36 backdrop-blur-md">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-12 h-full flex items-center justify-center hover:bg-white/10 transition-colors text-gray-400 hover:text-white"><Minus size={18} /></button>
                <span className="flex-1 text-center font-black text-xl">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="w-12 h-full flex items-center justify-center hover:bg-white/10 transition-colors text-gray-400 hover:text-white"><Plus size={18} /></button>
              </div>
              
              <button 
                onClick={handleAddToCart} 
                className="flex-1 h-16 bg-gradient-to-r from-[#c9a15c] to-[#e6c887] hover:from-[#e6c887] hover:to-[#c9a15c] text-black font-black uppercase tracking-[0.2em] text-sm rounded-2xl transition-all duration-300 shadow-[0_0_40px_-10px_rgba(201,161,92,0.6)] hover:shadow-[0_0_60px_-10px_rgba(201,161,92,0.8)] flex items-center justify-center gap-3 transform hover:-translate-y-1"
              >
                <ShoppingCart size={20} /> ADICIONAR AO CARRINHO
              </button>
            </div>
            
            <div className="flex items-center gap-3 justify-center sm:justify-start text-xs text-gray-400 font-medium tracking-wide">
              <ShieldCheck size={16} className="text-age-gold" />
              <span>Compra 100% Segura • Satisfação Garantida</span>
            </div>
          </div>
        </div>

        {/* SEÇÃO INFORMATIVA PREMIUM */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#c9a15c] to-[#e6c887] uppercase tracking-tighter mb-4">
              Vantagens e Benefícios
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light">
              Fórmula exclusiva desenvolvida com a mais alta tecnologia para entregar resultados rápidos e duradouros.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-24">
            {benefits.map((b, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-2xl bg-age-gold/10 border border-age-gold/20 flex items-center justify-center text-age-gold mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles size={20} />
                </div>
                <h4 className="text-xl font-black text-white mb-3 tracking-tight uppercase">{b.title}</h4>
                <p className="text-gray-400 leading-relaxed font-light">{b.desc}</p>
              </div>
            ))}
          </div>

          <div className="relative bg-gradient-to-br from-gray-900 to-black p-12 rounded-[3rem] text-center mb-24 border border-age-gold/20 overflow-hidden shadow-[0_0_100px_rgba(201,161,92,0.1)]">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
            <div className="relative z-10">
              <p className="text-2xl md:text-4xl font-black text-age-gold mb-4 tracking-tighter uppercase">Você vai precisar de apenas 1 Scoop por dia!</p>
              <p className="text-gray-300 text-lg md:text-xl font-light">
                O consumo é indicado sempre após a refeição. <br className="hidden md:block"/> Podendo ser após seu café da manhã ou após o almoço.
              </p>
            </div>
          </div>

          {/* FAQ Elegante */}
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
