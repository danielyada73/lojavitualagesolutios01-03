import { useState } from 'react';
import { Product } from '../../types';
import {
  Star, Minus, Plus, ShoppingCart, ChevronRight,
  Sparkles, ShieldCheck, Truck, RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useCartStore } from '../../store/cart';

// ── Dados de Kit + Sabor para Colágeno com Ácido Hialurônico ──
// Cada kit tem flavors com tokens diretos da Yampi
const COL_KITS = [
  {
    pots: 1,
    price: 89.90,
    originalPrice: 119.90,
    label: '1 POTE',
    tag: '',
    flavors: [
      { name: 'Cranberry', token: '3U1Y8DTZH9' },
      { name: 'Limão', token: 'EECCFB5BPD' },
    ],
  },
  {
    pots: 2,
    price: 139.90,
    originalPrice: 239.90,
    label: '2 POTES',
    tag: 'MAIS VENDIDO',
    popular: true,
    flavors: [
      { name: 'Cranberry', token: 'HOYDA7TYT0' },
      { name: 'Limão', token: 'KGICWXOHDC' },
      { name: '1 Cranberry + 1 Limão', token: '4TQFOJG1EA' },
    ],
  },
  {
    pots: 3,
    price: 179.90,
    originalPrice: 359.90,
    label: '3 POTES',
    tag: 'RECOMENDADO',
    flavors: [
      { name: 'Cranberry', token: 'RZI9L4LENR' },
      { name: 'Limão', token: '955WW4R8LN' },
      { name: '2 Cranberry + 1 Limão', token: 'GX3HE6DQ4M' },
      { name: '1 Cranberry + 2 Limão', token: 'P9FLSNK3UX' },
    ],
  },
  {
    pots: 6,
    price: 299.90,
    originalPrice: 719.90,
    label: '6 POTES',
    tag: 'MELHOR CUSTO',
    flavors: [
      { name: 'Cranberry', token: 'OICN88HJC2' },
      { name: 'Limão', token: 'B0A9ME4GR9' },
      { name: '3 Cranberry + 3 Limão', token: 'J7NHAD9XT9' },
    ],
  },
];

interface Props {
  product: Product;
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  }),
};

const benefits = [
  { title: 'Ácido Hialurônico 50mg', desc: 'Elasticidade e resistência da pele, unhas e cabelos.' },
  { title: 'Proteína 10g', desc: 'Regenera tecidos e fortalece o sistema imunológico.' },
  { title: 'Vitaminas B6, C e E', desc: 'Antioxidantes que deixam a pele mais luminosa e viçosa.' },
  { title: 'Zinco', desc: 'Protege células produtoras de colágeno e repara a pele.' },
];

const faqItems = [
  { question: 'Em quanto tempo aparecem os resultados?', answer: 'A maioria dos estudos mostra resultados visíveis a partir de 4 semanas, com melhora progressiva em 8 semanas.' },
  { question: 'Como devo tomar?', answer: 'Misture 1 colher de sopa (aprox. 12g) em 150ml de água ou suco. Consumir uma vez ao dia.' },
  { question: 'Qual o prazo de entrega?', answer: 'Despachamos em até 24h após confirmação do pagamento. Prazo médio: 3-7 dias úteis.' },
  { question: 'Os ingredientes são naturais?', answer: 'Sim! Não utilizamos corantes artificiais, malto ou conservantes.' },
  { question: 'Tem contraindicações?', answer: 'Gestantes, nutrizes e crianças até 3 anos devem consumir somente sob orientação médica.' },
];

