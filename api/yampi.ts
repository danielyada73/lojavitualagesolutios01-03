import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const alias = process.env.VITE_YAMPI_ALIAS || process.env.YAMPI_ALIAS;
    const userToken = process.env.VITE_YAMPI_TOKEN || process.env.YAMPI_TOKEN;
    const userSecretKey = process.env.VITE_YAMPI_SECRET_KEY || process.env.YAMPI_SECRET_KEY;

    if (!alias || !userToken || !userSecretKey) {
        return res.status(500).json({ error: 'Yampi API credentials are not configured on the server.' });
    }

    const { endpoint, method = 'GET', body } = req.body || {};

    if (!endpoint) {
        return res.status(400).json({ error: 'Endpoint is required in the request body.' });
    }

    const BASE_URL = `https://api.dooki.com.br/v2/${alias}`;
    const url = `${BASE_URL}${endpoint}`;

    try {
        const options: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'User-Token': userToken,
                'User-Secret-Key': userSecretKey,
            },
        };

        if (body && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
            options.body = JSON.stringify(body);
        }

        const externalResponse = await fetch(url, options);
        const data = await externalResponse.json();

        if (!externalResponse.ok) {
            return res.status(externalResponse.status).json({
                error: 'Error from Yampi API',
                details: data
            });
        }

        return res.status(200).json(data);
    } catch (error: any) {
        console.error('API Route Error fetching from Yampi:', error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}
