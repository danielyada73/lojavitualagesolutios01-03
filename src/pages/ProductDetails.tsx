import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/mock';
import { useCartStore } from '../store/cart';
import { getProductByHandle } from '../lib/shopify';
import { Product } from '../types';
import { 
  Star, Truck, ShieldCheck, Minus, Plus, 
  ShoppingCart, ChevronLeft, ChevronRight,
  CreditCard, Package, RotateCcw
} from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariation, setSelectedVariation] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

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
          if (target.variations && target.variations.length > 0) {
            setSelectedVariation(target.variations[0].id || target.variations[0].name || '');
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const allImages = useMemo(() => {
    if (!product) return [];
    const imgs: string[] = [];
    if (product.thumbnail_url) imgs.push(product.thumbnail_url);
    if (product.images) {
      product.images.forEach(img => {
        if (img !== product.thumbnail_url) imgs.push(img);
      });
    }
    return imgs.length > 0 ? imgs : [product.thumbnail_url || ''];
  }, [product]);

  const handlePrevSlide = () => {
    const newIdx = currentSlide === 0 ? allImages.length - 1 : currentSlide - 1;
    setCurrentSlide(newIdx);
    setMainImage(allImages[newIdx]);
  };

  const handleNextSlide = () => {
    const newIdx = currentSlide === allImages.length - 1 ? 0 : currentSlide + 1;
    setCurrentSlide(newIdx);
    setMainImage(allImages[newIdx]);
  };

  const handleThumbClick = (img: string, idx: number) => {
    setMainImage(img);
    setCurrentSlide(idx);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-age-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Carregando produto...</p>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <p className="text-gray-500">Produto não encontrado.</p>
    </div>
  );

  const discount = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.thumbnail_url
    });
    navigate('/cart');
  };

  return (
    <div className="bg-white">
      {/* ===== SEÇÃO PRINCIPAL DO PRODUTO ===== */}
      <section className="py-8 md:py-12">
        <div className="container max-w-7xl mx-auto px-4">
          
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-14">
            
            {/* ===== COLUNA ESQUERDA: GALERIA ===== */}
            <div className="w-full lg:w-1/2">
              <div className="flex flex-col-reverse lg:flex-row gap-4">
                
                {/* Thumbnails Verticais (Desktop) */}
                <div className="hidden lg:flex flex-col gap-3 w-20 shrink-0">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleThumbClick(img, idx)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 bg-white p-1 ${
                        currentSlide === idx 
                          ? 'border-age-gold shadow-md' 
                          : 'border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Imagem ${idx + 1}`} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>

                {/* Imagem Principal */}
                <div className="flex-1 relative group">
                  <div className="aspect-square bg-white rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center p-4 md:p-8">
                    <img 
                      src={mainImage} 
                      alt={product.name}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
                    />
                    
                    {/* Sale Badge */}
                    {discount > 0 && (
                      <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                        -{discount}% OFF
                      </div>
                    )}
                  </div>

                  {/* Setas de Navegação */}
                  {allImages.length > 1 && (
                    <>
                      <button 
                        onClick={handlePrevSlide}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-black opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button 
                        onClick={handleNextSlide}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-black opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Thumbnails Horizontais (Mobile) */}
              <div className="flex lg:hidden gap-2 mt-4 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleThumbClick(img, idx)}
                    className={`w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 bg-white p-1 ${
                      currentSlide === idx 
                        ? 'border-age-gold' 
                        : 'border-gray-200 opacity-60'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>

              {/* Compra Segura Badge */}
              <div className="mt-6 flex justify-center">
                <img 
                  src="https://agesolution.com.br/wp-content/uploads/2023/01/Compra-segura.webp" 
                  alt="Compra Segura" 
                  className="max-w-[300px] w-full"
                />
              </div>
            </div>

            {/* ===== COLUNA DIREITA: INFORMAÇÕES DO PRODUTO ===== */}
            <div className="w-full lg:w-1/2">
              
              {/* Título */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                {product.name}
              </h1>

              {/* Avaliações */}
              <div className="flex items-center gap-2 mb-5">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-500">(47 avaliações)</span>
              </div>

              {/* Separador */}
              <hr className="border-gray-200 mb-5" />

              {/* Preço */}
              <div className="mb-6">
                {product.original_price && product.original_price > product.price && (
                  <p className="text-sm text-gray-400 line-through mb-1">
                    De R$ {product.original_price.toFixed(2).replace('.', ',')}
                  </p>
                )}
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-gray-900">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </span>
                  {discount > 0 && (
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                      {discount}% OFF
                    </span>
                  )}
                </div>
                <p className="text-sm text-green-600 font-medium mt-2">
                  ou 12x de R$ {(product.price / 12).toFixed(2).replace('.', ',')} sem juros
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  No PIX com <strong className="text-green-600">5% de desconto</strong>: R$ {(product.price * 0.95).toFixed(2).replace('.', ',')}
                </p>
              </div>

              {/* Separador */}
              <hr className="border-gray-200 mb-5" />

              {/* Seletor de Variação (Sabor) */}
              {product.variations && product.variations.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Sabor
                  </label>
                  <select
                    value={selectedVariation}
                    onChange={(e) => setSelectedVariation(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-age-gold focus:border-transparent transition-all"
                  >
                    {product.variations.map((v) => (
                      <option key={v.id || v.name} value={v.id || v.name}>{v.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Quantidade + Botão Comprar */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Quantidade
                </label>
                <div className="flex gap-3">
                  {/* Seletor de Quantidade */}
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-3 text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-5 py-3 font-bold text-center min-w-[50px] border-x border-gray-300 bg-white">
                      {quantity}
                    </span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-3 text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Botão Comprar */}
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-age-gold hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95"
                  >
                    <ShoppingCart size={20} />
                    COMPRAR
                  </button>
                </div>
              </div>

              {/* Frete Grátis */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
                <Truck size={24} className="text-green-600 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-green-800">Frete Grátis</p>
                  <p className="text-xs text-green-600">Para compras acima de R$ 49,90</p>
                </div>
              </div>

              {/* Badges de Confiança */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <ShieldCheck size={20} className="text-age-gold shrink-0" />
                  <span className="text-xs font-medium text-gray-700">Compra 100% Segura</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <CreditCard size={20} className="text-age-gold shrink-0" />
                  <span className="text-xs font-medium text-gray-700">12x sem Juros</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Package size={20} className="text-age-gold shrink-0" />
                  <span className="text-xs font-medium text-gray-700">Envio em 24h</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <RotateCcw size={20} className="text-age-gold shrink-0" />
                  <span className="text-xs font-medium text-gray-700">Devolução Grátis</span>
                </div>
              </div>

              {/* Separador */}
              <hr className="border-gray-200 mb-5" />

              {/* Descrição Curta */}
              {product.description && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase">Descrição</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Meios de Pagamento */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase">Formas de Pagamento</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: 'Visa', url: 'https://img.icons8.com/color/48/000000/visa.png' },
                    { name: 'Mastercard', url: 'https://img.icons8.com/color/48/000000/mastercard.png' },
                    { name: 'Amex', url: 'https://img.icons8.com/color/48/000000/amex.png' },
                    { name: 'Elo', url: 'https://img.icons8.com/color/48/000000/elo.png' },
                    { name: 'Pix', url: 'https://img.icons8.com/color/48/000000/pix.png' },
                    { name: 'Boleto', url: 'https://img.icons8.com/color/48/000000/bank-building.png' }
                  ].map((card, i) => (
                    <div key={i} className="w-12 h-8 bg-white rounded border border-gray-200 flex items-center justify-center p-1">
                      <img src={card.url} alt={card.name} className="h-full w-auto object-contain" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SEÇÕES DE CONTEÚDO ABAIXO ===== */}
      
      {/* Informações Detalhadas */}
      {product.details && (
        <section className="py-12 bg-gray-50 border-t border-gray-200">
          <div className="container max-w-7xl mx-auto px-4">
            
            {/* Benefícios */}
            {product.details.benefits && product.details.benefits.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Benefícios</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {product.details.benefits.map((benefit, i) => (
                    <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-age-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Star size={14} className="text-age-gold" />
                      </div>
                      <p className="text-sm text-gray-700">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Como Usar */}
            {product.details.how_to_use && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Usar</h2>
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                  <p className="text-sm text-gray-700 leading-relaxed">{product.details.how_to_use}</p>
                </div>
              </div>
            )}

            {/* Composição */}
            {product.details.composition && product.details.composition.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Composição</h2>
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    {product.details.composition.map((item, i) => (
                      <span key={i} className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* FAQ */}
            {product.details.faq && product.details.faq.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Perguntas Frequentes</h2>
                <div className="space-y-3">
                  {product.details.faq.map((item, i) => (
                    <details key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden group">
                      <summary className="px-6 py-4 cursor-pointer text-sm font-bold text-gray-900 hover:bg-gray-50 transition-colors list-none flex items-center justify-between">
                        {item.question}
                        <ChevronRight size={16} className="text-gray-400 transition-transform group-open:rotate-90 shrink-0 ml-4" />
                      </summary>
                      <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
                        {item.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