export default function ColagenoTemplate({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem);

  // Detecta sabor padrão pelo produto clicado (col-lim → Limão)
  const isLimao = product.id === 'col-lim' || product.name.toLowerCase().includes('limão');
  const [selectedKitIdx, setSelectedKitIdx] = useState(1); // default: 2 potes
  const [selectedFlavorIdx, setSelectedFlavorIdx] = useState(isLimao ? 1 : 0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const currentKit = COL_KITS[selectedKitIdx];
  const currentFlavor = currentKit.flavors[selectedFlavorIdx] || currentKit.flavors[0];

  const images = product.images?.length ? product.images : [product.thumbnail_url];
  const savings = currentKit.originalPrice - currentKit.price;
  const discountPct = Math.round((savings / currentKit.originalPrice) * 100);

  const handleBuyNow = () => {
    addItem(
      { ...product, price: currentKit.price, original_price: currentKit.originalPrice },
      { id: currentFlavor.token, product_id: product.id, name: `${currentKit.label} — ${currentFlavor.name}`, price: currentKit.price, price_modifier: 0, sku_token: currentFlavor.token } as any
    );
  };

  return (
    <div className="bg-white text-[#141414] min-h-screen font-sans">

      {/* ── Barra de Promoção ── */}
      <div className="bg-[#141414] text-white py-2.5 overflow-hidden">
        <div className="flex gap-16 animate-marquee whitespace-nowrap">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="text-[10px] font-black uppercase tracking-[0.3em] shrink-0">
              🚚 FRETE GRÁTIS PARA TODO O BRASIL &nbsp;•&nbsp; 🔒 COMPRA 100% SEGURA &nbsp;•&nbsp; ✨ RESULTADO EM 4 SEMANAS
            </span>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* ── Breadcrumb ── */}
        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest py-5 border-b border-[#E5E5E5]"
        >
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <ChevronRight size={12} className="text-gray-300" />
          <span className="text-black">Colágeno</span>
        </motion.nav>

        {/* ── Hero ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 py-8 lg:py-12 items-start">

          {/* Imagem */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:sticky lg:top-6"
          >
            <div className="bg-[#F9F8F6] rounded-2xl overflow-hidden aspect-square flex items-center justify-center p-6 md:p-10 border border-[#E5E5E5] relative">
              <img
                src={images[0] || product.thumbnail_url}
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply"
              />
              {discountPct > 0 && (
                <div className="absolute top-5 right-5 bg-[#EB001B] text-white text-xs font-black px-3 py-1.5 tracking-widest uppercase">
                  -{discountPct}% OFF
                </div>
              )}
              <div className="absolute top-5 left-5 bg-[#141414] text-white px-4 py-1.5 text-[9px] font-black tracking-widest uppercase">
                Original
              </div>
            </div>
          </motion.div>

          {/* Compra */}
          <div className="flex flex-col gap-7">

            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={13} className="fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs text-gray-500 font-bold">4.9 · +1.200 avaliações</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-[#141414] leading-[1.05] tracking-tighter mb-3 uppercase">
                {product.name}
              </h1>
              <p className="text-base text-gray-500 font-medium leading-relaxed italic">
                "Renove sua pele com o colágeno mais eficaz do Brasil!"
              </p>
            </motion.div>

            {/* Seletor de Kit */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1}>
              <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3">
                Quantidade de potes:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {COL_KITS.map((kit, idx) => (
                  <motion.button
                    key={kit.pots}
                    onClick={() => { setSelectedKitIdx(idx); setSelectedFlavorIdx(0); }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`relative border-2 py-3 text-center text-xs font-black uppercase tracking-widest transition-all ${
                      selectedKitIdx === idx
                        ? 'border-[#141414] bg-[#141414] text-white'
                        : 'border-[#E5E5E5] hover:border-gray-400'
                    }`}
                  >
                    {kit.pots} {kit.pots > 1 ? 'POTES' : 'POTE'}
                    {kit.popular && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#EB001B] text-white text-[8px] font-black px-2 py-0.5 whitespace-nowrap">
                        + VENDIDO
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Seletor de Sabor */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}>
              <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3">
                Sabor:
              </p>
              <div className="flex flex-wrap gap-2">
                {currentKit.flavors.map((flavor, idx) => (
                  <motion.button
                    key={flavor.token}
                    onClick={() => setSelectedFlavorIdx(idx)}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition-all border ${
                      selectedFlavorIdx === idx
                        ? 'bg-[#141414] text-white border-[#141414]'
                        : 'bg-white text-[#141414] border-[#E5E5E5] hover:border-[#141414]'
                    }`}
                  >
                    {flavor.name}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Preço */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={3}
              className="bg-[#F9F8F6] border border-[#E5E5E5] p-6"
            >
              <div className="flex items-end gap-3 mb-1 flex-wrap">
                <div className="text-4xl lg:text-5xl font-black text-[#141414] tracking-tighter leading-none">
                  R$ {currentKit.price.toFixed(2).replace('.', ',')}
                </div>
                <div className="text-base lg:text-lg text-gray-400 line-through mb-0.5">
                  R$ {currentKit.originalPrice.toFixed(2).replace('.', ',')}
                </div>
              </div>
              <p className="text-[#28A745] font-black text-xs uppercase tracking-widest mb-1">
                Até 12x sem juros no cartão
              </p>
              <p className="text-gray-400 text-xs">
                ou R$ {(currentKit.price * 0.95).toFixed(2).replace('.', ',')} no PIX (5% OFF)
              </p>
            </motion.div>

            {/* CTA */}
            <motion.button
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={4}
              onClick={handleBuyNow}
              whileHover={{ backgroundColor: '#000' }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-16 bg-[#141414] text-white font-black uppercase tracking-[0.35em] text-sm flex items-center justify-center gap-3 transition-colors"
            >
              <ShoppingCart size={20} />
              COMPRAR AGORA
            </motion.button>

            {/* Selos */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={5}
              className="grid grid-cols-3 gap-4 border-t border-[#E5E5E5] pt-5"
            >
              {[
                { icon: <Truck size={18} />, label: 'Frete Grátis', sub: 'Todo o Brasil' },
                { icon: <ShieldCheck size={18} />, label: 'Compra Segura', sub: 'Checkout Protegido' },
                { icon: <RefreshCw size={18} />, label: 'Garantia 30d', sub: 'Devolução Total' },
              ].map((b, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 text-center">
                  <div className="w-10 h-10 bg-[#F9F8F6] flex items-center justify-center text-[#141414]">{b.icon}</div>
                  <div className="text-[9px] font-black uppercase tracking-widest leading-tight">
                    {b.label}<br /><span className="text-gray-400 font-bold">{b.sub}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ── Fórmula / Benefícios ── */}
        <section className="py-20 border-t border-[#E5E5E5]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-14"
          >
            <h2 className="text-3xl lg:text-4xl font-black text-[#141414] uppercase tracking-tighter mb-4">
              Fórmula Exclusiva e Poderosa
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Combinamos ciência e estética para criar um suplemento único que atua de dentro para fora.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.12, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[#F9F8F6] p-8 border border-[#E5E5E5] hover:border-[#141414] transition-colors group"
              >
                <Sparkles size={28} className="text-[#141414] mb-6 group-hover:scale-110 transition-transform" />
                <h4 className="text-sm font-black text-[#141414] uppercase tracking-tight mb-3">{b.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Como Usar ── */}
        <section className="py-16 border-t border-[#E5E5E5] bg-[#F9F8F6] rounded-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-2xl font-black text-[#141414] uppercase tracking-tighter mb-8">
              Como usar
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { step: '01', title: 'Meça a dose', desc: '1 colher de sopa (aprox. 12g)' },
                { step: '02', title: 'Misture', desc: 'Dissolva em 150ml de água ou suco' },
                { step: '03', title: 'Consuma', desc: '1x ao dia, após a refeição' },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className="bg-white border border-[#E5E5E5] p-6 text-center"
                >
                  <div className="text-4xl font-black text-[#E5E5E5] mb-3">{s.step}</div>
                  <h4 className="font-black text-[#141414] uppercase tracking-widest text-xs mb-2">{s.title}</h4>
                  <p className="text-sm text-gray-500">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-20 border-t border-[#E5E5E5] max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-black text-[#141414] mb-10 uppercase tracking-tighter text-center"
          >
            Dúvidas Frequentes
          </motion.h2>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="border border-[#E5E5E5] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-8 py-6 text-left hover:bg-[#F9F8F6] transition-colors"
                >
                  <span className="font-black text-[#141414] text-sm uppercase tracking-wider pr-4">{item.question}</span>
                  <Plus size={18} className={`shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-45' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-64' : 'max-h-0'}`}>
                  <div className="px-8 pb-7 text-gray-500 text-sm leading-relaxed border-t border-[#E5E5E5] pt-5 bg-white">
                    {item.answer}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── CTA Final ── */}
        <section className="py-16 border-t border-[#E5E5E5] text-center pb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">
              Pronta para renovar sua pele?
            </h3>
            <p className="text-gray-500 mb-8">
              Kit selecionado: {currentKit.label} — Sabor {currentFlavor.name}
            </p>
            <motion.button
              onClick={handleBuyNow}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 bg-[#141414] text-white font-black uppercase tracking-[0.35em] text-sm px-12 py-5 hover:bg-black transition-colors"
            >
              <ShoppingCart size={20} />
              GARANTIR MEU COLÁGENO
            </motion.button>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
