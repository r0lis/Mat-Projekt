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
} from "./../../types";
import "firebase/storage";
import * as admin from "firebase-admin";

export const userQueries = {
  user: async (_: any, { id }: { id: string }, context: Context) => {},

  heartbeat: () => true,

  checkUserMembership: async (
    _: any,
    { teamId, currentUserEmail }: { teamId: string; currentUserEmail: string },
    context: Context
  ) => {
    try {
      if (context.user) {
        const teamQuery = context.db
          .collection("Team")
          .where("teamId", "==", teamId);
        const teamSnapshot = await teamQuery.get();

        if (!teamSnapshot.empty) {
          const teamData = teamSnapshot.docs[0].data() as Team;
          return teamData.MembersEmails?.includes(currentUserEmail) || false;
        }
      }
      return false;
    } catch (error) {
      console.error("Error checking user membership:", error);
      throw error;
    }
  },

  checkUserMembershipInvite: async (
    _: any,
    { teamId, currentUserEmail }: { teamId: string; currentUserEmail: string },
    context: Context
  ) => {
    try {

        const teamQuery = context.db.collection("Team").where("teamId", "==", teamId);
        const teamSnapshot = await teamQuery.get();

        if (!teamSnapshot.empty) {
          const teamData = teamSnapshot.docs[0].data() as Team;
          const Is_member =teamData.MembersEmails?.includes(currentUserEmail) || false;
          return Is_member;
        }
      
      return false;
    } catch (error) {
      console.error("Error checking user membership:", error);
      throw error;
    }
  },

  getUserByNameAndSurname: async (
    _: any,
    { email }: { email: string },
    context: Context
  ) => {
    if (context.user) {
      const userQuery = context.db.collection("User").where("Email", "==", email);
      const userSnapshot = await userQuery.get();
      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data() as User;
        return {
          Name: userData.Name,
          Surname: userData.Surname,
          Id: userData.IdUser,
        };
      }
    }
    return null;
  },

  getUserTeamsByEmail: async (
    _: any,
    { email }: { email: string },
    context: Context
  ) => {
    if (context.user) {
      const userQuery = context.db.collection("User").where("Email", "==", email);
      const userSnapshot = await userQuery.get();
      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data() as User;

        const teamIds = userData.IdTeam;
        const teams = [];

        for (const teamId of teamIds) {
          const teamQuery = context.db
            .collection("Team")
            .where("teamId", "==", teamId)
            .where("Finished", "==", true);
          const teamSnapshot = await teamQuery.get();
          if (!teamSnapshot.empty) {
            const teamData = teamSnapshot.docs[0].data() as Team;
            teams.push({ teamId: teamData.teamId, Name: teamData.Name });
          }
        }

        return teams;
      }
    }
    return null;
  },


};
