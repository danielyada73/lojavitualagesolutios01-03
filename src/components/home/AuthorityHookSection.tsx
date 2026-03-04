import React from 'react';
import { Check, Star } from 'lucide-react';
import { motion } from 'motion/react';

export default function AuthorityHookSection() {
  const benefits = [
    "Peptídeos Bioativos de Colágeno Verisol®",
    "Ácido Hialurônico de alta absorção (50mg)",
    "Suporte estrutural contra rugas e linhas de expressão",
    "Pureza máxima: Zero aditivos desnecessários"
  ];

  return (
    <section className="py-24 bg-[#F9F9F9] overflow-hidden">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Visual Side */}
          <div className="w-full lg:w-1/2 relative group px-4 md:px-0">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl border border-gray-100"
            >
              <img 
                src="https://lh3.googleusercontent.com/d/1y23iuxtqgh1fRIxv4QPL0_k4_AmwXPg0" 
                alt="Protocolo Age Solutions"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </motion.div>
            
            {/* Floating Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:-right-8 bg-white/95 backdrop-blur-xl border border-gray-100 px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4 z-10 w-[90%] md:w-auto"
            >
              <div className="relative flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-ping absolute opacity-75"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 relative"></div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5 leading-none">Status</p>
                <p className="text-xs font-black text-gray-900 uppercase tracking-wider leading-none">Protocolo de Longevidade Ativado</p>
              </div>
            </motion.div>
          </div>

          {/* Content Side */}
          <div className="w-full lg:w-1/2 space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-black leading-[1.1] tracking-tight mb-8">
                ENTENDA POR QUE A AGE SOLUTIONS SE TORNOU O <span className="text-[#C39343]">PROTOCOLO ESSENCIAL</span> DE LONGEVIDADE PARA A SUA PELE.
              </h2>

              {/* Testimonial */}
              <div className="relative bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mt-8 mb-10">
                {/* Speech bubble tail */}
                <div className="absolute -top-3 left-10 w-6 h-6 bg-white border-t border-l border-gray-100 transform rotate-45"></div>
                
                <p className="text-gray-600 italic text-lg leading-relaxed mb-6">
                  "A Age Solutions não é apenas um suplemento, é uma decisão estratégica. Sinto minha pele mais firme e hidratada, mas o que mais me impressionou foi a pureza e a rapidez dos resultados. É ciência aplicada à rotina."
                </p>
                
                <div className="flex items-center gap-4">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" 
                    alt="Cliente Verificada" 
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#C39343]"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black text-sm uppercase tracking-wider text-gray-900">Cliente Verificada</span>
                      <div className="flex text-[#C39343]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} fill="currentColor" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 font-medium">Compra Verificada • Age Solutions</p>
                  </div>
                </div>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mb-10">
                {benefits.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#C39343]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={14} className="text-[#C39343]" strokeWidth={3} />
                    </div>
                    <span className="text-sm font-bold text-gray-700 leading-tight">{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <button className="w-full md:w-auto bg-black text-white px-10 py-5 rounded-full text-lg font-black uppercase tracking-[0.15em] hover:bg-[#C39343] transition-colors shadow-xl hover:shadow-[#C39343]/20 hover:-translate-y-1 transform duration-300">
                  Garantir Meu Protocolo
                </button>
                <p className="mt-4 text-gray-400 text-xs font-bold flex items-center gap-2">
                  <span className="text-red-500">❤️</span>
                  +562.179 avaliações 5 estrelas de clientes verificados
                </p>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
