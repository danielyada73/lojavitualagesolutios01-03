import { useCartStore } from '../../store/cart';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, total } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={toggleCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold uppercase tracking-wide">Seu Carrinho</h2>
              <button onClick={toggleCart} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">Seu carrinho está vazio.</p>
                  <button
                    onClick={toggleCart}
                    className="text-orange-600 font-medium hover:underline"
                  >
                    Continuar comprando
                  </button>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-4 p-2 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.product.thumbnail_url ? (
                          <img
                            src={item.product.thumbnail_url}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">
                            Sem Imagem
                          </div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-medium text-sm line-clamp-2 mb-1">{item.product.name}</h3>
                          {item.variation && (
                            <p className="text-xs text-gray-500">{item.variation.name}</p>
                          )}
                        </div>

                        <div className="flex items-center justify-end gap-4 mt-2">
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1.5 hover:bg-gray-100 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1.5 hover:bg-gray-100 transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <div className="flex flex-col items-end">
                            <span className="font-bold text-sm text-black">
                              R$ {((item.product.price + (item.variation?.price_modifier || 0)) * item.quantity).toFixed(2)}
                            </span>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors mt-1"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-xl font-bold">R$ {total().toFixed(2)}</span>
                </div>
                <button
                  onClick={async () => {
                    const { checkoutUrl, items } = useCartStore.getState();

                    if (checkoutUrl && !checkoutUrl.includes('shopify.com')) {
                      window.location.href = checkoutUrl;
                    } else if (items.length > 0) {
                      // Tenta regenerar na hora se estiver faltando ou for legado
                      const { generateCheckoutUrl } = await import('../../lib/yampi');
                      const checkoutItems = items.map(item => ({
                        skuId: item.variation?.id || item.product.variations?.[0]?.id || item.product.id,
                        quantity: item.quantity,
                      }));
                      const newUrl = generateCheckoutUrl(checkoutItems);
                      window.location.href = newUrl;
                    } else {
                      alert('Estamos preparando seu checkout, tente novamente em um instante.');
                    }
                  }}
                  className="block w-full bg-black hover:bg-age-gold text-white text-center font-bold uppercase tracking-widest py-4 rounded-full transition-all duration-300 shadow-lg"
                >
                  Finalizar Compra
                </button>
              </div>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
