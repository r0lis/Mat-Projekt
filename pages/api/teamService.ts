/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { NextApiRequest, NextApiResponse } from 'next';
import { firestore } from "firebase-admin";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const db = firestore();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await processTeams(); 
    await processMatches();
    await processTraining();

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
      if (timeDifferenceInMinutes > 40) {
        await teamDoc.ref.delete();
        console.log(`Tým ${teamData.Name} byl smazán. Protože vytvořen před více než 5 minutami.`);
      }
    }

  } catch (error) {
    console.error("Chyba při zpracování týmů:", error);
  }
}

async function processMatches() {
  try {
    const now = new Date();
    const matchesQuery = await db.collection("Match").get();

    for (const matchDoc of matchesQuery.docs) {
      const matchData = matchDoc.data();
      const matchDate = new Date(matchData.date + ' ' + matchData.time);

      // Pokud je datum a čas zápasu starší než aktuální čas, provede se změna hisAttendance
      if (matchDate < now) {
        const attendance = matchData.attendance || [];

        // Procházení účasti a změna hisAttendance na 1, pokud je 0
        const updatedAttendance = attendance.map((record: { hisAttendance: number; }) => {
          if (record.hisAttendance === 0) {
            record.hisAttendance = 2;
          }
          return record;
        });

        // Aktualizace účasti v dokumentu
        await matchDoc.ref.update({ attendance: updatedAttendance });
     }
    }
  } catch (error) {
    console.error("Chyba při zpracování zápasů:", error);
  }
}

async function processTraining() {
  try {
    const now = new Date();
    const matchesQuery = await db.collection("Training").get();

    for (const matchDoc of matchesQuery.docs) {
      const matchData = matchDoc.data();
      const matchDate = new Date(matchData.date + ' ' + matchData.time);

      // Pokud je datum a čas zápasu starší než aktuální čas, provede se změna hisAttendance
      if (matchDate < now) {
        const attendance = matchData.attendance || [];

        // Procházení účasti a změna hisAttendance na 1, pokud je 0
        const updatedAttendance = attendance.map((record: { hisAttendance: number; }) => {
          if (record.hisAttendance === 0) {
            record.hisAttendance = 2;
          }
          return record;
        });

        // Aktualizace účasti v dokumentu
        await matchDoc.ref.update({ attendance: updatedAttendance });
     }
    }
  } catch (error) {
    console.error("Chyba při zpracování zápasů:", error);
  }
}

