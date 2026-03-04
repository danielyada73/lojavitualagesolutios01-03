import { useState, useEffect } from 'react';
import { Package, MapPin, Edit2, LogOut, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { getCustomer } from '../lib/yampi';

export default function Account() {
  const [activeTab, setActiveTab] = useState('orders');
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadCustomerData() {
      const token = localStorage.getItem('customerAccessToken');
      if (!token) {
        navigate('/auth');
        return;
      }

      try {
        const data = await getCustomer(token);
        if (data) {
          setCustomer(data);
        } else {
          // Token expirado ou inválido
          localStorage.removeItem('customerAccessToken');
          navigate('/auth');
        }
      } catch (error) {
        console.error('Error loading customer:', error);
      } finally {
        setLoading(false);
      }
    }

    loadCustomerData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('customerAccessToken');
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-8 h-8 text-age-gold animate-spin" />
      </div>
    );
  }

  const orders = customer?.orders?.edges?.map((edge: any) => ({
    id: edge.node.orderNumber,
    date: new Date(edge.node.processedAt).toLocaleDateString('pt-BR'),
    total: parseFloat(edge.node.totalPriceV2.amount),
    status: edge.node.fulfillmentStatus === 'FULFILLED' ? 'Entregue' : 'Em Processamento',
    items: edge.node.lineItems.edges.map((e: any) => e.node.title)
  })) || [];

  const initials = `${customer?.firstName?.charAt(0) || ''}${customer?.lastName?.charAt(0) || ''}`.toUpperCase();

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-neutral-900/50 backdrop-blur-md p-6 rounded-[30px] border border-white/10 shadow-2xl">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
              <div className="w-12 h-12 bg-age-gold rounded-full flex items-center justify-center text-black font-black text-xl">
                {initials || 'AS'}
              </div>
              <div className="overflow-hidden">
                <h2 className="font-black text-white uppercase italic tracking-tighter truncate">
                  {customer?.firstName} {customer?.lastName}
                </h2>
                <p className="text-xs text-gray-500 truncate">{customer?.email}</p>
              </div>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black uppercase italic tracking-tighter transition-all ${activeTab === 'orders'
                  ? 'bg-age-gold text-black'
                  : 'text-gray-400 hover:bg-white/5'
                  }`}
              >
                <Package size={18} />
                Meus Pedidos
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black uppercase italic tracking-tighter transition-all ${activeTab === 'profile'
                  ? 'bg-age-gold text-black'
                  : 'text-gray-400 hover:bg-white/5'
                  }`}
              >
                <Edit2 size={18} />
                Dados Pessoais
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black uppercase italic tracking-tighter text-red-500 hover:bg-red-500/10 transition-all mt-8"
              >
                <LogOut size={18} />
                Sair
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-8">Meus Pedidos</h2>
              {orders.length > 0 ? (
                orders.map((order: any) => (
                  <div key={order.id} className="bg-neutral-900/50 backdrop-blur-md p-6 rounded-[30px] border border-white/10 shadow-2xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                      <div>
                        <span className="text-sm text-age-gold font-bold block">Pedido #{order.id}</span>
                        <span className="text-xs text-gray-500 block">{order.date}</span>
                      </div>
                      <div className={`mt-2 md:mt-0 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'Entregue' ? 'bg-green-500/10 text-green-500' : 'bg-age-gold/10 text-age-gold'
                        }`}>
                        {order.status}
                      </div>
                    </div>
                    <div className="border-t border-white/5 pt-4">
                      <p className="text-sm text-gray-400 mb-2">
                        <span className="text-gray-500">Itens:</span> {order.items.join(', ')}
                      </p>
                      <p className="font-black text-xl text-white italic tracking-tighter">Total: R$ {order.total.toFixed(2).replace('.', ',')}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-neutral-900/50 backdrop-blur-md p-10 rounded-[30px] border border-white/10 text-center">
                  <Package className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-500 font-bold">Você ainda não possui pedidos.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-8">Dados Pessoais</h2>
              <div className="bg-neutral-900/50 backdrop-blur-md p-8 rounded-[30px] border border-white/10 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Primeiro Nome</label>
                    <div className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white font-bold">
                      {customer?.firstName}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Sobrenome</label>
                    <div className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white font-bold">
                      {customer?.lastName}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">E-mail</label>
                    <div className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white font-bold">
                      {customer?.email}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Telefone</label>
                    <div className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white font-bold">
                      {customer?.phone || 'Não informado'}
                    </div>
                  </div>
                </div>

                <div className="mt-10 p-4 bg-age-gold/5 border border-age-gold/10 rounded-xl">
                  <p className="text-xs text-age-gold font-bold text-center">
                    Para alterar seus dados, entre em contato com nosso suporte através do WhatsApp.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
