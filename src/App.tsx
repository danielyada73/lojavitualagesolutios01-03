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

import ScrollToTop from './components/ui/ScrollToTop';

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

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
