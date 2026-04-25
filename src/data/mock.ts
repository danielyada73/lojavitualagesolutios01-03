import { Category, Product, ProductVariation, Banner, PromotionalKit, Video } from '../types';

export const categories: Category[] = [
  {
    id: 'colageno-po',
    name: 'COLÁGENO',
    slug: 'colageno-po',
    banner_url: 'https://lh3.googleusercontent.com/d/1Ty6gz_sNRs6B9m74oLQySoYHTSZjLTpw'
  },
  {
    id: 'creatina',
    name: 'CREATINA',
    slug: 'creatina',
    banner_url: 'https://lh3.googleusercontent.com/d/1v2LbVNgaoE38QY_8LZL3_4BmNs_bjkQD'
  },
  {
    id: 'coenzima',
    name: 'COENZIMA',
    slug: 'coenzima',
    banner_url: 'https://lh3.googleusercontent.com/d/1kBR7ir_TjJ3J8ptrApjq2Lt_YQrI5uYI'
  },
  {
    id: 'omega-3',
    name: 'ÔMEGA 3',
    slug: 'omega-3',
    banner_url: 'https://lh3.googleusercontent.com/d/1kBR7ir_TjJ3J8ptrApjq2Lt_YQrI5uYI'
  },
  {
    id: 'celluli',
    name: 'CELLULI',
    slug: 'celluli',
    banner_url: 'https://lh3.googleusercontent.com/d/1kBR7ir_TjJ3J8ptrApjq2Lt_YQrI5uYI'
  },
  {
    id: 'kits',
    name: 'KITS PROMOCIONAIS',
    slug: 'kits',
    banner_url: 'https://lh3.googleusercontent.com/d/17vf7Yp0mi5tBOBrSmNMXjWNHKhEMkCKN'
  },
  {
    id: 'kits-promocionais',
    name: 'KITS PROMOCIONAIS',
    slug: 'kits-promocionais',
    banner_url: 'https://lh3.googleusercontent.com/d/17vf7Yp0mi5tBOBrSmNMXjWNHKhEMkCKN'
  }
];

const commonDetails = {
  subtitle: 'Qualidade Premium para sua saúde',
  reviews: { rating: 4.9, count: 1200 },
  main_features: {
    title: 'Principais Benefícios',
    items: ['Alta absorção', 'Matéria-prima importada', 'Resultados rápidos', 'Sem aditivos']
  },
  benefits: {
    title: 'Benefícios',
    description: 'Transforme sua saúde com suplementação de alta performance.',
    items: [
      { icon: '✨', title: 'Qualidade', description: 'Ingredientes selecionados.' },
      { icon: '💪', title: 'Performance', description: 'Resultados visíveis.' }
    ]
  },
  timeline: [
    { period: '1ª Semana', title: 'Adaptação', points: ['Primeiros sinais de melhora'] },
    { period: '4ª Semana', title: 'Resultados', points: ['Benefícios consolidados'] }
  ],
  formula: {
    title: 'Fórmula Exclusiva',
    description: 'Desenvolvida por especialistas.',
    features: [
      { icon: '🔬', title: 'Tecnologia', description: 'Processos avançados de extração' }
    ]
  },
  comparison: {
    title: 'Comparativo',
    items: [
      { attribute: 'Alta Concentração', age_solution: true, others: false },
      { attribute: 'Pureza', age_solution: true, others: false }
    ]
  },
  how_to_use: {
    title: 'Como Usar',
    description: 'Siga as instruções para melhores resultados.',
    steps: ['Consumir diariamente', 'Seguir a dosagem recomendada']
  },
  kits: [],
  testimonials: [
    { id: 't1', name: 'Cliente Satisfeita', location: 'São Paulo, SP', rating: 5, comment: 'Adorei o produto, entrega super rápida!' }
  ],
  nutrition_facts: {
    serving_size: '1 porção',
    items: [{ nutrient: 'Valor Energético', quantity: '0 kcal', daily_value: '0%' }]
  },
  faq: [
    { question: 'Qual o prazo de entrega?', answer: 'Enviamos em até 24h para SP.' }
  ]
};

