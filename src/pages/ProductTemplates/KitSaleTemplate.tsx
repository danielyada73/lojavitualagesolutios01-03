import { useState } from 'react';
import { Product } from '../../types';
import { getKitCheckoutUrl } from '../../lib/yampi';
import { ShoppingCart, ChevronDown, ChevronRight, ShieldCheck, Truck, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

interface Props {
  product: Product;
}

export default function KitSaleTemplate({ product }: Props) {

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedKit, setSelectedKit] = useState<number>(3); 
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const images = product.images?.length ? product.images : [product.thumbnail_url];
  const basePrice = product.price;
  const originalBasePrice = product.original_price || basePrice * 1.5;

  const kits = [
    { pots: 6, discount: 0.80, label: 'MELHOR CUSTO-BENEFÍCIO', popular: false },
    { pots: 3, discount: 0.77, label: 'RECOMENDADO', popular: true },
    { pots: 2, discount: 0.74, label: 'O MAIS VENDIDO', popular: false },
    { pots: 1, discount: 0.60, label: 'UNIDADE', popular: false },
  ];

  const currentKit = kits.find(k => k.pots === selectedKit) || kits[1];
  const kitOriginalTotal = originalBasePrice * currentKit.pots;
  const kitFinalTotal = kitOriginalTotal * (1 - currentKit.discount);
  const kitInstallment = kitFinalTotal / 12;

  const handleBuyNow = () => {
    const url = getKitCheckoutUrl(product.id, selectedKit);
    window.open(url, '_blank');
  };

  const faqItems = [
    { question: 'O produto é original?', answer: 'Sim, somos a loja oficial e garantimos 100% de autenticidade em todos os nossos suplementos.' },
    { question: 'Qual o prazo de entrega?', answer: 'Enviamos em até 24h úteis. O prazo médio é de 3 a 7 dias úteis dependendo da sua região.' },
    { question: 'Como tomar?', answer: 'Recomendamos o uso diário conforme as instruções contidas no rótulo de cada produto.' },
  ];

  return (
    <div className="bg-white text-[#141414] min-h-screen font-sans">
      <div className="container mx-auto px-4 py-8 lg:py-16">
        {/* Breadcrumb */}
        <motion.nav 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-12"
        >
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <ChevronRight size={12} className="text-gray-300" />
          <span className="text-black uppercase">{product.name}</span>
        </motion.nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* GALERIA CLEAN */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#F9F8F6] rounded-[20px] overflow-hidden aspect-square flex items-center justify-center p-12 border border-[#E5E5E5]"
          >
            <motion.img 
              key={selectedImage}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              src={images[selectedImage] || product.thumbnail_url} 
              alt={product.name} 
              className="w-full h-full object-contain mix-blend-multiply" 
            />
          </motion.div>

          {/* SELEÇÃO DE KITS */}
          <div className="flex flex-col">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl lg:text-5xl font-black text-[#141414] leading-tight mb-4 tracking-tighter uppercase">
                {product.name}
              </h1>
              <p className="text-lg text-gray-500 mb-10 font-medium">Tratamento completo para resultados máximos.</p>
            </motion.div>

            <div className="space-y-4 mb-10">
              <span className="text-[11px] font-black uppercase tracking-widest text-gray-400 block mb-2">Selecione seu Kit:</span>
              
              {kits.map((kit, idx) => (
                <motion.button
                  key={kit.pots}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  onClick={() => setSelectedKit(kit.pots)}
                  className={`relative w-full border-2 p-6 transition-all text-left flex justify-between items-center ${
                    selectedKit === kit.pots
                      ? 'border-[#141414] bg-[#F9F8F6]'
                      : 'border-[#E5E5E5] bg-white hover:border-gray-400'
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div>
                    <div className="font-black text-xl tracking-tight uppercase">{kit.pots} {kit.pots > 1 ? 'POTES' : 'POTE'}</div>
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{kit.label}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-[#EB001B] font-black text-2xl tracking-tighter">-{Math.round(kit.discount * 100)}% OFF</div>
                    <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Desconto Ativo</div>
                  </div>

                  {kit.popular && (
                    <div className="absolute -top-3 left-6 bg-[#141414] text-white text-[9px] font-black uppercase px-4 py-1 rounded-none tracking-widest shadow-lg">
                      Mais Escolhido
                    </div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* PREÇO FINAL */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-[#F9F8F6] p-8 border border-[#E5E5E5] mb-8 text-center"
            >
              <p className="text-sm text-gray-400 mb-1">De <span className="line-through">R$ {kitOriginalTotal.toFixed(2).replace('.', ',')}</span> por apenas</p>
              <div className="text-[11px] text-[#141414] font-black uppercase tracking-widest mb-1">12x sem juros de</div>
              <div className="text-6xl font-black text-[#141414] tracking-tighter mb-2">
                <span className="text-2xl">R$</span> {kitInstallment.toFixed(2).replace('.', ',')}
              </div>
              <p className="text-sm text-[#28A745] font-black uppercase tracking-widest">Economize R$ {(kitOriginalTotal - kitFinalTotal).toFixed(2).replace('.', ',')}</p>
            </motion.div>

            {/* BOTÃO QUADRADO NEGRO */}
            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.02, backgroundColor: '#000' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBuyNow} 
              className="w-full h-20 bg-[#141414] text-white font-black uppercase tracking-[0.4em] text-lg rounded-none transition-all flex items-center justify-center gap-4 shadow-xl"
            >
              <ShoppingCart size={24} /> COMPRAR AGORA
            </motion.button>
            
            <div className="flex justify-between mt-10 border-t border-[#E5E5E5] pt-8">
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-500">
                <Truck size={20} className="text-[#141414]" /> Frete Grátis
              </div>
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-500">
                <ShieldCheck size={20} className="text-[#141414]" /> Compra Segura
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-4xl mx-auto mt-32 border-t border-[#E5E5E5] pt-20">
          <h2 className="text-3xl font-black text-[#141414] mb-12 uppercase tracking-tighter text-center">Dúvidas Frequentes</h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="border border-[#E5E5E5] overflow-hidden"
              >
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-8 text-left hover:bg-[#F9F8F6] transition-colors">
                  <span className="font-black text-[#141414] text-sm uppercase tracking-widest">{item.question}</span>
                  <Plus size={20} className={`transition-transform duration-300 ${openFaq === i ? 'rotate-45' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-96' : 'max-h-0'}`}>
                  <div className="px-8 pb-8 text-gray-500 text-sm leading-relaxed border-t border-[#E5E5E5] pt-6 bg-white">
                    {item.answer}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

