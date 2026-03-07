import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, ProductVariation } from '../types';
import { createCart, addToCart } from '../lib/shopify';

interface CartStore {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  isOpen: boolean;
  isSyncing: boolean;
  addItem: (product: Product, variation?: ProductVariation, quantity?: number) => Promise<void>;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  toggleCart: () => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      checkoutUrl: null,
      isOpen: false,
      isSyncing: false,
      addItem: async (product, variation, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id && (item.variation?.id === variation?.id || (!item.variation && !variation))
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === existingItem.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
              isOpen: true,
            };
          }

          return {
            items: [
              ...state.items,
              {
                id: Math.random().toString(36).substr(2, 9),
                product,
                variation,
                quantity,
              },
            ],
            isOpen: true,
          };
        });

        // Sync with Shopify
        try {
          set({ isSyncing: true });
          const state = get();
          const { cartId } = state;
          const variantId = variation?.id || product.variations?.[0]?.id || product.id;

          if (!cartId || cartId.includes('undefined')) {
            const newCart = await createCart(variantId);
            if (newCart) {
              set({ cartId: newCart.id, checkoutUrl: newCart.checkoutUrl });
            }
          } else {
            const updatedCart = await addToCart(cartId, variantId, quantity);
            if (updatedCart) {
              set({ checkoutUrl: updatedCart.checkoutUrl });
            }
          }
        } catch (error) {
          console.error('Erro ao sincronizar carrinho com Shopify:', error);
        } finally {
          set({ isSyncing: false });
        }
      },
      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },
      updateQuantity: (itemId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        }));
      },
      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },
      clearCart: () => {
        set({ items: [], cartId: null, checkoutUrl: null });
      },
      total: () => {
        const { items } = get();
        return items.reduce((acc, item) => {
          // Usa o preço direto da Shopify se disponível
          const price = item.variation?.price || item.product.price;
          return acc + price * item.quantity;
        }, 0);
      },
    }),
    {
      name: 'cart-storage',
      onRehydrateStorage: () => (state) => {
        // Limpeza de segurança na hidratação
        if (state?.checkoutUrl && (state.checkoutUrl.includes('yampi.com.br') || state.checkoutUrl.includes('undefined'))) {
          state.checkoutUrl = null;
          state.cartId = null;
        }
      },
      partialize: (state) => ({
        items: state.items,
        cartId: state.cartId,
        checkoutUrl: state.checkoutUrl
      }),
    }
  )
);

