import { useState } from 'react';

export default function Newsletter() {
  return (
    <section className="py-16 bg-age-gold">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-2 text-black">
            Cadastre-se em nossa Newsletter!
          </h2>
          <p className="text-black/80 mb-8 text-sm">
            Receba e-mails de promoções, lançamentos de produtos e muito mais!
          </p>
          
          <form className="flex flex-col md:flex-row gap-4 justify-center">
            <input 
              type="text" 
              placeholder="Seu Nome" 
              className="px-6 py-4 rounded-full border-2 border-black/10 focus:border-black focus:ring-0 w-full md:w-64 bg-white text-black placeholder:text-gray-400 font-medium"
            />
            <input 
              type="email" 
              placeholder="Seu e-mail" 
              className="px-6 py-4 rounded-full border-2 border-black/10 focus:border-black focus:ring-0 w-full md:w-64 bg-white text-black placeholder:text-gray-400 font-medium"
            />
            <button 
              type="submit" 
              className="bg-black text-white font-bold uppercase px-10 py-4 rounded-full hover:bg-gray-900 transition-all duration-300 shadow-xl hover:shadow-black/20 tracking-widest"
            >
              Cadastrar e-mail
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
