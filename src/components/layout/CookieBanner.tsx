import React, { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('age-solutions-cookie-consent');
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('age-solutions-cookie-consent', 'accepted');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-6 right-6 z-[100] animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="max-w-4xl mx-auto bg-black border border-age-gold/30 rounded-[32px] shadow-2xl overflow-hidden backdrop-blur-xl bg-opacity-95">
                <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-10">
                    {/* Icon Column */}
                    <div className="w-16 h-16 bg-age-gold rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
                        <Cookie size={32} className="text-black" />
                    </div>

                    {/* Text Column */}
                    <div className="flex-grow text-left">
                        <h3 className="text-age-gold font-black uppercase italic tracking-tighter mb-4 flex items-center gap-2">
                            Privacidade & Cookies
                        </h3>
                        <div className="text-gray-300 text-sm font-medium leading-relaxed">
                            <p className="mb-4">Podemos utilizar cookies e tecnologias semelhantes para:</p>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-4">
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-age-gold rounded-full"></span>
                                    Melhorar a sua experiência
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-age-gold rounded-full"></span>
                                    Lembrar preferências
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-age-gold rounded-full"></span>
                                    Medir desempenho
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-age-gold rounded-full"></span>
                                    Reduzir fraudes
                                </li>
                            </ul>
                            <p className="text-xs text-gray-500 italic">Você pode gerir cookies diretamente no seu navegador.</p>
                        </div>
                    </div>

                    {/* Action Column */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <button
                            onClick={handleAccept}
                            className="bg-age-gold text-black px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:bg-white transition-all shadow-xl hover:scale-105 active:scale-95"
                        >
                            Aceitar e Continuar
                        </button>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="flex items-center justify-center w-12 h-12 rounded-full border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                            title="Fechar"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
