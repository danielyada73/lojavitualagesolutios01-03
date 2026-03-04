import { Link } from 'react-router-dom';
import { categories } from '../../data/mock';

export default function CategoriesGrid() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8 uppercase tracking-wide">
          Navegue por Categorias
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              to={`/category/${category.slug}`}
              className="group flex flex-col items-center"
            >
              <div className="w-full aspect-square overflow-hidden rounded-full border-2 border-transparent group-hover:border-age-gold transition-all duration-300 mb-4">
                {category.banner_url ? (
                  <img 
                    src={category.banner_url} 
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                    Sem Foto
                  </div>
                )}
              </div>
              <h3 className="font-bold text-sm md:text-base uppercase text-center group-hover:text-age-gold transition-colors">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
