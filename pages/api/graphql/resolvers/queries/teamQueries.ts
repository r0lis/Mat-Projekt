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

export const teamQueries = {
  checkTeamEmailExistence: async (
    _: any,
    { email }: { email: string },
    context: Context
  ) => {
    try {
      if (context.user) {
        const teamQuery = context.db
          .collection("Team")
          .where("Email", "==", email);
        const teamSnapshot = await teamQuery.get();
        return !teamSnapshot.empty; // Returns true if the email is found in any team
      }
      return false;
    } catch (error) {
      console.error("Chyba při kontrole e-mailu v kolekci Team:", error);
      throw error;
    }
  },

  getTeamDetails: async (
    _: any,
    { teamId }: { teamId: string },
    context: Context
  ) => {
    if (context.user) {
      const teamQuery = context.db
        .collection("Team")
        .where("teamId", "==", teamId);
      const teamSnapshot = await teamQuery.get();
      if (!teamSnapshot.empty) {
        const teamData = teamSnapshot.docs[0].data() as Team;
        return {
          Name: teamData.Name,
          Logo: teamData.Logo,
        };
      }
    }
    return null;
  },

  getTeamMembersByEmail: async (
    _: any,
    { teamEmail }: { teamEmail: string },
    context: Context
  ) => {
    if (context.user) {
      const teamQuery = context.db
        .collection("Team")
        .where("Email", "==", teamEmail);
      const teamSnapshot = await teamQuery.get();
      if (!teamSnapshot.empty) {
        const teamData = teamSnapshot.docs[0].data() as Team;
        return teamData.MembersEmails;
      }
    }
    return null;
  },

  getTeamIdByEmail: async (
    _: any,
    { teamEmail }: { teamEmail: string },
    context: Context
  ): Promise<TeamDetails2 | null> => {
    try {
      if (context.user) {
        const teamQuery = context.db
          .collection("Team")
          .where("Email", "==", teamEmail);
        const teamSnapshot = await teamQuery.get();

        if (!teamSnapshot.empty) {
          const teamData = teamSnapshot.docs[0].data() as Team;
          return {
            teamId: teamData.teamId,
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Chyba při získávání ID týmu:", error);
      throw error;
    }
  },

  getUserRoleInTeam: async (
    _: any,
    { teamId, email }: { teamId: string; email: string },
    context: Context
  ) => {
    try {
      // Find the team by teamId
      const teamQuery = context.db
        .collection("Team")
        .where("teamId", "==", teamId);
      const teamSnapshot = await teamQuery.get();

      if (!teamSnapshot.empty) {
        const teamDoc = teamSnapshot.docs[0];

        // Find the member in the Members array
        const members = teamDoc.data().Members || [];
        const member = members.find((m: any) => m.member === email);

        if (member) {
          return {
            email: member.member, // Ensure you return a non-null value for the 'email' field
            role: member.role,
          };
        }
      }
    } catch (error) {
      console.error("Error fetching user role in team:", error);
      throw error;
    }

    return null; // Ensure you return a non-null value for the 'email' field
  },

  checkEmailsInTeam: async (
    _: any,
    { teamId, emails }: { teamId: string; emails: string[] },
    context: Context
  ) => {
    try {
      // Získat team podle teamId
      const teamQuery = context.db
        .collection("Team")
        .where("teamId", "==", teamId);
      const teamSnapshot = await teamQuery.get();

      if (!teamSnapshot.empty) {
        const teamData = teamSnapshot.docs[0].data() as Team;

        // Najít shodné e-maily v poli MembersEmails
        const duplicateEmails = emails.filter((email) =>
          teamData.MembersEmails?.includes(email)
        );

        // Vrátit e-maily, které již existují v kolekci
        return duplicateEmails;
      }

      return [];
    } catch (error) {
      console.error("Chyba při kontrole e-mailů v týmu:", error);
      throw error;
    }
  },
  getTeamLogo: async (
    _: any,
    { teamId }: { teamId: string },
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
          return teamData.Logo;
        }
      }
      return null;
    } catch (error) {
      console.error("Error getting team logo:", error);
      throw error;
    }
  },
  getTeamMembersDetails: async (
    _: any,
    { teamId }: { teamId: string },
    context: Context
  ): Promise<MemberDetails[] | null> => {
    if (context.user) {
      try {
        const teamQuery = context.db
          .collection("Team")
          .where("teamId", "==", teamId);
        const teamSnapshot = await teamQuery.get();

        if (!teamSnapshot.empty) {
          const teamData = teamSnapshot.docs[0].data();
          const membersEmails = teamData.MembersEmails || [];
          const membersRoles = teamData.Members || [];

          const membersDetails: MemberDetails[] = [];

          for (let i = 0; i < membersEmails.length; i++) {
            const email = membersEmails[i];
            const role = membersRoles[i]?.role || "No Role Assigned"; // Default role if not present

            const userQuery = context.db
              .collection("User")
              .where("Email", "==", email);
            const userSnapshot = await userQuery.get();

            const subteamQuery = context.db
              .collection("Teams")
              .where("teamId", "==", teamId);
            
            const subteamSnapshot = await subteamQuery.get();

            if (!userSnapshot.empty) {
              const userData = userSnapshot.docs[0].data() as User;
              const subteamsData = subteamSnapshot.docs.map((doc) => doc.data() as Subteam);
              const filteredSubteams = subteamsData.filter((subteam) => {
                return subteam.subteamMembers.some((member: { email: string; }) => member.email === email);
              });
              membersDetails.push({
                Name: userData.Name,
                Surname: userData.Surname,
                Picture: userData.Picture ?? null, 
                Role: role, // Add role to the returned details
                Email: userData.Email,
                DateOfBirth: userData.DateOfBirth,
                Subteams: filteredSubteams,
              });
            }
          }

          return membersDetails;
        }
      } catch (error) {
        console.error("Error getting team members details:", error);
        throw error;
      }
    }

    return null;
  },

  getTeamImg: async (
    _: any,
    { teamId }: { teamId: string },
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
          return teamData.Logo;
        }
      }
      return null;
    } catch (error) {
      console.error("Error getting team image:", error);
      throw error;
    }
  },

  getTeam: async (
    _: any,
    { teamId }: { teamId: string },
    context: Context
  ) => {
    if (context.user) {
      try {
        const teamQuery = context.db
          .collection("Team")
          .where("teamId", "==", teamId);
        const teamSnapshot = await teamQuery.get();
  
        if (!teamSnapshot.empty) {
          const teamData = teamSnapshot.docs[0].data() as Team;
  
          // Create a new object with the desired fields
          const teamDetailsWithoutMembers = {
            AdminEmail: teamData.AdminEmail,
            Email: teamData.Email,
            Logo: teamData.Logo,
            Name: teamData.Name,
            OwnerName: teamData.OwnerName,
            OwnerSurname: teamData.OwnerSurname,
            Place: teamData.Place,
            TimeCreated: teamData.TimeCreated,
            teamId: teamData.teamId,
          };
  
          return teamDetailsWithoutMembers;
        }
      } catch (error) {
        console.error("Error getting team details without members:", error);
        throw error;
      }
    }
  
    return null;
  },

  
};
