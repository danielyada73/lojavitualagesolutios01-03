import { Facebook, Instagram, Youtube, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white text-gray-800 pt-16 pb-8 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand & Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-black">Age Solution</h3>
            <p className="text-sm text-gray-600 mb-4">
              © 2026 Alpha Group Nutrition LTDA.<br />
              Rua Frederico Rene de Jaegher, 1085,<br />
              Sala 4, Rio Bonito, São Paulo - SP, CEP 04826-010. CNPJ: 42.081.426/0001-67
            </p>

            <h4 className="font-bold mb-4 mt-6">Redes Sociais</h4>
            <div className="flex gap-4">
              <a href="#" className="text-age-gold hover:text-black transition-colors no-underline">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-age-gold hover:text-black transition-colors no-underline">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-age-gold hover:text-black transition-colors no-underline">
                <div className="w-6 h-6 flex items-center justify-center font-bold border border-current rounded-full text-[10px]">Tk</div>
              </a>
            </div>
          </div>

          {/* Links Úteis */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-black">Links Úteis</h3>
            <ul className="space-y-3 text-sm text-gray-600 font-medium">
              <li><Link to="/about" className="text-gray-600 hover:text-age-gold transition-colors italic no-underline">Sobre Nós</Link></li>
              <li><Link to="/payment-methods" className="text-gray-600 hover:text-age-gold transition-colors italic no-underline">Formas de Pagamento</Link></li>
              <li><Link to="/shipping-policy" className="text-gray-600 hover:text-age-gold transition-colors italic no-underline">Políticas de Troca e Devolução</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-age-gold transition-colors italic no-underline">Segurança e Privacidade</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-age-gold transition-colors italic no-underline">Termos e Condições</Link></li>
            </ul>
          </div>

          {/* Relacionamento */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-black">Relacionamento</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>Central de Atendimento:</li>
              <li className="font-bold">(11) 91634-2268</li>
              <li className="mt-4">Horário de atendimento:</li>
              <li>Segunda a sexta-feira das 8h às 18h.</li>
            </ul>
          </div>

          {/* Formas de Pagamento */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-black">Formas de Pagamento</h3>
            <div className="grid grid-cols-4 gap-2">
              {[
                { name: 'Visa', url: 'https://img.icons8.com/color/48/000000/visa.png' },
                { name: 'Mastercard', url: 'https://img.icons8.com/color/48/000000/mastercard.png' },
                { name: 'Amex', url: 'https://img.icons8.com/color/48/000000/amex.png' },
                { name: 'Diners', url: 'https://img.icons8.com/color/48/000000/diners-club.png' },
                { name: 'Discover', url: 'https://img.icons8.com/color/48/000000/discover.png' },
                { name: 'Elo', url: '/elo.svg' },
                { name: 'Hipercard', url: '/hipercard.svg' },
                { name: 'Pix', url: 'https://img.icons8.com/color/48/000000/pix.png' }
              ].map((card, i) => (
                <div key={i} className="bg-white h-10 rounded flex items-center justify-center p-1 border border-gray-100 shadow-sm overflow-hidden">
                  <img src={card.url} alt={card.name} className="!h-full !w-auto !max-w-full object-contain" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 mt-8 flex flex-col items-center gap-4">
          <img
            src="https://agesolution.com.br/wp-content/uploads/2023/01/age-2-e1752779329574-1024x487.png"
            alt="Age Solutions"
            className="!h-16 !max-h-16 !w-auto !max-w-[200px] object-contain filter grayscale opacity-50 hover:opacity-100 transition-opacity"
          />
          <a
            href="https://marketingalphadigital.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 text-xs text-center hover:text-age-gold transition-colors no-underline"
          >
            Site desenvolvido por ALPHA MARKETING DIGITAL
          </a>
        </div>
      </div>
    </footer>
  );
}
