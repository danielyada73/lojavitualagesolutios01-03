import React from 'react';
import { Target, Heart, ShieldCheck, Zap, Users, Sparkles, Activity } from 'lucide-react';

export default function AboutUs() {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative py-24 bg-black text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-age-gold/10 rounded-full blur-[120px] -mr-48 -mt-48"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-6">
                        Sobre Nós
                    </h1>
                    <div className="w-32 h-1 bg-age-gold mx-auto mb-10"></div>
                    <p className="text-2xl md:text-3xl text-age-gold max-w-4xl mx-auto font-black leading-tight uppercase italic tracking-tighter">
                        Beleza e performance de dentro para fora
                    </p>
                </div>
            </section>

            {/* Narrative Section */}
            <section className="py-20 md:py-32">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        <div className="lg:col-span-12 prose prose-xl max-w-none text-gray-600 leading-relaxed font-medium">
                            <p className="text-3xl text-black font-black mb-12 italic border-l-8 border-age-gold pl-8 uppercase tracking-tighter">
                                A Age Solutions nasceu para simplificar o autocuidado com uma regra clara: resultado real exige fórmula certa + rotina possível.
                            </p>

                            <div className="space-y-8">
                                <p>
                                    Nós unimos nutrição inteligente e cuidado estético de alta performance para quem quer melhorar pele, composição corporal e energia sem cair em promessas vazias. Aqui, cada produto entra no catálogo por um motivo: entregar função, segurança e consistência.
                                </p>

                                <p>
                                    A nossa curadoria prioriza ativos com uso consolidado e propósito claro — como colágenos específicos (incluindo Verisol), ácido hialurónico, coenzima Q10 e creatina 100% pura — para apoiar a tua rotina "de dentro para fora".
                                </p>

                                <p>
                                    Mais do que vender suplementos, o nosso compromisso é ajudar-te a construir um plano de autocuidado realista e sustentável: o que faz sentido para ti, no teu ritmo, com informação clara e atendimento humano.
                                </p>
                            </div>

                            <p className="text-2xl text-black font-black uppercase italic tracking-tighter mt-16 bg-gray-50 p-8 rounded-[40px] text-center">
                                Age Solutions é um convite simples: cuidar de ti com critério — e ver isso aparecer no espelho e no dia a dia.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Lines / Positioning */}
            <section className="py-24 bg-black text-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-black text-center uppercase italic tracking-tighter mb-20 text-age-gold">
                        Nossas Linhas Principais
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                        <div className="bg-white/5 p-12 rounded-[50px] border border-white/10 group hover:border-age-gold transition-all">
                            <Sparkles className="text-age-gold mb-6" size={48} />
                            <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-6">Pele & Beleza (Core)</h3>
                            <ul className="space-y-4 text-gray-400 font-bold uppercase tracking-widest text-sm">
                                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-age-gold rounded-full"></span> Colagénio + Ácido Hialurónico</li>
                                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-age-gold rounded-full"></span> Colagénio Verisol</li>
                                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-age-gold rounded-full"></span> Coenzima Q10</li>
                            </ul>
                        </div>
                        <div className="bg-white/5 p-12 rounded-[50px] border border-white/10 group hover:border-age-gold transition-all">
                            <Activity className="text-age-gold mb-6" size={48} />
                            <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-6">Corpo & Performance</h3>
                            <ul className="space-y-4 text-gray-400 font-bold uppercase tracking-widest text-sm">
                                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-age-gold rounded-full"></span> Creatina 100% Pura</li>
                                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-age-gold rounded-full"></span> Celulli Burn (Suporte ao Metabolismo)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Values */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-20 inline-block border-b-4 border-age-gold pb-4">
                        Nossos Valores
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            { icon: <Target />, title: 'Ciência aplicada', desc: 'Evidência sem complicação na sua rotina.' },
                            { icon: <ShieldCheck />, title: 'Transparência Radical', desc: 'Fórmula, função e expectativa sempre claras.' },
                            { icon: <Zap />, title: 'Qualidade Exigente', desc: 'Curadoria criteriosa, segurança e consistência total.' },
                            { icon: <Heart />, title: 'Autocuidado Possível', desc: 'Sem extremos, sem terrorismo e sem culpa.' },
                            { icon: <Users />, title: 'Atendimento Humano', desc: 'Orientação e proximidade, não apenas checkout.' }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white p-10 rounded-[50px] shadow-sm border border-gray-100 hover:shadow-2xl transition-all group">
                                <div className="mb-8 inline-block p-5 bg-black text-age-gold rounded-[24px] group-hover:rotate-12 transition-transform">
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-black uppercase italic tracking-widest mb-4">{item.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed font-bold">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Full Mission Statement */}
            <section className="py-32 bg-white text-center">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-sm font-black text-age-gold uppercase tracking-[0.3em] mb-12">Nossa Missão</h2>
                    <blockquote className="text-2xl md:text-3xl text-black font-black leading-relaxed italic mb-16 uppercase tracking-tight">
                        "Transformar o autocuidado em um ato consciente, acessível e eficaz. Acreditamos que beleza e bem-estar caminham juntos, e que cuidar de si vai muito além da estética: é um compromisso com saúde, autoestima e equilíbrio."
                    </blockquote>
                    <div className="w-48 h-1 bg-black mx-auto opacity-10"></div>
                </div>
            </section>
        </div>
    );
}
