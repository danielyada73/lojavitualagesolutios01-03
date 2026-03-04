import React from 'react';
import { Shield, Eye, Cookie, Info, Lock, CreditCard, Search, Link } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 italic text-black">
            Segurança e Privacidade
          </h1>
          <div className="w-24 h-1 bg-age-gold mx-auto"></div>
          <p className="mt-6 text-gray-500 font-medium uppercase tracking-widest text-sm text-center">
            Sua Proteção é Nossa Prioridade
          </p>
        </div>

        <div className="prose prose-lg max-w-none text-gray-600 font-medium">
          <p className="mb-8 leading-relaxed">
            A Age Solutions trata a sua informação com seriedade. Por isso, investimos em tecnologias e práticas que protegem os seus dados durante a navegação, o pagamento e o atendimento.
          </p>

          {/* Compra segura */}
          <section className="mb-12 bg-gray-50 p-10 rounded-[40px] border border-gray-100">
            <h2 className="text-2xl font-black text-black uppercase italic tracking-tight mb-8 flex items-center gap-3">
              <Shield className="text-age-gold" /> Compra segura
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-4 items-start">
                <Lock className="text-age-gold flex-shrink-0" size={24} />
                <p className="text-sm leading-relaxed"><strong>SSL/HTTPS:</strong> Ambiente protegido por criptografia; os dados trafegam de forma cifrada entre o seu dispositivo e o nosso site.</p>
              </div>
              <div className="flex gap-4 items-start">
                <CreditCard className="text-age-gold flex-shrink-0" size={24} />
                <p className="text-sm leading-relaxed"><strong>Gateways:</strong> Pagamentos processados por intermediadores; os dados do seu cartão não ficam armazenados na Age Solutions.</p>
              </div>
              <div className="flex gap-4 items-start">
                <Search className="text-age-gold flex-shrink-0" size={24} />
                <p className="text-sm leading-relaxed"><strong>Monitorização:</strong> Prevenção contra fraudes; realizamos validações automáticas para reduzir riscos e proteger o consumidor.</p>
              </div>
              <div className="flex gap-4 items-start italic bg-white p-4 rounded-2xl border border-gray-200">
                <Info className="text-age-gold flex-shrink-0" size={24} />
                <p className="text-xs leading-relaxed">Em algumas compras, o pagamento pode passar por análise de segurança antes da aprovação. Isso é uma camada extra de proteção.</p>
              </div>
            </div>
          </section>

          {/* Privacidade dos seus dados */}
          <section className="mb-12 p-8">
            <h2 className="text-2xl font-black text-black uppercase italic tracking-tight mb-6 flex items-center gap-3">
              <Eye className="text-age-gold" /> Privacidade dos seus dados
            </h2>
            <p className="mb-4">Usamos os seus dados apenas para: processar pedidos, entregar a compra, emitir documentos quando aplicável, prestar suporte e cumprir obrigações legais.</p>
            <p className="font-bold text-black border-l-4 border-age-gold pl-4 py-2 my-6 bg-gray-50 uppercase tracking-tighter italic">Não vendemos nem alugamos dados pessoais.</p>
            <p className="text-sm">Compartilhamos informações somente com parceiros necessários para a operação, como transportadoras, plataformas de pagamento e serviços antifraude, sempre com o objetivo de concluir a compra com segurança.</p>
          </section>

          {/* Cookies e navegação */}
          <section className="mb-12 bg-black text-white p-10 rounded-[40px] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-age-gold/10 rounded-full blur-[80px] -mr-20 -mt-20"></div>
            <h2 className="text-2xl font-black text-age-gold uppercase italic tracking-tight mb-6 flex items-center gap-3 relative z-10">
              <Cookie /> Cookies e navegação
            </h2>
            <div className="relative z-10 space-y-4">
              <p className="text-gray-300">Podemos utilizar cookies e tecnologias semelhantes para:</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 list-none p-0 text-gray-400 text-sm">
                <li className="flex gap-2"><span className="text-age-gold">•</span> Melhorar a sua experiência</li>
                <li className="flex gap-2"><span className="text-age-gold">•</span> Lembrar preferências</li>
                <li className="flex gap-2"><span className="text-age-gold">•</span> Medir desempenho</li>
                <li className="flex gap-2"><span className="text-age-gold">•</span> Reduzir fraudes</li>
              </ul>
              <p className="text-xs italic text-gray-500">Você pode gerir cookies diretamente no seu navegador.</p>
            </div>
          </section>

          {/* Boas práticas e recomendações */}
          <section className="mb-12 p-8 bg-gray-50 rounded-[40px] border border-gray-100">
            <h2 className="text-2xl font-black text-black uppercase italic tracking-tight mb-6 flex items-center gap-3">
              <Info className="text-age-gold" /> Boas práticas e recomendações
            </h2>
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-gray-500">Para sua segurança, evite:</p>
            <ul className="space-y-3 list-none p-0">
              <li className="flex gap-3 items-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <p className="text-sm mb-0 italic">Utilizar computadores públicos ao finalizar compras.</p>
              </li>
              <li className="flex gap-3 items-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <p className="text-sm mb-0 italic">Compartilhar senhas ou códigos de confirmação.</p>
              </li>
              <li className="flex gap-3 items-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <p className="text-sm mb-0 italic">Clicar em links suspeitos se passando pela Age Solutions.</p>
              </li>
            </ul>
          </section>

          {/* Precisa de ajuda? */}
          <div className="mt-16 p-10 bg-white rounded-[50px] text-center border-4 border-black group hover:border-age-gold transition-colors">
            <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4 text-black">Precisa de ajuda?</h3>
            <p className="text-sm text-gray-500 mb-8 font-medium max-w-sm mx-auto">
              Se tiver qualquer dúvida sobre segurança, privacidade ou suspeitar de uso indevido de dados, fale com o nosso suporte.
            </p>
            <div className="flex justify-center flex-wrap gap-4">
              <a href="https://wa.me/5511916342268" target="_blank" rel="noopener noreferrer" className="bg-black text-age-gold px-10 py-4 rounded-full font-black uppercase italic text-xs tracking-widest hover:scale-105 transition-all">
                Chamar Suporte
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
