import { useState } from 'react';

export default function Newsletter() {
  return (
    <section className="py-20 bg-black relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-age-gold opacity-10 blur-[120px] -mr-48 -mt-10"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-4 text-white uppercase italic tracking-tighter">
            Newsletter <span className="text-age-gold">Premium</span>
          </h2>
          <p className="text-gray-400 mb-10 text-sm md:text-base font-medium max-w-2xl mx-auto">
            Receba e-mails de promoções, lançamentos de produtos e muito mais diretamente no seu e-mail!
          </p>

          <form className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <div className="w-full md:w-72">
              <input
                type="text"
                placeholder="Seu Nome"
                className="w-full px-8 py-4 rounded-full bg-neutral-900 border border-white/10 text-white placeholder:text-gray-500 focus:border-age-gold focus:ring-1 focus:ring-age-gold outline-none transition-all font-medium"
              />
            </div>
            <div className="w-full md:w-72">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="w-full px-8 py-4 rounded-full bg-neutral-900 border border-white/10 text-white placeholder:text-gray-500 focus:border-age-gold focus:ring-1 focus:ring-age-gold outline-none transition-all font-medium"
              />
            </div>
            <button
              type="submit"
              className="w-full md:w-auto bg-age-gold text-black font-black uppercase px-12 py-4 rounded-full hover:bg-white transition-all duration-300 shadow-xl shadow-age-gold/10 tracking-widest text-xs"
            >
              Cadastrar Agora
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
