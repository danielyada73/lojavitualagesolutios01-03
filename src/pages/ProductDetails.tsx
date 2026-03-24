import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/mock';
import { useCartStore } from '../store/cart';
import { getProductByHandle } from '../lib/shopify';
import { Product } from '../types';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      setLoading(true);
      try {
        let target: Product | null | undefined = null;
        try { target = await getProductByHandle(id); } catch { /* Shopify fail */ }
        if (!target) { target = products.find(p => p.id === id) || null; }
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

  const handleThumbClick = (img: string, idx: number) => {
    setMainImage(img);
    setCurrentSlide(idx);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-age-gold border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <p className="text-gray-500">Produto não encontrado.</p>
    </div>
  );

  const discount = product.discount_percentage || (
    product.original_price 
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : 0
  );

  const reviewRating = product.details?.reviews?.rating || 4.9;
  const reviewCount = product.details?.reviews?.count || 1200;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: Math.max(1, quantity),
      image: product.thumbnail_url
    });
    navigate('/cart');
  };

  const pixPrice = product.price * 0.95;
  const installmentPrice = product.price / 12;

  return (
    <div className="template-product">
      {/* Injeção de Estilos Originais do Cliente para Garantir o Layout Exato */}
      <style>{`
        @import url("//renovabe.com.br/cdn/shop/t/64/assets/base.css?v=59725492481374766101773950102");
        @import url("//renovabe.com.br/cdn/shop/t/64/compiled_assets/styles.css?v=84213709887736644741773950102");
        
        /* Ajuste de Prevenção de Conflito com Tailwind: remove margens globais que travam grid layout */
        .template-product .page-width { max-width: 120rem; margin: 0 auto; padding: 0 1.5rem; }
        .template-product .product { display: grid; grid-template-columns: 1fr; gap: 40px; }
        @media screen and (min-width: 990px) {
          .template-product .product { grid-template-columns: 8fr 5fr; gap: 60px; }
        }
        .template-product .product__media-wrapper { display: block; }
        .template-product .product__info-wrapper { padding-left: 0; }
        .template-product .product__title h1 { margin: 0; font-size: 2.4rem; font-weight: 700; color: #141414; text-transform: uppercase; font-family: Inter, sans-serif; letter-spacing: -1px; line-height: 1.1; margin-bottom: 10px; }
        .template-product .price { margin-bottom: 20px; }
        .template-product .price-item--regular { font-size: 1.4rem; text-decoration: line-through; color: #aaa; margin-bottom: 5px; display: block; }
        .template-product .price-item--sale { font-size: 3.6rem; font-weight: 700; color: #000; display: inline-block; margin-right: 15px; letter-spacing: -1px; }
        .template-product .badge-sale { background-color: #e5fbe9; color: #1f8a70; padding: 4px 10px; border-radius: 4px; font-weight: 700; font-size: 1.2rem; vertical-align: middle; }
        .template-product .installment-info { color: #1f8a70; font-weight: 600; font-size: 1.4rem; margin-top: 5px; }
        .template-product .pix-info { color: #555; font-size: 1.2rem; margin-top: 2px; }
        .template-product .pix-info strong { color: #1f8a70; }
        
        .template-product .product-form__buttons { display: flex; flex-direction: column; gap: 10px; margin-top: 25px; }
        .template-product .cart-submit { background-color: #F8B133; color: white; width: 100%; border: none; padding: 18px; border-radius: 8px; font-size: 1.8rem; font-weight: 700; text-transform: uppercase; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(248, 177, 51, 0.4); }
        .template-product .cart-submit:hover { background-color: #E6A02B; transform: translateY(-2px); }
        .template-product .cart-submit svg { margin-right: 10px; width: 24px; height: 24px; fill: white; }
        
        .template-product .quantity { display: flex; border: 1px solid #ddd; border-radius: 8px; max-width: 150px; height: 50px; overflow: hidden; margin-top: 10px; }
        .template-product .quantity__button { background: white; border: none; width: 50px; cursor: pointer; font-size: 2rem; color: #555; display: flex; align-items: center; justify-content: center; }
        .template-product .quantity__button:hover { background: #f5f5f5; }
        .template-product .quantity__input { width: 50px; border: none; text-align: center; font-size: 1.6rem; font-weight: 700; border-left: 1px solid #ddd; border-right: 1px solid #ddd; }
        .template-product .quantity-label { font-size: 1.2rem; font-weight: 700; color: #555; display: block; margin-bottom: 5px; }

        .template-product .trust-badges { margin-top: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .template-product .trust-badge { display: flex; align-items: center; gap: 10px; background: #f9f9f9; padding: 10px; border-radius: 6px; border: 1px solid #eee; }
        .template-product .trust-badge svg { width: 20px; height: 20px; stroke: #F8B133; fill: none; stroke-width: 2; }
        .template-product .trust-badge span { font-size: 1.1rem; font-weight: 600; color: #333; }
        
        .template-product .frete-gratis-banner { background: #e5fbe9; border: 1px solid #c3e6cb; border-radius: 8px; padding: 15px; margin-top: 20px; display: flex; align-items: center; gap: 15px; }
        .template-product .frete-gratis-banner svg { width: 30px; height: 30px; stroke: #1f8a70; fill: none; stroke-width: 2; }
        .template-product .frete-gratis-banner-text p { margin: 0; font-size: 1.4rem; font-weight: 700; color: #1f8a70; }
        .template-product .frete-gratis-banner-text span { font-size: 1.2rem; color: #1f8a70; }

        .template-product .media-gallery { width: 100%; display: flex; flex-direction: column-reverse; gap: 15px; }
        .template-product .media-gallery__thumbnails { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 5px; }
        .template-product .media-gallery__thumbnail { width: 80px; height: 80px; border-radius: 8px; border: 2px solid transparent; overflow: hidden; cursor: pointer; background: #f5f5f5; flex-shrink: 0; }
        .template-product .media-gallery__thumbnail.active { border-color: #F8B133; }
        .template-product .media-gallery__thumbnail img { width: 100%; height: 100%; object-fit: contain; }
        .template-product .media-gallery__main { width: 100%; background: #f9f9f9; border-radius: 12px; overflow: hidden; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; border: 1px solid #eee; position: relative; }
        .template-product .media-gallery__main img { width: 100%; height: 100%; object-fit: contain; }
        
        .template-product .judgeme-stars { display: flex; align-items: center; gap: 10px; margin-bottom: 15px; }
        .template-product .judgeme-stars .stars { display: flex; }
        .template-product .judgeme-stars .stars svg { width: 16px; height: 16px; fill: #F8B133; stroke: #F8B133; }
        .template-product .judgeme-stars .text { font-size: 1.3rem; color: #888; }
        
        @media screen and (min-width: 990px) {
          .template-product .media-gallery { flex-direction: row; }
          .template-product .media-gallery__thumbnails { flex-direction: column; width: 90px; }
          .template-product .media-gallery__thumbnail { width: 90px; height: 90px; }
        }

        .template-product .accordion { border: 1px solid #eee; border-radius: 8px; margin-top: 15px; overflow: hidden; }
        .template-product .accordion summary { padding: 18px 20px; font-weight: 700; font-size: 1.4rem; background: #fcfcfc; cursor: pointer; display: flex; justify-content: space-between; align-items: center; list-style: none; user-select: none; }
        .template-product .accordion summary::-webkit-details-marker { display: none; }
        .template-product .accordion summary svg { width: 16px; height: 16px; transition: transform 0.3s; }
        .template-product .accordion[open] summary svg { transform: rotate(180deg); }
        .template-product .accordion .accordion__content { padding: 20px; border-top: 1px solid #eee; font-size: 1.4rem; line-height: 1.6; color: #555; background: #fff; }
        
        /* Oculta layout original do site dentro desta pagina para nao conflitar caso haja CSS vazando */
        .template-product select { width: 100%; padding: 12px; border-radius: 6px; border: 1px solid #ccc; font-size: 1.4rem; margin-bottom: 20px; }
      `}</style>

      <main id="MainContent" className="content-for-layout focus-none" role="main" tabIndex={-1}>
        <section className="shopify-section section">
          <div className="color-scheme-1 gradient">
            <div className="page-width py-10">
              
              <div className="product product--large product--left product--stacked product--mobile-sides">
                <div className="grid grid--1-col grid--2-col-tablet">
                  
                  {/* ====== COLUNA ESQUERDA: GALERIA E MÍDIAS ====== */}
                  <div className="grid__item product__media-wrapper">
                    <div className="media-gallery">
                      
                      {/* Thumbnails */}
                      <div className="media-gallery__thumbnails">
                        {allImages.map((img, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => handleThumbClick(img, idx)}
                            className={`media-gallery__thumbnail ${currentSlide === idx ? 'active' : ''}`}
                          >
                            <img src={img} alt={`Imagem ${idx + 1}`} loading="lazy" />
                          </div>
                        ))}
                      </div>

                      {/* Imagem Principal */}
                      <div className="media-gallery__main">
                        <img src={mainImage} alt={product.name} />
                        {discount > 0 && (
                          <div style={{position: 'absolute', top: '20px', left: '20px'}} className="badge-sale">
                            -{discount}% OFF
                          </div>
                        )}
                      </div>

                    </div>

                    <div style={{marginTop: '30px', textAlign: 'center'}}>
                      <img src="https://agesolution.com.br/wp-content/uploads/2023/01/Compra-segura.webp" alt="Compra Segura" style={{maxWidth: '300px', display: 'inline-block'}} />
                    </div>
                  </div>

                  {/* ====== COLUNA DIREITA: INFORMAÇÕES DO PRODUTO ====== */}
                  <div className="product__info-wrapper grid__item">
                    <div className="product__info-container product__info-container--sticky">
                      
                      {/* Título do Produto */}
                      <div className="product__title">
                        <h1>{product.name}</h1>
                      </div>

                      {/* Avaliações */}
                      <div className="judgeme-stars">
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                            </svg>
                          ))}
                        </div>
                        <span className="text">({reviewCount} avaliações)</span>
                      </div>

                      {/* Separador */}
                      <hr style={{border: 'none', borderTop: '1px solid #eee', margin: '20px 0'}} />

                      {/* Preços */}
                      <div className="price price--large price--show-badge">
                        <div className="price__regular">
                          {product.original_price && product.original_price > product.price && (
                            <span className="price-item--regular">
                              De R$ {product.original_price.toFixed(2).replace('.', ',')}
                            </span>
                          )}
                          <div>
                            <span className="price-item--sale">
                              R$ {product.price.toFixed(2).replace('.', ',')}
                            </span>
                            {discount > 0 && <span className="badge-sale">{discount}% OFF</span>}
                          </div>
                          
                          <div className="installment-info">
                            ou 12x de R$ {installmentPrice.toFixed(2).replace('.', ',')} sem juros
                          </div>
                          
                          <div className="pix-info">
                            No PIX com <strong>5% de desconto</strong>: R$ {pixPrice.toFixed(2).replace('.', ',')}
                          </div>
                        </div>
                      </div>

                      {/* Separador */}
                      <hr style={{border: 'none', borderTop: '1px solid #eee', margin: '20px 0'}} />

                      <p style={{fontSize: '1.4rem', color: '#666', marginBottom: '20px'}}>
                        <strong>Sabor:</strong> Cranberry. 60 cápsulas.
                      </p>

                      <div className="product-form">
                        
                        {/* Seletor de Variação (Mockup visual) */}
                        {product.details?.flavors && product.details.flavors.length > 0 && (
                          <div className="product-form__input">
                            <label className="quantity-label">Sabor</label>
                            <select>
                              {product.details.flavors.map((f, i) => (
                                <option key={i} value={f}>{f}</option>
                              ))}
                            </select>
                          </div>
                        )}

                        <div className="product-form__input">
                          <label className="quantity-label">Quantidade</label>
                          <div className="quantity">
                            <button className="quantity__button" name="minus" type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                              −
                            </button>
                            <input className="quantity__input" type="number" name="quantity" value={quantity} readOnly />
                            <button className="quantity__button" name="plus" type="button" onClick={() => setQuantity(quantity + 1)}>
                              +
                            </button>
                          </div>
                        </div>

                        <div className="product-form__buttons">
                          <button 
                            type="button" 
                            className="cart-submit"
                            onClick={handleAddToCart}
                          >
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" clipRule="evenodd" d="M12.0001 2.25C9.9289 2.25 8.24996 3.92893 8.24996 6V7.5H5.44185C4.71714 7.5 4.10301 8.04358 3.96642 8.75621L2.55392 16.1287C2.45781 16.6305 2.59798 17.1517 2.93485 17.5451C3.27173 17.9385 3.76675 18.1583 4.28087 18.1583H8.25V20.25H4.28087C3.12351 20.25 2.00552 19.7497 1.24647 18.8631C0.487413 17.9765 0.165416 16.7909 0.385558 15.6417L1.79806 8.26921C2.10776 6.64969 3.49841 5.40833 5.14441 5.40833H8.24996V6C8.24996 5.08552 8.99548 4.34 9.90996 4.34H14.0901C15.0046 4.34 15.7501 5.08552 15.7501 6V7.5H19.5C20.7426 7.5 21.75 8.50736 21.75 9.75V11.25H23.8417V9.75C23.8417 7.35276 21.8972 5.40833 19.5 5.40833H15.7501V6C15.7501 3.92893 14.0712 2.25 12.0001 2.25ZM20.25 14.25V17.25H23.25V19.5H20.25V22.5H18V19.5H15V17.25H18V14.25H20.25Z" fill="currentColor"/>
                            </svg>
                            <span>Comprar Agora</span>
                          </button>
                        </div>
                        
                        <div className="frete-gratis-banner">
                          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <div className="frete-gratis-banner-text">
                            <p>Frete Grátis para todo o Brasil!</p>
                            <span>Entrega garantida e rastreável</span>
                          </div>
                        </div>

                        {/* Badges de Confiança */}
                        <div className="trust-badges">
                          <div className="trust-badge">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                            <span>Compra 100% Segura</span>
                          </div>
                          <div className="trust-badge">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                            <span>Envio Rápido e Seguro</span>
                          </div>
                          <div className="trust-badge">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                            <span>Dados Criptografados</span>
                          </div>
                          <div className="trust-badge">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
                            <span>Pagamento Facilitado</span>
                          </div>
                        </div>

                      </div>

                      {/* Info Accordions baseados no Shopify Dawn */}
                      <div className="product__accordion">
                        
                        {product.details?.benefits?.items && (
                          <details className="accordion" open>
                            <summary>
                              <span>{product.details.benefits.title || 'Benefícios'}</span>
                              <svg viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1.5L7 6.5L13 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </summary>
                            <div className="accordion__content">
                              <ul style={{paddingLeft: '20px', margin: 0}}>
                                {product.details.benefits.items.map((b, i) => (
                                  <li key={i} style={{marginBottom: '10px'}}>
                                    <strong>{b.title}:</strong> {b.description}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </details>
                        )}

                        {product.details?.main_features?.items && (
                          <details className="accordion">
                            <summary>
                              <span>{product.details.main_features.title || 'Principais Características'}</span>
                              <svg viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1.5L7 6.5L13 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </summary>
                            <div className="accordion__content">
                              <ul style={{paddingLeft: '20px', margin: 0}}>
                                {product.details.main_features.items.map((feat, i) => (
                                  <li key={i} style={{marginBottom: '5px'}}>{feat}</li>
                                ))}
                              </ul>
                            </div>
                          </details>
                        )}

                        {product.details?.how_to_use && (
                          <details className="accordion">
                            <summary>
                              <span>{product.details.how_to_use.title || 'Como Usar'}</span>
                              <svg viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1.5L7 6.5L13 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </summary>
                            <div className="accordion__content">
                              <p style={{marginBottom: '15px'}}>{product.details.how_to_use.description}</p>
                              {product.details.how_to_use.steps && (
                                <ol style={{paddingLeft: '20px', margin: 0}}>
                                  {product.details.how_to_use.steps.map((step, i) => (
                                    <li key={i} style={{marginBottom: '5px'}}>{step}</li>
                                  ))}
                                </ol>
                              )}
                            </div>
                          </details>
                        )}
                        
                        {product.details?.faq && (
                          <details className="accordion">
                            <summary>
                              <span>Dúvidas Frequentes</span>
                              <svg viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1.5L7 6.5L13 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </summary>
                            <div className="accordion__content">
                              {product.details.faq.map((item, i) => (
                                <div key={i} style={{marginBottom: '15px'}}>
                                  <strong>{item.question}</strong>
                                  <p style={{margin: '5px 0 0 0'}}>{item.answer}</p>
                                </div>
                              ))}
                            </div>
                          </details>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </section>
      </main>
      
    </div>
  );
}
