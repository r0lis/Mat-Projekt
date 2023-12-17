/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
import { firestore } from "firebase-admin";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import {
  Context,
  User,
  Team,
  TeamDetails2,
  MemberDetails,
  Subteam,
} from "./../../types";
import "firebase/storage";
import * as admin from "firebase-admin";

export const subteamQueries = {
    getSubteamData: async (
        _: any,
        { teamId }: { teamId: string },
        context: Context
      ): Promise<Subteam[] | null> => {
        try {
          if (context.user) {
            const subteamQuery = context.db
              .collection("Teams")  // Ujistěte se, že používáte správné jméno kolekce
              .where("teamId", "==", teamId);
            const subteamSnapshot = await subteamQuery.get();
    
            if (!subteamSnapshot.empty) {
              const subteamsData = subteamSnapshot.docs.map((doc) => doc.data() as Subteam);
              return subteamsData;
            }
          }
          return null;
        } catch (error) {
          console.error("Chyba při získávání dat o subtýmu:", error);
          throw error;
        }
      },

      getYourSubteamData: async (
        _: any,
        { teamId, email }: { teamId: string, email: string },
        context: Context
      ): Promise<Subteam[] | null> => {
        try {
          if (context.user) {
            const subteamQuery = context.db
              .collection("Teams")
              .where("teamId", "==", teamId);
            
            const subteamSnapshot = await subteamQuery.get();
      
            if (!subteamSnapshot.empty) {
              const subteamsData = subteamSnapshot.docs.map((doc) => doc.data() as Subteam);
              const filteredSubteams = subteamsData.filter((subteam) => {
                return subteam.subteamMembers.some((member: { email: string; }) => member.email === email);
              });
              return filteredSubteams;
            }
          }
          return null;
        } catch (error) {
          console.error("Error fetching subteam data:", error);
          throw error;
        }
      },

      getSubteamDetails: async (
        _: any,
        { subteamId }: { subteamId: string },
        context: Context
      ): Promise<Subteam | null> => {
        try {
          if (context.user) {
            const subteamDoc = await context.db.collection("Teams").doc(subteamId).get();
    
            if (subteamDoc.exists) {
              const subteamData = subteamDoc.data() as Subteam;
              return subteamData;
            }
          }
    
          return null;
        } catch (error) {
          console.error("Error fetching subteam details:", error);
          throw error;
        }
      },
  };