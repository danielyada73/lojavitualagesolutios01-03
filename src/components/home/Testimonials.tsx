import { Star, ThumbsUp, CheckCircle } from 'lucide-react';
import { useRef } from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: 'Andresa B.',
    initials: 'AB',
    date: '19/02/2026',
    title: 'Muito bom',
    content: 'Simplesmente amo A diferença e enorme',
    rating: 5,
    verified: true,
    likes: 1
  },
  {
    id: 2,
    name: 'MIGUEL L.',
    initials: 'ML',
    date: '18/02/2026',
    title: 'Muito bom surge resultados visíveis',
    content: '',
    rating: 5,
    verified: true,
    likes: 1
  },
  {
    id: 3,
    name: 'Ednei A.',
    initials: 'EA',
    date: '18/02/2026',
    title: 'Muito boa',
    content: 'Produto de ótima qualidade entrega com excelência',
    rating: 5,
    verified: true,
    likes: 0
  },
  {
    id: 4,
    name: 'Philipe S.',
    initials: 'PS',
    date: '18/02/2026',
    title: 'Gostei muito do preço e qualidade, vou comprar mais .',
    content: 'Gostei do preço, textura e qualidade .',
    rating: 5,
    verified: true,
    likes: 1
  },
  {
    id: 5,
    name: 'Anderson C.',
    initials: 'AC',
    date: '18/02/2026',
    title: 'Que o produto é 100% puro.',
    content: 'Creatina pura, marca de confiança e excelente custo benefício.',
    rating: 5,
    verified: true,
    likes: 1
  },
  {
    id: 6,
    name: 'Bruna F.',
    initials: 'BF',
    date: '17/02/2026',
    title: 'Já compro a anos , não troco !',
    content: 'Confiável e de alta qualidade',
    rating: 5,
    verified: true,
    likes: 0
  },
  {
    id: 7,
    name: 'Jaqueline L.',
    initials: 'JL',
    date: '11/02/2026',
    title: 'Nota 10',
    content: 'Muito boa e eficaz indico para toda minha família e amigos',
    rating: 5,
    verified: true,
    likes: 1
  },
  {
    id: 8,
    name: 'Ricardo M.',
    initials: 'RM',
    date: '10/02/2026',
    title: 'Excelente',
    content: 'O Colágeno da Age Solutions mudou minha pele. Recomendo demais!',
    rating: 5,
    verified: true,
    likes: 2
  },
  {
    id: 9,
    name: 'Fernanda T.',
    initials: 'FT',
    date: '09/02/2026',
    title: 'Entrega Rápida',
    content: 'Chegou em 1 dia em SP. O Celluli Burn funciona mesmo.',
    rating: 5,
    verified: true,
    likes: 1
  },
  {
    id: 10,
    name: 'Carlos E.',
    initials: 'CE',
    date: '08/02/2026',
    title: 'Qualidade Pura',
    content: 'A Creatina dissolve fácil e é pura de verdade. Comprarei sempre.',
    rating: 5,
    verified: true,
    likes: 3
  },
  {
    id: 11,
    name: 'Mariana S.',
    initials: 'MS',
    date: '05/02/2026',
    title: 'Amei',
    content: 'O sabor Cranberry do colágeno é delicioso. Resultados visíveis em 1 mês.',
    rating: 5,
    verified: true,
    likes: 1
  },
  {
    id: 12,
    name: 'Roberto J.',
    initials: 'RJ',
    date: '03/02/2026',
    title: 'Recomendo',
    content: 'Coenzima Q10 de alta qualidade. Sinto mais disposição.',
    rating: 5,
    verified: true,
    likes: 0
  },
  {
    id: 13,
    name: 'Patrícia L.',
    initials: 'PL',
    date: '01/02/2026',
    title: 'Fã da marca',
    content: 'Uso Age Solutions há 2 anos. Confiança total nos produtos.',
    rating: 5,
    verified: true,
    likes: 4
  }
];

export default function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold uppercase tracking-tight text-gray-900 mb-2">
            O que nossas clientes estão comentando?
          </h2>
          <div className="flex items-center justify-center gap-2 text-age-gold">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill="currentColor" />
              ))}
            </div>
            <span className="text-black font-bold text-lg">4.9/5</span>
            <span className="text-gray-400 text-sm">(+2.000 avaliações)</span>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {testimonials.map((testimonial) => (
            <motion.div 
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="min-w-[300px] md:min-w-[350px] bg-white p-6 rounded-2xl shadow-sm border border-gray-100 snap-center flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-sm">
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <h4 className="font-bold text-sm text-gray-900">{testimonial.name}</h4>
                      {testimonial.verified && (
                        <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <CheckCircle size={8} /> Compra Verificada
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">{testimonial.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={`${i < testimonial.rating ? 'text-age-gold fill-age-gold' : 'text-gray-300'}`} />
                ))}
              </div>

              <h3 className="font-bold text-gray-900 mb-2 text-sm">{testimonial.title}</h3>
              <p className="text-gray-600 text-sm mb-6 flex-grow leading-relaxed">
                {testimonial.content}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                  <CheckCircle size={12} />
                  Recomendo este produto
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <span className="text-[10px]">Útil?</span>
                  <button className="hover:text-age-gold transition-colors flex items-center gap-1">
                    <ThumbsUp size={12} /> {testimonial.likes}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              'https://lh3.googleusercontent.com/d/1E2Y_CyVGKow7kKi2JzeNOsBtgUrbiEjQ',
              'https://lh3.googleusercontent.com/d/1JVjRPCxHGSDzeOpluqTmNAVFR9p9HfdQ',
              'https://lh3.googleusercontent.com/d/1m0q9So-DusrbQM1Ad2V3-eAlpDHviPvG',
              'https://lh3.googleusercontent.com/d/1lAwh24PBs28U73SADAjk2isCUd6Oooil',
              'https://lh3.googleusercontent.com/d/1CZMkvkQaubhOT4P18H67615_pv5XxroQ'
            ].map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 bg-white"
              >
                <img 
                  src={img} 
                  alt={`Feedback ${index + 1}`} 
                  loading="lazy"
                  className="w-full h-auto object-contain"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
