import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/mock';
import { useCartStore } from '../store/cart';
import { getProductBySlug } from '../lib/yampi';
import { Product } from '../types';
import { Star, Minus, Plus, ShoppingCart, Truck, Shield, ChevronDown, ChevronRight, Check } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const addItem = useCartStore((state) => state.addItem);
  const toggleCart = useCartStore((state) => state.toggleCart);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState<number>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      setLoading(true);
      setSelectedImage(0);
      setQuantity(1);
      setSelectedVariation(0);
      try {
        let target: Product | null | undefined = null;
        try {
          target = await getProductBySlug(id);
          if (!target && products.find(p => p.id === id)) {
            const mockP = products.find(p => p.id === id);
            if (mockP) {
              const searchName = mockP.name.split(' ')[0];
              const yampiSearch = await getProductBySlug(searchName);
              if (yampiSearch) target = yampiSearch;
            }
          }
        } catch { /* Yampi fail */ }
        if (!target) { target = products.find(p => p.id === id) || null; }
        if (target) {
          setProduct(target);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-age-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
      <p className="text-gray-500 text-lg">Produto não encontrado.</p>
      <Link to="/" className="text-age-gold font-bold hover:underline">Voltar para a loja</Link>
    </div>
  );

  const images = product.images?.length ? product.images : [product.thumbnail_url];
  const discount = product.discount_percentage || (
    product.original_price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : 0
  );
  const pixPrice = product.price * 0.95;
  const installmentPrice = product.price / 12;
  const currentVariation = product.variations?.[selectedVariation];
  const displayPrice = currentVariation?.price || product.price;

  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const descriptionIsHtml = product.description?.includes('<');
  const cleanDescription = descriptionIsHtml ? stripHtml(product.description) : product.description;

  // Reviews data
  const reviewRating = product.details?.reviews?.rating || 4.9;
  const reviewCount = product.details?.reviews?.count || 124;

  // FAQ
  const faqItems = product.details?.faq || [
    { question: 'Qual o prazo de entrega?', answer: 'Enviamos em até 24h para São Paulo. Demais regiões de 3 a 15 dias úteis.' },
    { question: 'Como devo tomar?', answer: 'Siga as instruções de uso na embalagem. Recomendamos consumo diário para melhores resultados.' },
    { question: 'Contém alguma contraindicação?', answer: 'Gestantes, nutrizes e crianças até 3 anos devem consultar um médico antes do uso.' },
  ];

  // Benefits
  const benefitItems = [
    { icon: '🚚', title: 'Frete Grátis', desc: 'Para compras acima de R$ 49,90' },
    { icon: '🔒', title: 'Compra Segura', desc: 'Site 100% protegido' },
    { icon: '💳', title: 'Até 12x sem juros', desc: 'No cartão de crédito' },
    { icon: '↩️', title: 'Troca Garantida', desc: '30 dias para trocar' },
  ];

  const handleAddToCart = () => {
    addItem(product, currentVariation, quantity);
    toggleCart();
  };

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

      {/* Main Product Section */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">

          {/* LEFT: Image Gallery */}
          <div className="flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[600px] pb-2 md:pb-0 md:pr-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === i
                        ? 'border-age-gold shadow-lg shadow-age-gold/20'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="flex-1 relative">
              <div className="bg-white rounded-[20px] overflow-hidden shadow-lg aspect-square flex items-center justify-center">
                <img
                  src={images[selectedImage] || product.thumbnail_url}
                  alt={product.name}
                  className="w-full h-full object-contain p-4"
                />
              </div>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                <span className="bg-black text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
                  Frete Grátis
                </span>
                {discount > 0 && (
                  <span className="bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
                    {discount}% OFF
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div className="flex flex-col">
            {/* Reviews */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={`${i < Math.round(reviewRating) ? 'fill-age-gold text-age-gold' : 'fill-gray-200 text-gray-200'}`} />
                ))}
              </div>
              <span className="text-sm text-gray-500 font-medium">{reviewRating} ({reviewCount} avaliações)</span>
            </div>

            {/* Name */}
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-2">
              {product.name}
            </h1>

            {/* Subtitle */}
            {product.details?.subtitle && (
              <p className="text-sm text-gray-500 mb-4">{product.details.subtitle}</p>
            )}

            {/* Price Block */}
            <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100 shadow-sm">
              {product.original_price && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-gray-400 line-through">
                    De R$ {product.original_price.toFixed(2).replace('.', ',')}
                  </span>
                  {discount > 0 && (
                    <span className="text-xs font-black text-white bg-red-500 px-2 py-0.5 rounded-full">
                      -{discount}%
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl md:text-4xl font-black text-gray-900">
                  R$ {displayPrice.toFixed(2).replace('.', ',')}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-sm text-[#2E7D32] font-bold flex items-center gap-1.5">
                  <span className="inline-block w-5 h-5 bg-[#2E7D32] text-white rounded-full text-[9px] font-black flex items-center justify-center leading-none">PIX</span>
                  R$ {(displayPrice * 0.95).toFixed(2).replace('.', ',')} no PIX
                  <span className="text-[10px] text-gray-400 font-normal">(5% de desconto)</span>
                </p>
                <p className="text-xs text-gray-500">
                  ou <strong>12x de R$ {(displayPrice / 12).toFixed(2).replace('.', ',')}</strong> sem juros
                </p>
              </div>
            </div>

            {/* Variation Selector */}
            {product.variations && product.variations.length > 1 && (
              <div className="mb-6">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 block">
                  Escolha uma opção:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variations.map((v, i) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariation(i)}
                      className={`px-5 py-3 rounded-xl text-sm font-bold border-2 transition-all duration-200 ${
                        selectedVariation === i
                          ? 'border-age-gold bg-age-gold/5 text-age-gold'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {v.name}
                      {v.price && (
                        <span className="block text-[10px] font-normal mt-0.5">
                          R$ {v.price.toFixed(2).replace('.', ',')}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              {/* Quantity */}
              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden h-14">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-12 h-full flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-12 h-full flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Buy Button */}
              <button
                onClick={handleAddToCart}
                className="flex-1 h-14 bg-black hover:bg-age-gold text-white hover:text-black font-black uppercase tracking-widest text-sm rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              >
                <ShoppingCart size={18} />
                Comprar Agora
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {benefitItems.map((b, i) => (
                <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100">
                  <span className="text-xl">{b.icon}</span>
                  <div>
                    <p className="text-xs font-bold text-gray-800">{b.title}</p>
                    <p className="text-[10px] text-gray-400">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-16">
          <div className="bg-white rounded-[20px] p-8 md:p-12 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 mb-6 pb-4 border-b border-gray-100">
              Sobre o Produto
            </h2>

            {descriptionIsHtml ? (
              <div
                className="prose prose-sm max-w-none text-gray-600 leading-relaxed
                  [&_h2]:text-age-gold [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3
                  [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-3
                  [&_strong]:text-gray-800
                  [&_ul]:list-disc [&_ul]:pl-5
                  [&_li]:mb-2"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            ) : (
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
            )}
          </div>
        </div>

        {/* How to Use */}
        {product.details?.how_to_use && (
          <div className="mt-8">
            <div className="bg-white rounded-[20px] p-8 md:p-12 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 mb-6 pb-4 border-b border-gray-100">
                {product.details.how_to_use.title || 'Como Usar'}
              </h2>
              {product.details.how_to_use.description && (
                <p className="text-gray-600 mb-6">{product.details.how_to_use.description}</p>
              )}
              {product.details.how_to_use.steps?.length > 0 && (
                <div className="space-y-4">
                  {product.details.how_to_use.steps.map((step: string, i: number) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-age-gold/10 text-age-gold font-black flex items-center justify-center text-sm flex-shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-gray-600 pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* FAQ Section */}
        {faqItems.length > 0 && (
          <div className="mt-8">
            <div className="bg-white rounded-[20px] p-8 md:p-12 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 mb-6 pb-4 border-b border-gray-100">
                Perguntas Frequentes
              </h2>
              <div className="space-y-3">
                {faqItems.map((item: any, i: number) => (
                  <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-bold text-sm text-gray-800 pr-4">{item.question}</span>
                      <ChevronDown
                        size={18}
                        className={`text-gray-400 transition-transform duration-300 flex-shrink-0 ${
                          openFaq === i ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                        {item.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Nutrition Facts */}
        {product.details?.nutrition_facts && (
          <div className="mt-8">
            <div className="bg-white rounded-[20px] p-8 md:p-12 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 mb-6 pb-4 border-b border-gray-100">
                Tabela Nutricional
              </h2>
              <p className="text-sm text-gray-500 mb-4">Porção: {product.details.nutrition_facts.serving_size}</p>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="grid grid-cols-3 bg-gray-50 px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                  <span>Nutriente</span>
                  <span className="text-center">Quantidade</span>
                  <span className="text-right">%VD</span>
                </div>
                {product.details.nutrition_facts.items?.map((item, i) => (
                  <div key={i} className={`grid grid-cols-3 px-4 py-3 text-sm ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <span className="text-gray-700">{item.nutrient}</span>
                    <span className="text-center text-gray-600">{item.quantity}</span>
                    <span className="text-right text-gray-500">{item.daily_value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
