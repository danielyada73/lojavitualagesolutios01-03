import React from 'react';
import { FileText, Shield, AlertCircle } from 'lucide-react';

export default function TermsConditions() {
  return (
    <div className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 italic text-black">
            Termos e Condições
          </h1>
          <div className="w-24 h-1 bg-age-gold mx-auto"></div>
          <p className="mt-6 text-gray-500 font-medium uppercase tracking-widest text-sm text-center">
            Regras de Uso e Transparência
          </p>
        </div>

        <div className="space-y-8 text-gray-600 leading-relaxed font-medium">
          <div className="bg-gray-50 p-10 rounded-[40px] border border-gray-100">
            <h2 className="text-2xl font-black text-black uppercase mb-6 flex items-center gap-3 italic">
              <FileText className="text-age-gold" />
              1. Introdução
            </h2>
            <p className="mb-4">
              Ao acessar e usar o site da Age Solutions, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso. Se você não concordar com qualquer parte destes termos, não deverá usar nosso site.
            </p>
          </div>

          <div className="bg-gray-50 p-10 rounded-[40px] border border-gray-100">
            <h2 className="text-2xl font-black text-black uppercase mb-6 flex items-center gap-3 italic">
              <Shield className="text-age-gold" />
              2. Uso do Site
            </h2>
            <p className="mb-4">
              O conteúdo das páginas deste site é para sua informação geral e uso apenas. Ele está sujeito a alterações sem aviso prévio.
            </p>
            <p>
              Nem nós nem terceiros fornecemos qualquer garantia quanto à precisão, pontualidade, desempenho, integridade ou adequação das informações e materiais encontrados ou oferecidos neste site para qualquer finalidade específica.
            </p>
          </div>

          <div className="bg-gray-50 p-10 rounded-[40px] border border-gray-100">
            <h2 className="text-2xl font-black text-black uppercase mb-6 flex items-center gap-3 italic">
              <AlertCircle className="text-age-gold" />
              3. Propriedade Intelectual
            </h2>
            <p className="mb-4">
              Este site contém material que é de nossa propriedade ou licenciado para nós. Este material inclui, mas não está limitado a, design, layout, aparência, e gráficos.
            </p>
          </div>

          <div className="text-center pt-12">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
              Última atualização: Fevereiro de 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
