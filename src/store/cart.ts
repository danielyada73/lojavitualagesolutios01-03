import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, ProductVariation } from '../types';
import { createCheckout, addToCheckout } from '../lib/yampi';

interface CartStore {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  isOpen: boolean;
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
      addItem: async (product, variation, quantity = 1) => {
        // 1. Atualiza o estado local imediatamente para UX rápida
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id && item.variation?.id === variation?.id
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

        // 2. Sincroniza com Yampi em background (gera checkout URL)
        try {
          const { cartId, items } = get();
          const targetVariantId = variation?.id || product.variations?.[0]?.id;

          if (!targetVariantId) return;

          // Coleta todos os itens do carrinho para gerar a URL de checkout
          const checkoutItems = items.map(item => ({
            skuId: item.variation?.id || item.product.variations?.[0]?.id || item.product.id,
            quantity: item.quantity,
          }));

          if (!cartId) {
            const newCheckout = await createCheckout(targetVariantId, quantity);
            if (newCheckout) {
              set({ cartId: newCheckout.id, checkoutUrl: newCheckout.checkoutUrl });
            }
          } else {
            const updatedCheckout = await addToCheckout(
              cartId,
              targetVariantId,
              quantity,
              checkoutItems
            );
            if (updatedCheckout) {
              set({ checkoutUrl: updatedCheckout.checkoutUrl });
            }
          }
        } catch (error) {
          console.error('Erro ao sincronizar carrinho com Yampi:', error);
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
          const price = item.product.price + (item.variation?.price_modifier || 0);
          return acc + price * item.quantity;
        }, 0);
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        cartId: state.cartId,
        checkoutUrl: state.checkoutUrl
      }),
    }
  )
);

