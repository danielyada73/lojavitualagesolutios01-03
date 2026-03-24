import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-age-dark text-white pt-24 pb-12 overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-age-gold/5 blur-[120px] rounded-full -mr-64 -mb-32" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* Brand Identity */}
          <div className="flex flex-col gap-8">
            <Link to="/" className="inline-block">
              <img
                src="https://agesolution.com.br/wp-content/uploads/2023/01/age-2-e1752779329574-1024x487.png"
                alt="Age Solutions"
                className="h-12 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              A excelência em suplementação premium. Fórmulas exclusivas desenvolvidas para quem não aceita nada menos que a máxima performance e beleza.
            </p>
            <div className="flex gap-4">
              {[
                { icon: <Instagram size={18} />, url: "#" },
                { icon: <Facebook size={18} />, url: "#" },
                { icon: <Youtube size={18} />, url: "#" }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.url} 
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-age-gold hover:border-age-gold transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-age-gold mb-8">Navegação</h4>
            <ul className="grid grid-cols-1 gap-4">
              {[
                { name: "Sobre a Age", path: "/about" },
                { name: "Formas de Pagamento", path: "/payment-methods" },
                { name: "Fale Conosco", path: "/contact" },
                { name: "Minha Conta", path: "/account" },
                { name: "Meus Pedidos", path: "/orders" }
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-gray-400 hover:text-white text-sm font-bold transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Policies */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-age-gold mb-8">Políticas</h4>
            <ul className="grid grid-cols-1 gap-4">
              {[
                { name: "Privacidade e Segurança", path: "/privacy" },
                { name: "Termos de Uso", path: "/terms" },
                { name: "Trocas e Devoluções", path: "/shipping-policy" },
                { name: "Entregas e Prazos", path: "/shipping-policy" }
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-gray-400 hover:text-white text-sm font-bold transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-age-gold mb-8">Newsletter</h4>
            <p className="text-gray-500 text-sm mb-6">Receba ofertas exclusivas e dicas de performance.</p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Seu e-mail" 
                className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 text-sm focus:outline-none focus:border-age-gold transition-colors"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-age-gold text-white p-2 rounded-full hover:scale-105 transition-transform">
                <ArrowRight size={20} />
              </button>
            </div>
            <div className="mt-8 pt-8 border-t border-white/5 space-y-2">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Atendimento</p>
              <p className="text-lg font-black text-white">(11) 91634-2268</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row items-center justify-between gap-8 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <span>© {currentYear} Age Solutions - Todos os direitos reservados.</span>
            <span>CNPJ: 42.081.426/0001-67</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="opacity-40">Desenvolvido por</span>
            <a href="#" className="text-gray-400 hover:text-age-gold transition-colors">Alpha Marketing</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

const ChevronRight = ({ size, className }: { size: number, className: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);
