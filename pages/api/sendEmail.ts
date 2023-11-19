/* eslint-disable @typescript-eslint/strict-boolean-expressions */
// pages/api/sendEmail.ts
import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { emails } = req.body;

  if (!emails || !Array.isArray(emails) || emails.length === 0) {
    return res.status(400).json({ error: 'Invalid or empty email list.' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'appteammanager@gmail.com', // Nahraďte svou e-mailovou adresou
      pass: 'igxh nnhl rwvy alzf', // Nahraďte heslem své e-mailové adresy

    },
  });

  const mailOptions = {
    from: 'appteammanager@gmail.com', // Nahraďte svou e-mailovou adresou
    subject: 'Pozvánka na registraci',
    text: 'Registrace: http://localhost/UserRegistration', // Nahraďte URL své aplikace
  };

  try {
    for (const email of emails) {
      const optionsWithEmail = { ...mailOptions, to: email };
      await transporter.sendMail(optionsWithEmail);
      console.log(`E-mail úspěšně odeslán na ${email}`);
    }

    res.status(200).json({ message: 'E-maily úspěšně odeslány.' });
  } catch (error) {
    console.error('Chyba při odesílání e-mailů:', error);
    res.status(500).json({ error: 'Chyba při odesílání e-mailů.' });
  }
}
