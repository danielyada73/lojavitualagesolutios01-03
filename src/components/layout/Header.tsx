import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, User, ChevronRight } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { useCartStore } from '../../store/cart';
import { getAllProducts } from '../../lib/shopify';
import { Product } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const cartItems = useCartStore((state) => state.items);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadAll() {
      const prods = await getAllProducts(50);
      if (prods) setAllProducts(prods);
    }
    loadAll();
  }, []);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return allProducts.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);
  }, [searchQuery, allProducts]);

  const navLinks = [
    { name: 'COLÁGENO', path: '/category/colageno-po' },
    { name: 'CREATINA', path: '/category/creatina' },
    { name: 'COENZIMA', path: '/category/coenzima' },
    { name: 'ÔMEGA 3', path: '/category/omega-3' },
    { name: 'CELLULI', path: '/category/celluli' },
    { name: 'KITS', path: '/category/kits' },
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* 1. Announcement Bar Premium */}
      <div className="bg-age-gold text-black text-[10px] font-black uppercase tracking-[0.2em] py-2.5 overflow-hidden border-b border-black/5">
        <div className="flex animate-marquee whitespace-nowrap">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center mx-8 gap-8">
              <span>🚚 FRETE GRÁTIS ACIMA DE R$49</span>
              <span className="w-1.5 h-1.5 rounded-full bg-black/20" />
              <span>🚀 ENVIO EM 24H (SP)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-black/20" />
              <span>💳 12X SEM JUROS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-black/20" />
            </div>
          ))}
        </div>
      </div>

      {/* 2. Main Header Glass */}
      <div className="bg-black/95 backdrop-blur-md text-white py-5 border-b border-white/5">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between">
            
            {/* Mobile Menu Trigger */}
            <button 
              className="lg:hidden w-12 h-12 flex items-center justify-center rounded-full border border-white/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Logo Premium */}
            <Link to="/" className="hover:scale-105 transition-transform duration-500">
              <img
                src="https://agesolution.com.br/wp-content/uploads/2023/01/age-2-e1752779329574-1024x487.png"
                alt="Age Solutions"
                className="h-8 md:h-11 w-auto brightness-0 invert"
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-[11px] font-black tracking-[0.1em] hover:text-age-gold transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-age-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3 md:gap-5">
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-white/10 hover:bg-white/5 transition-colors"
              >
                <Search size={18} />
              </button>

              <Link 
                to="/auth" 
                className="hidden md:flex w-12 h-12 items-center justify-center rounded-full border border-white/10 hover:bg-white/5 transition-colors"
              >
                <User size={18} />
              </Link>

              <button
                onClick={toggleCart}
                className="group flex items-center gap-3 bg-age-gold text-white px-5 py-3 md:px-6 md:py-3.5 rounded-full shadow-lg shadow-age-gold/20 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <ShoppingCart size={18} strokeWidth={2.5} />
                <span className="font-black text-xs">{cartCount}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Overlay Dynamic */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-8">
              <div className="max-w-3xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="O que você está procurando?"
                    className="w-full text-2xl md:text-3xl font-black p-0 border-none focus:ring-0 placeholder:text-gray-200 text-age-dark"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button onClick={() => setIsSearchOpen(false)} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-age-dark">
                    <X size={32} />
                  </button>
                </div>
                
                {searchQuery && (
                  <div className="mt-8 grid gap-4">
                    {filteredProducts.map(product => (
                      <button
                        key={product.id}
                        onClick={() => {
                          navigate(`/product/${product.id}`);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center justify-between p-4 rounded-3xl hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex items-center gap-6">
                          <img src={product.thumbnail_url} className="w-16 h-16 object-contain" />
                          <div>
                            <p className="font-black text-age-dark uppercase tracking-tight">{product.name}</p>
                            <p className="text-age-gold font-bold">R$ {product.price.toFixed(2)}</p>
                          </div>
                        </div>
                        <ChevronRight className="text-gray-200 group-hover:text-age-gold group-hover:translate-x-2 transition-all" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
