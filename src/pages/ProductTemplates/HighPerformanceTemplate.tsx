import { useState } from 'react';
import { Product } from '../../types';
import {
  ShoppingCart, ChevronRight, ShieldCheck, Truck,
  Star, Plus, Check, RefreshCw, Package
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

// ── Tipos ─────────────────────────────────────────────
interface KitOption {
  pots: number;
  price: number;
  originalPrice: number;
  token: string;
  label: string;
  tag?: string;
  popular?: boolean;
}

interface ProductKitData {
  tagline: string;
  benefits: { icon: string; title: string; desc: string }[];
  faq: { question: string; answer: string }[];
  kits: KitOption[];
}

// ── Dados de kits por produto (preços e tokens reais) ──
const PRODUCT_KITS: Record<string, ProductKitData> = {
  verisol: {
    tagline: 'O colágeno com comprovação científica e resultados visíveis em 4 semanas.',
    benefits: [
      { icon: '✨', title: 'Pele + Jovem', desc: 'Reduz rugas e linhas finas em até 60% com peptídeos bioativos Verisol®.' },
      { icon: '💅', title: 'Unhas Fortes', desc: 'Estimula o crescimento e fortalece unhas quebradiças.' },
      { icon: '💪', title: 'Articulações', desc: 'Regenera cartilagens e melhora a mobilidade articular.' },
      { icon: '🔬', title: 'Verisol® Clínico', desc: 'Matéria-prima alemã com eficácia comprovada em estudos.' },
    ],
    faq: [
      { question: 'Em quanto tempo vejo resultados?', answer: 'Estudos clínicos mostram resultados visíveis a partir de 4 semanas, com melhora progressiva em 8 semanas de uso contínuo.' },
      { question: 'Como tomar?', answer: 'Misture 1 scoop ou sachê em água ou suco. Consumir 1x ao dia, preferencialmente pela manhã.' },
      { question: 'Qual o prazo de entrega?', answer: 'Despachamos em até 24h após confirmação do pagamento. Prazo médio: 3-7 dias úteis conforme sua região.' },
      { question: 'Tem garantia?', answer: 'Sim! 30 dias de garantia incondicional. Se não gostar por qualquer motivo, devolvemos 100% do seu dinheiro.' },
    ],
    kits: [
      { pots: 1, price: 89.90, originalPrice: 119.90, token: '8G95KP981S', label: '1 POTE' },
      { pots: 2, price: 139.90, originalPrice: 239.80, token: 'E6DOV587F3', label: '2 POTES', tag: 'MAIS VENDIDO' },
      { pots: 3, price: 179.90, originalPrice: 359.70, token: '3AUV0QPTH3', label: '3 POTES', tag: 'RECOMENDADO', popular: true },
      { pots: 6, price: 299.90, originalPrice: 719.40, token: 'S5LJPNV5AG', label: '6 POTES', tag: 'MELHOR CUSTO' },
    ],
  },
  celluli: {
    tagline: 'Fórmula 100% natural para combater celulite e retenção de líquidos.',
    benefits: [
      { icon: '🔥', title: 'Termogênico', desc: 'Acelera o metabolismo e favorece a queima de gordura localizada.' },
      { icon: '💧', title: 'Anticelulite', desc: 'Reduz a aparência da celulite visivelmente em 30 dias.' },
      { icon: '🌿', title: '100% Natural', desc: 'Fórmula com ingredientes naturais certificados, sem efeitos colaterais.' },
      { icon: '⚡', title: 'Mais Disposição', desc: 'Aumenta energia e disposição para as atividades do dia a dia.' },
    ],
    faq: [
      { question: 'Quanto tempo para ver resultados?', answer: 'Resultados visíveis a partir de 30 dias com uso contínuo. Para transformação completa, recomendamos 3 meses.' },
      { question: 'Como tomar?', answer: 'Tome 2 cápsulas por dia, preferencialmente 30 minutos antes das refeições, com bastante água.' },
      { question: 'Tem contraindicações?', answer: 'Gestantes, lactantes e menores de 18 anos devem consultar um médico antes do uso.' },
      { question: 'Qual o prazo de entrega?', answer: 'Enviamos em até 24h. Prazo médio de 3-7 dias úteis dependendo da sua região.' },
    ],
    kits: [
      { pots: 1, price: 39.90, originalPrice: 49.88, token: 'RMAGUPCGHB', label: '1 POTE' },
      { pots: 2, price: 69.90, originalPrice: 99.76, token: 'PCF9HY50IY', label: '2 POTES', tag: 'MAIS VENDIDO' },
      { pots: 3, price: 99.90, originalPrice: 149.64, token: '78HF7WJF4F', label: '3 POTES', tag: 'RECOMENDADO', popular: true },
      { pots: 6, price: 179.90, originalPrice: 299.28, token: 'KDNJ1WEHC3', label: '6 POTES', tag: 'MELHOR CUSTO' },
    ],
  },
  coenzima: {
    tagline: 'Antioxidante poderoso para energia celular, coração saudável e longevidade.',
    benefits: [
      { icon: '❤️', title: 'Coração Forte', desc: 'Protege o músculo cardíaco e melhora a circulação sanguínea.' },
      { icon: '⚡', title: 'Energia Celular', desc: 'Otimiza a produção de ATP nas mitocôndrias para mais disposição.' },
      { icon: '🛡️', title: 'Antioxidante', desc: 'Combate radicais livres e retarda o envelhecimento celular.' },
      { icon: '🧠', title: 'Cognição', desc: 'Estudos associam CoQ10 à melhora da memória e clareza mental.' },
    ],
    faq: [
      { question: 'Qual o melhor horário para tomar?', answer: 'Tome 1 cápsula junto com uma refeição que contenha gordura para melhor absorção.' },
      { question: 'Pode tomar com medicamentos?', answer: 'Se você usa medicamentos para pressão ou anticoagulantes, consulte seu médico antes.' },
      { question: 'Em quanto tempo sinto os efeitos?', answer: 'Muitos clientes relatam mais disposição em 2-3 semanas. Benefícios cardiovasculares são progressivos.' },
      { question: 'Qual o prazo de entrega?', answer: 'Enviamos em até 24h. Prazo médio de 3-7 dias úteis dependendo da sua região.' },
    ],
    kits: [
      { pots: 1, price: 49.90, originalPrice: 62.38, token: 'JD0TPQXRRP', label: '1 POTE' },
      { pots: 2, price: 89.90, originalPrice: 124.76, token: 'ARHY9PYKB4', label: '2 POTES', tag: 'MAIS VENDIDO' },
      { pots: 3, price: 129.90, originalPrice: 187.14, token: 'KSO4RI8XF0', label: '3 POTES', tag: 'RECOMENDADO', popular: true },
      { pots: 6, price: 219.90, originalPrice: 374.28, token: 'C1EJM7X0EW', label: '6 POTES', tag: 'MELHOR CUSTO' },
    ],
  },
  creatina: {
    tagline: 'Creatina monohidratada 100% pura para força máxima e recuperação acelerada.',
    benefits: [
      { icon: '💪', title: 'Força Máxima', desc: 'Aumenta a produção de ATP para treinos mais intensos e pesados.' },
      { icon: '⚡', title: 'Explosão', desc: 'Melhora o desempenho em exercícios de alta intensidade em até 15%.' },
      { icon: '🔬', title: '100% Pura', desc: 'Monohidratada sem maltodextrina, corantes ou conservantes.' },
      { icon: '🧠', title: 'Cognição', desc: 'Pesquisas mostram benefícios para saúde cerebral e memória.' },
    ],
    faq: [
      { question: 'Como tomar?', answer: 'Recomendamos 3g (1 dosador) por dia, todos os dias, preferencialmente após o treino com água ou suco.' },
      { question: 'Creatina retém líquido?', answer: 'A creatina retém líquido DENTRO do músculo, auxiliando na síntese proteica. Não causa "inchaço" abdominal.' },
      { question: 'Precisa fazer fase de carga?', answer: 'Não é obrigatório. O protocolo de 3g/dia já satura os estoques em 3-4 semanas sem fase de carga.' },
      { question: 'Qual o prazo de entrega?', answer: 'Enviamos em até 24h. Prazo médio de 3-7 dias úteis dependendo da sua região.' },
    ],
    kits: [
      { pots: 1, price: 79.90, originalPrice: 119.90, token: '9K68OGYB34', label: '1 POTE (300g)' },
      { pots: 2, price: 139.90, originalPrice: 239.80, token: '3LGTLLJT9Q', label: '2 POTES (600g)', tag: 'MAIS VENDIDO' },
      { pots: 3, price: 199.90, originalPrice: 359.70, token: 'CAZ37JJ91W', label: '3 POTES (900g)', tag: 'RECOMENDADO', popular: true },
    ],
  },
};

function resolveProductKey(product: Product): string | null {
  const name = product.name.toLowerCase();
  const cat = (product.category_id || '').toLowerCase();
  const id = product.id.toLowerCase();
  if (name.includes('verisol') || cat.includes('verisol') || id.includes('verisol')) return 'verisol';
  if (name.includes('celluli') || cat.includes('celluli') || id.includes('cell')) return 'celluli';
  if (name.includes('coenzima') || cat.includes('coenzima') || id.includes('coenz')) return 'coenzima';
  if (name.includes('creatina') || cat.includes('creatina') || id.includes('cre')) return 'creatina';
  return null;
}

// ── Animação de entrada reutilizável ──
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] } }),
};

