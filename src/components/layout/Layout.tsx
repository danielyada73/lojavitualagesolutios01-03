import Header from './Header';
import Footer from './Footer';
import CartDrawer from '../cart/CartDrawer';
import CookieBanner from './CookieBanner';
import { Outlet } from 'react-router-dom';

export default function Layout() {
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
