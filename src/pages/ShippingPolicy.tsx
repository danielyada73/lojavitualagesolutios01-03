import React from 'react';
import { RefreshCcw, Package, HelpCircle, AlertTriangle, Truck, CreditCard, Mail, Phone } from 'lucide-react';

export default function ShippingPolicy() {
  return (
    <div className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 italic text-black">
            Política de Troca e Devolução
          </h1>
          <div className="w-24 h-1 bg-age-gold mx-auto"></div>
          <p className="mt-6 text-gray-500 font-medium uppercase tracking-widest text-sm text-center">
            Age Solutions — Transparência e Respeito
          </p>
        </div>

        <div className="prose prose-lg max-w-none text-gray-600 font-medium">
          <p className="mb-8 leading-relaxed">
            Na Age Solutions, queremos que a tua experiência seja simples e segura. Por isso, a nossa política segue o Código de Defesa do Consumidor e foi feita para proteger você e garantir a integridade dos produtos.
          </p>

          {/* 1) Prazo de arrependimento */}
          <section className="mb-12 bg-gray-50 p-8 rounded-[40px] border border-gray-100">
            <h2 className="text-2xl font-black text-black uppercase italic tracking-tight mb-6 flex items-center gap-3">
              <RefreshCcw className="text-age-gold" /> 1) Prazo de arrependimento
            </h2>
            <p className="mb-4 text-gray-700">A devolução de qualquer produto por desistência só pode ser feita no prazo de até <strong>7 (sete) dias corridos</strong>, a contar da data de entrega para compras realizadas pela Internet. Para que o valor da compra seja devolvido, deverá ser encaminhado em sua embalagem original, sem qualquer indício de violação do lacre original do fabricante ou de uso. Deve ser realizada a devolução com o acompanhamento da DANFE (Nota Fiscal Eletrônica), e de todos os produtos contidos no pedido.</p>
            <p className="mt-4 text-sm bg-red-50 p-4 rounded-xl text-red-800 border border-red-100 italic">
              <strong>Atenção:</strong> Por se tratar de produtos para consumo e/ou uso pessoal, não aceitamos devolução de itens abertos, consumidos, utilizados ou com lacre violado, por questões de higiene e segurança.
            </p>
          </section>

          {/* 2) Devolução de kits */}
          <section className="mb-12 p-8">
            <h2 className="text-2xl font-black text-black uppercase italic tracking-tight mb-6 flex items-center gap-3">
              <Package className="text-age-gold" /> 2) Devolução de kits e combos promocionais
            </h2>
            <p className="mb-4">Os kits disponíveis em nosso site possuem um valor promocional especial, resultado da compra combinada de dois ou mais produtos.</p>
            <p className="mb-4">Em casos de devolução ou solicitação de estorno parcial (quando apenas um dos itens do kit for devolvido ou apresentar avaria), o valor a ser reembolsado será calculado proporcionalmente ao valor total pago pelo kit com desconto, e não com base no preço individual dos produtos fora do kit.</p>
            <p className="text-sm italic">Essa regra se aplica a situações de desistência de um item do kit, produto com defeito ou avaria, ou qualquer outra solicitação parcial de reembolso relacionada ao kit.</p>
          </section>

          {/* 3) Como solicitar */}
          <section className="mb-12 bg-black text-white p-10 rounded-[40px] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-age-gold/10 rounded-full blur-[80px] -mr-20 -mt-20"></div>
            <h2 className="text-2xl font-black text-age-gold uppercase italic tracking-tight mb-8 flex items-center gap-3 relative z-10">
              <HelpCircle /> 3) Como solicitar troca ou devolução
            </h2>
            <div className="space-y-6 relative z-10">
              <p>Quando o cliente deseja devolver um produto, ele deve entrar em contacto com o nosso suporte. Assim que o produto chega ao nosso centro de distribuição, fazemos uma análise para verificar se ele está em condições. Em seguida, geramos um voucher no valor do produto ou realizamos o estorno.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                  <p className="text-xs uppercase text-gray-400 font-bold mb-1">E-mail</p>
                  <p className="font-bold">contato@agesolution.com.br</p>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                  <p className="text-xs uppercase text-gray-400 font-bold mb-1">WhatsApp</p>
                  <p className="font-bold">(11) 91634-2268</p>
                </div>
              </div>
              <div className="bg-age-gold/10 p-6 rounded-2xl border border-age-gold/20">
                <p className="text-sm italic mb-0"><strong>Informe ao suporte:</strong> número do pedido, motivo da solicitação, fotos/vídeos (se houver avaria), e se prefere reembolso, troca (se disponível) ou voucher.</p>
              </div>
            </div>
          </section>

          {/* 4) Troca por defeito */}
          <section className="mb-12 p-8 border-l-4 border-age-gold bg-gray-50 rounded-r-[40px]">
            <h2 className="text-2xl font-black text-black uppercase italic tracking-tight mb-6 flex items-center gap-3">
              <AlertTriangle className="text-red-500" /> 4) Troca por defeito, avaria ou item divergente
            </h2>
            <p className="mb-4 italic">No caso de produtos com defeito, o prazo é de até 90 dias (duráveis) ou 30 dias (não duráveis) contados do recebimento. O cliente deve nos contatar imediatamente e <strong>não descartar ou consumir o produto</strong>.</p>
            <ul className="text-sm space-y-2 list-none p-0">
              <li className="flex gap-2"><span className="text-age-gold font-bold">●</span> O produto passará por análise técnica.</li>
              <li className="flex gap-2"><span className="text-age-gold font-bold">●</span> Se o defeito for confirmado, você escolhe: estorno, troca ou voucher.</li>
              <li className="flex gap-2"><span className="text-age-gold font-bold">●</span> Se <strong>não</strong> houver defeito, o produto é retornado ao cliente.</li>
            </ul>
            <p className="mt-4 text-sm font-bold">Item divergente ou faltante: não descarte nada, contacte imediatamente com fotos da caixa e etiquetas.</p>
          </section>

          {/* 5) Recusa */}
          <section className="mb-12 p-8">
            <h2 className="text-2xl font-black text-black uppercase italic tracking-tight mb-6 flex items-center gap-3">
              <Truck className="text-age-gold" /> 5) Recusa da encomenda no ato da entrega
            </h2>
            <p className="mb-4">Verifique a encomenda no ato do recebimento. Recuse imediatamente e escreva o motivo no verso da nota fiscal caso observe:</p>
            <div className="grid grid-cols-2 gap-4 text-sm font-bold">
              <div className="bg-gray-100 p-3 rounded-lg flex items-center gap-2"> Produto avariado</div>
              <div className="bg-gray-100 p-3 rounded-lg flex items-center gap-2"> Embalagem violada</div>
              <div className="bg-gray-100 p-3 rounded-lg flex items-center gap-2"> Item em desacordo</div>
              <div className="bg-gray-100 p-3 rounded-lg flex items-center gap-2"> Falta de item</div>
            </div>
          </section>

          {/* 6) Reembolso */}
          <section className="mb-12 bg-gray-50 p-8 rounded-[40px] border border-gray-100">
            <h2 className="text-2xl font-black text-black uppercase italic tracking-tight mb-6 flex items-center gap-3">
              <CreditCard className="text-age-gold" /> 6) Reembolso: como devolvemos o valor pago
            </h2>
            <p className="mb-6 text-sm">A Age Solutions fará a restituição utilizando a mesma forma de pagamento escolhida no processo da compra.</p>
            <div className="space-y-4">
              <div className="flex gap-4 items-start border-b border-gray-200 pb-4">
                <div className="w-10 h-10 bg-black text-age-gold rounded-full flex items-center justify-center flex-shrink-0 font-bold italic">CC</div>
                <p className="text-sm"><strong>Cartão de Crédito:</strong> A administradora será notificada e o estorno ocorrerá na fatura seguinte ou posterior, de uma só vez. O prazo depende exclusivamente da administradora.</p>
              </div>
              <div className="flex gap-4 items-start border-b border-gray-200 pb-4">
                <div className="w-10 h-10 bg-black text-age-gold rounded-full flex items-center justify-center flex-shrink-0 font-bold italic">BL</div>
                <p className="text-sm"><strong>Boleto Bancário:</strong> O estorno será via depósito bancário em até 48 horas úteis após o recebimento e análise do(s) produto(s).</p>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-black text-age-gold rounded-full flex items-center justify-center flex-shrink-0 font-bold italic">PX</div>
                <p className="text-sm"><strong>PIX:</strong> O estorno é feito de forma imediata após a aprovação da análise técnica.</p>
              </div>
            </div>
          </section>

          {/* 7) Endereço incorreto */}
          <section className="mb-12 p-8 bg-yellow-50 rounded-[40px] border border-yellow-100">
            <h2 className="text-2xl font-black text-black uppercase italic tracking-tight mb-6 flex items-center gap-3">
              <AlertTriangle className="text-yellow-600" /> 7) Endereço incorreto ou incompleto
            </h2>
            <p className="text-sm leading-relaxed">
              Caso houver erro por parte do cliente no endereço de entrega ou ausência de informação e a encomenda entre em processo de retorno, o frete para reenvio será de responsabilidade do cliente. Se optar pelo cancelamento, o valor pago (exceto frete) será estornado assim que a encomenda for recebida em nossa sede.
            </p>
          </section>

          {/* 8) Canais oficiais */}
          <section className="mt-16 text-center bg-black text-white p-12 rounded-[50px]">
            <h2 className="text-3xl font-black text-age-gold uppercase italic tracking-tighter mb-8">
              8) Canais Oficiais de Suporte
            </h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto italic">Nossa equipe está pronta para resolver qualquer ocorrência com agilidade e respeito.</p>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="mailto:contato@agesolution.com.br" className="flex items-center gap-3 bg-white/5 px-6 py-4 rounded-2xl hover:bg-age-gold hover:text-black transition-all">
                <Mail size={20} />
                <span className="font-bold">contato@agesolution.com.br</span>
              </a>
              <a href="tel:5511916342268" className="flex items-center gap-3 bg-white/5 px-6 py-4 rounded-2xl hover:bg-age-gold hover:text-black transition-all">
                <Phone size={20} />
                <span className="font-bold">(11) 91634-2268</span>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
