import { CheckCircle } from 'lucide-react';

export default function Differentiators() {
  return (
    <section className="py-0">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Cranberry Side (Pink) */}
        <div className="bg-pink-50 p-12 md:p-24 flex flex-col justify-center items-center text-center">
          <h3 className="text-3xl font-bold text-pink-600 mb-6 uppercase">Colágeno Cranberry</h3>
          <p className="text-gray-600 mb-8 max-w-md">
            Sabor refrescante e benefícios antioxidantes para sua pele e saúde.
          </p>
          <ul className="text-left space-y-4">
            <li className="flex items-center gap-3 text-gray-700">
              <CheckCircle className="text-pink-500" size={20} />
              <span>Rico em Vitamina C</span>
            </li>
            <li className="flex items-center gap-3 text-gray-700">
              <CheckCircle className="text-pink-500" size={20} />
              <span>Melhora a elasticidade da pele</span>
            </li>
            <li className="flex items-center gap-3 text-gray-700">
              <CheckCircle className="text-pink-500" size={20} />
              <span>Fortalece unhas e cabelos</span>
            </li>
          </ul>
        </div>

        {/* Limão Side (Green) */}
        <div className="bg-lime-50 p-12 md:p-24 flex flex-col justify-center items-center text-center">
          <h3 className="text-3xl font-bold text-lime-600 mb-6 uppercase">Colágeno Limão</h3>
          <p className="text-gray-600 mb-8 max-w-md">
            Cítrico e revitalizante, perfeito para começar o dia com energia.
          </p>
          <ul className="text-left space-y-4">
            <li className="flex items-center gap-3 text-gray-700">
              <CheckCircle className="text-lime-500" size={20} />
              <span>Zero Açúcar</span>
            </li>
            <li className="flex items-center gap-3 text-gray-700">
              <CheckCircle className="text-lime-500" size={20} />
              <span>Rápida absorção</span>
            </li>
            <li className="flex items-center gap-3 text-gray-700">
              <CheckCircle className="text-lime-500" size={20} />
              <span>Auxilia nas articulações</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
