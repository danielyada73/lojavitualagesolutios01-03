import { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email } = req.body || {};

  if (!name || !email) {
    return res.status(400).json({ error: 'Nome e e-mail são obrigatórios.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Serviço de e-mail não configurado.' });
  }

  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      from: 'Newsletter Age Solutions <onboarding@resend.dev>',
      to: 'marketing@anutrition.com.br',
      subject: 'Inscrição na Newsletter — Age Solutions',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
          <h2 style="color: #c9a15c; margin-bottom: 8px;">Nova inscrição na Newsletter</h2>
          <p style="color: #555; margin-bottom: 24px;">Uma pessoa acabou de se inscrever na newsletter da <strong>Age Solutions</strong>.</p>
          <table style="width: 100%; border-collapse: collapse; background: #f9f9f9; border-radius: 8px; overflow: hidden;">
            <tr>
              <td style="padding: 16px 20px; font-weight: bold; color: #333; border-bottom: 1px solid #eee; width: 120px;">Nome</td>
              <td style="padding: 16px 20px; color: #555; border-bottom: 1px solid #eee;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 16px 20px; font-weight: bold; color: #333;">E-mail</td>
              <td style="padding: 16px 20px; color: #555;">${email}</td>
            </tr>
          </table>
          <p style="color: #aaa; font-size: 12px; margin-top: 32px;">Enviado automaticamente pela loja Age Solutions.</p>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('[Newsletter] Erro ao enviar e-mail:', error);
    return res.status(500).json({ error: 'Erro ao enviar e-mail. Tente novamente.' });
  }
}
