/* eslint-disable @typescript-eslint/strict-boolean-expressions */
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
      const registrationLink = `https://clubflow.vercel.app//Invite/${teamId}?email=${encodeURIComponent(email)}`;
      const mailOptions = {
        from: 'appteammanager@gmail.com',
        to: email,
        subject: 'Pozvánka do aplikace pro Florbalové kluby',

        html: 
        ` 
        <h1>Pozvánka do florbalového klubu</h1>
        <p>Dobrý den,</p>
        <p>Byli jste pozváni do naší aplikace vaším klubem. Pro dokončení přidání do klubu klikněte na následující odkaz:</p>
        <p>Registrace: <a href="${registrationLink}">${registrationLink}</a></p>
        <p>Tento odkaz vás přesměruje do aplikace, kde si můžete vytvořit svůj účet. Pokud již účet vlastníte, stačí se přihlásit, a do klubu budete přidáni automaticky.</p>
        <p>S pozdravem,</p>
        <p>Aplikace pro florbalové kluby</p>
        `,
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
