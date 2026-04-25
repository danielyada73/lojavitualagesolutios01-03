import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/mock';
import { useCartStore } from '../store/cart';
import { getProductBySlug } from '../lib/yampi';
import { Product } from '../types';

import { RAW_PRODUCT_HTML, RAW_PRODUCT_HEAD_HTML } from '../data/rawProductHtml';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      setLoading(true);
      try {
        let target: Product | null | undefined = null;
        try { 
          // Primeiro tenta pelo Slug exato (ex: cell-ind ou slug da Yampi)
          target = await getProductBySlug(id); 
          
          // Se não achar e for um ID do mockup (ex: cell-ind), tenta buscar pelo nome aproximado na Yampi
          if (!target && products.find(p => p.id === id)) {
            const mockP = products.find(p => p.id === id);
            if (mockP) {
              const searchName = mockP.name.split(' ')[0]; // Pega a primeira palavra (ex: Celluli)
              // Tenta achar na Yampi por esse nome
              const yampiSearch = await getProductBySlug(searchName);
              if (yampiSearch) target = yampiSearch;
            }
          }
        } catch { /* Yampi fail */ }
        
        // Fallback apenas se a Yampi realmente não tiver nada
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

  useEffect(() => {
    if (!product || loading) return;

    // Attach listener to any "Add to Cart" or form submit button
    // Broader selectors to catch all possible buy buttons in the raw HTML template
    const forms = document.querySelectorAll('form[action="/cart/add"], form[action*="cart"]');
    const addToCartBtns = document.querySelectorAll(
      '.product-form__submit, button[name="add"], .product-form__buttons button, ' +
      '.add-to-cart, [data-add-to-cart], button.button--primary, ' +
      'button[type="submit"], .kb-main-buy-btn, .kit-builder__buy-button, ' +
      '.kb-cta, .kit-buy-btn, .buy-now-btn, .comprar-agora'
    );

    const handleAdd = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Get quantity from standard input
      const qtyInput = document.querySelector('input[name="quantity"]') as HTMLInputElement;
      let quantity = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
      
      // Determine variant from standard Shopify hidden inputs or checked radios
      let variantToSelect = product.variations?.[0] || undefined;
      const selectedIdInput = document.querySelector('input[name="id"]:checked, select[name="id"]') as HTMLInputElement | HTMLSelectElement;
      
      if (selectedIdInput) {
        if (selectedIdInput.value) {
          const found = product.variations?.find(v => v.id === selectedIdInput.value);
          if (found) variantToSelect = found;
        }
        
        // Se a lógica do concorrente usa um 'Kits' radio, vamos sugar a "Quantidade" pelo texto
        const labelText = selectedIdInput.closest('label, .kit-option, .product-form__input')?.textContent || '';
        const match = labelText.match(/(\d+)\s*unidade/i);
        if (match) {
          quantity = parseInt(match[1]);
        }
      }
      
      addItem(product, variantToSelect, quantity);

      // Tenta abrir o carrinho
      const cartBtn = document.querySelector('[aria-controls="cart-drawer"], [data-drawer="cart"], .header__icon--cart') as HTMLButtonElement | null;
      if (cartBtn) cartBtn.click();
    };

    const handlePlus = (e: Event) => {
      e.preventDefault();
      const qtyInput = document.querySelector('input[name="quantity"]') as HTMLInputElement;
      if (qtyInput) qtyInput.value = (parseInt(qtyInput.value) || 1) + 1 + '';
    };

    const handleMinus = (e: Event) => {
      e.preventDefault();
      const qtyInput = document.querySelector('input[name="quantity"]') as HTMLInputElement;
      if (qtyInput && parseInt(qtyInput.value) > 1) qtyInput.value = (parseInt(qtyInput.value) - 1) + '';
    };

    const plusBtns = document.querySelectorAll('button[name="plus"], .quantity__button[name="plus"]');
    const minusBtns = document.querySelectorAll('button[name="minus"], .quantity__button[name="minus"]');
    plusBtns.forEach(btn => btn.addEventListener('click', handlePlus));
    minusBtns.forEach(btn => btn.addEventListener('click', handleMinus));

    forms.forEach(f => f.addEventListener('submit', handleAdd));
    addToCartBtns.forEach(b => b.addEventListener('click', handleAdd));

    // Also capture any button with "Comprar" text that wasn't matched by selectors
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(btn => {
      const text = btn.textContent?.toLowerCase() || '';
      if (text.includes('comprar') || text.includes('adicionar') || text.includes('add to cart')) {
        btn.addEventListener('click', handleAdd);
      }
    });

    return () => {
      forms.forEach(f => f.removeEventListener('submit', handleAdd));
      addToCartBtns.forEach(b => b.removeEventListener('click', handleAdd));
      allButtons.forEach(btn => btn.removeEventListener('click', handleAdd));
      plusBtns.forEach(btn => btn.removeEventListener('click', handlePlus));
      minusBtns.forEach(btn => btn.removeEventListener('click', handleMinus));
    };
  }, [product, loading, addItem, navigate]);

  // DOM manipulation image replacement removed.
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-age-gold border-t-transparent rounded-full animate-spin" />
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
  
  const pixPrice = product.price * 0.95;
  const installmentPrice = product.price / 12;

  // Replacements in raw HTML:
  let finalHtml = RAW_PRODUCT_HEAD_HTML + RAW_PRODUCT_HTML;
  
  // 1. Replace Product Name (global)
  // Replaces the specific competitor product name everywhere
  finalHtml = finalHtml.replace(/Botox Firmador Instant[^\s]* - FaceLifting PRO/g, product.name);
  
  // 2. Replace Brand Name
  finalHtml = finalHtml.replace(/Renova Be/g, 'AGE Solution');
  
  // 3. Replace Main Description
  // Agora buscamos exatamente as divs reais para evitar que o replace quebre o JSON das propriedades da Yampi/Shopify
  const descRegex = /<div class="ql-block"[^>]*>O Firmador Instant.*?da (Renova Be|AGE Solution).*?procedimentos invasivos\.<\/div>/is;
  
  const isColageno = product.id.startsWith('col-') || product.name.toLowerCase().includes('colágeno') || product.name.toLowerCase().includes('colageno') || product.id === '137428494';

  if (isColageno) {
      const colagenoHtml = `
      <div class="colageno-description" style="padding: 20px 0; font-family: var(--font-body--family);">
        <h2 style="color: #c9a15c; font-size: 24px; margin-bottom: 10px;">Tratamento anti-idade</h2>
        <h3 style="font-size: 18px; margin-bottom: 20px; font-weight: bold; line-height: 1.4;">TENHA UMA PELE MAIS JOVEM, SEM RUGAS E SEM LINHA DE EXPRESSÃO! RENOVE SUA PELE COM O COLÁGENO MAIS EFICAZ DO BRASIL!</h3>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h3 style="color: #c9a15c; font-size: 20px; margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">VANTAGENS E BENEFÍCIOS</h3>
          <ul style="list-style-type: none; padding: 0;">
            <li style="margin-bottom: 15px;">
              <strong style="font-size: 16px;">Ácido hialurônico 50mg</strong><br>
              <span style="color: #555;">Contribui para a elasticidade e resistência da pele, para a saúde das unhas e cabelos e é responsável por constituir as fibras que sustentam os tecidos do corpo - como ossos, músculos, tendões e articulações.</span>
            </li>
            <li style="margin-bottom: 15px;">
              <strong style="font-size: 16px;">PROTEÍNA 10g</strong><br>
              <span style="color: #555;">Proteínas são componentes essenciais para as células e estão presentes em quase todas as funções fisiológicas do nosso corpo. As proteínas são capazes de regenerar tecidos, além de desempenhar um papel muito importante no sistema imunológico e serem fundamentais no processo de desenvolvimento e reprodução.</span>
            </li>
            <li style="margin-bottom: 15px;">
              <strong style="font-size: 16px;">Vitamina B6, C e E</strong><br>
              <span style="color: #555;">É um antioxidante forte e eficaz que beneficia a luminosidade da pele, deixando-a mais viçosa, bonita e com aparência saudável.</span>
            </li>
            <li style="margin-bottom: 15px;">
              <strong style="font-size: 16px;">Zinco</strong><br>
              <span style="color: #555;">O zinco atua como um antioxidante fundamental para o sistema de defesa da pele; diminui a formação de radicais livres e protege as células produtoras de colágeno e as gorduras da pele. O zinco também ajuda a curar e rejuvenescer a pele. Isso porque, se existe algum corte na pele a quantidade desse mineral ao redor do corte aumenta a fim de proteger contra infecções e controlar a inflamação.</span>
            </li>
          </ul>
        </div>

        <div style="text-align: center; margin-bottom: 30px; font-weight: bold; background-color: #fff8e1; padding: 20px; border-radius: 8px;">
          <p style="font-size: 18px; color: #c9a15c; margin-bottom: 10px;">Você vai precisar de apenas 1 Scoop por dia!</p>
          <p style="color: #444;">O consumo é indicado sempre após a refeição.<br>Podendo ser após seu café da manhã ou após o almoço.</p>
        </div>

        <h3 style="color: #c9a15c; font-size: 20px; margin-bottom: 15px; text-align: center;">PRECISA DE AJUDA?</h3>
        <h4 style="font-size: 18px; margin-bottom: 10px;">Perguntas Frequentes</h4>
        <p style="margin-bottom: 20px; color: #666;">Abaixo você encontra as principais dúvidas sobre o melhor colágeno do Brasil.</p>
        
        <div style="margin-bottom: 20px;">
          <strong style="color: #333;">Em quanto tempo começa a aparecer os resultados?</strong><br>
          <span style="color: #555;">A maioria dos estudos demonstram que os resultados são visíveis a partir de 8 semanas, mas começam a ser notados a partir de 4 semanas. Resultados podem variar de organismo para organismo.</span>
        </div>
        <div style="margin-bottom: 20px;">
          <strong style="color: #333;">Como devo tomar?</strong><br>
          <span style="color: #555;">Misture 1 colher de sopa (aprox.12g) em 150ml de água, consumir uma vez ao dia.</span>
        </div>
        <div style="margin-bottom: 20px;">
          <strong style="color: #333;">Qual o prazo de entrega?</strong><br>
          <span style="color: #555;">Em média despachamos o produto em até 24hs após comprovação do pagamento. Utilizamos a transportadora Kangu para agilizar a entrega:<br>
          Região Sudeste – de 1 a 8 dias úteis<br>
          Região Sul – de 1 a 9 dias úteis<br>
          Região Centro-Oeste – de 1 a 10 dias úteis<br>
          Região Nordeste – de 2 a 14 dias úteis<br>
          Região Norte – de 3 a 15 dias úteis</span>
        </div>
        <div style="margin-bottom: 20px;">
          <strong style="color: #333;">Contém alguma contraindicação?</strong><br>
          <span style="color: #555;">Gestantes, nutrizes, lactantes e crianças (até 3 anos) somente devem consumir este produto sob orientação de nutricionistas ou médicos. Não exceder a recomendação diária de consumo.</span>
        </div>
        <div style="margin-bottom: 20px;">
          <strong style="color: #333;">Os ingredientes são naturais?</strong><br>
          <span style="color: #555;">Sim, Priorizamos sempre a qualidade! Por isso não utilizamos corantes artificiais, malto e nem conservantes!</span>
        </div>
      </div>
      `;

      finalHtml = finalHtml.replace(descRegex, colagenoHtml);

      // Remove sections extras (FAQ, Reviews, Por que precisa) do Firmador de forma SEGURA usando CSS
      // Assim o React não se perde com tags HTML não fechadas.
      finalHtml += `
        <style>
          /* Esconde TODAS as seções da página exceto a principal do produto */
          div.shopify-section:not(#shopify-section-template--18579175112775__main) {
             display: none !important;
          }
        </style>
      `;

      // Adiciona CSS para esconder miniaturas extras se houver apenas 1 foto
      const totalImages = product.images?.length || (product.thumbnail_url ? 1 : 0);
      if (totalImages === 1) {
         finalHtml += `
            <style>
              .product__media-list li:nth-child(n+2),
              .thumbnail-list li:nth-child(n+2),
              slider-component li:nth-child(n+2),
              media-gallery li:nth-child(n+2),
              .slider-buttons {
                display: none !important;
              }
            </style>
         `;
      }
      
  } else if (product.description) {
      finalHtml = finalHtml.replace(descRegex, `<div class="ql-block">` + product.description + `</div>`);
  }

  // 4. Replace Prices (global)
  finalHtml = finalHtml.replace(/79,90/g, product.price.toFixed(2).replace('.', ','));
  if (product.original_price) {
    finalHtml = finalHtml.replace(/159,90/g, product.original_price.toFixed(2).replace('.', ','));
  }
  finalHtml = finalHtml.replace(/50% OFF/g, `${discount}% OFF`);
  
  // 5. Replace installments if found
  finalHtml = finalHtml.replace(/6,66/g, installmentPrice.toFixed(2).replace('.', ','));
  
  // 6. Replace image URL (main and gallery)
  // Como as seções extras estão escondidas via CSS, isso só vai afetar as imagens visíveis da galeria!
  if (product.thumbnail_url) {
    const images = product.images?.length ? product.images : [product.thumbnail_url];
    let imgIndex = 0;
    
    const protoRelativeCdnRegex = /\/\/renovabe\.com\.br\/cdn\/shop\/files\/[^" ]+\.(jpg|jpeg|png|webp|gif)/gi;
    finalHtml = finalHtml.replace(protoRelativeCdnRegex, (match) => {
      const img = images[imgIndex % images.length];
      imgIndex++;
      return img;
    });
  }

  return (
    <div className="template-product">
      <div 
        dangerouslySetInnerHTML={{ __html: finalHtml }} 
      />
    </div>
  );
}
