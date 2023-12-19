/* eslint-disable @typescript-eslint/strict-boolean-expressions */
// pages/api/sendEmail.ts
import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { emails, teamId } = req.body;

  if (!emails || !Array.isArray(emails) || emails.length === 0) {
    return res.status(400).json({ error: 'Invalid or empty email list.' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'appteammanager@gmail.com',
      pass: 'igxh nnhl rwvy alzf',
    },
  });

  try {
    for (const email of emails) {
      const token = generateUniqueToken();
      const registrationLink = `https://team-app-sand.vercel.app/Invite/${teamId}?email=${encodeURIComponent(email)}&token=${token}`;
      const mailOptions = {
        from: 'appteammanager@gmail.com',
        to: email,
        subject: 'Pozvánka na registraci',
        html: `Registrace: <a href="${registrationLink}">${registrationLink}</a>`,
      };

      await transporter.sendMail(mailOptions);
      console.log(`E-mail úspěšně odeslán na ${email}`);
      console.log(`Registrace: ${registrationLink}`);
    }

    res.status(200).json({ message: 'E-maily úspěšně odeslány.' });
  } catch (error) {
    console.error('Chyba při odesílání e-mailů:', error);
    res.status(500).json({ error: 'Chyba při odesílání e-mailů.' });
  }
}
function generateUniqueToken() {
  const tokenLength = 16;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';

  for (let i = 0; i < tokenLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters[randomIndex];
  }

  return token;
}
