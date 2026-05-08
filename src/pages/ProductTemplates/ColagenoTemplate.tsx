import { useState } from 'react';
import { Product } from '../../types';
import { useCartStore } from '../../store/cart';
import { Star, Minus, Plus, ShoppingCart, ChevronDown, ChevronRight } from 'lucide-react';
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
    { question: 'Em quanto tempo começa a aparecer os resultados?', answer: 'A maioria dos estudos demonstram que os resultados são visíveis a partir de 8 semanas, mas começam a ser notados a partir de 4 semanas. Resultados podem variar de organismo para organismo.' },
    { question: 'Como devo tomar?', answer: 'Misture 1 colher de sopa (aprox.12g) em 150ml de água, consumir uma vez ao dia.' },
    { question: 'Qual o prazo de entrega?', answer: 'Em média despachamos o produto em até 24hs após comprovação do pagamento. Utilizamos a transportadora Kangu para agilizar a entrega.' },
    { question: 'Contém alguma contraindicação?', answer: 'Gestantes, nutrizes, lactantes e crianças (até 3 anos) somente devem consumir este produto sob orientação de nutricionistas ou médicos.' },
    { question: 'Os ingredientes são naturais?', answer: 'Sim, Priorizamos sempre a qualidade! Por isso não utilizamos corantes artificiais, malto e nem conservantes!' },
  ];

  const benefits = [
    { title: 'Ácido hialurônico 50mg', desc: 'Contribui para a elasticidade e resistência da pele, para a saúde das unhas e cabelos e é responsável por constituir as fibras.' },
    { title: 'PROTEÍNA 10g', desc: 'Proteínas são capazes de regenerar tecidos, além de desempenhar um papel muito importante no sistema imunológico.' },
    { title: 'Vitamina B6, C e E', desc: 'Antioxidante forte e eficaz que beneficia a luminosidade da pele, deixando-a mais viçosa e bonita.' },
    { title: 'Zinco', desc: 'Atua como antioxidante fundamental para o sistema de defesa da pele; diminui radicais livres e protege células.' },
  ];

  return (
    <div className="bg-[#f9f8f6] min-h-screen">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-xs text-gray-400">
          <Link to="/" className="hover:text-age-gold transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link to={`/category/${product.category_id}`} className="hover:text-age-gold transition-colors capitalize">
            {product.category_id?.replace(/-/g, ' ')}
          </Link>
          <ChevronRight size={12} />
          <span className="text-gray-600 font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Esquerda: Imagens */}
          <div className="flex flex-col-reverse md:flex-row gap-4">
            {images.length > 1 && (
              <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[600px] pb-2 md:pb-0 md:pr-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)} className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-age-gold' : 'border-gray-200'}`}>
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div className="flex-1 relative">
              <div className="bg-white rounded-[20px] overflow-hidden shadow-lg aspect-square flex items-center justify-center p-4">
                <img src={images[selectedImage] || product.thumbnail_url} alt={product.name} className="w-full h-full object-contain" />
              </div>
            </div>
          </div>

          {/* Direita: Info Principal */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-age-gold text-age-gold" />)}
              </div>
              <span className="text-sm text-gray-500 font-medium">4.9 (1200 avaliações)</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-2">{product.name}</h1>
            <p className="text-sm text-gray-500 mb-4">Renove sua pele com o Colágeno mais eficaz do Brasil!</p>

            <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100 shadow-sm">
              {product.original_price && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-gray-400 line-through">De R$ {product.original_price.toFixed(2).replace('.', ',')}</span>
                  <span className="text-xs font-black text-white bg-red-500 px-2 py-0.5 rounded-full">-{discount}%</span>
                </div>
              )}
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl md:text-4xl font-black text-gray-900">R$ {displayPrice.toFixed(2).replace('.', ',')}</span>
              </div>
              <p className="text-sm text-[#2E7D32] font-bold">R$ {(displayPrice * 0.95).toFixed(2).replace('.', ',')} no PIX <span className="text-[10px] text-gray-400 font-normal">(5% de desconto)</span></p>
              <p className="text-xs text-gray-500">ou 12x de R$ {(displayPrice / 12).toFixed(2).replace('.', ',')} sem juros</p>
            </div>

            {/* Variações (Sabores) */}
            {product.variations && product.variations.length > 1 && (
              <div className="mb-6">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 block">Sabor:</label>
                <div className="flex flex-wrap gap-2">
                  {product.variations.map((v, i) => (
                    <button key={v.id} onClick={() => setSelectedVariation(i)} className={`px-5 py-3 rounded-xl text-sm font-bold border-2 transition-all ${selectedVariation === i ? 'border-age-gold bg-age-gold/5 text-age-gold' : 'border-gray-200 text-gray-600'}`}>
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantidade e Comprar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden h-14">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-12 h-full flex items-center justify-center hover:bg-gray-50"><Minus size={16} /></button>
                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="w-12 h-full flex items-center justify-center hover:bg-gray-50"><Plus size={16} /></button>
              </div>
              <button onClick={handleAddToCart} className="flex-1 h-14 bg-black hover:bg-age-gold text-white hover:text-black font-black uppercase tracking-widest text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-3">
                <ShoppingCart size={18} /> Comprar Agora
              </button>
            </div>
          </div>
        </div>

        {/* Informações Extras (Colágeno) */}
        <div className="mt-16 bg-white rounded-[20px] p-8 md:p-12 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-black text-age-gold mb-2 text-center uppercase">Tratamento anti-idade</h2>
          <h3 className="text-lg font-bold text-gray-800 mb-8 text-center uppercase tracking-tight">Tenha uma pele mais jovem, sem rugas e sem linha de expressão! Renove sua pele com o colágeno mais eficaz do brasil!</h3>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {benefits.map((b, i) => (
              <div key={i} className="bg-[#f9f8f6] p-6 rounded-xl border border-gray-100">
                <h4 className="font-black text-gray-900 mb-2 uppercase">{b.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#fff8e1] p-8 rounded-xl text-center mb-12 border border-[#f1d592]/30">
            <p className="text-xl font-black text-age-gold mb-2">Você vai precisar de apenas 1 Scoop por dia!</p>
            <p className="text-gray-700">O consumo é indicado sempre após a refeição. Podendo ser após seu café da manhã ou após o almoço.</p>
          </div>

          {/* FAQ */}
          <h2 className="text-2xl font-black text-gray-900 mb-6 text-center uppercase">Perguntas Frequentes</h2>
          <div className="space-y-3 max-w-3xl mx-auto">
            {faqItems.map((item, i) => (
              <div key={i} className="border border-gray-100 rounded-xl overflow-hidden bg-white">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50">
                  <span className="font-bold text-sm text-gray-800 pr-4">{item.question}</span>
                  <ChevronDown size={18} className={`text-gray-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-4">{item.answer}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
