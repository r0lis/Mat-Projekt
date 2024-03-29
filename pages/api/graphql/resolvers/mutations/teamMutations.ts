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
  MemberDetails,
} from "../../types";
import "firebase/storage";
import * as admin from "firebase-admin";

const generateRandomString = (length: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

async function addUserToTeam(
  context: Context,
  adminEmail: any,
  teamId: String
) {
  const userQuery = context.db
    .collection("User")
    .where("Email", "==", adminEmail);
  const userSnapshot = await userQuery.get();
  if (!userSnapshot.empty) {
    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data() as User;

    userData.IdTeam.push(teamId);

    await userDoc.ref.update({ IdTeam: userData.IdTeam });
  }
}

export const teamMutations = {
  uploadImageTeam: async (
    _: any,
    { imageBase64, teamEmail }: { imageBase64: string; teamEmail: string },
    context: Context
  ) => {
    try {
      // Decode the base64 image
      const imageBuffer = Buffer.from(
        imageBase64.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );

      // Generate a unique filename for the image
      const filename = `team_logos/${teamEmail}_${Date.now()}.jpg`;

      // Reference to the Firebase Storage bucket
      const bucket = admin.storage().bucket();

      // Upload the image to Firebase Storage
      await bucket.file(filename).save(imageBuffer, {
        metadata: {
          contentType: "image/jpeg", // Adjust the content type based on your image type
        },
      });

      // Get the signed URL for the uploaded image
      const [downloadUrl] = await bucket.file(filename).getSignedUrl({
        action: "read",
        expires: "03-09-2491", // Adjust the expiration date as needed
      });

      // Update the team document with the download URL
      const teamQuery = context.db
        .collection("Team")
        .where("Email", "==", teamEmail);
      const teamSnapshot = await teamQuery.get();

      if (!teamSnapshot.empty) {
        const teamDoc = teamSnapshot.docs[0];
        await teamDoc.ref.update({ Logo: downloadUrl });
      }

      return downloadUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
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
      const teamId = generateRandomString(30);
      const timeCreated = new Date();
      const formattedTimeCreated = `${timeCreated.getDate()}.${timeCreated.getMonth() + 1}. ${timeCreated.getFullYear()}`;

      await addUserToTeam(context, input.AdminEmail, teamId);


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
        TimeCreated: formattedTimeCreated,
      };

      await newTeamDoc.set(newTeam);

      return newTeam;
    } catch (error) {
      console.error("Chyba při vytváření týmu:", error);
      throw error;
    }
  },

  updateMembers: async (
    _: any,
    { teamId, newMembers }: any,
    context: {
      user: any;
      db: {
        collection: (arg0: string) => {
          (): any;
          new (): any;
          where: { (arg0: string, arg1: string, arg2: any): any; new (): any };
        };
      };
    }
  ) => {
    try {
      if (context.user) {
        // Fetch the team by teamId
        const teamQuery = context.db
          .collection("Team")
          .where("teamId", "==", teamId);
        const teamSnapshot = await teamQuery.get();

        if (!teamSnapshot.empty) {
          const teamDoc = teamSnapshot.docs[0];
          const existingMembers = teamDoc.data().Members || [];
          const existingEmails = teamDoc.data().MembersEmails || [];

          // Transform newMembers array into the desired format
          const updatedMembers = [
            ...existingMembers,
            ...newMembers.map((email: any) => ({ member: email, role: 0 })),
          ];

          // Combine new emails with existing ones
          const updatedEmails = [...existingEmails, ...newMembers];

          // Update both Members and MembersEmails
          await teamDoc.ref.update({
            Members: updatedMembers,
            MembersEmails: updatedEmails,
          });
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating members:", error);
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
            const updatedTeamData = updatedTeamSnapshot.docs[0].data() as Team;

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
      const userQuery = context.db
        .collection("User")
        .where("Email", "==", email);
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
        const teamQuery = context.db
          .collection("Team")
          .where("Email", "==", teamEmail);
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
        const teamQuery = context.db
          .collection("Team")
          .where("Email", "==", email);
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

  updateMemberRole: async (
    _: any,
    { email, role, docDate, teamId }: { email: string; role: string; docDate: string, teamId: string },
    context: Context
  ) => {
    try {
      // Find the team by teamId in the Team collection
      const teamQuery = context.db
        .collection("Team")
        .where("teamId", "==", teamId);
      const teamSnapshot = await teamQuery.get();

      if (!teamSnapshot.empty) {
        const teamDoc = teamSnapshot.docs[0];

        // Update the role of the specified member in the Members array
        const existingMembers = teamDoc.data().Members || [];
        const updatedMembers = existingMembers.map((member: any) => {
          if (member.member === email) {
            // Adjust the field name here
            return { ...member, role, docDate };
          }
          return member;
        });

        // Update the Members field in the database
        await teamDoc.ref.update({ Members: updatedMembers });

        // Return the updated member details
        const updatedMemberDetails = {
          Name: "", // Get the name from the User collection or other source
          Surname: "", // Get the surname from the User collection or other source
          Role: role,
          docDate: docDate,
          Email: email,
        };
        // Now, find the teams by teamId in the Teams collection
        const teamsQuery = context.db
          .collection("Teams")
          .where("teamId", "==", teamId);
        const teamsSnapshot = await teamsQuery.get();
  
        if (!teamsSnapshot.empty) {
          // Iterate through each document and update the member role in subteamMembers array
          for (const teamDoc of teamsSnapshot.docs) {
            const existingSubteamMembers = teamDoc.data().subteamMembers || [];
            const updatedSubteamMembers = existingSubteamMembers.map((subteamMember: any) => {
              if (subteamMember.email === email) {
                return { ...subteamMember, role };
              }
              return subteamMember;
            });
            // Update the subteamMembers field in the database
            await teamDoc.ref.update({ subteamMembers: updatedSubteamMembers });
          }
        }
  
        return updatedMemberDetails;
      }
      return null;
    } catch (error) {
      console.error("Error updating member role:", error);
      throw error;
    }
  },

  updateMemberMedicalDoc: async (
    _: any,
    { email, doc, teamId }: { email: string; doc: string; teamId: string },
    context: Context
  ) => {
    try {

      const imageBuffer = Buffer.from(
        doc.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );

      // Generate a unique filename for the image
      const filename = `user_medical/${email}_${Date.now()}.jpg`;

      const bucket = admin.storage().bucket();

      // Upload the image to Firebase Storage
      await bucket.file(filename).save(imageBuffer, {
        metadata: {
          contentType: "image/jpeg", // Adjust the content type based on your image type
        },
      });

      // Get the signed URL for the uploaded image
      const [downloadUrl] = await bucket.file(filename).getSignedUrl({
        action: "read",
        expires: "03-09-2491", // Adjust the expiration date as needed
      });

      // Find the team by teamId
      const teamQuery = context.db
        .collection("Team")
        .where("teamId", "==", teamId);
      const teamSnapshot = await teamQuery.get();

      if (!teamSnapshot.empty) {
        const teamDoc = teamSnapshot.docs[0];

        // Update the role of the specified member in the Members array
        const existingMembers = teamDoc.data().Members || [];
        const updatedMembers = existingMembers.map((member: any) => {
          if (member.member == email) {
            return { ...member, downloadUrl };
          }
          return member;
        });

        // Update the Members field in the database
        console.log(updatedMembers);

        await teamDoc.ref.update({ Members: updatedMembers });

        // Return the updated member details
        const updatedMemberDetails = {
          Name: "", // Get the name from the User collection or other source
          Surname: "", // Get the surname from the User collection or other source
          doc: downloadUrl,
          Email: email,
        };

        return updatedMemberDetails;
      }
      return null;
    } catch (error) {
      console.error("Error updating member role:", error);
      throw error;
    }
  },

  deleteMember: async (
    _: any,
    { teamId, memberEmail }: { teamId: string; memberEmail: string },
    context: Context
  ) => {
    try {
      if (context.user) {
        // Find all teams with the given teamId in the Team collection
        const teamQuery = context.db
          .collection("Team")
          .where("teamId", "==", teamId);
        const teamSnapshot = await teamQuery.get();
  
        if (!teamSnapshot.empty) {
          // Iterate over each team with the given teamId
          teamSnapshot.forEach(async (teamDoc) => {
            const existingMembers = teamDoc.data().Members || [];
  
            // Remove the specified memberEmail from Members
            const updatedMembers = existingMembers.filter(
              (member: { member: string; role: string }) =>
                member.member !== memberEmail
            );
  
            // Update the Members field in the database for each team
            await teamDoc.ref.update({ Members: updatedMembers });
  
            // Also remove the member from MembersEmails if present
            const existingMembersEmails = teamDoc.data().MembersEmails || [];
            const updatedMembersEmails = existingMembersEmails.filter(
              (email: string) => email !== memberEmail
            );
  
            // Update the MembersEmails field in the database for each team
            await teamDoc.ref.update({ MembersEmails: updatedMembersEmails });
  
            // Find the team by teamId in the Teams collection
            const teamsQuery = context.db
              .collection("Teams")
              .where("teamId", "==", teamId);
            const teamsSnapshot = await teamsQuery.get();
  
            if (!teamsSnapshot.empty) {
              // Iterate over each team with the given teamId
              teamsSnapshot.forEach(async (teamsDoc) => {
                // Remove the member from SubteamMembers
                const subteamMembers = teamsDoc.data().subteamMembers || [];
                const updatedSubteamMembers = subteamMembers.filter(
                  (subteamMember: any) => subteamMember.email !== memberEmail
                );
  
                // Update the SubteamMembers field in the database for each team
                await teamsDoc.ref.update({ subteamMembers: updatedSubteamMembers });
              });
            }
          });
        }
  
        // Delete the teamId from IdTeam in the User collection
        const userQuery = context.db
          .collection("User")
          .where("Email", "==", memberEmail);
  
        const userSnapshot = await userQuery.get();
  
        if (!userSnapshot.empty) {
          userSnapshot.forEach(async (userDoc) => {
            const existingIdTeam = userDoc.data().IdTeam || [];
            const updatedIdTeam = existingIdTeam.filter(
              (id: string) => id !== teamId
            );
  
            // Update the IdTeam field in the User collection
            await userDoc.ref.update({ IdTeam: updatedIdTeam });
          });
        }
  
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting member:", error);
      throw error;
    }
  },
  

  addHallToTeam: async (
    _: any,
    { teamId, hall }: { teamId: string; hall: { name: string; location: string } },
    context: Context
  ) => {
    try {
      // Najít tým podle teamId
      const teamQuery = context.db
        .collection("Team")
        .where("teamId", "==", teamId);

      const teamSnapshot = await teamQuery.get();

      if (!teamSnapshot.empty) {
        const teamDoc = teamSnapshot.docs[0];

        // Získat stávající Halls
        const existingHalls = teamDoc.data().Halls || [];

        const hallId =  generateRandomString(30);

        const hallWithId = { ...hall, hallId };

        const updatedHalls = [...existingHalls, hallWithId];

        // Aktualizovat tým s novým polem Halls
        await teamDoc.ref.update({ Halls: updatedHalls });

        // Vrátit aktualizovaný tým
        const updatedTeamQuery = context.db
          .collection("Team")
          .where("teamId", "==", teamId);

        const updatedTeamSnapshot = await updatedTeamQuery.get();

        if (!updatedTeamSnapshot.empty) {
          const updatedTeamData = updatedTeamSnapshot.docs[0].data() as Team;

          return updatedTeamData;
        }
      }

      return null;
    } catch (error) {
      console.error("Chyba při přidávání haly do týmu:", error);
      throw error;
    }
  },
  deleteHallFromTeam: async (
    _: any,
    { teamId, hallId }: { teamId: string; hallId: string },
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

        // Get existing Halls or initialize as an empty array
        const existingHalls = teamDoc.data().Halls || [];

        // Filter out the hall with the specified hallId
        const updatedHalls = existingHalls.filter(
          (hall: { hallId: string }) => hall.hallId !== hallId
        );

        // Update the team with the new Halls array
        await teamDoc.ref.update({ Halls: updatedHalls });

        // Return the updated team
        const updatedTeamQuery = context.db
          .collection("Team")
          .where("teamId", "==", teamId);

        const updatedTeamSnapshot = await updatedTeamQuery.get();

        if (!updatedTeamSnapshot.empty) {
          const updatedTeamData = updatedTeamSnapshot.docs[0].data() as Team;

          return updatedTeamData;
        }
      }

      return null;
    } catch (error) {
      console.error("Error deleting hall from team:", error);
      throw error;
    }
  },

  addTreningHallToTeam: async (
    _: any,
    { teamId, treningHall }: { teamId: string; treningHall: { name: string; location: string } },
    context: Context
  ) => {
    try {
      // Najít tým podle teamId
      const teamQuery = context.db
        .collection("Team")
        .where("teamId", "==", teamId);

      const teamSnapshot = await teamQuery.get();

      if (!teamSnapshot.empty) {
        const teamDoc = teamSnapshot.docs[0];

        // Získat stávající Halls
        const existingTreningHalls = teamDoc.data().TreningHalls || [];

        const treningHallId =  generateRandomString(30);

        const treningHallWithId = { ...treningHall, treningHallId };

        const updatedTreningHalls = [...existingTreningHalls, treningHallWithId];

        // Aktualizovat tým s novým polem Halls
        await teamDoc.ref.update({ TreningHalls: updatedTreningHalls });

        // Vrátit aktualizovaný tým
        const updatedTeamQuery = context.db
          .collection("Team")
          .where("teamId", "==", teamId);

        const updatedTeamSnapshot = await updatedTeamQuery.get();

        if (!updatedTeamSnapshot.empty) {
          const updatedTeamData = updatedTeamSnapshot.docs[0].data() as Team;

          return updatedTeamData;
        }
      }

      return null;
    } catch (error) {
      console.error("Chyba při přidávání haly do týmu:", error);
      throw error;
    }
  },
  deleteTreningHallFromTeam: async (
    _: any,
    { teamId, treningHallId }: { teamId: string; treningHallId: string },
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

        // Get existing Halls or initialize as an empty array
        const existingHalls = teamDoc.data().TreningHalls || [];

        // Filter out the hall with the specified hallId
        const updatedHalls = existingHalls.filter(
          (treningHall: { treningHallId: string }) => treningHall.treningHallId !== treningHallId
        );

        // Update the team with the new Halls array
        await teamDoc.ref.update({ TreningHalls: updatedHalls });

        // Return the updated team
        const updatedTeamQuery = context.db
          .collection("Team")
          .where("teamId", "==", teamId);

        const updatedTeamSnapshot = await updatedTeamQuery.get();

        if (!updatedTeamSnapshot.empty) {
          const updatedTeamData = updatedTeamSnapshot.docs[0].data() as Team;

          return updatedTeamData;
        }
      }

      return null;
    } catch (error) {
      console.error("Error deleting hall from team:", error);
      throw error;
    }
  },

  addGymToTeam: async (
    _: any,
    { teamId, gym }: { teamId: string; gym: { name: string; location: string } },
    context: Context
  ) => {
    try {
      // Najít tým podle teamId
      const teamQuery = context.db
        .collection("Team")
        .where("teamId", "==", teamId);

      const teamSnapshot = await teamQuery.get();

      if (!teamSnapshot.empty) {
        const teamDoc = teamSnapshot.docs[0];

        // Získat stávající Halls
        const existingGyms= teamDoc.data().Gyms || [];

        const gymId =  generateRandomString(30);

        const treningHallWithId = { ...gym, gymId };

        const updatedGyms = [...existingGyms, treningHallWithId];

        // Aktualizovat tým s novým polem Halls
        await teamDoc.ref.update({ Gyms: updatedGyms });

        // Vrátit aktualizovaný tým
        const updatedTeamQuery = context.db
          .collection("Team")
          .where("teamId", "==", teamId);

        const updatedTeamSnapshot = await updatedTeamQuery.get();

        if (!updatedTeamSnapshot.empty) {
          const updatedTeamData = updatedTeamSnapshot.docs[0].data() as Team;

          return updatedTeamData;
        }
      }

      return null;
    } catch (error) {
      console.error("Chyba při přidávání haly do týmu:", error);
      throw error;
    }
  },
  deleteGymFromTeam: async (
    _: any,
    { teamId, gymId }: { teamId: string; gymId: string },
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

        // Get existing Halls or initialize as an empty array
        const existingHalls = teamDoc.data().Gyms || [];

        // Filter out the hall with the specified hallId
        const updatedGyms = existingHalls.filter(
          (gym: { gymId: string }) => gym.gymId !== gymId
        );

        // Update the team with the new Halls array
        await teamDoc.ref.update({ Gyms: updatedGyms });

        // Return the updated team
        const updatedTeamQuery = context.db
          .collection("Team")
          .where("teamId", "==", teamId);

        const updatedTeamSnapshot = await updatedTeamQuery.get();

        if (!updatedTeamSnapshot.empty) {
          const updatedTeamData = updatedTeamSnapshot.docs[0].data() as Team;

          return updatedTeamData;
        }
      }

      return null;
    } catch (error) {
      console.error("Error deleting hall from team:", error);
      throw error;
    }
  },




 
  
};
