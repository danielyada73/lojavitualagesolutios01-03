import { Link } from 'react-router-dom';

export default function CategoryBanners() {
  const banners = [
    {
      title: 'CREATINA PREMIUM',
      image: 'https://lh3.googleusercontent.com/d/1oiuWSKUbeg9zCesqmNUAjVPVOZ-C3Hps',
      link: '/category/creatina'
    },
    {
      title: 'COLÁGENO',
      image: 'https://lh3.googleusercontent.com/d/1eoDiKva023UW9wYjZXAfy5rCQij5NUr6',
      link: '/category/colageno'
    },
    {
      title: 'CELULI BURN',
      image: 'https://lh3.googleusercontent.com/d/1MWS5erJ-7Nl-5XpKvZqmEe7qhakvTYbD',
      link: '/category/emagrecimento'
    },
    {
      title: 'COENZIMA Q10',
      image: 'https://lh3.googleusercontent.com/d/15YjQ-vdQwbZUk2rbSo2tLzX_RwN92J-C',
      link: '/category/coenzima'
    },
    {
      title: 'KITS PROMOCIONAIS',
      image: 'https://lh3.googleusercontent.com/d/1p7eaqKgOLxUkbjysNYyqSAYimif_Kig4',
      link: '/kits'
    }
  ];

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4 mb-8 text-center">
        <h2 className="text-3xl font-bold uppercase tracking-tight text-age-gold mb-2">
          NOSSAS CATEGORIAS
        </h2>
        <p className="text-xs uppercase tracking-widest text-gray-500">
          Navegue pelas categorias de todos os nossos produtos
        </p>
      </div>

      {/* Desktop: Static Grid */}
      <div className="hidden md:grid grid-cols-5 gap-4 container mx-auto px-4">
        {banners.map((banner, index) => (
          <div key={index} className="relative h-[712px] overflow-hidden group rounded-2xl">
            <img 
              src={banner.image} 
              alt={banner.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
            <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-center pb-16">
              <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-6 drop-shadow-md">
                {banner.title}
              </h3>
              <Link 
                to={banner.link}
                className="bg-white/20 backdrop-blur-sm border border-white text-white text-xs font-bold uppercase px-6 py-3 rounded-full hover:bg-white hover:text-black transition-all"
              >
                Ver Produtos
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: Infinite Loop Carousel */}
      <div className="md:hidden relative w-full">
        <div className="flex animate-marquee gap-4 w-max px-4">
          {/* Duplicated for infinite loop effect */}
          {[...banners, ...banners, ...banners].map((banner, index) => (
            <div key={index} className="relative w-[85vw] h-[500px] flex-shrink-0 rounded-2xl overflow-hidden">
              <img 
                src={banner.image} 
                alt={banner.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-center pb-12">
                <h3 className="text-2xl font-bold text-white uppercase tracking-wider mb-4 drop-shadow-md">
                  {banner.title}
                </h3>
                <Link 
                  to={banner.link}
                  className="bg-white/20 backdrop-blur-sm border border-white text-white text-xs font-bold uppercase px-8 py-3 rounded-full"
                >
                  Ver Produtos
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
