import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products, promotionalKits } from '../data/mock';
import { useCartStore } from '../store/cart';
import { getProductBySlug } from '../lib/yampi';
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

  // States for variations and images
  const [selectedVariation, setSelectedVariation] = useState<any>(null);
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      setLoading(true);

      try {
        const yampiProduct = await getProductBySlug(id);

        if (yampiProduct) {
          setProduct(yampiProduct);
          setSelectedVariation(yampiProduct.variations?.[0] || null);
          setMainImage(yampiProduct.thumbnail_url || '');
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
        console.error('Erro ao buscar produto:', error);
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
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Carregando Detalhes...</p>
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
    <div className="bg-white">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 text-[10px] md:text-xs text-gray-400 uppercase tracking-widest font-medium">
          <button onClick={() => navigate('/')} className="hover:text-age-gold transition-colors">Home</button>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-bold truncate">{title}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* 🏛️ Arquitetura Visual do Hero - Left Side (7 columns) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-6">
            {/* Galeria Vertical à Esquerda */}
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto no-scrollbar md:max-h-[600px] pb-2 md:pb-0">
              {(product?.images || (mainImage ? [mainImage] : [])).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 bg-[#F9F9F9] rounded-2xl overflow-hidden transition-all border-2 ${mainImage === img
                    ? 'border-age-gold shadow-md scale-95'
                    : 'border-transparent hover:border-gray-200'
                    }`}
                >
                  {img && <img src={img} alt={`${title} view ${i + 1}`} className="w-full h-full object-contain p-2" />}
                </button>
              ))}
            </div>

            {/* Main Image Display */}
            <div className="flex-1 relative aspect-square bg-[#F9F9F9] rounded-[40px] overflow-hidden group">
              <AnimatePresence mode="wait">
                {mainImage ? (
                  <motion.img
                    key={mainImage}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    src={mainImage}
                    alt={title}
                    className="w-full h-full object-contain p-8 md:p-16 mix-blend-multiply"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Loader2 className="animate-spin" size={48} />
                  </div>
                )}
              </AnimatePresence>

              {/* Discount Badge */}
              {discountPercentage > 0 && (
                <div className="absolute top-8 right-8 z-10 bg-age-gold text-white px-5 py-2 rounded-full font-black text-sm shadow-xl shadow-age-gold/20 tracking-wide">
                  {discountPercentage}% OFF
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
                <span className="text-[11px] text-gray-400 font-bold tracking-widest uppercase border-l border-gray-200 pl-3">
                  {details?.reviews.count || '2.847'} Avaliações
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-black leading-[1.1] tracking-tight">
                {title}
              </h1>

              {/* Contraste de Preço */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-4">
                  <span className="text-gray-400 line-through text-xl font-medium">
                    R$ {originalPrice.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-4xl md:text-5xl font-black text-black tracking-tight">
                    R$ {currentPrice.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <p className="text-sm text-[#2E7D32] font-bold flex items-center gap-2 bg-green-50 w-fit px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]"></span>
                  12x sem juros de R$ {(currentPrice / 12).toFixed(2).replace('.', ',')}
                </p>
              </div>
            </div>

            {/* Variation Selector */}
            {variations.length > 0 && (

              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="font-bold uppercase text-[11px] tracking-widest text-gray-400">Selecione o Sabor:</h3>
                <div className="flex flex-wrap gap-3">
                  {variations.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariation(v)}
                      className={`px-6 py-3 rounded-xl text-xs font-bold transition-all uppercase tracking-wider border-2 ${selectedVariation?.id === v.id
                        ? 'bg-black text-white border-black shadow-lg scale-105'
                        : 'bg-white border-gray-100 text-gray-400 hover:border-age-gold hover:text-age-gold'
                        }`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Section */}
            <div className="space-y-6 pt-4">
              <div className="flex gap-4 h-14">
                {/* Seletor de Quantidade Moderno */}
                <div className="flex items-center bg-gray-50 rounded-full border border-gray-200 px-1 w-32 justify-between">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-full flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                  >
                    <Minus size={16} strokeWidth={2.5} />
                  </button>
                  <span className="font-bold text-lg text-black">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-full flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                  >
                    <Plus size={16} strokeWidth={2.5} />
                  </button>
                </div>

                {/* Botão "Comprar" em Destaque */}
                <button
                  onClick={handleAddToCart}
                  disabled={isAdded}
                  className={`flex-1 font-black uppercase tracking-widest rounded-full transition-all flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] active:scale-[0.98] ${isAdded
                    ? 'bg-green-600 text-white'
                    : 'bg-age-gold text-white hover:bg-black hover:shadow-age-gold/20'
                    }`}
                >
                  {isAdded ? (
                    <>
                      <Check size={20} strokeWidth={3} />
                      Adicionado
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={20} strokeWidth={3} />
                      Comprar Agora
                    </>
                  )}
                </button>
              </div>

              {/* Cálculo de CEP Integrado */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <form onSubmit={calculateShipping} className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <Truck size={14} />
                    Consultar Frete e Prazo
                  </div>
                  <div className="flex gap-2 relative">
                    <input
                      type="text"
                      placeholder="Digite seu CEP"
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-age-gold focus:ring-1 focus:ring-age-gold transition-all placeholder:text-gray-300"
                    />
                    <button
                      type="submit"
                      disabled={isCalculating}
                      className="absolute right-1 top-1 bottom-1 bg-black text-white px-4 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-age-gold transition-colors disabled:opacity-50"
                    >
                      {isCalculating ? <Loader2 size={14} className="animate-spin" /> : 'OK'}
                    </button>
                  </div>
                  {shippingCost !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-xs font-bold text-[#2E7D32] bg-[#2E7D32]/5 p-3 rounded-lg border border-[#2E7D32]/10"
                    >
                      <Truck size={14} />
                      <span>Frete Grátis para sua região! (Até 5 dias úteis)</span>
                    </motion.div>
                  )}
                </form>
              </div>
            </div>

            {/* 🛡️ Logística e Sinais de Confiança */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-gray-100 text-center gap-2 hover:border-age-gold/30 transition-colors group">
                <ShieldCheck size={24} className="text-gray-300 group-hover:text-age-gold transition-colors" strokeWidth={1.5} />
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-tight group-hover:text-gray-600">Compra<br />Protegida</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-gray-100 text-center gap-2 hover:border-age-gold/30 transition-colors group">
                <Truck size={24} className="text-gray-300 group-hover:text-age-gold transition-colors" strokeWidth={1.5} />
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-tight group-hover:text-gray-600">Envio a<br />Domicílio</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-gray-100 text-center gap-2 hover:border-age-gold/30 transition-colors group">
                <Activity size={24} className="text-gray-300 group-hover:text-age-gold transition-colors" strokeWidth={1.5} />
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-tight group-hover:text-gray-600">Trocas e<br />Devoluções</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid Section */}
      {details?.benefits && (
        <section className="bg-black py-24 text-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-age-gold rounded-full blur-[150px]"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-age-gold rounded-full blur-[150px]"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter leading-none">
                {details.benefits.title}
              </h2>
              <p className="text-gray-400 text-xl font-medium">
                {details.benefits.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {details.benefits.items.map((benefit, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -10 }}
                  className="bg-zinc-900/50 backdrop-blur-xl p-10 rounded-[40px] border border-white/5 hover:border-age-gold/30 transition-all group"
                >
                  <div className="text-5xl mb-8 transform group-hover:scale-110 transition-transform duration-500">
                    {benefit.icon}
                  </div>
                  <h3 className="text-2xl font-black mb-4 group-hover:text-age-gold transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Timeline Section */}
      {details?.timeline && (
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-black text-center mb-20 tracking-tighter">
              Sua Jornada de Transformação
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
              {/* Connector Line */}
              <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0"></div>

              {details.timeline.map((step, idx) => (
                <div key={idx} className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-black text-age-gold rounded-full flex items-center justify-center text-2xl font-black mb-8 shadow-2xl border-4 border-white">
                    {idx + 1}
                  </div>
                  <div className="bg-white p-10 rounded-[40px] shadow-xl border border-gray-100 w-full">
                    <span className="inline-block px-4 py-1 bg-age-gold/10 text-age-gold text-xs font-black rounded-full mb-4 uppercase tracking-widest">
                      {step.period}
                    </span>
                    <h3 className="text-2xl font-black mb-6">{step.title}</h3>
                    <ul className="space-y-4 text-left">
                      {step.points.map((point, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-3 text-gray-600">
                          <Check size={18} className="text-green-500 mt-1 flex-shrink-0" />
                          <span className="font-medium">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Protocolo Essencial Section (Replaces Formula) */}
      <section className="py-24 bg-[#F9F9F9]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Media Block */}
            <div className="relative group px-4 md:px-0">
              <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl border border-gray-100">
                <img
                  src="https://lh3.googleusercontent.com/d/1y23iuxtqgh1fRIxv4QPL0_k4_AmwXPg0"
                  alt="Protocolo Age Solutions"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:-right-8 bg-white/95 backdrop-blur-xl border border-gray-100 px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4 z-10 w-[90%] md:w-auto">
                <div className="relative flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-ping absolute opacity-75"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500 relative"></div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5 leading-none">Status</p>
                  <p className="text-xs font-black text-gray-900 uppercase tracking-wider leading-none">Protocolo de Longevidade Ativado</p>
                </div>
              </div>
            </div>

            {/* Right: Content Block */}
            <div className="space-y-10">
              {/* Headline */}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-black leading-[1.1] tracking-tight">
                ENTENDA POR QUE A AGE SOLUTIONS SE TORNOU O <span className="text-[#C39343]">PROTOCOLO ESSENCIAL</span> DE LONGEVIDADE PARA A SUA PELE.
              </h2>

              {/* Testimonial */}
              <div className="relative bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mt-8">
                {/* Speech bubble tail */}
                <div className="absolute -top-3 left-10 w-6 h-6 bg-white border-t border-l border-gray-100 transform rotate-45"></div>

                <p className="text-gray-600 italic text-lg leading-relaxed mb-6">
                  "A Age Solutions não é apenas um suplemento, é uma decisão estratégica. Sinto minha pele mais firme e hidratada, mas o que mais me impressionou foi a pureza e a rapidez dos resultados. É ciência aplicada à rotina."
                </p>

                <div className="flex items-center gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
                    alt="Cliente Verificada"
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#C39343]"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black text-sm uppercase tracking-wider text-gray-900">Cliente Verificada</span>
                      <div className="flex text-[#C39343]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} fill="currentColor" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 font-medium">Compra Verificada • Age Solutions</p>
                  </div>
                </div>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                {[
                  "Peptídeos Bioativos de Colágeno Verisol®",
                  "Ácido Hialurônico de alta absorção (50mg)",
                  "Suporte estrutural contra rugas",
                  "Pureza máxima: Zero aditivos"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#C39343]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={14} className="text-[#C39343]" strokeWidth={3} />
                    </div>
                    <span className="text-sm font-bold text-gray-700 leading-tight">{item}</span>
                  </div>
                ))}
              </div>

              {/* CTA & Social Proof */}
              <div className="pt-4">
                <button
                  onClick={handleAddToCart}
                  className="w-full md:w-auto bg-black text-white px-10 py-5 rounded-full text-lg font-black uppercase tracking-[0.15em] hover:bg-[#C39343] transition-colors shadow-xl hover:shadow-[#C39343]/20 hover:-translate-y-1 transform duration-300"
                >
                  Garantir Meu Protocolo
                </button>
                <p className="mt-4 text-gray-400 text-xs font-bold flex items-center gap-2">
                  <span className="text-red-500">❤️</span>
                  +562.179 avaliações 5 estrelas de clientes verificados
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      {details?.comparison && (
        <section className="py-24 bg-black text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-black text-center mb-20 tracking-tighter">
              {details.comparison.title}
            </h2>

            <div className="max-w-4xl mx-auto overflow-hidden rounded-[40px] border border-white/10 shadow-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900">
                    <th className="p-8 text-xl font-black uppercase tracking-widest">Atributo</th>
                    <th className="p-8 text-center bg-age-gold text-white">
                      <span className="block text-xs font-black uppercase tracking-[0.2em] mb-1">Age Solutions</span>
                      <span className="text-xl font-black">O Nosso</span>
                    </th>
                    <th className="p-8 text-center text-gray-500">
                      <span className="block text-xs font-black uppercase tracking-[0.2em] mb-1">Concorrentes</span>
                      <span className="text-xl font-black">Outros</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {details.comparison.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="p-8 font-bold text-gray-300">{item.attribute}</td>
                      <td className="p-8 text-center bg-age-gold/5">
                        <div className="flex justify-center">
                          {item.age_solution ? (
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                              <Check size={24} className="text-white" strokeWidth={4} />
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                              <Plus size={24} className="text-white rotate-45" strokeWidth={4} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-8 text-center">
                        <div className="flex justify-center">
                          {item.others ? (
                            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                              <Check size={20} className="text-green-500" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                              <Plus size={20} className="text-red-500 rotate-45" strokeWidth={3} />
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
        </section>
      )}

      {/* How to Use Section */}
      {details?.how_to_use && (
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter">
                {details.how_to_use.title}
              </h2>
              <p className="text-xl text-gray-500 font-medium">
                {details.how_to_use.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {details.how_to_use.steps.map((step, idx) => (
                <div key={idx} className="bg-gray-50 p-10 rounded-[40px] border border-gray-100 relative group hover:bg-white hover:shadow-2xl transition-all duration-500">
                  <div className="absolute -top-6 -left-6 w-16 h-16 bg-black text-age-gold rounded-full flex items-center justify-center text-2xl font-black shadow-xl group-hover:scale-110 transition-transform">
                    {idx + 1}
                  </div>
                  <p className="text-gray-900 font-bold leading-relaxed text-lg">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Kits Section */}
      {details?.kits && (
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-black text-center mb-20 tracking-tighter">
              Escolha o Melhor Kit para Você
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {details.kits.map((kitItem, idx) => (
                <div
                  key={idx}
                  className={`relative bg-white p-10 rounded-[40px] border-2 transition-all hover:scale-[1.03] flex flex-col ${kitItem.is_best_seller ? 'border-age-gold shadow-2xl scale-105 z-10' : 'border-gray-100 shadow-xl'
                    }`}
                >
                  {kitItem.is_best_seller && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-age-gold text-white px-8 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-lg">
                      Mais Vendido
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-black mb-2">{kitItem.pots} {kitItem.pots === 1 ? 'Pote' : 'Potes'}</h3>
                    <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Tratamento para {kitItem.pots} {kitItem.pots === 1 ? 'mês' : 'meses'}</p>
                  </div>

                  <div className="aspect-square mb-8 bg-gray-50 rounded-3xl p-6">
                    <img
                      src={product?.thumbnail_url}
                      alt={`${kitItem.pots} Potes`}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="mt-auto text-center space-y-4">
                    <div className="space-y-1">
                      <p className="text-gray-400 line-through text-lg">R$ {kitItem.old_price.toFixed(2).replace('.', ',')}</p>
                      <p className="text-4xl font-black text-gray-900">R$ {kitItem.price.toFixed(2).replace('.', ',')}</p>
                      <p className="text-age-gold font-black text-sm uppercase tracking-widest">{kitItem.installments}</p>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all ${kitItem.is_best_seller
                        ? 'bg-age-gold text-white hover:bg-black shadow-xl'
                        : 'bg-black text-white hover:bg-age-gold shadow-lg'
                        }`}
                    >
                      Selecionar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Nutrition Facts */}
      {details?.nutrition_facts && (
        <section className="py-24">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="bg-white p-12 rounded-[40px] border-4 border-black shadow-2xl">
              <div className="border-b-8 border-black pb-4 mb-6">
                <h2 className="text-5xl font-black tracking-tighter uppercase">Tabela Nutricional</h2>
                <p className="text-xl font-bold">Porção: {details.nutrition_facts.serving_size}</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between font-black text-xs uppercase tracking-widest border-b-2 border-black pb-2">
                  <span>Quantidade por porção</span>
                  <span>%VD*</span>
                </div>

                {details.nutrition_facts.items.map((item, idx) => (
                  <div key={idx} className={`flex justify-between py-3 border-b border-gray-200 ${idx % 2 === 0 ? 'font-black' : 'font-medium'}`}>
                    <span>{item.nutrient} <span className="text-gray-500 ml-2">{item.quantity}</span></span>
                    <span>{item.daily_value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-[10px] text-gray-500 leading-tight">
                * % Valores Diários com base em uma dieta de 2.000 kcal ou 8.400 kJ. Seus valores diários podem ser maiores ou menores dependendo de suas necessidades energéticas. ** Valor Diário não estabelecido.
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {details?.testimonials && (
        <section className="py-24 bg-black text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">O Que Dizem Nossas Clientes</h2>
              <div className="flex justify-center items-center gap-2 text-age-gold">
                {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" size={24} />)}
                <span className="text-2xl font-black ml-4">4.9/5.0</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {details.testimonials.slice(0, 6).map((testi, idx) => (
                <div key={idx} className="bg-zinc-900 p-10 rounded-[40px] border border-white/5 relative">
                  <div className="flex text-age-gold mb-6">
                    {[...Array(testi.rating)].map((_, i) => <Star key={i} fill="currentColor" size={16} />)}
                  </div>
                  <p className="text-lg text-gray-300 italic mb-8 leading-relaxed">"{testi.comment}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-age-gold rounded-full flex items-center justify-center font-black text-black">
                      {testi.name[0]}
                    </div>
                    <div>
                      <p className="font-black text-white uppercase tracking-wider">{testi.name}</p>
                      <p className="text-xs text-gray-500">{testi.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {details?.faq && (
        <section className="py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-black text-center mb-20 tracking-tighter">Dúvidas Frequentes</h2>

            <div className="space-y-4">
              {details.faq.map((item, idx) => (
                <div key={idx} className="border-2 border-gray-100 rounded-[30px] overflow-hidden transition-all hover:border-age-gold/30">
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full p-8 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xl font-black text-gray-900">{item.question}</span>
                    {activeFaq === idx ? <ChevronUp className="text-age-gold" /> : <ChevronDown className="text-gray-400" />}
                  </button>
                  <AnimatePresence>
                    {activeFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-gray-50 px-8 pb-8"
                      >
                        <p className="text-gray-600 text-lg leading-relaxed pt-4 border-t border-gray-200">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-24 bg-age-gold text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-none">
            PRONTA PARA RENOVAR <br /> SUA AUTOESTIMA?
          </h2>
          <p className="text-2xl font-bold mb-12 opacity-90">
            Aproveite o desconto de 25% OFF por tempo limitado!
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-black text-white px-16 py-8 rounded-full text-2xl font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-110 transition-transform"
          >
            Quero Começar Agora
          </button>
        </div>
      </section>
    </div>
  );
}
