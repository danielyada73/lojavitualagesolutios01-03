import { Link } from 'react-router-dom';

export default function BenefitBanners() {
  const benefits = [
    {
      title: 'FORÇA E PERFORMANCE',
      image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=600&h=600&auto=format&fit=crop',
      link: '/category/creatina'
    },
    {
      title: 'BELEZA E PELE',
      image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?q=80&w=600&h=600&auto=format&fit=crop',
      link: '/category/colageno-po'
    },
    {
      title: 'EMAGRECIMENTO',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&h=600&auto=format&fit=crop',
      link: '/category/celluli-burn'
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((item, index) => (
            <Link key={index} to={item.link} className="group relative aspect-square overflow-hidden rounded-xl">
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                <h3 className="text-2xl font-bold text-white uppercase tracking-wider border-b-2 border-age-gold pb-2">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
