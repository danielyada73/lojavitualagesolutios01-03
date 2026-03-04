import { useCartStore } from '../store/cart';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, CreditCard, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function Checkout() {
  const { items, removeItem, total, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  const handleCheckout = () => {
    setIsProcessing(true);
    // Mock payment processing
    setTimeout(() => {
      clearCart();
      navigate('/account'); // Redirect to orders page (mocked as account)
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Seu carrinho está vazio</h1>
        <Link to="/" className="text-orange-600 hover:underline">Voltar para a loja</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 uppercase italic tracking-tight">Finalizar Compra</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Order Summary */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <CheckCircle className="text-green-500" />
              Revisão do Pedido
            </h2>
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                  <div className="w-24 h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={item.product.thumbnail_url} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{item.product.name}</h3>
                        {item.variation && (
                          <p className="text-sm text-gray-500">{item.variation.name}</p>
                        )}
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="flex justify-between items-end mt-4">
                      <span className="text-sm text-gray-600">Qtd: {item.quantity}</span>
                      <span className="font-bold text-lg">
                        R$ {((item.product.price + (item.variation?.price_modifier || 0)) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <CreditCard className="text-orange-500" />
              Pagamento
            </h2>
            
            <div className="space-y-4">
              <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'credit_card' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="credit_card"
                  checked={paymentMethod === 'credit_card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-3 font-medium">Cartão de Crédito</span>
              </label>
              
              <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'pix' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="pix"
                  checked={paymentMethod === 'pix'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-3 font-medium">Pix (5% de desconto)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Order Total */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Resumo</h2>
            
            <div className="space-y-3 text-sm text-gray-600 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>R$ {total().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete</span>
                <span className="text-green-600">Grátis</span>
              </div>
              {paymentMethod === 'pix' && (
                <div className="flex justify-between text-green-600">
                  <span>Desconto Pix (5%)</span>
                  <span>- R$ {(total() * 0.05).toFixed(2)}</span>
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex justify-between items-end">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-2xl text-orange-600">
                  R$ {(paymentMethod === 'pix' ? total() * 0.95 : total()).toFixed(2)}
                </span>
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full bg-green-600 text-white font-bold uppercase tracking-wide py-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processando...' : 'Finalizar Pedido'}
            </button>
            
            <p className="text-xs text-center text-gray-400 mt-4">
              Ambiente 100% seguro. Seus dados estão protegidos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
