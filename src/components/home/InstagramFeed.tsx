import { Instagram } from 'lucide-react';

export default function InstagramFeed() {
  const feedItems = [
    {
      image: 'https://agesolution.com.br/wp-content/uploads/sb-instagram-feed-images/627858314_18022463897801896_6698833572728110420_nlow.webp',
      link: 'https://www.instagram.com/p/DUrGhWEjjRO/'
    },
    {
      image: 'https://agesolution.com.br/wp-content/uploads/sb-instagram-feed-images/633644614_18022377938801896_1209281044728644927_nlow.webp',
      link: 'https://www.instagram.com/p/DUpDz1cDIvj/'
    },
    {
      image: 'https://agesolution.com.br/wp-content/uploads/sb-instagram-feed-images/632771036_18022377839801896_8560291961205462691_nlow.webp',
      link: 'https://www.instagram.com/p/DUpDkWlDFG-/'
    },
    {
      image: 'https://agesolution.com.br/wp-content/uploads/sb-instagram-feed-images/612238192_1401089404701119_3064472095413346872_nlow.webp',
      link: 'https://www.instagram.com/reel/DTgdzuBjnN7/'
    },
    {
      image: 'https://agesolution.com.br/wp-content/uploads/sb-instagram-feed-images/611304449_3778582055781043_3444938854961503853_nlow.webp',
      link: 'https://www.instagram.com/reel/DTLgnHGkdIt/'
    },
    {
      image: 'https://agesolution.com.br/wp-content/uploads/sb-instagram-feed-images/607530497_18017753210801896_2477102409357741333_nlow.webp',
      link: 'https://www.instagram.com/p/DS7rVEujlUs/'
    },
    {
      image: 'https://agesolution.com.br/wp-content/uploads/sb-instagram-feed-images/605800937_18016966145801896_5445842700030679763_nlow.webp',
      link: 'https://www.instagram.com/p/DSpqGyIjmyR/'
    },
    {
      image: 'https://agesolution.com.br/wp-content/uploads/sb-instagram-feed-images/599883930_18016113731801896_815633100191770650_nlow.webp',
      link: 'https://www.instagram.com/reel/DSVcO_kkRgi/'
    },
    {
      image: 'https://agesolution.com.br/wp-content/uploads/sb-instagram-feed-images/591152660_860257296392350_369429904238859292_nlow.webp',
      link: 'https://www.instagram.com/reel/DRnJLyakQjE/'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-age-gold mb-2">
          Acompanhe a gente no Instagram!
        </h2>
        <div className="flex flex-col items-center mb-8">
          <a href="https://www.instagram.com/agesolutions/" target="_blank" rel="noopener noreferrer" className="font-bold text-lg hover:text-age-gold transition-colors">agesolutions</a>
          <span className="text-gray-600 text-sm">Soluções para beleza! 💎</span>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-8 max-w-2xl mx-auto">
          {feedItems.map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="aspect-square overflow-hidden group relative cursor-pointer"
            >
              <img
                src={item.image}
                alt={`Instagram post ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Instagram size={24} />
              </div>
            </a>
          ))}
        </div>

        <a
          href="https://www.instagram.com/agesolutions/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-age-gold text-black font-bold uppercase px-8 py-3 rounded-full hover:bg-black hover:text-white transition-all duration-300 shadow-lg"
        >
          <Instagram size={20} />
          Siga a @agesolutions
        </a>
      </div>
    </section>
  );
}