export const products: Product[] = [
  // --- COLÁGENO ---
  {
    id: 'col-cran',
    category_id: 'colageno-po',
    name: 'Colágeno com Ácido Hialurônico',
    description: 'Tratamento anti-idade para pele mais jovem. Contém Ácido Hialurônico (50mg), Proteína (10g), Vitaminas B6, C, E e Zinco.',
    price: 89.90,
    original_price: 119.90,
    discount_percentage: 25,
    thumbnail_url: 'https://agesolution.com.br/wp-content/uploads/2023/01/Colageno-Andreza.webp',
    images: ['https://agesolution.com.br/wp-content/uploads/2023/01/Colageno-Andreza.webp'],
    is_popular: true,
    is_kit: false,
    details: { ...commonDetails, subtitle: 'Sabor Cranberry Delicioso' }
  },
  {
    id: 'col-lim',
    category_id: 'colageno-po',
    name: 'Colágeno: Ácido Hialurônico',
    description: `
      <div class="colageno-description" style="padding: 20px 0; font-family: var(--font-body--family);">
        <h2 style="color: #c9a15c; font-size: 24px; margin-bottom: 10px;">Tratamento anti-idade</h2>
        <h3 style="font-size: 18px; margin-bottom: 20px; font-weight: bold; line-height: 1.4;">TENHA UMA PELE MAIS JOVEM, SEM RUGAS E SEM LINHA DE EXPRESSÃO! RENOVE SUA PELE COM O COLÁGENO MAIS EFICAZ DO BRASIL!</h3>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h3 style="color: #c9a15c; font-size: 20px; margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">VANTAGENS E BENEFÍCIOS</h3>
          <ul style="list-style-type: none; padding: 0;">
            <li style="margin-bottom: 15px;">
              <strong style="font-size: 16px;">Ácido hialurônico 50mg</strong><br>
              <span style="color: #555;">Contribui para a elasticidade e resistência da pele, para a saúde das unhas e cabelos e é responsável por constituir as fibras que sustentam os tecidos do corpo - como ossos, músculos, tendões e articulações.</span>
            </li>
            <li style="margin-bottom: 15px;">
              <strong style="font-size: 16px;">PROTEÍNA 10g</strong><br>
              <span style="color: #555;">Proteínas são componentes essenciais para as células e estão presentes em quase todas as funções fisiológicas do nosso corpo. As proteínas são capazes de regenerar tecidos, além de desempenhar um papel muito importante no sistema imunológico e serem fundamentais no processo de desenvolvimento e reprodução.</span>
            </li>
            <li style="margin-bottom: 15px;">
              <strong style="font-size: 16px;">Vitamina B6, C e E</strong><br>
              <span style="color: #555;">É um antioxidante forte e eficaz que beneficia a luminosidade da pele, deixando-a mais viçosa, bonita e com aparência saudável.</span>
            </li>
            <li style="margin-bottom: 15px;">
              <strong style="font-size: 16px;">Zinco</strong><br>
              <span style="color: #555;">O zinco atua como um antioxidante fundamental para o sistema de defesa da pele; diminui a formação de radicais livres e protege as células produtoras de colágeno e as gorduras da pele. O zinco também ajuda a curar e rejuvenescer a pele. Isso porque, se existe algum corte na pele a quantidade desse mineral ao redor do corte aumenta a fim de proteger contra infecções e controlar a inflamação.</span>
            </li>
          </ul>
        </div>

        <div style="text-align: center; margin-bottom: 30px; font-weight: bold; background-color: #fff8e1; padding: 20px; border-radius: 8px;">
          <p style="font-size: 18px; color: #c9a15c; margin-bottom: 10px;">Você vai precisar de apenas 1 Scoop por dia!</p>
          <p style="color: #444;">O consumo é indicado sempre após a refeição.<br>Podendo ser após seu café da manhã ou após o almoço.</p>
        </div>

        <h3 style="color: #c9a15c; font-size: 20px; margin-bottom: 15px; text-align: center;">PRECISA DE AJUDA?</h3>
        <h4 style="font-size: 18px; margin-bottom: 10px;">Perguntas Frequentes</h4>
        <p style="margin-bottom: 20px; color: #666;">Abaixo você encontra as principais dúvidas sobre o melhor colágeno do Brasil.</p>
        
        <div style="margin-bottom: 20px;">
          <strong style="color: #333;">Em quanto tempo começa a aparecer os resultados?</strong><br>
          <span style="color: #555;">A maioria dos estudos demonstram que os resultados são visíveis a partir de 8 semanas, mas começam a ser notados a partir de 4 semanas. Resultados podem variar de organismo para organismo.</span>
        </div>
        <div style="margin-bottom: 20px;">
          <strong style="color: #333;">Como devo tomar?</strong><br>
          <span style="color: #555;">Misture 1 colher de sopa (aprox.12g) em 150ml de água, consumir uma vez ao dia.</span>
        </div>
        <div style="margin-bottom: 20px;">
          <strong style="color: #333;">Qual o prazo de entrega?</strong><br>
          <span style="color: #555;">Em média despachamos o produto em até 24hs após comprovação do pagamento. Utilizamos a transportadora Kangu para agilizar a entrega:<br>
          Região Sudeste – de 1 a 8 dias úteis<br>
          Região Sul – de 1 a 9 dias úteis<br>
          Região Centro-Oeste – de 1 a 10 dias úteis<br>
          Região Nordeste – de 2 a 14 dias úteis<br>
          Região Norte – de 3 a 15 dias úteis</span>
        </div>
        <div style="margin-bottom: 20px;">
          <strong style="color: #333;">Contém alguma contraindicação?</strong><br>
          <span style="color: #555;">Gestantes, nutrizes, lactantes e crianças (até 3 anos) somente devem consumir este produto sob orientação de nutricionistas ou médicos. Não exceder a recomendação diária de consumo.</span>
        </div>
        <div style="margin-bottom: 20px;">
          <strong style="color: #333;">Os ingredientes são naturais?</strong><br>
          <span style="color: #555;">Sim, Priorizamos sempre a qualidade! Por isso não utilizamos corantes artificiais, malto e nem conservantes!</span>
        </div>
      </div>
    `,
    price: 89.90,
    original_price: 119.90,
    discount_percentage: 25,
    thumbnail_url: 'https://lh3.googleusercontent.com/d/1_4bIoGpjxCTkgd6_idrMqbN7Zf_V8VoO',
    images: ['https://lh3.googleusercontent.com/d/1_4bIoGpjxCTkgd6_idrMqbN7Zf_V8VoO'],
    is_popular: true,
    is_kit: false,
    details: { ...commonDetails, subtitle: 'Sabor Limão Refrescante' }
  },
  {
    id: 'col-kit-2',
    category_id: 'colageno-po',
    name: 'Colágeno com Ácido Hialurônico - Kit com 2',
    description: 'Sabores disponíveis: Cranberry e Limão',
    price: 139.90,
    original_price: 239.90,
    discount_percentage: 41,
    thumbnail_url: 'https://lh3.googleusercontent.com/d/1alfY7lxdTMx2TJ20snzubh8F05kUlelx',
    images: ['https://lh3.googleusercontent.com/d/1alfY7lxdTMx2TJ20snzubh8F05kUlelx'],
    is_popular: true,
    is_kit: true,
    details: { ...commonDetails, subtitle: 'Kit Econômico 2 Potes' }
  },
  {
    id: '137428494', // Colágeno Verisol 3 Potes (Yampi)
    category_id: 'colageno-po',
    name: 'Colágeno com Ácido Hialurônico - Kit com 3',
    description: 'Sabores disponíveis: Cranberry e Limão',
    price: 179.90,
    original_price: 359.90,
    discount_percentage: 50,
    thumbnail_url: 'https://lh3.googleusercontent.com/d/1spHD4PqpZW6Bj-pZvauiAISpyGpOywfq',
    images: ['https://lh3.googleusercontent.com/d/1spHD4PqpZW6Bj-pZvauiAISpyGpOywfq'],
    is_popular: true,
    is_kit: true,
    variations: [{ id: '137428494', product_id: '137428494', name: 'Kit 3 Potes', price: 179.90 }],
    details: { ...commonDetails, subtitle: 'Kit Tratamento Completo 3 Potes' }
  },

  // --- CREATINA ---
  {
    id: 'cre-ind',
    category_id: 'creatina',
    name: 'Creatina 100% pura 300g',
    description: 'Aumento de força, explosão muscular e recuperação acelerada. 100% pura monohidratada.',
    price: 79.90,
    original_price: 119.90,
    discount_percentage: 33,
    thumbnail_url: 'https://agesolution.com.br/wp-content/uploads/2025/02/promo-320-x-500-px.png',
    images: ['https://agesolution.com.br/wp-content/uploads/2025/02/promo-320-x-500-px.png'],
    is_popular: true,
    is_kit: false,
    details: { ...commonDetails, subtitle: 'Força e Explosão Muscular' }
  },
  {
    id: 'cre-kit-2',
    category_id: 'creatina',
    name: 'Creatina 100% Pura - Kit com 2',
    description: '2 potes de 300g cada',
    price: 139.90,
    original_price: 239.80,
    discount_percentage: 42,
    thumbnail_url: 'https://lh3.googleusercontent.com/d/10yQnidB-VchjwD8ZFc9Ax2RkftUVhyoT',
    images: ['https://lh3.googleusercontent.com/d/10yQnidB-VchjwD8ZFc9Ax2RkftUVhyoT'],
    is_popular: true,
    is_kit: true,
    details: { ...commonDetails, subtitle: 'Kit Duplo 2 Potes' }
  },
  {
    id: 'cre-kit-3',
    category_id: 'creatina',
    name: 'Creatina 100% Pura - Kit com 3',
    description: '3 potes de 300g cada',
    price: 199.90,
    original_price: 299.70,
    discount_percentage: 33,
    thumbnail_url: 'https://lh3.googleusercontent.com/d/11siijMM1Fl-c5ETHBfb2o2-2JIxT9ko5',
    images: ['https://lh3.googleusercontent.com/d/11siijMM1Fl-c5ETHBfb2o2-2JIxT9ko5'],
    is_popular: true,
    is_kit: true,
    details: { ...commonDetails, subtitle: 'Kit Atleta 3 Potes' }
  },

  // --- COENZIMA ---
  {
    id: 'coenz-ind',
    category_id: 'coenzima',
    name: 'Coenzima Q10',
    description: 'Potente ação antioxidante, controle do colesterol e energia celular.',
    price: 49.90,
    original_price: 62.38,
    discount_percentage: 20,
    thumbnail_url: 'https://agesolution.com.br/wp-content/uploads/2023/01/coenzima-q10.webp',
    images: ['https://agesolution.com.br/wp-content/uploads/2023/01/coenzima-q10.webp'],
    is_popular: true,
    is_kit: false,
    details: { ...commonDetails, subtitle: 'Energia Celular e Coração Forte' }
  },
  {
    id: '137428502', // Coenzima Q10 3 Potes (Yampi)
    category_id: 'coenzima',
    name: 'Coenzima Q10 - Kit com 3',
    description: '3 potes de 60 cápsulas',
    price: 129.90,
    original_price: 187.14,
    discount_percentage: 30,
    thumbnail_url: 'https://lh3.googleusercontent.com/d/17FKIVWECEUSfgkXNUB46Sl6U6EOBjj1e',
    images: ['https://lh3.googleusercontent.com/d/17FKIVWECEUSfgkXNUB46Sl6U6EOBjj1e'],
    is_popular: true,
    is_kit: true,
    variations: [{ id: '137428502', product_id: '137428502', name: 'Kit 3 Potes', price: 129.90 }],
    details: { ...commonDetails, subtitle: 'Kit Saúde 3 Potes' }
  },
  {
    id: 'coenz-kit-5',
    category_id: 'coenzima',
    name: 'Coenzima Q10 - Kit com 5',
    description: '5 potes de 60 cápsulas',
    price: 189.90,
    original_price: 311.90,
    discount_percentage: 39,
    thumbnail_url: 'https://lh3.googleusercontent.com/d/1z764f5Ozo0qBgXsbHAjHASNF_zghzS8e',
    images: ['https://lh3.googleusercontent.com/d/1z764f5Ozo0qBgXsbHAjHASNF_zghzS8e'],
    is_popular: true,
    is_kit: true,
    details: { ...commonDetails, subtitle: 'Kit Longevidade 5 Potes' }
  },

  // --- CELLULI ---
  {
    id: 'cell-ind',
    category_id: 'celluli',
    name: 'Celluli Burn 100% Natural',
    description: '60 cápsulas de 500 mg/cada.',
    price: 39.90,
    original_price: 49.88,
    discount_percentage: 20,
    thumbnail_url: 'https://lh3.googleusercontent.com/d/1tOBC8M0mpnAkHCUtZntZLf-PiWzcWMTo',
    images: ['https://lh3.googleusercontent.com/d/1tOBC8M0mpnAkHCUtZntZLf-PiWzcWMTo'],
    is_popular: true,
    is_kit: false,
    details: { ...commonDetails, subtitle: 'Combate a Celulite e Retenção' }
  },
  {
    id: '137428501', // Celluli Burn 3 Potes (Yampi)
    category_id: 'celluli',
    name: 'Celluli Burn - Kit com 3',
    description: '3 potes de 60 cápsulas',
    price: 99.90,
    original_price: 149.64,
    discount_percentage: 33,
    thumbnail_url: 'https://lh3.googleusercontent.com/d/1450UF0tdiT5sjxv7CJZJeh4CuZpNZAAY',
    images: ['https://lh3.googleusercontent.com/d/1450UF0tdiT5sjxv7CJZJeh4CuZpNZAAY'],
    is_popular: true,
    is_kit: true,
    variations: [{ id: '137428501', product_id: '137428501', name: 'Kit 3 Potes', price: 99.90 }],
    details: { ...commonDetails, subtitle: 'Kit Redução de Medidas 3 Potes' }
  },
  {
    id: 'cell-kit-5',
    category_id: 'celluli',
    name: 'Celluli Burn - Kit com 5',
    description: '5 potes de 60 cápsulas',
    price: 149.90,
    original_price: 249.40,
    discount_percentage: 40,
    thumbnail_url: 'https://lh3.googleusercontent.com/d/1rIKr_pT7RFEz6tVAGo3PQICq4EtT2JIU',
    images: ['https://lh3.googleusercontent.com/d/1rIKr_pT7RFEz6tVAGo3PQICq4EtT2JIU'],
    is_popular: true,
    is_kit: true,
    details: { ...commonDetails, subtitle: 'Kit Transformação 5 Potes' }
  },

  // --- OMEGA 3 ---
  {
    id: 'omega-ind',
    category_id: 'omega-3',
    name: 'Ômega 3 60 Cápsulas',
    description: 'Alta concentração de EPA, DHA e ALA. Saúde cardiovascular e cerebral.',
    price: 59.90,
    original_price: 79.90,
    discount_percentage: 25,
    thumbnail_url: 'https://agesolution.com.br/wp-content/uploads/2025/07/OMEGA-3-MOCKUP.webp',
    images: ['https://agesolution.com.br/wp-content/uploads/2025/07/OMEGA-3-MOCKUP.webp'],
    is_popular: true,
    is_kit: false,
    details: { ...commonDetails, subtitle: 'Saúde Cardiovascular e Cerebral' }
  },
  {
    id: 'omega-kit-3',
    category_id: 'omega-3',
    name: 'Ômega 3 - Kit com 3',
    description: '3 potes de 120 cápsulas',
    price: 149.90,
    original_price: 239.70,
    discount_percentage: 37,
    thumbnail_url: 'https://placehold.co/500x500/black/gold?text=Omega+3+Kit', // Placeholder
    images: ['https://placehold.co/500x500/black/gold?text=Omega+3+Kit'],
    is_popular: true,
    is_kit: true,
    details: { ...commonDetails, subtitle: 'Kit Família 3 Potes' }
  }
];

