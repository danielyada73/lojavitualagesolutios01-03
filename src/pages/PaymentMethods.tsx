import React from 'react';
import { CreditCard, QrCode, ShieldCheck, HelpCircle, AlertCircle, Clock, CheckCircle } from 'lucide-react';

export default function PaymentMethods() {
    return (
        <div className="bg-white py-16 md:py-24">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 italic text-black">
                        Formas de Pagamento
                    </h1>
                    <div className="w-24 h-1 bg-age-gold mx-auto"></div>
                    <p className="mt-6 text-gray-500 font-medium uppercase tracking-widest text-sm text-center">
                        Segurança e Agilidade em Sua Compra
                    </p>
                </div>

                <div className="prose prose-lg max-w-none text-gray-600 font-medium leading-relaxed">
                    <p className="mb-12 text-center text-lg italic">
                        Para garantir uma experiência segura e organizada, o seu pedido é reservado por um período limitado após a finalização da compra.
                    </p>

                    {/* Importante Section */}
                    <section className="mb-12 bg-black text-white p-10 rounded-[40px] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-age-gold/10 rounded-full blur-[80px] -mr-20 -mt-20"></div>
                        <h2 className="text-2xl font-black text-age-gold uppercase italic tracking-tight mb-8 flex items-center gap-3 relative z-10">
                            <AlertCircle size={28} /> Importante
                        </h2>
                        <ul className="space-y-6 list-none p-0 relative z-10">
                            <li className="flex gap-4 items-start">
                                <span className="text-age-gold font-black italic">01.</span>
                                <p className="text-sm"><strong>Prazo para pagamento:</strong> o pedido deve ser pago em até <strong>2 (dois) dias úteis</strong>. Após esse prazo, o pedido poderá ser cancelado automaticamente.</p>
                            </li>
                            <li className="flex gap-4 items-start border-t border-white/10 pt-6">
                                <span className="text-age-gold font-black italic">02.</span>
                                <p className="text-sm"><strong>Confirmação automática:</strong> o nosso sistema identifica o pagamento sem necessidade de envio de comprovante.</p>
                            </li>
                            <li className="flex gap-4 items-start border-t border-white/10 pt-6">
                                <span className="text-age-gold font-black italic">03.</span>
                                <p className="text-sm"><strong>Alterações no pedido:</strong> após finalizar a compra, não é possível alterar produtos, quantidades ou endereço.</p>
                            </li>
                        </ul>
                    </section>

                    {/* Methods Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        {/* PIX */}
                        <div className="bg-gray-50 p-10 rounded-[50px] border border-gray-100 group hover:border-age-gold transition-all duration-300">
                            <div className="w-16 h-16 bg-black text-age-gold rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:rotate-6 transition-transform">
                                <QrCode size={32} />
                            </div>
                            <h2 className="text-3xl font-black uppercase italic tracking-tight mb-6 text-black">PIX</h2>
                            <ul className="space-y-4 text-sm font-bold uppercase tracking-widest text-gray-500">
                                <li className="flex items-center gap-3"><CheckCircle size={16} className="text-age-gold" /> Confirmação imediata</li>
                                <li className="flex items-center gap-3 text-red-600"><Clock size={16} /> Prazo: até 30 minutos</li>
                                <li className="flex items-center gap-3"><CheckCircle size={16} className="text-age-gold" /> Sem envio de comprovante</li>
                            </ul>
                        </div>

                        {/* Cartão de Crédito */}
                        <div className="bg-gray-50 p-10 rounded-[50px] border border-gray-100 group hover:border-age-gold transition-all duration-300">
                            <div className="w-16 h-16 bg-black text-age-gold rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:rotate-6 transition-transform">
                                <CreditCard size={32} />
                            </div>
                            <h2 className="text-3xl font-black uppercase italic tracking-tight mb-6 text-black">Cartão</h2>
                            <div className="bg-black text-age-gold p-4 rounded-2xl text-center mb-6">
                                <span className="text-xl font-black italic italic">Até 10x SEM JUROS</span>
                            </div>
                            <ul className="space-y-4 text-sm font-bold uppercase tracking-widest text-gray-500">
                                <li className="flex items-center gap-3">Parcela mínima R$ 20,00</li>
                                <li className="flex items-center gap-3 italic">Visa, Master, Amex, Elo</li>
                            </ul>
                        </div>
                    </div>

                    {/* Resumo de Prazos */}
                    <section className="mb-20">
                        <h2 className="text-2xl font-black text-black uppercase italic tracking-tight mb-10 text-center underline decoration-age-gold decoration-4 underline-offset-8">
                            Prazos de Confirmação
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {[
                                { label: 'PIX', time: 'Geralmente imediato' },
                                { label: 'Cartão', time: 'Geralmente imediato' },
                                { label: 'Análises', time: 'Pode haver análise extra' }
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 text-center shadow-sm">
                                    <p className="text-xs uppercase font-black text-gray-400 mb-2">{item.label}</p>
                                    <p className="text-sm font-black text-black italic">{item.time}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Segurança */}
                    <section className="bg-gray-50 p-10 rounded-[50px] mb-12 flex flex-col md:flex-row gap-8 items-center border border-gray-200">
                        <div className="w-20 h-20 bg-white text-black rounded-3xl flex items-center justify-center flex-shrink-0 shadow-lg border border-gray-100">
                            <ShieldCheck size={40} className="text-age-gold" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4">Segurança no Pagamento</h3>
                            <p className="text-sm text-gray-500 font-bold leading-relaxed mb-0">
                                Para sua segurança, não armazenamos dados do cartão. O pagamento é processado por um gateway intermediador criptografado. A Age Solutions não tem acesso aos detalhes do seu cartão.
                            </p>
                        </div>
                    </section>

                    {/* Footer Contact */}
                    <footer className="text-center p-12 bg-black text-white rounded-[60px] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-age-gold opacity-0 group-hover:opacity-5 transition-opacity"></div>
                        <h4 className="text-3xl font-black uppercase italic flex items-center justify-center gap-3 mb-6 text-age-gold">
                            <HelpCircle size={32} /> Dúvidas no Pagamento?
                        </h4>
                        <p className="text-gray-400 mb-10 font-medium italic">
                            Se tiver qualquer dificuldade para concluir, fale com o nosso suporte agora.
                        </p>
                        <a href="https://wa.me/5511916342268" target="_blank" rel="noopener noreferrer" className="inline-block bg-age-gold text-black px-12 py-5 rounded-full font-black uppercase italic tracking-[0.2em] text-xs hover:bg-white hover:scale-110 transition-all">
                            Suporte WhatsApp
                        </a>
                    </footer>
                </div>
            </div>
        </div>
    );
}
