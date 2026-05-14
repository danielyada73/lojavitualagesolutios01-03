import { useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function Newsletter() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('https://lojashopifyagesolutios.vercel.app/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });

      if (res.ok) {
        setStatus('success');
        setName('');
        setEmail('');
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'Erro ao cadastrar. Tente novamente.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Erro de conexão. Tente novamente.');
      setStatus('error');
    }
  };

  return (
    <section className="py-20 bg-black relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-age-gold opacity-10 blur-[120px] -mr-48 -mt-10" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-4 text-white uppercase italic tracking-tighter">
            Newsletter <span className="text-age-gold">Premium</span>
          </h2>
          <p className="text-gray-400 mb-10 text-sm md:text-base font-medium max-w-2xl mx-auto">
            Receba e-mails de promoções, lançamentos de produtos e muito mais diretamente no seu e-mail!
          </p>

          {status === 'success' ? (
            <div className="flex flex-col items-center gap-3 text-age-gold">
              <CheckCircle size={48} />
              <p className="text-xl font-black uppercase tracking-widest">Cadastro realizado!</p>
              <p className="text-gray-400 text-sm">Você receberá nossas novidades em breve.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <div className="w-full md:w-72">
                <input
                  type="text"
                  placeholder="Seu Nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-8 py-4 rounded-full bg-neutral-900 border border-white/10 text-white placeholder:text-gray-500 focus:border-age-gold focus:ring-1 focus:ring-age-gold outline-none transition-all font-medium"
                />
              </div>
              <div className="w-full md:w-72">
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-8 py-4 rounded-full bg-neutral-900 border border-white/10 text-white placeholder:text-gray-500 focus:border-age-gold focus:ring-1 focus:ring-age-gold outline-none transition-all font-medium"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full md:w-auto bg-age-gold text-black font-black uppercase px-12 py-4 rounded-full hover:bg-white transition-all duration-300 shadow-xl shadow-age-gold/10 tracking-widest text-xs disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <><Loader2 size={16} className="animate-spin" /> Enviando...</>
                ) : (
                  'Cadastrar Agora'
                )}
              </button>
            </form>
          )}

          {status === 'error' && (
            <p className="mt-4 text-red-400 text-sm font-medium">{errorMsg}</p>
          )}
        </div>
      </div>
    </section>
  );
}