export const productVariations: ProductVariation[] = [
  { id: '1', product_id: 'col-cran', name: 'Cranberry', price_modifier: 0 },
  { id: '2', product_id: 'col-lim', name: 'Limão', price_modifier: 0 },
];

export const banners: Banner[] = [
  {
    id: '1',
    title: 'VOCÊ EM ALTA PERFORMANCE',
    description: '3 CREATINAS 300g 100% PURA DE R$ 239,70 POR: R$ 149,90',
    image_url: 'https://lh3.googleusercontent.com/d/1yy_f33w_qx8zf4aPOE3vM2WVcK_Jz_fC',
    mobile_image_url: 'https://lh3.googleusercontent.com/d/1bkYo7vC0vGjc7rj98TvsvFjfqvUEG2FI',
    target_url: '/category/creatina',
    is_active: true
  }
];

export const differentialsImages = [
  'https://lh3.googleusercontent.com/d/1_0yv33mvmhPTljKde8mF9RP1MxejoL9i',
  'https://lh3.googleusercontent.com/d/1N2QgM0Pbr17M3XPUEeE1kZjUjuaqmei-',
  'https://lh3.googleusercontent.com/d/1q87Plm6aU5X30YCUSdqxRFTnfcUr-FIr'
];

export const colagenoOffers = [
  // Keeping this for backward compatibility if used elsewhere, but main data is now in products
  {
    id: 'col-1',
    name: 'Colágeno com Ácido Hialurônico Sabor Cranberry',
    description: 'Sabores disponíveis do colágeno: Cranberry e Limão',
    price: 89.90,
    original_price: 119.90,
    installment_price: 7.49,
    installment_count: 12,
    discount_percentage: 25,
    thumbnail_url: 'https://lh3.googleusercontent.com/d/1jkQtn2c2AeRD-CkRk7PJi-6ulyk1jHjp',
    is_kit: false
  },
  {
    id: 'col-2',
    name: 'Colágeno com Ácido Hialurônico - Kit com 2',
    description: 'Sabores disponíveis do colágeno: Cranberry e Limão',
    price: 139.90,
    original_price: 239.80,
    installment_price: 11.66,
    installment_count: 12,
    discount_percentage: 42,
    thumbnail_url: 'https://lh3.googleusercontent.com/d/1alfY7lxdTMx2TJ20snzubh8F05kUlelx',
    is_kit: true
  },
  {
    id: 'col-3',
    name: 'Colágeno com Ácido Hialurônico - Kit com 3',
    description: 'Sabores disponíveis do colágeno: Cranberry e Limão',
    price: 179.90,
    original_price: 359.70,
    installment_price: 14.99,
    installment_count: 12,
    discount_percentage: 50,
    thumbnail_url: 'https://lh3.googleusercontent.com/d/1spHD4PqpZW6Bj-pZvauiAISpyGpOywfq',
    is_kit: true
  }
];

export const promotionalKits: PromotionalKit[] = [
  {
    id: '1',
    name: '3 Potes Celluli Burn',
    description: '180 cápsulas de 500 mg/cada',
    base_price: 119.70,
    discount_percentage: 41,
    thumbnail_url: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: '2',
    name: '3 Potes Colágeno Verisol',
    description: '180 cápsulas de 500 mg/cada',
    base_price: 149.70,
    discount_percentage: 53,
    thumbnail_url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=500&auto=format&fit=crop'
  }
];

export const videos: Video[] = [
  {
    id: '1',
    product_id: '1',
    title: 'Conheça o Colágeno Age',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=500&auto=format&fit=crop'
  }
];
