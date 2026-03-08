import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, User } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { useCartStore } from '../../store/cart';
import { getAllProducts } from '../../lib/yampi';
import { Product } from '../../types';

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
      setAllProducts(prods);
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

  const handleSearchSelect = (productId: string) => {
    const product = allProducts.find(p => p.id === productId);
    if (product?.handle) {
      navigate(`/product/${product.handle}`);
    } else {
      navigate(`/product/${productId}`);
    }
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const navLinks = [
    { name: 'COLÁGENO', path: '/category/colageno-po' },
    { name: 'CREATINA', path: '/category/creatina' },
    { name: 'COENZIMA', path: '/category/coenzima' },
    { name: 'ÔMEGA 3', path: '/category/omega-3' },
    { name: 'CELLULI', path: '/category/celluli' },
    { name: 'KITS PROMOCIONAIS', path: '/category/kits' },
  ];

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      {/* 1. Announcement Bar (Gold Background, Black Text, Marquee) */}
      <div className="bg-age-gold text-black text-[10px] md:text-xs py-2 overflow-hidden whitespace-nowrap border-b border-black/5 font-black uppercase tracking-tighter">
        <div className="inline-flex animate-marquee">
          {[1, 2, 3].map((i) => (
            <span key={i} className="mx-4 flex items-center gap-4">
              <span>🚚 FRETE GRÁTIS EM COMPRAS A PARTIR DE R$49,90</span>
              <span className="opacity-20">•</span>
              <span>🚀 ENVIO EM 24H PARA REGIÕES DE SÃO PAULO</span>
              <span className="opacity-20">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* 2. Main Header (Black Background, White Text) */}
      <div className="bg-black text-white py-4 border-b border-gray-800 relative">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4">

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center h-full">
              <img
                src="https://agesolution.com.br/wp-content/uploads/2023/01/age-2-e1752779329574-1024x487.png"
                alt="Age Solutions"
                className="max-h-[35px] md:max-h-[45px] w-auto object-contain block"
              />
            </Link>

            {/* Desktop Navigation (Centered) */}
            <nav className="hidden lg:flex items-center gap-6 text-xs font-bold uppercase tracking-wide">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-white hover:text-age-gold transition-colors whitespace-nowrap no-underline"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Actions (Right) */}
            <div className="flex items-center gap-4 md:gap-6">
              <div className="relative">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="text-white hover:text-age-gold transition-colors"
                >
                  <Search size={20} />
                </button>
                {isSearchOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-xl p-2 z-50">
                    <input
                      type="text"
                      placeholder="Buscar produtos..."
                      className="w-full px-3 py-2 text-black text-sm border border-gray-200 rounded-md focus:outline-none focus:border-age-gold"
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <div className="mt-2 max-h-60 overflow-y-auto">
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map(product => (
                            <button
                              key={product.id}
                              onClick={() => handleSearchSelect(product.id)}
                              className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-3 rounded-md group"
                            >
                              <img src={product.thumbnail_url} alt={product.name} className="w-10 h-10 object-cover rounded" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 group-hover:text-age-gold line-clamp-1">{product.name}</p>
                                <p className="text-xs text-gray-500">R$ {product.price.toFixed(2).replace('.', ',')}</p>
                              </div>
                            </button>
                          ))
                        ) : (
                          <p className="text-xs text-gray-500 px-3 py-2 text-center">Nenhum produto encontrado.</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Link to="/auth" className="text-white hover:text-age-gold transition-colors">
                <User size={20} />
              </Link>

              <button
                onClick={toggleCart}
                className="relative text-white hover:text-age-gold transition-colors group flex items-center gap-2"
              >
                <ShoppingCart size={20} />
                <span className="hidden md:inline font-bold">({cartCount})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="lg:hidden bg-neutral-900 border-t border-neutral-800 absolute w-full left-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <ul className="space-y-4 text-white text-sm font-medium uppercase">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="block hover:text-age-gold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}
    </header>
  );
}
