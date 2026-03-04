import Header from './Header';
import Footer from './Footer';
import CartDrawer from '../cart/CartDrawer';
import CookieBanner from './CookieBanner';
import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useCartStore } from '../../store/cart';

export default function Layout() {
  const { checkoutUrl, clearCart } = useCartStore();

  useEffect(() => {
    // Garante que links legados do Shopify sejam invalidados após o carregamento
    if (checkoutUrl?.includes('shopify.com')) {
      console.log('[Layout] Detectada URL legada do Shopify. Limpando carrinho para evitar erro.');
      // Opcional: apenas limpa a URL se o carrinho tiver itens que podem ser resincronizados
      // Mas para segurança máxima, limpamos o ID e a URL
      useCartStore.setState({ checkoutUrl: null, cartId: null });
    }
  }, [checkoutUrl]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <CookieBanner />
    </div>
  );
}
