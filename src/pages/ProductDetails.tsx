import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products, promotionalKits } from '../data/mock';
import { useCartStore } from '../store/cart';
import { getProductByHandle } from '../lib/shopify';
import { Product } from '../types';
import {
  Star, Truck, ShieldCheck, Minus, Plus,
  ShoppingCart, Check, Loader2, ChevronDown, ChevronUp,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [cep, setCep] = useState('');
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // States for variations and images
  const [selectedVariation, setSelectedVariation] = useState<any>(null);
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 800);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      setLoading(true);

      try {
        const shopifyProduct = await getProductByHandle(id);

        if (shopifyProduct) {
          setProduct(shopifyProduct);
          setSelectedVariation(shopifyProduct.variations?.[0] || null);
          setMainImage(shopifyProduct.thumbnail_url || '');
        } else {
          // Fallback para Mock
          const mockProduct = products.find(p => p.id === id);
          if (mockProduct) {
            setProduct(mockProduct);
            setSelectedVariation(mockProduct.variations?.[0] || null);
            setMainImage(mockProduct.thumbnail_url || '');
          }
        }
      } catch (error) {
        console.error('Erro ao buscar produto na Shopify:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-age-gold" size={48} />
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Preparando Experiência...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-3xl font-black mb-6">Produto não encontrado</h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">Não conseguimos localizar o produto que você está procurando em nossa base de dados.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-black text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-age-gold transition-colors"
        >
          Voltar para a loja
        </button>
      </div>
    );
  }

  const currentPrice = product.price + (selectedVariation?.price_modifier || 0);
  const originalPrice = product.original_price || currentPrice * 1.25;
  const discountPercentage = product.discount_percentage || 25;

  const handleAddToCart = async () => {
    await addItem(product, selectedVariation || undefined, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const calculateShipping = (e: FormEvent) => {
    e.preventDefault();
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      setIsCalculating(true);
      setShippingCost(null);
      setTimeout(() => {
        setShippingCost(15.90);
        setIsCalculating(false);
      }, 1500);
    }
  };

  const title = product.name;
  const description = product.description;
  const details = product.details;
  const variations = product.variations || [];

  return (
    <div className="bg-white selection:bg-age-gold/30">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 text-[10px] md:text-xs text-gray-400 uppercase tracking-widest font-bold">
          <button onClick={() => navigate('/')} className="hover:text-age-gold transition-colors">Home</button>
          <span className="text-gray-200">/</span>
          <span className="text-gray-900 truncate">{title}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* 🏛️ Arquitetura Visual do Hero - Left Side (7 columns) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-6">
            {/* Galeria Vertical à Esquerda */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar md:max-h-[600px] pb-2 md:pb-0 scroll-smooth">
              {(product?.images || (mainImage ? [mainImage] : [])).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 bg-gray-50 rounded-2xl overflow-hidden transition-all border-2 relative group ${mainImage === img
                    ? 'border-age-gold shadow-lg shadow-age-gold/10'
                    : 'border-transparent hover:border-gray-200'
                    }`}
                >
                  {img && <img src={img} alt={`${title} view ${i + 1}`} className="w-full h-full object-contain p-2 grayscale-[0.2] group-hover:grayscale-0 transition-all" />}
                  {mainImage === img && <div className="absolute inset-0 bg-age-gold/5 pointer-events-none" />}
                </button>
              ))}
            </div>

            {/* Main Image Display */}
            <div className="flex-1 relative aspect-square bg-[#FBFBFB] rounded-[48px] overflow-hidden group border border-gray-100/50">
              <AnimatePresence mode="wait">
                {mainImage ? (
                  <motion.img
                    key={mainImage}
                    initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    src={mainImage}
                    alt={title}
                    className="w-full h-full object-contain p-8 md:p-14 mix-blend-multiply"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-200">
                    <Loader2 className="animate-spin" size={48} />
                  </div>
                )}
              </AnimatePresence>

              {/* Discount Badge Premium */}
              {discountPercentage > 0 && (
                <div className="absolute top-8 right-8 z-10 flex flex-col items-center">
                   <div className="bg-age-gold text-white px-5 py-2 rounded-2xl font-black text-sm shadow-xl shadow-age-gold/30 tracking-tight animate-bounce-slow">
                    {discountPercentage}% OFF
                  </div>
                </div>
              )}
            </div>
          </div>


          {/* 🛒 Núcleo de Conversão - Right Side (5 columns) - Sticky */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-10">

            {/* Hierarquia de Informação */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex text-age-gold gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" className="drop-shadow-sm" />
                  ))}
                </div>
                <span className="text-[11px] text-gray-400 font-black tracking-widest uppercase border-l border-gray-200 pl-3">
                  +{details?.reviews.count || '2.847'} Clientes Satisfeitos
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-age-dark leading-[1.1] tracking-tight">
                {title}
              </h1>

              {/* Contraste de Preço Premium */}
              <div className="space-y-3">
                <div className="flex items-baseline gap-4">
                  <span className="text-gray-300 line-through text-lg font-bold">
                    R$ {originalPrice.toFixed(2).replace('.', ',')}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-age-gold font-black uppercase tracking-widest mb-1">Preço Exclusivo</span>
                    <span className="text-4xl md:text-6xl font-black text-age-dark tracking-tighter">
                      R$ {currentPrice.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-age-green-soft w-fit px-4 py-2 rounded-2xl border border-age-green/10">
                  <div className="w-2 h-2 rounded-full bg-age-green animate-pulse"></div>
                  <p className="text-sm text-age-green font-black">
                    12x sem juros de R$ {(currentPrice / 12).toFixed(2).replace('.', ',')}
                  </p>
                </div>
              </div>
            </div>

            {/* Variation Selector Premium */}
            {variations.length > 0 && (
              <div className="space-y-5 pt-6 border-t border-gray-100">
                <div className="flex justify-between items-end">
                  <h3 className="font-black uppercase text-[11px] tracking-widest text-gray-400">Escolha o Sabor:</h3>
                  <span className="text-[10px] font-bold text-age-gold uppercase bg-age-gold/10 px-2 py-0.5 rounded-lg">Puro & Natural</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {variations.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariation(v)}
                      className={`px-8 py-4 rounded-2xl text-[13px] font-black transition-all uppercase tracking-wider border-2 ${selectedVariation?.id === v.id
                        ? 'bg-age-dark text-white border-age-dark shadow-xl shadow-age-dark/20 scale-105'
                        : 'bg-white border-gray-100 text-gray-400 hover:border-age-gold hover:text-age-gold hover:bg-gray-50'
                        }`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Section Premium */}
            <div className="space-y-6 pt-6">
              <div className="flex gap-4 h-16">
                {/* Seletor de Quantidade Moderno */}
                <div className="flex items-center bg-gray-50 rounded-2xl border border-gray-200 p-1 w-36 justify-between shadow-inner">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-full flex items-center justify-center text-gray-400 hover:text-age-dark transition-colors"
                  >
                    <Minus size={18} strokeWidth={3} />
                  </button>
                  <span className="font-black text-xl text-age-dark">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-full flex items-center justify-center text-gray-400 hover:text-age-dark transition-colors"
                  >
                    <Plus size={18} strokeWidth={3} />
                  </button>
                </div>

                {/* Botão "Comprar" Ultra Premium */}
                <button
                  onClick={handleAddToCart}
                  disabled={isAdded}
                  className={`flex-1 font-black uppercase tracking-[0.2em] text-sm rounded-2xl transition-all flex items-center justify-center gap-3 shadow-2xl relative overflow-hidden group ${isAdded
                    ? 'bg-age-green text-white'
                    : 'bg-age-gold text-white hover:bg-age-dark hover:shadow-age-gold/20'
                    }`}
                >
                  <AnimatePresence mode="wait">
                    {isAdded ? (
                      <motion.div
                        key="added"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="flex items-center gap-2"
                      >
                        <Check size={20} strokeWidth={4} />
                        Adicionado!
                      </motion.div>
                    ) : (
                      <motion.div
                        key="buy"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="flex items-center gap-2"
                      >
                        <ShoppingCart size={20} strokeWidth={3} />
                        Comprar Agora
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Glossy Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </button>
              </div>

              {/* Cálculo de CEP Premium */}
              <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200/50 shadow-sm relative overflow-hidden">
                <form onSubmit={calculateShipping} className="flex flex-col gap-4 relative z-10">
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <Truck size={14} />
                    Tempo estimado de entrega
                  </div>
                  <div className="flex gap-2 relative">
                    <input
                      type="text"
                      placeholder="Seu CEP aqui..."
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      className="flex-1 bg-white border border-gray-200 rounded-xl px-5 py-4 text-sm font-bold focus:outline-none focus:border-age-gold transition-all shadow-inner"
                    />
                    <button
                      type="submit"
                      disabled={isCalculating}
                      className="bg-age-dark text-white px-6 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-age-gold transition-all disabled:opacity-50"
                    >
                      {isCalculating ? <Loader2 size={16} className="animate-spin" /> : 'Calcular'}
                    </button>
                  </div>
                  {shippingCost !== null && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="flex items-center gap-3 text-xs font-black text-age-green bg-age-green/10 p-4 rounded-xl border border-age-green/20"
                    >
                      <div className="p-1.5 bg-age-green rounded-full text-white shadow-sm">
                        <Check size={12} strokeWidth={4} />
                      </div>
                      <span>Frete Grátis Liberado para sua região!</span>
                    </motion.div>
                  )}
                </form>
              </div>
            </div>

            {/* 🛡️ Confiança Premium */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { icon: ShieldCheck, label: "Garantia\nAge Solutions" },
                { icon: Truck, label: "Envio\nExpresso" },
                { icon: Activity, label: "Fórmula\nCertificada" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center justify-center p-5 bg-white rounded-3xl border border-gray-100/80 text-center gap-3 hover:border-age-gold/30 hover:shadow-xl hover:shadow-gray-100 transition-all group">
                  <item.icon size={26} className="text-gray-200 group-hover:text-age-gold transition-all transform group-hover:scale-110" strokeWidth={1.5} />
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-tight group-hover:text-age-dark whitespace-pre-line">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid Section - Ultra Premium */}
      {details?.benefits && (
        <section className="bg-age-dark py-32 text-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-age-gold rounded-full blur-[180px]"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-age-gold rounded-full blur-[180px]"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto mb-24">
              <span className="inline-block px-5 py-2 bg-age-gold/10 text-age-gold text-[10px] font-black rounded-full mb-6 uppercase tracking-[0.3em] border border-age-gold/20">
                Performance Superior
              </span>
              <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter leading-none uppercase">
                {details.benefits.title}
              </h2>
              <p className="text-gray-400 text-xl md:text-2xl font-medium leading-relaxed">
                {details.benefits.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {details.benefits.items.map((benefit, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -12, backgroundColor: 'rgba(255,255,255,0.03)' }}
                  className="bg-white/[0.02] backdrop-blur-3xl p-12 rounded-[48px] border border-white/5 hover:border-age-gold/20 transition-all group"
                >
                  <div className="text-6xl mb-10 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                    {benefit.icon}
                  </div>
                  <h3 className="text-2xl font-black mb-5 group-hover:text-age-gold transition-colors leading-tight uppercase">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed font-medium">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Timeline Section - Jornada Premium */}
      {details?.timeline && (
        <section className="py-32 bg-gray-50/50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-24">
              <h2 className="text-4xl md:text-6xl font-black text-age-dark tracking-tighter uppercase leading-none">
                Sua Jornada de <br /><span className="text-age-gold">Transformação</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 relative">
              {/* Connector Line Modern */}
              <div className="hidden lg:block absolute top-[60px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-gray-200 to-transparent z-0"></div>

              {details.timeline.map((step, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  className="relative z-10 flex flex-col items-center text-center group"
                >
                  <div className="w-24 h-24 bg-age-dark text-age-gold rounded-[32px] flex items-center justify-center text-3xl font-black mb-10 shadow-2xl border-4 border-white group-hover:scale-110 group-hover:bg-age-gold group-hover:text-white transition-all duration-500 rotate-3 group-hover:rotate-0">
                    {idx + 1}
                  </div>
                  <div className="bg-white p-12 rounded-[56px] shadow-xl shadow-gray-200/50 border border-gray-100 w-full hover:shadow-2xl transition-all duration-500">
                    <span className="inline-block px-4 py-1.5 bg-age-gold/10 text-age-gold text-[10px] font-black rounded-full mb-6 uppercase tracking-widest border border-age-gold/10">
                      {step.period}
                    </span>
                    <h3 className="text-2xl font-black mb-8 text-age-dark uppercase leading-tight">{step.title}</h3>
                    <ul className="space-y-5 text-left">
                      {step.points.map((point, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-4 text-gray-500 group/item">
                          <div className="w-5 h-5 rounded-full bg-age-gold/20 flex-shrink-0 flex items-center justify-center mt-1 group-hover/item:bg-age-gold transition-colors">
                            <Check size={12} className="text-age-gold group-hover/item:text-white" strokeWidth={4} />
                          </div>
                          <span className="font-bold text-sm leading-snug group-hover/item:text-age-dark transition-colors">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* Protocolo Essencial Section - Design Narrativo */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            {/* Left: Media Block Premium */}
            <div className="relative group px-4 md:px-0">
              <div className="absolute -inset-4 bg-age-gold/10 rounded-[64px] blur-2xl group-hover:bg-age-gold/20 transition-all duration-700"></div>
              <div className="relative aspect-[4/5] rounded-[56px] overflow-hidden shadow-2xl border border-gray-100 ring-1 ring-black/5">
                <img
                  src="https://lh3.googleusercontent.com/d/1y23iuxtqgh1fRIxv4QPL0_k4_AmwXPg0"
                  alt="Protocolo Age Solutions"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-age-dark/40 via-transparent to-transparent"></div>
              </div>

              {/* Floating Badge Ultra Premium */}
              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:-right-12 bg-white/95 backdrop-blur-2xl border border-gray-100 px-8 py-6 rounded-[32px] shadow-2xl flex items-center gap-5 z-10 w-[90%] md:w-auto ring-1 ring-black/5"
              >
                <div className="relative flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-age-green animate-ping absolute opacity-40"></div>
                  <div className="w-4 h-4 rounded-full bg-age-green relative border-2 border-white"></div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 leading-none">Status do Sistema</p>
                  <p className="text-sm font-black text-age-dark uppercase tracking-wide leading-none">Bio-Ativação em Tempo Real</p>
                </div>
              </motion.div>
            </div>

            {/* Right: Content Block Premium */}
            <div className="space-y-12">
              <div className="space-y-6">
                <span className="text-age-gold font-black uppercase text-[10px] tracking-[0.4em]">A Ciência da Beleza</span>
                <h2 className="text-4xl md:text-6xl font-black text-age-dark leading-[1.05] tracking-tighter uppercase">
                  O PROTOCOLO <span className="text-age-gold">ESSENCIAL</span> DE LONGEVIDADE.
                </h2>
                <p className="text-gray-500 text-lg md:text-xl font-medium leading-relaxed">
                  Desenvolvido com tecnologia de ponta para quem não aceita nada menos que a perfeição em cuidados com a pele.
                </p>
              </div>

              {/* Testimonial Premium */}
              <div className="relative bg-gray-50/50 p-10 rounded-[48px] border border-gray-100 shadow-inner mt-8 group">
                <div className="text-age-gold mb-6 flex gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>

                <p className="text-age-dark font-bold italic text-xl md:text-2xl leading-relaxed mb-8 relative z-10">
                  "A Age Solutions não é apenas um suplemento, é uma decisão estratégica. Sinto minha pele mais firme e o que mais me impressionou foi a pureza dos resultados."
                </p>

                <div className="flex items-center gap-5">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
                      alt="Cliente Verificada"
                      className="w-14 h-14 rounded-full object-cover border-2 border-age-gold p-0.5"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-age-green text-white p-1 rounded-full border-2 border-white">
                      <Check size={10} strokeWidth={4} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-black text-xs uppercase tracking-widest text-age-dark">Marina Silva</span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Compra Verificada • Influencer</p>
                  </div>
                </div>
              </div>

              {/* Benefits Checklist Premium */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-10">
                {[
                  "Peptídeos Bioativos Verisol®",
                  "Ácido Hialurônico (50mg)",
                  "Redução Clinicamente Provada de Rugas",
                  "Pureza Absoluta: Zero Aditivos"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 group/item">
                    <div className="w-7 h-7 rounded-xl bg-age-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/item:bg-age-gold transition-colors">
                      <Check size={14} className="text-age-gold group-hover/item:text-white" strokeWidth={4} />
                    </div>
                    <span className="text-[13px] font-black text-gray-600 leading-tight uppercase tracking-tight group-hover/item:text-age-dark transition-colors">{item}</span>
                  </div>
                ))}
              </div>

              {/* CTA & Social Proof Premium */}
              <div className="pt-6 space-y-6">
                <button
                  onClick={handleAddToCart}
                  className="w-full md:w-auto bg-age-dark text-white px-12 py-6 rounded-2xl text-lg font-black uppercase tracking-[0.2em] hover:bg-age-gold transition-all shadow-2xl hover:shadow-age-gold/30 hover:-translate-y-1 transform duration-500"
                >
                  Garantir Meu Protocolo
                </button>
                <div className="flex items-center gap-3">
                   <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest leading-none">
                    Mais de <span className="text-age-dark">500k clientes</span> recomendam
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table - Design de Contraste Máximo */}
      {details?.comparison && (
        <section className="py-32 bg-age-dark text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-age-gold/5 skew-x-12 transform translate-x-24"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-24">
              <span className="text-age-gold font-black uppercase text-[10px] tracking-[0.4em] mb-4 block">O Melhor vs O Resto</span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
                {details.comparison.title}
              </h2>
            </div>

            <div className="max-w-5xl mx-auto overflow-hidden rounded-[56px] border border-white/10 shadow-2xl bg-zinc-900/50 backdrop-blur-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-900/80">
                      <th className="p-10 text-xs font-black uppercase tracking-[0.3em] text-gray-500">Atributo de Valor</th>
                      <th className="p-10 text-center bg-age-gold/10 border-x border-white/5">
                        <div className="flex flex-col items-center">
                          <span className="block text-[8px] font-black uppercase tracking-[0.4em] text-age-gold mb-2">Original</span>
                          <span className="text-xl md:text-2xl font-black uppercase tracking-tighter">Age Solutions</span>
                        </div>
                      </th>
                      <th className="p-10 text-center text-gray-600">
                        <span className="block text-[8px] font-black uppercase tracking-[0.4em] mb-2">Genérico</span>
                        <span className="text-xl md:text-2xl font-black uppercase tracking-tighter text-gray-500">Concorrentes</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {details.comparison.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-all group">
                        <td className="p-10 font-black text-gray-400 uppercase text-xs tracking-widest group-hover:text-white transition-colors">{item.attribute}</td>
                        <td className="p-10 text-center bg-age-gold/[0.03] border-x border-white/5">
                          <div className="flex justify-center">
                            {item.age_solution ? (
                              <motion.div 
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                className="w-12 h-12 bg-age-gold rounded-2xl flex items-center justify-center shadow-xl shadow-age-gold/20 ring-1 ring-white/20"
                              >
                                <Check size={28} className="text-white" strokeWidth={4} />
                              </motion.div>
                            ) : (
                              <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center shadow-xl shadow-red-500/20">
                                <Plus size={28} className="text-white rotate-45" strokeWidth={4} />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-10 text-center">
                          <div className="flex justify-center">
                            {item.others ? (
                              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center grayscale opacity-30">
                                <Check size={20} className="text-white" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center opacity-20">
                                <Plus size={20} className="text-white rotate-45" strokeWidth={3} />
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* How to Use Section - Design Educativo Premium */}
      {details?.how_to_use && (
        <section className="py-32 bg-white relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-24">
              <span className="text-age-gold font-black uppercase text-[10px] tracking-[0.4em] mb-4 block">Ritual Diário</span>
              <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter uppercase leading-none">
                {details.how_to_use.title}
              </h2>
              <p className="text-xl text-gray-400 font-medium">
                {details.how_to_use.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {details.how_to_use.steps.map((step, idx) => (
                <motion.div 
                  key={idx} 
                  whileHover={{ y: -10 }}
                  className="bg-gray-50/50 p-12 rounded-[56px] border border-gray-100 relative group hover:bg-white hover:shadow-2xl transition-all duration-500"
                >
                  <div className="absolute -top-8 -left-4 w-20 h-20 bg-age-dark text-age-gold rounded-[28px] flex items-center justify-center text-3xl font-black shadow-2xl group-hover:scale-110 group-hover:bg-age-gold group-hover:text-white transition-all rotate-3">
                    {idx + 1}
                  </div>
                  <p className="text-age-dark font-black leading-relaxed text-xl uppercase tracking-tighter pt-4">
                    {step}
                  </p>
                  <div className="mt-8 w-12 h-1 bg-age-gold/20 group-hover:w-full transition-all duration-700"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Kits Section - O Verdadeiro KitBuilder Premium */}
      {details?.kits && (
        <section className="py-32 bg-gray-50/50 relative overflow-hidden" id="kits">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-24">
              <span className="text-age-gold font-black uppercase text-[10px] tracking-[0.4em] mb-4 block">Ofertas Exclusivas</span>
              <h2 className="text-4xl md:text-6xl font-black text-age-dark tracking-tighter uppercase leading-none">
                ESCOLHA O SEU <br /><span className="text-age-gold">PROTOCOLO</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-end">
              {details.kits.map((kitItem, idx) => (
                <div
                  key={idx}
                  className={`relative bg-white p-10 rounded-[64px] border-2 transition-all hover:translate-y-[-8px] flex flex-col group ${kitItem.is_best_seller ? 'border-age-gold shadow-[0_32px_64px_-12px_rgba(232,170,36,0.2)] scale-105 z-10' : 'border-gray-100 shadow-xl shadow-gray-200/50'
                    }`}
                >
                  {kitItem.is_best_seller && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-age-gold text-white px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-age-gold/30">
                      Mais Recomendado
                    </div>
                  )}

                  <div className="text-center mb-10">
                    <h3 className="text-3xl font-black text-age-dark mb-2 uppercase tracking-tighter">{kitItem.pots} {kitItem.pots === 1 ? 'Frasco' : 'Frascos'}</h3>
                    <p className="text-gray-400 font-black uppercase text-[10px] tracking-[0.2em]">Tratamento para {kitItem.pots * 30} dias</p>
                  </div>

                  <div className="aspect-square mb-10 relative bg-gray-50/50 rounded-[48px] p-8 flex items-center justify-center group-hover:bg-gray-50 transition-colors">
                    <img
                      src={product?.thumbnail_url}
                      alt={`${kitItem.pots} Potes`}
                      className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-700"
                    />
                    {kitItem.pots > 1 && (
                       <div className="absolute -bottom-4 right-4 bg-age-dark text-age-gold w-16 h-16 rounded-2xl flex flex-col items-center justify-center shadow-xl rotate-12">
                         <span className="text-[10px] font-black leading-none">OFF</span>
                         <span className="text-xl font-black">-{Math.round((1 - kitItem.price/(kitItem.old_price)) * 100)}%</span>
                       </div>
                    )}
                  </div>

                  <div className="mt-auto text-center space-y-6">
                    <div className="space-y-1">
                      <p className="text-gray-300 line-through text-lg font-bold">R$ {kitItem.old_price.toFixed(2).replace('.', ',')}</p>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-age-gold uppercase tracking-widest mb-1">Por apenas VIP</span>
                        <p className="text-4xl md:text-5xl font-black text-age-dark tracking-tighter">R$ {kitItem.price.toFixed(2).replace('.', ',')}</p>
                      </div>
                      <p className="text-age-green font-black text-xs uppercase tracking-widest pt-2 flex items-center justify-center gap-2">
                         <Star size={12} fill="currentColor" /> {kitItem.installments} <Star size={12} fill="currentColor" />
                      </p>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-2xl ${kitItem.is_best_seller
                        ? 'bg-age-gold text-white hover:bg-age-dark shadow-age-gold/20'
                        : 'bg-age-dark text-white hover:bg-age-gold shadow-gray-400/20'
                        }`}
                    >
                      Selecionar Kit
                    </button>
                    
                    <div className="flex items-center justify-center gap-2 text-[9px] font-black text-gray-300 uppercase tracking-widest">
                       <ShieldCheck size={12} /> Compra 100% Segura
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Nutrition Facts - Design Técnico Limpo */}
      {details?.nutrition_facts && (
        <section className="py-32 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-age-dark p-12 md:p-20 rounded-[64px] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-age-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-age-gold/20 transition-all duration-1000"></div>
              
              <div className="border-b-4 border-age-gold/30 pb-10 mb-12 relative z-10">
                <span className="text-age-gold font-black uppercase text-[10px] tracking-[0.4em] mb-4 block">Transparência Total</span>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none mb-4">Tabela Nutricional</h2>
                <p className="text-xl font-bold text-gray-400">Dose Diária: <span className="text-white">{details.nutrition_facts.serving_size}</span></p>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="flex justify-between font-black text-[10px] uppercase tracking-[0.3em] text-gray-500 border-b border-white/10 pb-4">
                  <span>Componente</span>
                  <span>Valor / %VD*</span>
                </div>

                {details.nutrition_facts.items.map((item, idx) => (
                  <div key={idx} className={`flex justify-between py-5 border-b border-white/5 group/row transition-colors hover:bg-white/[0.02] px-2 rounded-lg`}>
                    <span className="text-sm md:text-base font-black uppercase tracking-tight text-gray-300 group-hover/row:text-age-gold transition-colors">{item.nutrient}</span>
                    <div className="text-right">
                      <span className="block font-black text-white">{item.quantity}</span>
                      <span className="text-[10px] font-black text-age-gold uppercase tracking-widest opacity-60">{item.daily_value}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-[10px] text-gray-500 font-bold leading-relaxed uppercase tracking-wider italic">
                * Percentual de valores diários fornecidos pela porção. <br />
                Protocolo Age Solutions: Alta Pureza, Sem Açúcares, Sem Glúten.
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials - Prova Social de Luxo */}
      {details?.testimonials && (
        <section className="py-32 bg-age-dark text-white relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-24">
              <span className="text-age-gold font-black uppercase text-[10px] tracking-[0.4em] mb-4 block">Voz da Experiência</span>
              <h2 className="text-4xl md:text-7xl font-black mb-10 tracking-tighter uppercase leading-none">O IMPACTO NA PELE</h2>
              <div className="flex justify-center items-center gap-6">
                <div className="flex text-age-gold gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" size={28} className="drop-shadow-[0_0_12px_rgba(232,170,36,0.3)]" />)}
                </div>
                <div className="h-12 w-px bg-white/20"></div>
                <div className="text-left">
                  <span className="text-3xl font-black block leading-none">4.9/5.0</span>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Média Global</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {details.testimonials.slice(0, 6).map((testi, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-zinc-900/40 backdrop-blur-3xl p-12 rounded-[56px] border border-white/5 relative group hover:border-age-gold/20 transition-all"
                >
                  <div className="text-age-gold/30 absolute top-10 right-12 text-6xl font-serif rotate-12 group-hover:text-age-gold/50 transition-colors">"</div>
                  <div className="flex text-age-gold mb-8 gap-0.5">
                    {[...Array(testi.rating)].map((_, i) => <Star key={i} fill="currentColor" size={14} />)}
                  </div>
                  <p className="text-xl text-gray-300 italic mb-10 leading-relaxed font-medium">"{testi.comment}"</p>
                  <div className="flex items-center gap-5 pt-8 border-t border-white/5">
                    <div className="w-14 h-14 bg-gradient-to-br from-age-gold to-age-gold-dark rounded-2xl flex items-center justify-center font-black text-age-dark text-xl shadow-xl shadow-age-gold/10">
                      {testi.name[0]}
                    </div>
                    <div>
                      <p className="font-black text-white uppercase tracking-[0.1em] text-sm">{testi.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                         <div className="w-1.5 h-1.5 rounded-full bg-age-green"></div>
                         <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Cliente Verificada</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section - Acordeão de Luxo */}
      {details?.faq && (
        <section className="py-32 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-24">
               <span className="text-age-gold font-black uppercase text-[10px] tracking-[0.4em] mb-4 block">Dúvidas</span>
               <h2 className="text-4xl md:text-6xl font-black text-age-dark tracking-tighter uppercase leading-none">CENTRAL DE SUPORTE</h2>
            </div>

            <div className="space-y-5">
              {details.faq.map((item, idx) => (
                <div key={idx} className={`border border-gray-100 rounded-[40px] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-gray-100 ${activeFaq === idx ? 'bg-gray-50 ring-2 ring-age-gold/5 border-age-gold/20' : 'bg-white'}`}>
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full p-10 flex items-center justify-between text-left group"
                  >
                    <span className={`text-xl md:text-2xl font-black uppercase tracking-tighter transition-colors ${activeFaq === idx ? 'text-age-gold' : 'text-age-dark'}`}>{item.question}</span>
                    <div className={`p-3 rounded-2xl transition-all ${activeFaq === idx ? 'bg-age-gold text-white rotate-180' : 'bg-gray-100 text-gray-400 group-hover:bg-age-gold/10 group-hover:text-age-gold'}`}>
                       <ChevronDown size={24} strokeWidth={3} />
                    </div>
                  </button>
                  <AnimatePresence>
                    {activeFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-10 pb-10">
                          <p className="text-gray-500 text-lg md:text-xl leading-relaxed pt-8 border-t border-gray-200/50 font-medium italic">
                            {item.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA - O Último Impulso */}
      <section className="py-32 md:py-48 bg-age-gold text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5 mix-blend-overlay"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
           <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
          >
            <h2 className="text-5xl md:text-9xl font-black mb-12 tracking-tighter leading-none uppercase">
              PRONTA PARA O <br /> <span className="text-age-dark">PRÓXIMO NÍVEL?</span>
            </h2>
            <p className="text-2xl md:text-4xl font-black mb-16 opacity-90 tracking-tight uppercase max-w-4xl mx-auto border-y border-white/20 py-8">
              Aproveite a Condição Exclusiva <br /> <span className="text-age-dark">25% OFF HOJE</span>
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-age-dark text-white px-20 py-10 rounded-3xl text-2xl font-black uppercase tracking-[0.3em] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] hover:scale-105 hover:bg-white hover:text-age-dark transition-all duration-500 ring-4 ring-white/10"
            >
              Quero Minha Transformação
            </button>
          </motion.div>
        </div>
      </section>

      {/* Sticky Mobile Buy Bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-100 p-5 md:hidden shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.1)]"
          >
            <div className="container mx-auto flex items-center gap-4">
              <div className="flex-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Oferta Exclusiva</p>
                <p className="text-lg font-black text-age-dark leading-none">R$ {currentPrice.toFixed(2).replace('.', ',')}</p>
              </div>
              <button
                onClick={() => {
                  handleAddToCart();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-age-gold text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-age-gold/20 active:scale-95 transition-all"
              >
                Comprar Agora
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

  );
}
