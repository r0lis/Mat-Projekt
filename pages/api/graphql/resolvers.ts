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
import * as admin from 'firebase-admin';

export type MemberDetails = {
  Name: string;
  Surname: string;
  Role: string;
  Email: string;
  DateOfBirth: string;
};


const generateRandomString = (length: number) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};



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

    checkUserMembership: async (
      _: any,
      { teamId, currentUserEmail }: { teamId: string; currentUserEmail: string },
      context: Context
    ) => {
      try {
        if (context.user) {
          const teamQuery = context.db.collection("Team").where("teamId", "==", teamId);
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

      getUserRoleInTeam: async (
        _: any,
        { teamId, email }: { teamId: string; email: string },
        context: Context
      ) => {
        try {
          // Find the team by teamId
          const teamQuery = context.db.collection("Team").where("teamId", "==", teamId);
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
          const teamQuery = context.db.collection("Team").where("teamId", "==", teamId);
          const teamSnapshot = await teamQuery.get();
    
          if (!teamSnapshot.empty) {
            const teamData = teamSnapshot.docs[0].data() as Team;
    
            // Najít shodné e-maily v poli MembersEmails
            const duplicateEmails = emails.filter(email => teamData.MembersEmails?.includes(email));
    
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
            const teamQuery = context.db.collection("Team").where("teamId", "==", teamId);
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
            const teamQuery = context.db.collection("Team").where("teamId", "==", teamId);
            const teamSnapshot = await teamQuery.get();
      
            if (!teamSnapshot.empty) {
              const teamData = teamSnapshot.docs[0].data();
              const membersEmails = teamData.MembersEmails || [];
              const membersRoles = teamData.Members || [];
      
              const membersDetails: MemberDetails[] = [];
      
              for (let i = 0; i < membersEmails.length; i++) {
                const email = membersEmails[i];
                const role = membersRoles[i]?.role || 'No Role Assigned'; // Default role if not present
      
                const userQuery = context.db.collection("User").where("Email", "==", email);
                const userSnapshot = await userQuery.get();
      
                if (!userSnapshot.empty) {
                  const userData = userSnapshot.docs[0].data() as User;
                  membersDetails.push({
                    Name: userData.Name,
                    Surname: userData.Surname,
                    Role: role, // Add role to the returned details
                    Email: userData.Email,
                    DateOfBirth: userData.DateOfBirth,
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
          DateOfBirth: new Date(input.DateOfBirth).toISOString(),
        };

        await newUserDoc.set(newUser);

        return newUser;
      } catch (error) {
        console.error("Chyba při vytváření uživatele:", error);
        throw error;
      }
    },

    uploadImage: async (
      _: any,
      { imageBase64, teamId }: { imageBase64: string; teamId: string },
      context: Context
    ) => {
      try {
        // Decode the base64 image
        const imageBuffer = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ""), "base64");
    
        // Generate a unique filename for the image
        const filename = `team_logos/${teamId}_${Date.now()}.jpg`;
    
        // Reference to the Firebase Storage bucket
        const bucket = admin.storage().bucket();
    
        // Upload the image to Firebase Storage
        await bucket.file(filename).save(imageBuffer, {
          metadata: {
            contentType: "image/jpeg", // Adjust the content type based on your image type
          },
        });
    
        // Get the download URL for the uploaded image
        const downloadUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
    
        // Update the team document with the download URL
        const teamQuery = context.db.collection("Team").where("teamId", "==", teamId);
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

    uploadImageTeam: async (
      _: any,
      { imageBase64, teamEmail }: { imageBase64: string; teamEmail: string },
      context: Context
    ) => {
      try {
        // Decode the base64 image
        const imageBuffer = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ""), "base64");
    
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
    
        // Get the download URL for the uploaded image
        const downloadUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
    
        // Update the team document with the download URL
        const teamQuery = context.db.collection("Team").where("Email", "==", teamEmail);
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

    uploadImageUser: async (
      _: any,
      { imageBase64, userEmail }: { imageBase64: string; userEmail: string },
      context: Context
    ) => {
      try {
        // Decode the base64 image
        const imageBuffer = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ""), "base64");
    
        // Generate a unique filename for the image
        const filename = `user_logos/${userEmail}_${Date.now()}.jpg`;
    
        // Reference to the Firebase Storage bucket
        const bucket = admin.storage().bucket();
    
        // Upload the image to Firebase Storage
        await bucket.file(filename).save(imageBuffer, {
          metadata: {
            contentType: "image/jpeg", // Adjust the content type based on your image type
          },
        });
    
        // Get the download URL for the uploaded image
        const downloadUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
    
        // Update the team document with the download URL
        const teamQuery = context.db.collection("User").where("Email", "==", userEmail);
        const teamSnapshot = await teamQuery.get();
    
        if (!teamSnapshot.empty) {
          const teamDoc = teamSnapshot.docs[0];
          await teamDoc.ref.update({ Picture: downloadUrl });
        }
    
        return downloadUrl;
      } catch (error) {
        console.error("Error uploading image:", error);
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
            DateOfBirth: new Date(input.DateOfBirth).toISOString(),
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
        const teamId = generateRandomString(30);
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

    updateMembers: async (_: any, { teamId, newMembers }: any, context: { user: any; db: { collection: (arg0: string) => { (): any; new(): any; where: { (arg0: string, arg1: string, arg2: any): any; new(): any; }; }; }; }) => {
      try {
        if (context.user) {
          // Fetch the team by teamId
          const teamQuery = context.db.collection("Team").where("teamId", "==", teamId);
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

    updateMemberRole: async (
      _: any,
      { email, role, teamId }: { email: string; role: string; teamId: string },
      context: Context
    ) => {
      try {
        // Find the team by teamId
        const teamQuery = context.db.collection("Team").where("teamId", "==", teamId);
        const teamSnapshot = await teamQuery.get();
    
        if (!teamSnapshot.empty) {
          const teamDoc = teamSnapshot.docs[0];
    
          // Update the role of the specified member in the Members array
          const existingMembers = teamDoc.data().Members || [];
          const updatedMembers = existingMembers.map((member: any) => {
            if (member.member === email) { // Adjust the field name here
              return { ...member, role };
            }
            return member;
          });
    
          // Update the Members field in the database
          await teamDoc.ref.update({ Members: updatedMembers });
    
          // Return the updated member details
          const updatedMemberDetails = {
            Name: '', // Get the name from the User collection or other source
            Surname: '', // Get the surname from the User collection or other source
            Role: role,
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
          // Find the team by teamId
          const teamQuery = context.db.collection("Team").where("teamId", "==", teamId);
          const teamSnapshot = await teamQuery.get();
    
          if (!teamSnapshot.empty) {
            const teamDoc = teamSnapshot.docs[0];
            const existingMembers = teamDoc.data().Members || [];
    
            // Remove the specified memberEmail from Members
            const updatedMembers = existingMembers.filter(
              (member: { member: string; role: string }) => member.member !== memberEmail
            );
    
            // Update the Members field in the database
            await teamDoc.ref.update({ Members: updatedMembers });
    
            // Also remove the member from MembersEmails if present
            const existingMembersEmails = teamDoc.data().MembersEmails || [];
            const updatedMembersEmails = existingMembersEmails.filter((email: string) => email !== memberEmail);
    
            // Update the MembersEmails field in the database
            await teamDoc.ref.update({ MembersEmails: updatedMembersEmails });
    
            // Delete the teamId from IdTeam in the User collection
            const userQuery = context.db.collection("User").where("Email", "==", memberEmail);

            const userSnapshot = await userQuery.get();
    
            if (!userSnapshot.empty) {
              userSnapshot.forEach(async (userDoc) => {
                const existingIdTeam = userDoc.data().IdTeam || [];
                const updatedIdTeam = existingIdTeam.filter((id: string) => id !== teamId);
    
                // Update the IdTeam field in the User collection
                await userDoc.ref.update({ IdTeam: updatedIdTeam });
              });
            }
    
            return true;
          }
        }
        return false;
      } catch (error) {
        console.error("Error deleting member:", error);
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
