import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Category from './pages/Category';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import Account from './pages/Account';
import Kits from './pages/Kits';
import ShippingPolicy from './pages/ShippingPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import AboutUs from './pages/AboutUs';
import PaymentMethods from './pages/PaymentMethods';

import ScrollToTop from '@/components/ui/ScrollToTop';

// Dashboard Imports
import AppLayoutDashboard from './dashboard/components/Layout/AppLayout';
import Dashboard from './dashboard/pages/Dashboard';
import Catalog from './dashboard/pages/Catalog';
import Orders from './dashboard/pages/Orders';
import Stock from './dashboard/pages/Stock';
import Metrics from './dashboard/pages/Metrics';
import Pricing from './dashboard/pages/Pricing';
import Logistics from './dashboard/pages/Logistics';
import Ads from './dashboard/pages/Ads';
import Settings from './dashboard/pages/Settings';
import Integrations from './dashboard/pages/Integrations';
import OAuthML from './dashboard/pages/OAuthML';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}>
      <ScrollToTop />

      {/* Botão flutuante do WhatsApp */}
      <a
        href="https://api.whatsapp.com/send/?phone=5511947928227&text=Ol%C3%A1%2C%20acabei%20de%20ver%20a%20loja%20de%20voc%C3%AAs%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20os%20produtos!&type=phone_number&app_absent=0"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300"
        aria-label="Fale conosco no WhatsApp"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      <Routes>
        {/* Loja Pública */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="auth" element={<Auth />} />
          <Route path="category/:slug" element={<Category />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="account" element={<Account />} />
          <Route path="kits" element={<Kits />} />
          <Route path="promocoes" element={<Kits />} />
          <Route path="shipping-policy" element={<ShippingPolicy />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<TermsConditions />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="payment-methods" element={<PaymentMethods />} />
        </Route>

        {/* Dashboard Administrativo */}
        <Route path="/admin" element={<AppLayoutDashboard />}>
          <Route index element={<Dashboard />} />
          <Route path="catalog" element={<Catalog />} />
          <Route path="orders" element={<Orders />} />
          <Route path="stock" element={<Stock />} />
          <Route path="metrics" element={<Metrics />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="logistics" element={<Logistics />} />
          <Route path="ads" element={<Ads />} />
          <Route path="settings" element={<Settings />} />
          <Route path="integrations" element={<Integrations />} />
          <Route path="auth/ml" element={<OAuthML />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
