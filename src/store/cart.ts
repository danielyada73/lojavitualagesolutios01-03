import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, ProductVariation } from '../types';
import { createCheckout, addToCheckout } from '../lib/yampi';

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
  syncCart: () => Promise<void>;
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

        // Sync with Yampi
        try {
          set({ isSyncing: true });
          const state = get();
          const { cartId, items } = state;
          
          // Encontra o SKU ID ou Token para a Yampi. 
          // Se houver variação, assume ela. Caso contrário, tenta a primeira variação do produto.
          const skuId = variation?.id || product.variations?.[0]?.id || product.id;

          if (!cartId) {
            const newCheckout = await createCheckout(skuId, quantity);
            if (newCheckout) {
              set({ cartId: newCheckout.id, checkoutUrl: newCheckout.checkoutUrl });
            }
          } else {
            // Prepara lista de itens existentes para adicionar o novo
            const existingItems = items
              .filter(i => i.product.id !== product.id || (i.variation?.id !== (variation?.id || product.variations?.[0]?.id)))
              .map(i => ({
                skuId: i.variation?.id || i.product.variations?.[0]?.id || i.product.id,
                quantity: i.quantity
              }));

            const updatedCheckout = await addToCheckout(cartId, skuId, quantity, existingItems);
            if (updatedCheckout) {
              set({ checkoutUrl: updatedCheckout.checkoutUrl });
            }
          }
        } catch (error) {
          console.error('Erro ao sincronizar carrinho com Yampi:', error);
        } finally {
          set({ isSyncing: false });
        }
      },
      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
        
        if (get().items.length === 0) {
          get().clearCart();
        } else {
          get().syncCart();
        }
      },
      updateQuantity: (itemId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        }));
        get().syncCart();
      },
      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },
      clearCart: () => {
        set({ items: [], cartId: null, checkoutUrl: null });
      },
      syncCart: async () => {
        const { items } = get();
        if (items.length === 0) return;

        try {
          set({ isSyncing: true });

          // Cria um novo checkout com todos os itens atuais
          const checkoutItems = items.map(item => ({
            skuId: item.variation?.id || item.product.variations?.[0]?.id || item.product.id,
            quantity: item.quantity
          }));

          const first = checkoutItems[0];
          const rest = checkoutItems.slice(1);

          let result = await createCheckout(first.skuId, first.quantity);
          if (result) {
            for (const item of rest) {
              result = await addToCheckout(result.id, item.skuId, item.quantity, [
                { skuId: first.skuId, quantity: first.quantity },
                ...rest.slice(0, rest.indexOf(item))
              ]);
            }
            set({ cartId: result?.id || null, checkoutUrl: result?.checkoutUrl || null });
          }
        } catch (error) {
          console.error('[CartStore] Erro ao sincronizar carrinho:', error);
        } finally {
          set({ isSyncing: false });
        }
      },
      total: () => {
        const { items } = get();
        return items.reduce((acc, item) => {
          const price = item.variation?.price || item.product.price;
          return acc + price * item.quantity;
        }, 0);
      },
    }),
    {
      name: 'cart-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.checkoutUrl && state.checkoutUrl.includes('undefined')) {
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