const TESTIMONIALS = [
  { name: 'Ana Clara S.', city: 'São Paulo, SP', stars: 5, text: 'Em 4 semanas minha pele ficou visivelmente mais firme. Produto incrível!' },
  { name: 'Fernanda M.', city: 'Belo Horizonte, MG', stars: 5, text: 'Comprei o kit de 3 e estou no 2º mês. Já notei diferença nas unhas e no cabelo.' },
  { name: 'Juliana P.', city: 'Curitiba, PR', stars: 5, text: 'Entrega super rápida, produto original. Já indiquei para todas as minhas amigas!' },
];

// ── Componente Principal ───────────────────────────────
interface Props {
  product: Product;
}

export default function HighPerformanceTemplate({ product }: Props) {
  const key = resolveProductKey(product);
  const kitData = key ? PRODUCT_KITS[key] : null;

  const defaultKit = kitData?.kits.find(k => k.popular) || kitData?.kits[1] || kitData?.kits[0];
  const [selectedKit, setSelectedKit] = useState<KitOption | undefined>(defaultKit);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const images = product.images?.length ? product.images : [product.thumbnail_url];

  const handleBuyNow = () => {
    if (!selectedKit) return;
    window.open(`https://seguro.agesolution.com.br/r/${selectedKit.token}:1`, '_blank');
  };

  if (!kitData || !selectedKit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Template não disponível para este produto.</p>
      </div>
    );
  }

  const savings = selectedKit.originalPrice - selectedKit.price;
  const discountPct = Math.round((savings / selectedKit.originalPrice) * 100);

  return (
    <div className="bg-white text-[#141414] min-h-screen font-sans">

      {/* ── Barra de Promoção Animada ── */}
      <div className="bg-[#141414] text-white py-2.5 overflow-hidden">
        <div className="flex gap-16 animate-marquee whitespace-nowrap">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="text-[10px] font-black uppercase tracking-[0.3em] shrink-0">
              🚚 FRETE GRÁTIS PARA TODO O BRASIL &nbsp;•&nbsp; 🔒 COMPRA 100% SEGURA &nbsp;•&nbsp; ⭐ +5.000 CLIENTES SATISFEITOS
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
          <span className="text-black">{product.name}</span>
        </motion.nav>

        {/* ── Hero 2-colunas ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 py-12 lg:py-16 items-start">

          {/* Coluna Esquerda: Imagem */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="sticky top-6"
          >
            <div className="bg-[#F9F8F6] rounded-2xl overflow-hidden aspect-square flex items-center justify-center p-10 border border-[#E5E5E5] relative">
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
            </div>
          </motion.div>

          {/* Coluna Direita: Compra */}
          <div className="flex flex-col gap-8">

            {/* Título e tagline */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
              <div className="flex items-center gap-3 mb-4">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={14} className="fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs text-gray-500 font-bold">4.9 · +1.200 avaliações</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-[#141414] leading-[1.05] tracking-tighter mb-4 uppercase">
                {product.name}
              </h1>
              <p className="text-base text-gray-500 leading-relaxed font-medium">{kitData.tagline}</p>
            </motion.div>

            {/* Seletor de Kit */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1}>
              <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3">
                Selecione seu Kit:
              </p>
              <div className="flex flex-col gap-3">
                {kitData.kits.map(kit => {
                  const active = selectedKit.pots === kit.pots;
                  const kitSavings = kit.originalPrice - kit.price;
                  return (
                    <motion.button
                      key={kit.pots}
                      onClick={() => setSelectedKit(kit)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`relative w-full border-2 px-6 py-4 text-left flex justify-between items-center transition-all duration-200 ${
                        active ? 'border-[#141414] bg-[#F9F8F6]' : 'border-[#E5E5E5] bg-white hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${active ? 'border-[#141414] bg-[#141414]' : 'border-gray-300'}`}>
                          {active && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                        <div>
                          <div className="font-black text-base tracking-tight uppercase">{kit.label}</div>
                          {kit.tag && (
                            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                              {kit.tag}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-lg text-[#141414]">
                          R$ {kit.price.toFixed(2).replace('.', ',')}
                        </div>
                        {kitSavings > 0 && (
                          <div className="text-[11px] text-[#28A745] font-black uppercase tracking-widest">
                            Economize R$ {kitSavings.toFixed(2).replace('.', ',')}
                          </div>
                        )}
                      </div>
                      {kit.popular && (
                        <div className="absolute -top-2.5 left-5 bg-[#141414] text-white text-[9px] font-black uppercase px-3 py-1 tracking-widest">
                          ✦ Mais Escolhido
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Bloco de Preço */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={2}
              className="bg-[#F9F8F6] border border-[#E5E5E5] p-6"
            >
              <div className="flex items-end gap-4 mb-1">
                <div className="text-5xl font-black text-[#141414] tracking-tighter leading-none">
                  R$ {selectedKit.price.toFixed(2).replace('.', ',')}
                </div>
                <div className="text-lg text-gray-400 line-through mb-0.5">
                  R$ {selectedKit.originalPrice.toFixed(2).replace('.', ',')}
                </div>
              </div>
              <p className="text-[#28A745] font-black text-xs uppercase tracking-widest mb-1">
                Até 12x sem juros no cartão
              </p>
              <p className="text-gray-400 text-xs">
                ou R$ {(selectedKit.price * 0.95).toFixed(2).replace('.', ',')} no PIX (5% OFF)
              </p>
            </motion.div>

            {/* Botão CTA */}
            <motion.button
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={3}
              onClick={handleBuyNow}
              whileHover={{ backgroundColor: '#000000' }}
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
              custom={4}
              className="grid grid-cols-3 gap-4 border-t border-[#E5E5E5] pt-6"
            >
              {[
                { icon: <Truck size={20} />, label: 'Frete Grátis', sub: 'Todo o Brasil' },
                { icon: <ShieldCheck size={20} />, label: 'Compra Segura', sub: 'Checkout Protegido' },
                { icon: <RefreshCw size={20} />, label: 'Garantia 30d', sub: 'Devolução Total' },
              ].map((b, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 text-center">
                  <div className="w-10 h-10 bg-[#F9F8F6] flex items-center justify-center text-[#141414]">
                    {b.icon}
                  </div>
                  <div className="text-[9px] font-black uppercase tracking-widest leading-tight">
                    {b.label}<br />
                    <span className="text-gray-400 font-bold">{b.sub}</span>
                  </div>
                </div>
              ))}
            </motion.div>

          </div>
        </div>

        {/* ── Benefícios (scroll-triggered) ── */}
        <section className="py-20 border-t border-[#E5E5E5]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl lg:text-4xl font-black text-[#141414] uppercase tracking-tighter mb-4">
              Por que escolher a Age Solution?
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">Ingredientes selecionados, testados e aprovados para entrega de resultados reais.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {kitData.benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.12, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[#F9F8F6] p-8 border border-[#E5E5E5] hover:border-[#141414] transition-colors group"
              >
                <div className="text-3xl mb-5">{b.icon}</div>
                <h4 className="text-sm font-black text-[#141414] uppercase tracking-widest mb-3 group-hover:text-black">
                  {b.title}
                </h4>
                <p className="text-sm text-gray-500 leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── O que está incluso ── */}
        <section className="py-20 border-t border-[#E5E5E5] bg-[#F9F8F6] -mx-4 px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-2xl font-black text-[#141414] uppercase tracking-tighter mb-10">
              O que você recebe no kit {selectedKit.label}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 text-left">
              {[
                `${selectedKit.pots} pote${selectedKit.pots > 1 ? 's' : ''} de ${product.name}`,
                'Nota fiscal e embalagem segura',
                'Rastreamento do pedido por e-mail',
                'Suporte dedicado via WhatsApp',
                '30 dias de garantia incondicional',
                `${selectedKit.pots * 30} dias de tratamento completo`,
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="flex items-center gap-3 bg-white border border-[#E5E5E5] px-5 py-3"
                >
                  <Check size={16} className="text-[#28A745] shrink-0" />
                  <span className="text-sm font-bold text-[#141414]">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── Depoimentos ── */}
        <section className="py-20 border-t border-[#E5E5E5]">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-black text-[#141414] uppercase tracking-tighter text-center mb-12"
          >
            O que nossos clientes dizem
          </motion.h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ delay: i * 0.15, duration: 0.55 }}
                className="border border-[#E5E5E5] p-8 bg-white"
              >
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={12} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed italic mb-5">"{t.text}"</p>
                <div>
                  <div className="font-black text-[#141414] text-xs uppercase tracking-widest">{t.name}</div>
                  <div className="text-[10px] text-gray-400 font-bold mt-0.5">{t.city}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-20 border-t border-[#E5E5E5] max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-black text-[#141414] uppercase tracking-tighter text-center mb-10"
          >
            Dúvidas Frequentes
          </motion.h2>
          <div className="space-y-3">
            {kitData.faq.map((item, i) => (
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
                  <Plus
                    size={18}
                    className={`shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-45' : ''}`}
                  />
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
        <section className="py-16 border-t border-[#E5E5E5] text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#141414] text-white p-12 max-w-2xl mx-auto"
          >
            <Package size={40} className="mx-auto mb-6 opacity-60" />
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">{product.name}</h3>
            <p className="text-gray-400 text-sm mb-6">Kit selecionado: {selectedKit.label}</p>
            <div className="text-4xl font-black tracking-tighter mb-6">
              R$ {selectedKit.price.toFixed(2).replace('.', ',')}
            </div>
            <button
              onClick={handleBuyNow}
              className="w-full bg-white text-[#141414] font-black uppercase tracking-[0.35em] text-sm py-5 flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors"
            >
              <ShoppingCart size={20} />
              GARANTIR MEU KIT AGORA
            </button>
            <p className="text-[10px] text-gray-500 mt-4 uppercase tracking-widest">
              🔒 Pagamento 100% seguro · 30 dias de garantia
            </p>
          </motion.div>
        </section>

      </div>
    </div>
  );
}
