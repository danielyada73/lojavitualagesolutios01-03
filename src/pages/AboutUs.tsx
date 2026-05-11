import React from 'react';

const valores = [
  {
    titulo: 'Ciência e Consistência',
    desc: 'Acreditamos em resultados construídos com base em evidências e rotinas bem estruturadas. Nada de promessas vazias ou soluções milagrosas.',
  },
  {
    titulo: 'Transparência e Confiança',
    desc: 'Nosso compromisso é com a clareza em cada produto, fórmula e informação. Prezamos por uma relação honesta com quem escolhe a Age Solutions.',
  },
  {
    titulo: 'Autocuidado com Propósito',
    desc: 'Encorajamos práticas reais, possíveis e conscientes. Respeitamos o tempo, o ritmo e a individualidade de cada pessoa.',
  },
  {
    titulo: 'Qualidade com Responsabilidade',
    desc: 'Todos os nossos produtos passam por curadoria criteriosa, com foco em eficácia, segurança e bem-estar.',
  },
  {
    titulo: 'Atendimento Humano e Acolhedor',
    desc: 'Mais do que vender, buscamos ouvir, orientar e acompanhar. Cada pessoa importa, e cada jornada merece atenção de verdade.',
  },
];

export default function AboutUs() {
  return (
    <div className="bg-white">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section
        className="relative min-h-[520px] md:min-h-[600px] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage:
            'url(https://agesolution.com.br/wp-content/uploads/2023/10/age-sobre-nos-banner.jpg), url(https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
        }}
      >
        {/* Overlay escuro */}
        <div className="absolute inset-0 bg-black/65" />

        {/* Conteúdo */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="text-age-gold font-bold uppercase tracking-[0.3em] text-sm mb-6">
            A Age Solutions é uma empresa 100% brasileira
          </p>
          <h1 className="text-white font-black uppercase italic tracking-tighter leading-none text-4xl md:text-6xl lg:text-7xl mb-8">
            Existe beleza em<br />cada fase da vida.
            <br />
            <span className="text-age-gold">E a nossa missão</span><br />
            é fazer ela brilhar.
          </h1>
          <div className="w-20 h-1 bg-age-gold mx-auto" />
        </div>
      </section>

      {/* ── SOBRE NÓS + VALORES + MISSÃO ─────────────────── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-16">

            {/* — SOBRE NÓS — */}
            <div>
              <h2 className="text-2xl font-black text-age-gold uppercase italic tracking-tight mb-6 pb-3 border-b-2 border-age-gold/30">
                Sobre Nós
              </h2>
              <div className="space-y-4 text-gray-600 text-sm leading-relaxed font-medium">
                <p>
                  A verdadeira transformação começa quando você escolhe cuidar de si com intenção. Na Age Solutions, não acreditamos em promessas vazias ou fórmulas mágicas. Acreditamos em ciência, consistência e resultados reais.
                </p>
                <p>
                  Nossa missão é oferecer produtos que unem o melhor da nutrição inteligente com a dermocosmética de alta performance, para que você possa cuidar da sua pele com eficácia e segurança, de dentro para fora.
                </p>
                <p>
                  Trabalhamos com uma curadoria criteriosa de suplementos — como nosso colágeno com ácido hialurônico, coenzima Q10 e creatina 100% pura — desenvolvidos para promover firmeza, hidratação e vitalidade.
                </p>
                <p>
                  Cada produto foi escolhido com um único objetivo: te ajudar a construir uma rotina de autocuidado realista, eficaz e prazerosa, que respeite seu tempo, seu ritmo e suas necessidades únicas.
                </p>
                <p>
                  Age Solutions é mais do que uma marca — é um convite para você colocar sua beleza como prioridade, com consciência e propósito.
                </p>
              </div>
            </div>

            {/* — VALORES — */}
            <div>
              <h2 className="text-2xl font-black text-age-gold uppercase italic tracking-tight mb-6 pb-3 border-b-2 border-age-gold/30">
                Valores
              </h2>
              <div className="space-y-5">
                {valores.map((v, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="mt-1 w-2 h-2 rounded-full bg-age-gold flex-shrink-0" />
                    <div>
                      <p className="text-sm font-black text-black mb-1">{v.titulo}</p>
                      <p className="text-sm text-gray-500 leading-relaxed font-medium">{v.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* — MISSÃO — */}
            <div>
              <h2 className="text-2xl font-black text-age-gold uppercase italic tracking-tight mb-6 pb-3 border-b-2 border-age-gold/30">
                Missão
              </h2>
              <div className="space-y-4 text-gray-600 text-sm leading-relaxed font-medium">
                <p>
                  Nossa missão é transformar o autocuidado em um ato consciente, acessível e eficaz. Na Age Solutions, acreditamos que beleza e bem-estar caminham juntos, e que cuidar de si vai muito além da estética: é um compromisso com saúde, autoestima e equilíbrio.
                </p>
                <p>
                  Por isso, desenvolvemos e selecionamos produtos que unem ciência, nutrição inteligente e dermocosmética de alta performance, oferecendo soluções que atuam de dentro para fora com segurança, eficácia e respaldo técnico.
                </p>
                <p>
                  Queremos que cada pessoa se sinta segura para construir uma rotina de cuidados que faça sentido — que respeite seu tempo, seu ritmo e suas necessidades reais. Sem fórmulas mágicas, sem exageros, sem promessas vazias.
                </p>
              </div>

              {/* Quote em destaque */}
              <blockquote className="mt-8 bg-black text-white p-6 rounded-[24px] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-age-gold/10 rounded-full blur-[60px]" />
                <p className="text-age-gold font-black italic text-3xl leading-none mb-3 relative z-10">"</p>
                <p className="text-sm font-medium text-gray-300 leading-relaxed relative z-10 italic">
                  Nosso propósito é promover resultados reais e sustentáveis, incentivando uma relação mais leve, confiante e intencional com a própria beleza.
                </p>
              </blockquote>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
