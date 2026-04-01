import { useCartStore } from '../../store/cart';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect } from 'react';

export default function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, total, checkoutUrl, isSyncing } = useCartStore();

  useEffect(() => {
    // Limpa apenas URLs legadas se forem da Shopify ou inválidas
    if (checkoutUrl && (checkoutUrl.includes('myshopify.com') || checkoutUrl.includes('undefined'))) {
      console.log('[CartDrawer] Limpando URL legada ou inválida.');
      useCartStore.setState({ checkoutUrl: null, cartId: null });
    }
  }, [checkoutUrl]);

  const handleCheckout = async () => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    } else if (items.length > 0) {
      // Tenta re-sincronizar se o checkoutUrl sumiu mas ainda há itens
      console.log('[CartDrawer] CheckoutUrl ausente, tentando re-sincronizar...');
      await useCartStore.getState().syncCart();
      const newUrl = useCartStore.getState().checkoutUrl;
      if (newUrl) {
        window.location.href = newUrl;
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-black uppercase italic tracking-tighter">Seu Carrinho</h2>
              <button onClick={toggleCart} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                    <Trash2 size={32} className="text-gray-300" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 uppercase italic">Carrinho vazio</p>
                    <p className="text-sm text-gray-500">Adicione produtos para continuar.</p>
                  </div>
                  <button
                    onClick={toggleCart}
                    className="px-8 py-3 bg-black text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-age-gold hover:text-black transition-all"
                  >
                    Ver Produtos
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0">
                      {item.product.thumbnail_url ? (
                        <img
                          src={item.product.thumbnail_url}
                          alt={item.product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">
                          Sem Imagem
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 leading-tight mb-1 truncate">
                        {item.product.name}
                      </h3>
                      {item.variation && (
                        <p className="text-xs text-gray-500 mb-2">{item.variation.name}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 px-2 hover:bg-gray-100 text-gray-500 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 px-2 hover:bg-gray-100 text-gray-500 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-black italic">
                            R$ {((item.variation?.price || item.product.price) * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Subtotal</span>
                  <span className="text-2xl font-black italic">R$ {total().toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={items.length === 0 || isSyncing}
                  className="w-full py-5 bg-black text-white rounded-full font-black uppercase tracking-widest text-sm hover:bg-age-gold hover:text-black transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed shadow-xl shadow-black/10"
                >
                  {isSyncing ? 'Sincronizando...' : 'Finalizar Compra'}
                </button>
              </div>
            )}

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
