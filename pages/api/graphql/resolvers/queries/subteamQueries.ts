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
  CompleteSubteam,
  CompleteSubteamMember,
} from "./../../types";
import "firebase/storage";
import * as admin from "firebase-admin";

const getSubteamDetails = async (subteamId: string, context: Context): Promise<Subteam | null> => {
  try {
    const subteamDoc = await context.db.collection("Teams").doc(subteamId).get();

    if (subteamDoc.exists) {
      const subteamData = subteamDoc.data() as Subteam;
      return subteamData;
    }

    return null;
  } catch (error) {
    console.error("Error fetching subteam details:", error);
    throw error;
  }
};

export const subteamQueries = {
  getSubteamData: async (
    _: any,
    { teamId }: { teamId: string },
    context: Context
  ): Promise<Subteam[] | null> => {
    try {
      if (context.user) {
        const subteamQuery = context.db
          .collection("Teams") // Ujistěte se, že používáte správné jméno kolekce
          .where("teamId", "==", teamId);
        const subteamSnapshot = await subteamQuery.get();

        if (!subteamSnapshot.empty) {
          const subteamsData = subteamSnapshot.docs.map(
            (doc) => doc.data() as Subteam
          );
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
    { teamId, email }: { teamId: string; email: string },
    context: Context
  ): Promise<Subteam[] | null> => {
    try {
      if (context.user) {
        const subteamQuery = context.db
          .collection("Teams")
          .where("teamId", "==", teamId);

        const subteamSnapshot = await subteamQuery.get();

        if (!subteamSnapshot.empty) {
          const subteamsData = subteamSnapshot.docs.map(
            (doc) => doc.data() as Subteam
          );
          const filteredSubteams = subteamsData.filter((subteam) => {
            return subteam.subteamMembers.some(
              (member: { email: string }) => member.email === email
            );
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
        const subteamDoc = await context.db
          .collection("Teams")
          .doc(subteamId)
          .get();

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

  getCompleteSubteamDetail: async (
    _: any,
    { subteamId }: { subteamId: string },
    context: Context
  ): Promise<CompleteSubteam | null> => {
    try {
      if (context.user) {
        // Retrieve subteam details
        const subteamDoc = await context.db
          .collection("Teams")
          .doc(subteamId)
          .get();

        if (subteamDoc.exists) {
          const subteamData = subteamDoc.data() as Subteam;

          // Retrieve member details for each subteam member
          const subteamMembersPromises = subteamData.subteamMembers.map(
            async (member: {
              email: string;
              position: string;
              role: string;
            }) => {
              const userDoc = await context.db
                .collection("User")
                .where("Email", "==", member.email)
                .get();

              if (!userDoc.empty) {
                const userData = userDoc.docs[0].data() as User;
                const completeMember: CompleteSubteamMember = {
                  name: userData.Name,
                  surname: userData.Surname,
                  email: userData.Email,
                  picture: userData.Picture,
                  role: member.role,
                  position: member.position,
                };

                return completeMember;
              }

              return null;
            }
          );

          // Resolve all promises to get the complete subteam members' details
          const subteamMembers = await Promise.all(subteamMembersPromises);

          // Create the CompleteSubteam object
          const completeSubteam: CompleteSubteam = {
            Name: subteamData.Name,
            teamId: subteamData.teamId,
            subteamId: subteamData.subteamId,
            subteamMembers: subteamMembers.filter(
              Boolean
            ) as CompleteSubteamMember[], // Filter out null values
          };

          return completeSubteam;
        }
      }

      return null;
    } catch (error) {
      console.error("Error fetching complete subteam details:", error);
      throw error;
    }
  },

  getMissingSubteamMembers: async (
    _: any,
    { subteamId }: { subteamId: string },
    context: Context
  ): Promise<{ email: string; role: number; name: string; surname: string }[] | null> => {
    try {
      if (context.user) {
        // Fetch subteam details using the helper function
        const subteamDetails = await getSubteamDetails(subteamId, context);

        if (subteamDetails && subteamDetails.subteamMembers) {
          // Extracting emails and roles from subteamMembers array
          const subteamMembers = subteamDetails.subteamMembers.map((member: any) => ({
            email: member.email,
            role: member.role,
          }));

          // Fetch team details using the provided teamId
          const teamQuery = context.db.collection("Team").where("teamId", "==", subteamDetails.teamId);
          const teamSnapshot = await teamQuery.get();

          if (!teamSnapshot.empty) {
            // Extracting emails and roles from Members array of the Team collection
            const teamData = teamSnapshot.docs[0].data() as Team;
            const teamMembers = teamData.Members.map((member: any) => ({
              email: member.member,
              role: member.role,
            }));

            const allMembers: { email: string; role: number }[] = [...subteamMembers, ...teamMembers];

            // Create a map to track email occurrences
            const emailOccurrences: Record<string, number> = {};
            allMembers.forEach((member) => {
              emailOccurrences[member.email] = (emailOccurrences[member.email] || 0) + 1;
            });

            // Filter members where email occurrences are 1 (unique)
            const uniqueMembers = allMembers.filter((member) => emailOccurrences[member.email] === 1);

            // Fetch name and surname for unique members
            const completeMembers = await Promise.all(
              uniqueMembers.map(async (member) => {
                const userDoc = await context.db.collection("User").where("Email", "==", member.email).get();

                if (!userDoc.empty) {
                  const userData = userDoc.docs[0].data() as User;
                  return {
                    email: member.email,
                    role: member.role,
                    name: userData.Name,
                    surname: userData.Surname,
                  };
                }

                return null;
              })
            );

            return completeMembers.filter(Boolean) as {
              email: string;
              role: number;
              name: string;
              surname: string;
            }[];
          }
        }

        return null;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching missing subteam members:", error);
      throw error;
    }
  },
};
