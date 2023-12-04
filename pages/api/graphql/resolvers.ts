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
  UpdatedMemberInput,
  CreateUserInput,
  CreateTeamInput,
  NameAndSurname,
  TeamDetails,
  Query,
  CreateUserToTeamInput,
  TeamDetails2,
} from "./types";
import 'firebase/storage';




async function addUserToTeam(context: Context,adminEmail: any, teamId: String) {
  const userQuery = context.db.collection("User").where("Email", "==", adminEmail);
  const userSnapshot = await userQuery.get();
  if (!userSnapshot.empty) {
    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data() as User;

    userData.IdTeam.push(teamId);

    await userDoc.ref.update({ IdTeam: userData.IdTeam });
  }
}

export const resolvers = {
  Query: {
    user: async (_: any, { id }: { id: string }, context: Context) => {},

    heartbeat: () => true,

    checkTeamEmailExistence: async (
      _: any,
      { email }: { email: string },
      context: Context
    ) => {
      try {
        if (context.user) {
          const teamQuery = context.db.collection("Team").where("Email", "==", email);
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
        const teamQuery = context.db.collection("Team").where("teamId", "==", teamId);
        const teamSnapshot = await teamQuery.get();
        if (!teamSnapshot.empty) {
          const teamData = teamSnapshot.docs[0].data() as Team;
          return {
            Name: teamData.Name,
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
        const teamQuery = context.db.collection("Team").where("Email", "==", teamEmail);
        const teamSnapshot = await teamQuery.get();
        if (!teamSnapshot.empty) {
          const teamData = teamSnapshot.docs[0].data() as Team;
          return teamData.MembersEmails;
        }
      }
      return null;
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
              .where("teamId", "==", teamId);
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

    getTeamIdByEmail: async (
        _: any,
        { teamEmail }: { teamEmail: string },
        context: Context
      ): Promise<TeamDetails2 | null> => {
        try {
          if (context.user) {
            const teamQuery = context.db.collection("Team").where("Email", "==", teamEmail);
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
  },

  Mutation: {
    createUser: async (
      _: any,
      { input }: { input: CreateUserInput },
      context: Context
    ) => {
      try {
        const newUserDoc = context.db.collection("User").doc();
        const userId = newUserDoc.id;
        const teamId: never[] = [];
        const IsAdmin = 0;

        const newUser = {
          Name: input.Name,
          Surname: input.Surname,
          IdUser: userId,
          IdTeam: teamId,
          Email: input.Email,
          IsAdmin: IsAdmin,
        };

        await newUserDoc.set(newUser);

        return newUser;
      } catch (error) {
        console.error("Chyba při vytváření uživatele:", error);
        throw error;
      }
    },

    createUserToTeam: async (
        _: any,
        { input }: { input: CreateUserToTeamInput },
        context: Context

      ) => {
        try {
          const newUserDoc = context.db.collection("User").doc();
          const userId = newUserDoc.id;
          const teamId = input.IdTeam;
          const IsAdmin = 0;
  
          const newUser = {
            Name: input.Name,
            Surname: input.Surname,
            IdUser: userId,
            IdTeam: teamId,
            Email: input.Email,
            IsAdmin: IsAdmin,
          };
  
          await newUserDoc.set(newUser);
  
          return newUser;
        } catch (error) {
          console.error("Chyba při vytváření uživatele:", error);
          throw error;
        }
      },

    createTeam: async (
      _: any,
      { input }: { input: CreateTeamInput },
      context: Context
    ) => {
      try {
        const newTeamDoc = context.db.collection("Team").doc();
        const teamId = newTeamDoc.id;
        await addUserToTeam(context,input.AdminEmail, teamId);

        const newTeam = {
          Name: input.Name,
          teamId: teamId,
          AdminEmail: input.AdminEmail,
          MembersEmails: input.MembersEmails,
          Email: input.Email,
          Logo: input.Logo,
          Place: input.Place,
          OwnerName: input.OwnerName,
          OwnerSurname: input.OwnerSurname,
          Finished: false,
          TimeCreated: firestore.Timestamp.now(),
        };

        await newTeamDoc.set(newTeam);

        return newTeam;
      } catch (error) {
        console.error("Chyba při vytváření týmu:", error);
        throw error;
      }
    },

    updateUserRoles: async (
      _: any,
      {
        teamEmail,
        updatedMembers,
      }: { teamEmail: string; updatedMembers: UpdatedMemberInput[] },
      context: Context
    ) => {
      try {
        if (context.user) {
          const teamQuery = context.db
            .collection("Team")
            .where("Email", "==", teamEmail);
          const teamSnapshot = await teamQuery.get();

          if (!teamSnapshot.empty) {
            const teamDoc = teamSnapshot.docs[0];

            await teamDoc.ref.update({ Members: updatedMembers });
            // Fetch the updated data after the update
            const updatedTeamQuery = context.db
              .collection("Team")
              .where("Email", "==", teamEmail);
            const updatedTeamSnapshot = await updatedTeamQuery.get();

            if (!updatedTeamSnapshot.empty) {
              const updatedTeamData =
                updatedTeamSnapshot.docs[0].data() as Team;

              return {
                Members: updatedMembers,
              };
            }
          }
        }
        return null;
      } catch (error) {
        console.error("Chyba při aktualizaci rolí uživatelů:", error);
        throw error;
      }
    },

    addUserToTeam: async (
      _: any,
      { email, teamId }: { email: string; teamId: string },
      context: Context
    ) => {
      try {
        const userQuery = context.db.collection("User").where("Email", "==", email);
        const userSnapshot = await userQuery.get();
        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          const userData = userDoc.data() as User;

          // Add teamId to the IdTeam array
          userData.IdTeam.push(teamId);

          await userDoc.ref.update({ IdTeam: userData.IdTeam });

          return true;
        }
        return false;
      } catch (error) {
        console.error("Error adding user to team:", error);
        throw error;
      }
    },

    updateTeamFinished: async (
      _: any,
      { teamEmail }: { teamEmail: string },
      context: Context
    ) => {
      try {
        if (context.user) {
          // Najít tým podle e-mailu
          const teamQuery = context.db.collection("Team").where("Email", "==", teamEmail);
          const teamSnapshot = await teamQuery.get();

          if (!teamSnapshot.empty) {
            // Aktualizovat hodnotu Finished na true
            const teamDoc = teamSnapshot.docs[0];
            await teamDoc.ref.update({ Finished: true });

            return true;
          }
        }
        return false;
      } catch (error) {
        console.error("Chyba při aktualizaci stavu týmu:", error);
        throw error;
      }
    },

    deleteTeamByEmail: async (
      _: any,
      { email }: { email: string },
      context: Context
    ) => {
      try {
        if (context.user) {
          // Najít tým podle e-mailu
          const teamQuery = context.db.collection("Team").where("Email", "==", email);
          const teamSnapshot = await teamQuery.get();

          if (!teamSnapshot.empty) {
            // Odstranit tým
            const teamDoc = teamSnapshot.docs[0];
            await teamDoc.ref.delete();

            return true;
          }
        }
        return false;
      } catch (error) {
        console.error("Chyba při mazání týmu:", error);
        throw error;
      }
    },

    deleteUserByEmail: async (
      _: any,
      { email }: { email: string },
      context: Context
    ) => {
      try {
        if (context.user) {
          const userQuery = context.db.collection("User").where("Email", "==", email);
          const userSnapshot = await userQuery.get();
          if (!userSnapshot.empty) {
            const userDoc = userSnapshot.docs[0];
            await userDoc.ref.delete();
            return true;
          }
        }
        return false;
      } catch (error) {
        console.error("Chyba při mazání uživatele:", error);
        throw error;
      }
    },
  },
};
