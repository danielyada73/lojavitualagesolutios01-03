import { Truck, Lock, CreditCard } from 'lucide-react';

export default function BenefitsBanner() {
  const benefits = [
    {
      icon: CreditCard,
      title: 'PAGUE COM CARTÃO',
      description: 'em até 12x no crédito',
    },
    {
      icon: Truck,
      title: 'FRETE GRÁTIS',
      description: 'para todo Brasil',
    },
    {
      icon: Lock,
      title: 'SITE 100% SEGURO',
      description: 'com segurança SSL',
    },
  ];

  return (
    <div className="bg-zinc-800 py-8 border-b border-zinc-700">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-4 group">
              <div className="text-age-gold transition-colors">
                <benefit.icon size={32} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-bold uppercase text-sm tracking-wide text-white">
                  {benefit.title}
                </h3>
                <p className="text-xs text-gray-300">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
