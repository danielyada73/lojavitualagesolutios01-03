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
    name: 'Colágeno: Ácido Hialurônico',
    description: 'Sabor: Cranberry. 60 cápsulas.',
    price: 89.90,
    original_price: 112.38,
    discount_percentage: 20,
    thumbnail_url: 'https://lh3.googleusercontent.com/d/1lq7WT4FVW0oTzqd8k0KNhwa40t8YF_pD',
    images: ['https://lh3.googleusercontent.com/d/1lq7WT4FVW0oTzqd8k0KNhwa40t8YF_pD'],
    is_popular: true,
    is_kit: false,
    details: { ...commonDetails, subtitle: 'Sabor Cranberry Delicioso' }
  },
  {
    id: 'col-lim',
    category_id: 'colageno-po',
    name: 'Colágeno: Ácido Hialurônico',
    description: 'Sabor: Limão. 60 cápsulas.',
    price: 89.90,
    original_price: 112.38,
    discount_percentage: 20,
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
    original_price: 239.80,
    discount_percentage: 42,
    thumbnail_url: 'https://lh3.googleusercontent.com/d/1alfY7lxdTMx2TJ20snzubh8F05kUlelx',
    images: ['https://lh3.googleusercontent.com/d/1alfY7lxdTMx2TJ20snzubh8F05kUlelx'],
    is_popular: true,
    is_kit: true,
    details: { ...commonDetails, subtitle: 'Kit Econômico 2 Potes' }
  },
  {
    id: 'col-kit-3',
    category_id: 'colageno-po',
    name: 'Colágeno com Ácido Hialurônico - Kit com 3',
    description: 'Sabores disponíveis: Cranberry e Limão',
    price: 179.90,
    original_price: 359.70,
    discount_percentage: 50,
    thumbnail_url: 'https://lh3.googleusercontent.com/d/1spHD4PqpZW6Bj-pZvauiAISpyGpOywfq',
    images: ['https://lh3.googleusercontent.com/d/1spHD4PqpZW6Bj-pZvauiAISpyGpOywfq'],
    is_popular: true,
    is_kit: true,
    details: { ...commonDetails, subtitle: 'Kit Tratamento Completo 3 Potes' }
  },

  // --- CREATINA ---
  {
    id: 'cre-ind',
    category_id: 'creatina',
    name: 'Creatina 100% Pura',
    description: 'Pote com 300g. 100% pura monohidratada.',
    price: 79.90,
    original_price: 119.90,
    discount_percentage: 33,
    thumbnail_url: 'https://lh3.googleusercontent.com/d/1wRqYe-LAEDgfpTx6gieddtbuwBKOHcxB',
    images: ['https://lh3.googleusercontent.com/d/1wRqYe-LAEDgfpTx6gieddtbuwBKOHcxB'],
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
    name: 'Coenzima Q10 100% Natural',
    description: '60 cápsulas de 500 mg/cada.',
    price: 49.90,
    original_price: 62.38,
    discount_percentage: 20,
    thumbnail_url: 'https://lh3.googleusercontent.com/d/12i1-zNojutljuRZKVlNo4dfWcHy9124I',
    images: ['https://lh3.googleusercontent.com/d/12i1-zNojutljuRZKVlNo4dfWcHy9124I'],
    is_popular: true,
    is_kit: false,
    details: { ...commonDetails, subtitle: 'Energia Celular e Coração Forte' }
  },
  {
    id: 'coenz-kit-3',
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
    id: 'cell-kit-3',
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
    name: 'Ômega 3 Ultra Concentrado',
    description: '120 cápsulas. Alta concentração de EPA e DHA.',
    price: 59.90,
    original_price: 79.90,
    discount_percentage: 25,
    thumbnail_url: 'https://placehold.co/500x500/black/gold?text=Omega+3', // Placeholder
    images: ['https://placehold.co/500x500/black/gold?text=Omega+3'],
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
