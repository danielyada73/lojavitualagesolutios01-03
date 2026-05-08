import { useState } from 'react';
import { Product } from '../../types';
import { useCartStore } from '../../store/cart';
import { Star, Minus, Plus, ShoppingCart, ChevronDown, ChevronRight } from 'lucide-react';
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
    { title: 'Aumento de Força', desc: 'Eleve sua capacidade de levantar mais peso e ter mais resistência nos treinos.' },
    { title: 'Recuperação Muscular', desc: 'Reduz a fadiga e acelera a regeneração dos músculos após treinos intensos.' },
    { title: 'Desempenho Máximo', desc: 'A creatina aumenta os níveis de ATP, garantindo mais potência para suas atividades.' },
    { title: 'Melhoria Cognitiva', desc: 'Estudos comprovam que a creatina melhora o foco, a memória e a clareza mental.' },
  ];

  return (
    <div className="bg-[#f9f8f6] min-h-screen">
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
              <span className="text-sm text-gray-500 font-medium">4.9 (2450 avaliações)</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-2">{product.name}</h1>
            <p className="text-sm text-gray-500 mb-4">Diminui a fadiga e aumenta a resistência e força em exercícios físicos de alta intensidade. Dose diária: 3g.</p>

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
              <p className="text-sm text-[#2E7D32] font-bold">R$ {(displayPrice * 0.95).toFixed(2).replace('.', ',')} no PIX</p>
              <p className="text-xs text-gray-500">ou 12x de R$ {(displayPrice / 12).toFixed(2).replace('.', ',')} sem juros</p>
            </div>

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
            
            <div className="bg-[#E8F5E9] text-[#2E7D32] text-center p-3 rounded-xl text-xs font-bold border border-[#2E7D32]/20">
              🚚 Frete GRÁTIS PARA TODO BRASIL!
            </div>
          </div>
        </div>

        {/* Informações Extras (Creatina) */}
        <div className="mt-16 bg-white rounded-[20px] p-8 md:p-12 shadow-sm border border-gray-100">
          
          {/* Benefícios */}
          <h2 className="text-2xl font-black text-gray-900 mb-8 text-center uppercase">Principais Benefícios da Creatina</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {benefits.map((b, i) => (
              <div key={i} className="text-center p-4">
                <div className="w-16 h-16 mx-auto bg-age-gold/10 rounded-full flex items-center justify-center mb-4 text-age-gold">
                  {/* Ícones genéricos simples com Emoji para não depender de libs extras complexas, mantendo minimalista */}
                  <span className="text-2xl">{i === 0 ? '💪' : i === 1 ? '🔄' : i === 2 ? '⚡' : '🧠'}</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{b.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>

          <hr className="border-gray-100 mb-12" />

          {/* Como Tomar */}
          <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase">Como devo tomar?</h2>
              <p className="text-gray-600 mb-6">Muitas pessoas têm dúvidas sobre como tomar creatina, mas o mais importante é entender que o consumo diário é essencial para garantir seus benefícios.</p>
              
              <div className="mb-6">
                <h4 className="font-bold text-gray-900 mb-2">Preciso tomar todos os dias?</h4>
                <p className="text-sm text-gray-600">Sim. A creatina deve ser consumida diariamente, mesmo nos dias em que você não treina. Seu efeito é acumulativo.</p>
              </div>
              
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Qual a quantidade ideal?</h4>
                <p className="text-sm text-gray-600">A recomendação é consumir entre 3g e 5g de creatina por dia para obter todos os benefícios. Não é necessário fazer fase de saturação.</p>
              </div>
            </div>
            <div className="bg-[#f9f8f6] p-8 rounded-[20px] border border-gray-100">
              <h3 className="font-black text-gray-900 mb-4 uppercase">Como consumir?</h3>
              <p className="text-sm text-gray-600 mb-4">A creatina pode ser facilmente misturada em água, suco ou shakes proteicos.</p>
              <p className="text-sm text-gray-600">Para otimizar sua absorção, consuma junto com alimentos que estimulam a produção de insulina (arroz, banana, mel, dextrose).</p>
            </div>
          </div>

          <hr className="border-gray-100 mb-12" />

          {/* Tabela Nutricional */}
          <div className="max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl font-black text-gray-900 mb-6 text-center uppercase">Tabela Nutricional</h2>
            <p className="text-sm text-gray-500 mb-4 text-center">Porção de 3g (1 dosador)</p>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="grid grid-cols-2 bg-gray-50 px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                <span>Quantidade por porção</span>
                <span className="text-right">%VD (*)</span>
              </div>
              <div className="grid grid-cols-2 px-4 py-3 text-sm bg-white border-b border-gray-100">
                <span className="text-gray-700">Creatina Monohidratada</span>
                <span className="text-right text-gray-900 font-bold">3000mg</span>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 mt-4 text-center">
              Não contém quantidades significativas de valor energético, carboidratos, açúcares, proteínas, gorduras e sódio.
            </p>
          </div>

          <hr className="border-gray-100 mb-12" />

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
