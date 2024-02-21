/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { firestore } from "firebase-admin";

const db = firestore();

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
            record.hisAttendance = 1;
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

export default processMatches;
