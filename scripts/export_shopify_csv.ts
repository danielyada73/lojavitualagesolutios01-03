import fs from 'fs';
import path from 'path';

// Dados MESTRE com imagens reais e tags corrigidas
const allProductsToExport = [
    // --- COLÁGENO ÁCIDO HIALURÔNICO ---
    { handle: 'col-cran', title: 'Colágeno: Ácido Hialurônico (Cranberry)', body: 'Sabor: Cranberry. 60 cápsulas.', type: 'Colágeno', price: 89.90, comparePrice: 112.38, image: 'https://lh3.googleusercontent.com/d/1lq7WT4FVW0oTzqd8k0KNhwa40t8YF_pD', tags: 'colageno, acid-hialuronic, cranberry' },
    { handle: 'col-lim', title: 'Colágeno: Ácido Hialurônico (Limão)', body: 'Sabor: Limão. 60 cápsulas.', type: 'Colágeno', price: 89.90, comparePrice: 112.38, image: 'https://lh3.googleusercontent.com/d/1_4bIoGpjxCTkgd6_idrMqbN7Zf_V8VoO', tags: 'colageno, acid-hialuronic, limao' },
    { handle: 'col-kit-2', title: 'Colágeno com Ácido Hialurônico - Kit com 2', body: '2 Potes. Sabores: Cranberry ou Limão.', type: 'Kits', price: 139.90, comparePrice: 239.80, image: 'https://lh3.googleusercontent.com/d/1alfY7lxdTMx2TJ20snzubh8F05kUlelx', tags: 'kit, colageno' },
    { handle: 'col-kit-3', title: 'Colágeno com Ácido Hialurônico - Kit com 3', body: '3 Potes. Sabores: Cranberry ou Limão.', type: 'Kits', price: 179.90, comparePrice: 359.70, image: 'https://lh3.googleusercontent.com/d/1spHD4PqpZW6Bj-pZvauiAISpyGpOywfq', tags: 'kit, colageno, mais-vendido' },
    { handle: 'col-kit-6', title: 'Colágeno com Ácido Hialurônico - Kit com 6', body: '6 Potes. Tratamento Intensivo.', type: 'Kits', price: 299.90, comparePrice: 719.90, image: 'https://lh3.googleusercontent.com/d/1spHD4PqpZW6Bj-pZvauiAISpyGpOywfq', tags: 'kit, colageno' },

    // --- CREATINA ---
    { handle: 'cre-ind', title: 'Creatina 100% Pura - 300g', body: 'Pote com 300g. 100% pura monohidratada.', type: 'Creatina', price: 79.90, comparePrice: 119.90, image: 'https://lh3.googleusercontent.com/d/1wRqYe-LAEDgfpTx6gieddtbuwBKOHcxB', tags: 'creatina, pureza' },
    { handle: 'cre-kit-2', title: 'Creatina 100% Pura - Kit com 2', body: '2 Potes de 300g.', type: 'Kits', price: 139.90, comparePrice: 239.80, image: 'https://lh3.googleusercontent.com/d/10yQnidB-VchjwD8ZFc9Ax2RkftUVhyoT', tags: 'kit, creatina' },
    { handle: 'cre-kit-3', title: 'Creatina 100% Pura - Kit com 3', body: '3 Potes de 300g.', type: 'Kits', price: 199.90, comparePrice: 299.70, image: 'https://lh3.googleusercontent.com/d/11siijMM1Fl-c5ETHBfb2o2-2JIxT9ko5', tags: 'kit, creatina, mais-vendido' },

    // --- COENZIMA Q10 ---
    { handle: 'coenz-ind', title: 'Coenzima Q10 100% Natural', body: '60 cápsulas de 500 mg.', type: 'Coenzima', price: 49.90, comparePrice: 109.90, image: 'https://lh3.googleusercontent.com/d/12i1-zNojutljuRZKVlNo4dfWcHy9124I', tags: 'coenzima, saude-celular' },
    { handle: 'coenz-kit-2', title: 'Coenzima Q10 - Kit com 2', body: '120 cápsulas totais.', type: 'Kits', price: 65.90, comparePrice: 219.90, image: 'https://lh3.googleusercontent.com/d/1FrI2Fg4bqDkuoacT9aywxkfBqnDaNCo3', tags: 'kit, coenzima' },
    { handle: 'coenz-kit-3', title: 'Coenzima Q10 - Kit com 3', body: '180 cápsulas totais.', type: 'Kits', price: 99.90, comparePrice: 329.90, image: 'https://lh3.googleusercontent.com/d/17FKIVWECEUSfgkXNUB46Sl6U6EOBjj1e', tags: 'kit, coenzima, mais-vendido' },
    { handle: 'coenz-kit-6', title: 'Coenzima Q10 - Kit com 6', body: '360 cápsulas totais.', type: 'Kits', price: 179.90, comparePrice: 659.90, image: 'https://lh3.googleusercontent.com/d/1z764f5Ozo0qBgXsbHAjHASNF_zghzS8e', tags: 'kit, coenzima' },

    // --- CELLULI BURN ---
    { handle: 'cell-ind', title: 'Celluli Burn 100% Natural - 1 Pote', body: '60 cápsulas de 500 mg.', type: 'Celluli Burn', price: 39.90, comparePrice: 99.90, image: 'https://lh3.googleusercontent.com/d/1tOBC8M0mpnAkHCUtZntZLf-PiWzcWMTo', tags: 'celluli, emagrecimento' },
    { handle: 'cell-kit-2', title: 'Celluli Burn - Kit com 2', body: '120 cápsulas totais.', type: 'Kits', price: 55.90, comparePrice: 199.90, image: 'https://lh3.googleusercontent.com/d/1rIKr_pT7RFEz6tVAGo3PQICq4EtT2JIU', tags: 'kit, celluli' },
    { handle: 'cell-kit-3', title: 'Celluli Burn - Kit com 3', body: '180 cápsulas totais.', type: 'Kits', price: 69.90, comparePrice: 299.90, image: 'https://lh3.googleusercontent.com/d/1450UF0tdiT5sjxv7CJZJeh4CuZpNZAAY', tags: 'kit, celluli, mais-vendido' },
    { handle: 'cell-kit-6', title: 'Celluli Burn - Kit com 6', body: '360 cápsulas totais.', type: 'Kits', price: 119.90, comparePrice: 599.90, image: 'https://lh3.googleusercontent.com/d/1450UF0tdiT5sjxv7CJZJeh4CuZpNZAAY', tags: 'kit, celluli' },

    // --- COLÁGENO VERISOL (FOTOS REAIS) ---
    { handle: 'verisol-ind', title: '1 Pote Colágeno Verisol', body: '60 cápsulas de 500 mg.', type: 'Colágeno', price: 39.90, comparePrice: 99.90, image: 'https://lh3.googleusercontent.com/d/1Y6x63-ucORHZ6uiRdcUJS0Hg19t1a2BB', tags: 'colageno, verisol' },
    { handle: 'verisol-kit-2', title: '2 Potes Colágeno Verisol', body: '120 cápsulas totais.', type: 'Kits', price: 55.90, comparePrice: 199.90, image: 'https://lh3.googleusercontent.com/d/15EA9Itgo7VmVNm_9dadIpaY-NvcfF3b8', tags: 'kit, colageno, verisol' },
    { handle: 'verisol-kit-3', title: '3 Potes Colágeno Verisol', body: '180 cápsulas totais.', type: 'Kits', price: 69.90, comparePrice: 299.90, image: 'https://lh3.googleusercontent.com/d/1H15nQWZblvjbNqYBrKDgurKNHqBNTvjA', tags: 'kit, colageno, verisol, mais-vendido' },
    { handle: 'verisol-kit-6', title: '6 Potes Colágeno Verisol', body: '360 cápsulas totais.', type: 'Kits', price: 119.90, comparePrice: 599.90, image: 'https://lh3.googleusercontent.com/d/1H15nQWZblvjbNqYBrKDgurKNHqBNTvjA', tags: 'kit, colageno, verisol' },

    // --- ÔMEGA 3 ---
    { handle: 'omega-ind', title: 'Ômega 3 Ultra Concentrado', body: '120 cápsulas. Alta concentração EPA/DHA.', type: 'Ômega 3', price: 59.90, comparePrice: 79.90, image: 'https://placehold.co/500x500/black/gold?text=Omega+3', tags: 'omega, saude-cardiovascular' },
    { handle: 'omega-kit-3', title: 'Ômega 3 - Kit com 3', body: '3 potes de 120 cápsulas.', type: 'Kits', price: 149.90, comparePrice: 239.70, image: 'https://placehold.co/500x500/black/gold?text=Omega+3+Kit', tags: 'kit, omega' },
];

