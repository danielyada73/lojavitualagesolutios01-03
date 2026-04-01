import { useEffect } from 'react';

export default function Auth() {
  useEffect(() => {
    // Redireciona diretamente para a Central do Cliente oficial da Age Solution na Yampi
    window.location.href = 'https://seguro.agesolution.com.br/auth/login';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-age-gold/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-md w-full space-y-8 bg-black/40 backdrop-blur-md p-10 rounded-[30px] border border-white/10 shadow-2xl relative z-10 text-center">
        <div className="flex flex-col items-center gap-6">
          <div className="h-12 w-12 border-4 border-age-gold border-t-transparent rounded-full animate-spin"></div>
          <div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
              Redirecionando...
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Estamos te levando para o ambiente seguro de login da Age Solution na Yampi.
            </p>
          </div>
          <button 
            onClick={() => window.location.href = 'https://seguro.agesolution.com.br/auth/login'}
            className="mt-4 px-8 py-3 bg-age-gold text-black font-bold rounded-full hover:bg-white transition-colors uppercase text-sm tracking-widest"
          >
            Acessar Agora
          </button>
        </div>
      </div>
    </div>
  );
}
