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

      if (matchData.Checked && matchData.Checked === true) {
        continue; 
      }

      if (matchDate < now) {
        const attendance = matchData.attendance || [];

        const updatedAttendance = attendance.map((record: { hisAttendance: number; }) => {
          if (record.hisAttendance === 0) {
            record.hisAttendance = 2;
          }
          return record;
        });

        await matchDoc.ref.update({ attendance: updatedAttendance });

        await matchDoc.ref.update({ Checked: true });
      }
    }
  } catch (error) {
    console.error("Chyba při zpracování zápasů:", error);
  }
}


async function processTraining() {
  try {
    const now = new Date();
    const trainingQuery = await db.collection("Training").get();

    for (const trainingDoc of trainingQuery.docs) {
      const trainingData = trainingDoc.data();
      const trainingDate = new Date(trainingData.date + ' ' + trainingData.time);

      if (trainingData.Checked && trainingData.Checked === true) {
        continue; 
      }

      if (trainingDate < now) {
        const attendance = trainingData.attendance || [];

        const updatedAttendance = attendance.map((record: { hisAttendance: number; }) => {
          if (record.hisAttendance === 0) {
            record.hisAttendance = 2;
          }
          return record;
        });

        await trainingDoc.ref.update({ attendance: updatedAttendance });

        await trainingDoc.ref.update({ Checked: true });
      }
    }
  } catch (error) {
    console.error("Chyba při zpracování tréninků:", error);
  }
}


