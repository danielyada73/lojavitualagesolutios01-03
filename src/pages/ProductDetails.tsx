import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/mock';
import { useCartStore } from '../store/cart';
import { getProductByHandle } from '../lib/shopify';
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
        try { target = await getProductByHandle(id); } catch { /* Shopify fail */ }
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
    const forms = document.querySelectorAll('form[action="/cart/add"]');
    const addToCartBtns = document.querySelectorAll('.product-form__submit, button[name="add"], .product-form__buttons button');

    const handleAdd = (e: Event) => {
      e.preventDefault();
      // Get quantity if selected
      const qtyInput = document.querySelector('input[name="quantity"]') as HTMLInputElement;
      const quantity = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
      
      addItem(product, undefined, quantity);
      navigate('/cart');
    };

    forms.forEach(f => f.addEventListener('submit', handleAdd));
    addToCartBtns.forEach(b => b.addEventListener('click', handleAdd));

    return () => {
      forms.forEach(f => f.removeEventListener('submit', handleAdd));
      addToCartBtns.forEach(b => b.removeEventListener('click', handleAdd));
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
    finalHtml = finalHtml.replace(descRegex, product.description);
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
    // This regex catches all Renova Be product-specific CDN images and replaces them with the current product image
    const cdnRegex = /https?:\/\/renovabe\.com\.br\/cdn\/shop\/files\/[^" ]+\.(jpg|jpeg|png|webp|gif)/gi;
    finalHtml = finalHtml.replace(cdnRegex, product.thumbnail_url);
    const protoRelativeCdnRegex = /\/\/renovabe\.com\.br\/cdn\/shop\/files\/[^" ]+\.(jpg|jpeg|png|webp|gif)/gi;
    finalHtml = finalHtml.replace(protoRelativeCdnRegex, product.thumbnail_url);
  }

  return (
    <div className="template-product">
      <div 
        dangerouslySetInnerHTML={{ __html: finalHtml }} 
      />
    </div>
  );
}
