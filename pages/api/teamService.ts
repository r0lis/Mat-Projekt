import { NextApiRequest, NextApiResponse } from 'next';
import admin from "firebase-admin";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { firestore } = admin;
const db = admin.firestore();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await processTeams(); // Volání funkce pro zpracování týmů

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error in API endpoint:', error);
    console.log('Error in API endpoint:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
async function processTeams() {

  try {

    const teamsQuery = await db.collection("Team").where("Finished", "==", false).get();

    for (const teamDoc of teamsQuery.docs) {
      const teamData = teamDoc.data();
      const teamCreationTime = teamData.TimeCreated.toDate();

      const currentTime = new Date().getTime();

      const timeDifference = currentTime - teamCreationTime.getTime();
      const timeDifferenceInMinutes = Math.floor(timeDifference / 60000);
      console.log(`Rozdíl času: ${timeDifferenceInMinutes} minut.`);
      // Smazat tým, pokud není dokončen a byl vytvořen před více než 20 minutami
      if (timeDifferenceInMinutes > 20) {
        await teamDoc.ref.delete();
        console.log(`Tým ${teamData.Name} byl smazán. Protože vytvořen před více než 5 minutami.`);
      }
    }

    console.log(`Zpracování týmů dokončeno.`);
  } catch (error) {
    console.error("Chyba při zpracování týmů:", error);
  }
}

console.log("Služba týmů spuštěna...");