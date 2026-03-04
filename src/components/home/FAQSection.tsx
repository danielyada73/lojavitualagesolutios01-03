import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "1. Como funciona o Frete Grátis?",
    answer: "É simples: em qualquer compra a partir de R$49,90, o frete é por nossa conta para qualquer lugar do Brasil."
  },
  {
    question: "2. Qual o prazo de entrega para São Paulo?",
    answer: "Para a grande São Paulo, operamos com logística prioritária e envio em 24h após a confirmação do pagamento."
  },
  {
    question: "3. Posso parcelar minha compra?",
    answer: "Sim, oferecemos parcelamento em até 10x sem juros no cartão de crédito, com parcela mínima de R$ 20,00."
  },
  {
    question: "4. Os suplementos são seguros e possuem laudos?",
    answer: "Trabalhamos com transparência radical e pureza máxima. Nossas fórmulas seguem as normas da ANVISA e são focadas em ciência e resultados reais."
  },
  {
    question: "5. E se eu me arrepender da compra?",
    answer: "Você tem o direito de arrependimento de 7 dias corridos após a entrega. O produto deve estar com o lacre original intacto por motivos de segurança e higiene."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-black mb-4">
            Perguntas Frequentes <span className="text-age-gold">(FAQ)</span>
          </h2>
          <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">
            Age Solutions — Longevidade e Ciência
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div 
              key={index} 
              className="border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="font-bold text-black text-sm md:text-base pr-4 uppercase tracking-tight">
                  {item.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="text-age-gold flex-shrink-0" size={20} />
                ) : (
                  <ChevronDown className="text-gray-400 flex-shrink-0" size={20} />
                )}
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="p-6 pt-0 text-gray-600 text-sm md:text-base leading-relaxed border-t border-gray-50">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
