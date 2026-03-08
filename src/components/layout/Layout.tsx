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
    // Apenas aviso de debug, sem limpar o que é válido
    if (checkoutUrl) {
      console.log('[Layout] Checkout URL ativa:', checkoutUrl.substring(0, 50) + '...');
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