const headers = [
    'Handle', 'Title', 'Body (HTML)', 'Vendor', 'Type', 'Tags', 'Published',
    'Option1 Name', 'Option1 Value', 'Variant Price', 'Variant Compare At Price',
    'Variant Inventory Tracker', 'Variant Inventory Qty', 'Variant Inventory Policy',
    'Variant Fulfillment Service', 'Variant Requires Shipping', 'Variant Taxable',
    'Image Src', 'Status'
];

const csvRows = [headers.join(',')];

allProductsToExport.forEach(p => {
    const row = [
        p.handle,
        `"${p.title.replace(/"/g, '""')}"`,
        `"${p.body.replace(/"/g, '""')}"`,
        '"Age Solutions"',
        `"${p.type}"`,
        `"${p.tags}"`,
        'TRUE',
        'Title', 'Default Title',
        p.price.toString(),
        p.comparePrice.toString(),
        'shopify', '100', 'deny', 'manual', 'TRUE', 'TRUE',
        p.image,
        'active'
    ];
    csvRows.push(row.join(','));
});

const csvContent = csvRows.join('\n');
const outputPath = path.join(process.cwd(), 'shopify_products_import.csv');

fs.writeFileSync(outputPath, csvContent, 'utf8');

console.log(`✅ CSV MESTRE gerado: ${allProductsToExport.length} itens.`);
console.log('👉 Importe novamente no Shopify Admin e marque a opção para SUBSTITUIR produtos existentes.');
