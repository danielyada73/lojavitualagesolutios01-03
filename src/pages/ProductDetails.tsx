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
  // Catches the characteristic competitor description and puts the user's product description
  const descRegex = /O Firmador Instant.*?da (Renova Be|AGE Solution).*?procedimentos invasivos\./is;
  if (product.description) {
    if (product.description.includes('colageno-description')) {
      // Remove entirely the Firmador specific content for Colágeno
      const firmadorExtraContentRegex = /<h2[^>]*>Por que voc.*?Para quem o Firmador é indicado.*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/is;
      finalHtml = finalHtml.replace(firmadorExtraContentRegex, '');
      // And also replace the first block with the description
      finalHtml = finalHtml.replace(descRegex, product.description);
    } else {
      finalHtml = finalHtml.replace(descRegex, product.description);
    }
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
