import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/mock';
import { useCartStore } from '../store/cart';
import { getProductByHandle } from '../lib/shopify';
import { Product } from '../types';
import { 
  Star, Truck, ShieldCheck, Minus, Plus, 
  ShoppingCart, Check, ChevronDown, 
  Leaf, Zap, Heart, Clock, Award,
  Shield, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Subcomponentes de Impacto ---

const Badge = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ title, subtitle, centered = false }: { title: string, subtitle?: string, centered?: boolean }) => (
  <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
    {subtitle && <span className="text-age-gold font-bold text-xs uppercase tracking-[0.3em] mb-3 block">{subtitle}</span>}
    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[0.9]">{title}</h2>
  </div>
);

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedKit, setSelectedKit] = useState<number>(1); // 1, 3, or 5 pots
  const [quantity, setQuantity] = useState(1);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [mainImage, setMainImage] = useState('');

  // Scroll handler para Sticky Bar
  useEffect(() => {
    const handleScroll = () => setShowStickyBar(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      setLoading(true);
      try {
        const shopifyProduct = await getProductByHandle(id);
        const target = shopifyProduct || products.find(p => p.id === id);
        if (target) {
          setProduct(target);
          setMainImage(target.thumbnail_url || '');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  // Cálculo de Preços Dinâmicos baseado no Kit
  const kitInfo = useMemo(() => {
    if (!product) return null;
    const basePrice = product.price;
    const kits = [
      { pots: 1, discount: 0, label: 'Tratamento 30 dias', recommended: false },
      { pots: 3, discount: 0.15, label: 'Tratamento 90 dias', recommended: true },
      { pots: 5, discount: 0.25, label: 'Tratamento 150 dias', recommended: false },
    ];
    
    return kits.map(k => {
      const totalPrice = (basePrice * k.pots) * (1 - k.discount);
      const unitPrice = totalPrice / k.pots;
      const installment = totalPrice / 12;
      return { ...k, totalPrice, unitPrice, installment };
    });
  }, [product]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 border-4 border-age-gold border-t-transparent rounded-full animate-spin" />
        <p className="font-black uppercase tracking-[0.4em] text-xs">Carregando Experiência</p>
      </motion.div>
    </div>
  );

  if (!product) return null;

  const activeKitData = kitInfo?.find(k => k.pots === selectedKit) || kitInfo![0];

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${selectedKit}`,
      name: `${product.name} - Kit ${selectedKit} Potes`,
      price: activeKitData.totalPrice,
      quantity: 1,
      image: product.thumbnail_url
    });
    navigate('/cart');
  };

  return (
    <div className="bg-white selection:bg-age-gold selection:text-white">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 overflow-hidden hero-gradient">
        <div className="container mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Galeria Imersiva */}
          <div className="w-full lg:w-1/2 sticky top-32">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative aspect-square rounded-[40px] overflow-hidden bg-gray-50 shadow-premium group"
            >
              <img 
                src={mainImage} 
                alt={product.name}
                className="w-full h-full object-contain p-12 transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute top-8 left-8 flex flex-col gap-3">
                <Badge className="bg-age-gold text-white shadow-lg">Lançamento Exclusivo</Badge>
                <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-2xl shadow-sm flex items-center gap-2">
                  <div className="flex text-age-gold shrink-0">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <span className="text-[10px] font-black text-age-dark">+1.2k Avaliações</span>
                </div>
              </div>
            </motion.div>
            
            {/* Thumbnails Minimalistas */}
            <div className="grid grid-cols-4 gap-4 mt-8">
              {product.images?.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`aspect-square rounded-2xl bg-gray-50 p-2 border-2 transition-all ${mainImage === img ? 'border-age-gold scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Dados de Compra */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <SectionTitle 
                subtitle="Age Solutions® Performance"
                title={product.name}
              />
              
              <div className="flex items-center gap-4 mb-8">
                <div className="text-5xl font-black text-age-dark">
                  R$ {activeKitData.totalPrice.toFixed(2).replace('.', ',')}
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400 line-through text-lg font-bold">R$ {(activeKitData.totalPrice * 1.4).toFixed(2).replace('.', ',')}</span>
                  <span className="text-age-green font-black text-xs uppercase tracking-tighter">Economia de {selectedKit > 1 ? 'até 50%' : '20%'}</span>
                </div>
              </div>

              {/* Installment Highlight */}
              <div className="bg-gray-50 border border-gray-100 p-6 rounded-[32px] mb-10 flex items-center justify-between group hover:border-age-gold/30 transition-colors">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Ou em 12x de</p>
                  <p className="text-4xl font-black text-age-dark group-hover:text-age-gold transition-colors">R$ {activeKitData.installment.toFixed(2).replace('.', ',')}</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-age-green/10 text-age-green mb-2">Sem Juros</Badge>
                  <p className="text-[10px] text-gray-400 font-bold">Cartão de Crédito</p>
                </div>
              </div>

              {/* Kit Builder Premium */}
              <div className="space-y-4 mb-10">
                <p className="font-black text-xs uppercase tracking-[0.2em] mb-4">Escolha seu tratamento:</p>
                <div className="grid grid-cols-1 gap-4">
                  {kitInfo?.map((kit) => (
                    <button
                      key={kit.pots}
                      onClick={() => setSelectedKit(kit.pots)}
                      className={`relative p-6 rounded-[28px] border-2 transition-all duration-300 flex items-center justify-between text-left group
                        ${selectedKit === kit.pots 
                          ? 'border-age-gold bg-age-gold/5 shadow-premium' 
                          : 'border-gray-100 hover:border-gray-300 bg-white'}`}
                    >
                      <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl transition-colors
                          ${selectedKit === kit.pots ? 'bg-age-gold text-white' : 'bg-gray-100 text-gray-400'}`}>
                          {kit.pots}
                        </div>
                        <div>
                          <p className="font-black text-age-dark uppercase tracking-tight">{kit.label}</p>
                          <p className="text-xs font-bold text-gray-400">R$ {kit.unitPrice.toFixed(2).replace('.', ',')} / unidade</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-xl text-age-dark">R$ {kit.totalPrice.toFixed(2).replace('.', ',')}</p>
                        {kit.recommended && (
                          <span className="absolute -top-3 right-8 bg-age-dark text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg animate-bounce">
                            Mais Recomendado
                          </span>
                        )}
                      </div>
                      {selectedKit === kit.pots && (
                        <motion.div layoutId="check" className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-age-gold rounded-full flex items-center justify-center">
                          <Check size={10} className="text-white" strokeWidth={4} />
                        </motion.div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA Original */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleAddToCart}
                  className="btn-premium flex-1 flex items-center justify-center gap-3 group"
                >
                  <ShoppingCart size={20} />
                  COMPRAR AGORA
                </button>
                <div className="flex items-center gap-4 bg-gray-50 px-6 py-4 rounded-full border border-gray-100">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-age-dark"><Minus size={18} /></button>
                  <span className="font-black w-8 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="text-gray-400 hover:text-age-dark"><Plus size={18} /></button>
                </div>
              </div>

              {/* Trust badges rápidos */}
              <div className="mt-12 grid grid-cols-3 gap-4 border-t border-gray-100 pt-8">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-age-gold">
                    <Truck size={20} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-tighter">Entrega Expressa</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-age-gold">
                    <ShieldCheck size={20} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-tighter">Compra 100% Segura</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-age-gold">
                    <Check size={20} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-tighter">Garantia 30 Dias</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- TRUST BAR --- */}
      <div className="bg-gray-50 py-10 border-y border-gray-100">
        <div className="container mx-auto px-4 flex flex-wrap justify-center items-center gap-12 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          <img src="https://renovabe.com.br/cdn/shop/files/logo-g1.svg" alt="G1" className="h-6" />
          <img src="https://renovabe.com.br/cdn/shop/files/logo-vogue.svg" alt="Vogue" className="h-6" />
          <img src="https://renovabe.com.br/cdn/shop/files/logo-estadao.svg" alt="Estadão" className="h-6" />
          <img src="https://renovabe.com.br/cdn/shop/files/logo-r7.svg" alt="R7" className="h-6" />
        </div>
      </div>

      {/* --- BENEFÍCIOS SECTION --- */}
      <section className="section-padding">
        <SectionTitle 
          centered
          subtitle="A Excelência da Fórmula"
          title="Por que escolher a Age?"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: <Zap />, title: "Absorção Imediata", desc: "Nossa tecnologia de micropartículas garante que os nutrientes cheguem onde você precisa em minutos." },
            { icon: <Leaf />, title: "100% Pureza", desc: "Sem conservantes, sem corantes artificiais e livre de açúcares. Apenas o que seu corpo realmente precisa." },
            { icon: <Activity />, title: "Alta Performance", desc: "Concentrações até 3x superiores ao mercado para resultados que você realmente sente." },
            { icon: <Heart />, title: "Saúde Integrativa", desc: "Fórmulas equilibradas que cuidam da sua saúde de dentro para fora, respeitando seu organismo." },
            { icon: <Award />, title: "Padrão Europeu", desc: "Matéria-prima importada dos melhores laboratórios para garantir a máxima eficácia e segurança." },
            { icon: <Shield />, title: "Testado em Rigor", desc: "Cada lote passa por rigorosos testes de qualidade antes de chegar à sua mesa." }
          ].map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="p-10 rounded-[40px] bg-gray-50 border border-transparent hover:border-age-gold/20 hover:bg-white hover:shadow-premium transition-all duration-500 group"
            >
              <div className="w-16 h-16 rounded-3xl bg-white shadow-sm flex items-center justify-center text-age-gold mb-6 group-hover:bg-age-gold group-hover:text-white transition-colors duration-500">
                {item.icon}
              </div>
              <h3 className="text-xl font-black mb-4">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- NARRATIVA / TIMELINE --- */}
      <section className="bg-age-dark text-white py-32 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-age-gold/10 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="w-full lg:w-1/2">
              <span className="text-age-gold font-bold text-xs uppercase tracking-[0.3em] mb-3 block">Sua Jornada de Saúde</span>
              <h2 className="text-5xl md:text-7xl font-black leading-tight mb-8">Evolução que você acompanha.</h2>
              <p className="text-gray-400 text-lg max-w-lg mb-12">Não é mágica, é ciência. Siga o protocolo e sinta a transformação real no seu bem-estar diário.</p>
              
              <div className="space-y-12 border-l-2 border-white/10 pl-8 ml-4">
                {[
                  { time: "Dia 01", title: "O Despertar", desc: "Início da saturação celular. Seu corpo começa a receber os nutrientes essenciais." },
                  { time: "Dia 15", title: "O Ajuste", desc: "Melhora nos níveis de energia e disposição. A absorção está em seu pico." },
                  { time: "Dia 30", title: "O Resultado", desc: "Benefícios visíveis na pele, cabelo e performance física consolidada." }
                ].map((step, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-age-gold shadow-[0_0_15px_rgba(212,175,55,1)]" />
                    <span className="text-age-gold font-black text-xs uppercase tracking-widest">{step.time}</span>
                    <h4 className="text-2xl font-black mt-2 mb-3">{step.title}</h4>
                    <p className="text-gray-400 text-sm">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="relative">
                <div className="absolute inset-0 bg-age-gold/20 blur-[100px] rounded-full scale-75" />
                <img 
                  src={product.thumbnail_url} 
                  alt="Product Narrative" 
                  className="relative z-10 w-full max-w-md mx-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <SectionTitle 
            centered
            subtitle="Dúvidas Frequentes"
            title="Tire suas dúvidas"
          />
          <div className="space-y-4">
            {product.details?.faq?.map((item, i) => (
              <div key={i} className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left group"
                >
                  <span className="font-black text-age-dark uppercase tracking-tight">{item.question}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${activeFaq === i ? 'bg-age-dark text-white' : 'bg-gray-100'}`}>
                    <ChevronDown size={18} className={`transition-transform duration-300 ${activeFaq === i ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-8 pb-8 text-gray-500 text-sm leading-relaxed border-t border-gray-50 pt-4">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- STICKY PURCHASE BAR (MOBILE) --- */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 lg:hidden"
          >
            <div className="glass shadow-premium rounded-[32px] p-5 flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-gray-400">Tratamento {selectedKit} Potes</span>
                <span className="text-xl font-black text-age-dark whitespace-nowrap">R$ {activeKitData.totalPrice.toFixed(2).replace('.', ',')}</span>
              </div>
              <button 
                onClick={handleAddToCart}
                className="btn-premium py-4 px-6 text-sm flex-1"
              >
                COMPRAR AGORA
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
