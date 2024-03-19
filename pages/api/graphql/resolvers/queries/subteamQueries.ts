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
  SubteamMember,
  Subteam,
  CompleteSubteam,
  CompleteSubteamMember,
} from "./../../types";
import "firebase/storage";
import * as admin from "firebase-admin";

type Discussion = {
  discussionId: String
  subteamId: String
  postText: String
  userEmail: String
  date: String
  title: String
  onComment: Boolean
}

const getSubteamDetails = async (
  subteamId: string,
  context: Context
): Promise<Subteam | null> => {
  try {
    const subteamDoc = await context.db
      .collection("Teams")
      .doc(subteamId)
      .get();
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
          .collection("Teams")
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
        const subteamDoc = await context.db.collection('Teams').doc(subteamId).get();
        if (subteamDoc.exists) {
          const subteamData = subteamDoc.data() as Subteam;
          const teamId = subteamData.teamId;
  
          const teamDoc = await context.db.collection('Team').where('teamId', '==', teamId).get();
          if (!teamDoc.empty) {
            const teamData = teamDoc.docs[0].data() as Team;
            const subteamMembersPromises = subteamData.subteamMembers.map(
              async (member: SubteamMember) => {
                const userDoc = await context.db.collection('User').where('Email', '==', member.email).get();
                if (!userDoc.empty) {
                  const userData = userDoc.docs[0].data() as User;
                  // Najít odpovídajícího člena v poli Members v kolekci Team
                  const teamMember = teamData.Members.find((m: any) => m.member === member.email);
                  // Získat doc a docDate z nalezeného člena
                  const docDate = teamMember?.docDate || "No Date Assigned";
                  const doc = teamMember?.doc || "No Doc Assigned";
                  const completeMember: CompleteSubteamMember = {
                    name: userData.Name,
                    surname: userData.Surname,
                    email: userData.Email,
                    dateOfBirth: userData.DateOfBirth,
                    picture: userData.Picture,
                    role: member.role,
                    position: member.position,
                    playPosition: member.playPosition,
                    docDate: docDate,
                    doc: doc,
                  };
                  return completeMember;
                }
                return null;
              }
            );
  
            const subteamMembers = await Promise.all(subteamMembersPromises);
            const completeSubteam: CompleteSubteam = {
              Name: subteamData.Name,
              teamId: subteamData.teamId,
              subteamId: subteamData.subteamId,
              subteamMembers: subteamMembers.filter(Boolean) as CompleteSubteamMember[],
              Formations: subteamData.Formations || [],
            };
            return completeSubteam;
          }
        }
      }
      return null;
    } catch (error) {
      console.error('Error fetching complete subteam details:', error);
      throw error;
    }
  },
  

  getMissingSubteamMembers: async (
    _: any,
    { subteamId }: { subteamId: string },
    context: Context
  ): Promise<
    { email: string; role: number; name: string; surname: string }[] | null
  > => {
    try {
      if (context.user) {
        const subteamDetails = await getSubteamDetails(subteamId, context);

        if (subteamDetails && subteamDetails.subteamMembers) {
          const subteamMembers = subteamDetails.subteamMembers.map(
            (member: any) => ({
              email: member.email,
              role: member.role,
            })
          );

          const teamQuery = context.db
            .collection("Team")
            .where("teamId", "==", subteamDetails.teamId);
          const teamSnapshot = await teamQuery.get();

          if (!teamSnapshot.empty) {
            const teamData = teamSnapshot.docs[0].data() as Team;
            const teamMembers = teamData.Members.map((member: any) => ({
              email: member.member,
              role: member.role,
            }));

            const allMembers: { email: string; role: number }[] = [
              ...subteamMembers,
              ...teamMembers,
            ];

            const emailOccurrences: Record<string, number> = {};
            allMembers.forEach((member) => {
              emailOccurrences[member.email] =
                (emailOccurrences[member.email] || 0) + 1;
            });

            const uniqueMembers = allMembers.filter(
              (member) => emailOccurrences[member.email] === 1
            );

            const completeMembers = await Promise.all(
              uniqueMembers.map(async (member) => {
                const userDoc = await context.db
                  .collection("User")
                  .where("Email", "==", member.email)
                  .get();

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

  getMatchesBySubteam: async (
    _: any,
    { input }: { input: { subteamIds: string[] } },
    context: { db: { collection: (arg0: string) => any } }
    
  ) => {
    const { subteamIds } = input;
    try {
      const matchesSnapshot = await context.db
          .collection("Match")
          .where("subteamIdSelected", "in", subteamIds)
          .get();
  
      const currentDate = new Date();
  
      const matches = matchesSnapshot.docs
          .map((doc: any) => doc.data() as any)
          .filter((match: any) => {
              const matchDate = new Date(`${match.date}T${match.time}`);
              
              const timeDifference = currentDate.getTime() - matchDate.getTime();
  
              const isWithinOneDay = timeDifference < 24 * 60 * 60 * 1000;
  
              return match.subteamIdSelected !== null && isWithinOneDay;
          });
  
      return [{ subteamId: subteamIds[0], matches }];
  } catch (error) {
      console.error("Error fetching matches by subteams:", error);
      throw error;
  }
  },

  getMatchByMatchId: async (
    _: any,
    { matchId }: { matchId: string },
    context: { db: { collection: (arg0: string) => any } }
  ) => {
    try {
      const matchDoc = await context.db.collection("Match").doc(matchId).get();

      if (matchDoc.exists) {
        return matchDoc.data();
      }

      return null;
    } catch (error) {
      console.error("Error fetching match by ID:", error);
      throw error;
    }
  },

  getTrainingByMatchId: async (
    _: any,
    { matchId }: { matchId: string },
    context: { db: { collection: (arg0: string) => any } }
  ) => {
    try {
      const trainingDoc = await context.db
        .collection("Training")
        .doc(matchId)
        .get();

      if (trainingDoc.exists) {
        return trainingDoc.data();
      }

      return null;
    } catch (error) {
      console.error("Error fetching training by ID:", error);
      throw error;
    }
  },

  getAllMatchesBySubteam: async (
    _: any,
    { input }: { input: { subteamIds: string[] } },
    context: { db: { collection: (arg0: string) => any } }
  ) => {
    const { subteamIds } = input;
    
    try {
      const matchesSnapshot = await context.db
        .collection("Match")
        .where("subteamIdSelected", "in", subteamIds)
        .get();
  
      const matches = matchesSnapshot.docs.map((doc: any) => doc.data() as any);
  
      return [{ subteamId: subteamIds[0], matches }];
    } catch (error) {
      console.error("Error fetching matches by subteams:", error);
      throw error;
    }
  },

  getAllMatchBySubteamId: async (
    _: any,
    { subteamId }: { subteamId: string },
    context: { db: { collection: (arg0: string) => any } }
  ) => {
    try {
      const matchesSnapshot = await context.db
        .collection("Match")
        .where("subteamIdSelected", "==", subteamId)
        .get();
  
      const matches = matchesSnapshot.docs.map((doc: any) => doc.data() as any);
  
      return matches;
    } catch (error) {
      console.error("Error fetching matches by subteamId:", error);
      throw error;
    }
  },

  getAllTrainingBySubteamId: async (
    _: any,
    { subteamId }: { subteamId: string },
    context: { db: { collection: (arg0: string) => any } }
  ) => {
    try {
      const matchesSnapshot = await context.db
        .collection("Training")
        .where("subteamIdSelected", "==", subteamId)
        .get();
  
      const trainings = matchesSnapshot.docs.map((doc: any) => doc.data() as any);
  
      return trainings;
    } catch (error) {
      console.error("Error fetching trainings by subteamId:", error);
      throw error;
    }
  },

  getTrainingsBySubteam: async (
    _: any,
    { input }: { input: { subteamIds: string[] } },
    context: { db: { collection: (arg0: string) => any } }
  ) => {
    const { subteamIds } = input;
  
    try {
      const trainingsSnapshot = await context.db
        .collection("Training")
        .where("subteamIdSelected", "in", input.subteamIds)
        .get();
  
      const currentDate = new Date();
  
      const trainings = trainingsSnapshot.docs
        .map((doc: any) => doc.data() as any)
        .filter((training: any) => {
          const trainingDate = new Date(`${training.date}T${training.time}`);
  
          const timeDifference = currentDate.getTime() - trainingDate.getTime();
  
          const isWithinOneDay = timeDifference < 24 * 60 * 60 * 1000;
  
          return training.subteamIdSelected !== null && isWithinOneDay;
        });
  
      return [{ subteamId: input.subteamIds[0], trainings }];
    } catch (error) {
      console.error("Error fetching trainings by subteams:", error);
      throw error;
    }
  },

  getAllTrainingsBySubteam: async (
    _: any,
    { input }: { input: { subteamIds: string[] } },
    context: { db: { collection: (arg0: string) => any } }
  ) => {
    const { subteamIds } = input;
  
    try {
      const trainingsSnapshot = await context.db
        .collection("Training")
        .where("subteamIdSelected", "in", input.subteamIds)
        .get();
  
      const trainings = trainingsSnapshot.docs.map((doc: any) => doc.data() as any);
  
      return [{ subteamId: input.subteamIds[0], trainings }];
    } catch (error) {
      console.error("Error fetching trainings by subteams:", error);
      throw error;
    }
  },

  getPastMatchesBySubteam: async (
    _: any,
    { input }: { input: { subteamIds: string[] } },
    context: { db: { collection: (arg0: string) => any } }
  ) => {
    try {
      const currentDate = new Date(); // Get the current date and time
      const eightDaysAgo = new Date(currentDate.getTime() - 8 * 24 * 60 * 60 * 1000); // Calculate the date 8 days ago
  
      const matchesSnapshot = await context.db
        .collection("Match")
        .where("subteamIdSelected", "in", input.subteamIds)
        .get();
  
      const matches = matchesSnapshot.docs.map((doc: any) => doc.data() as any);
  
      const validMatches = matches.filter((match: any) => {
        const matchDateTime = new Date(`${match.date} ${match.time}`);
  
        // Check if the match date is within the last 8 days
        return matchDateTime >= eightDaysAgo && matchDateTime < currentDate;
      });
  
      return [{ subteamId: input.subteamIds[0], matches: validMatches }];
    } catch (error) {
      console.error("Error fetching matches by subteams:", error);
      throw error;
    }
  },

  getPastTrainingsBySubteam: async (
    _: any,
    { input }: { input: { subteamIds: string[] } },
    context: { db: { collection: (arg0: string) => any } }
  ) => {
    try {
      const currentDate = new Date();
      const eightDaysAgo = new Date(currentDate.getTime() - 8 * 24 * 60 * 60 * 1000); // Calculate the date 8 days ago
      const trainingsSnapshot = await context.db
        .collection("Training")
        .where("subteamIdSelected", "in", input.subteamIds)
        .get();
  
      const trainings = trainingsSnapshot.docs.map((doc: any) => doc.data() as any);
  
      const validTrainings = trainings.filter((training: any) => {
        const trainingDateTime = new Date(`${training.date} ${training.time}`);
       
        // Check if the training date is within the last 8 days
        return trainingDateTime >= eightDaysAgo && trainingDateTime < currentDate;
      });
  
      return [{ subteamId: input.subteamIds[0], trainings: validTrainings }];
    } catch (error) {
      console.error("Error fetching trainings by subteams:", error);
      throw error;
    }
  },
  
  getFutureMatchesBySubteam: async (
    _: any,
    { input }: { input: { subteamIds: string[] } },
    context: { db: { collection: (arg0: string) => any } }
  ) => {
    try {
      const currentDate = new Date(); 
      const matchesSnapshot = await context.db
        .collection("Match")
        .where("subteamIdSelected", "in", input.subteamIds)
        .get();
  
      const matches = matchesSnapshot.docs.map((doc: any) => doc.data() as any);
      
      const validMatches = matches.filter((match: any) => {
        const matchDateTime = new Date(`${match.date} ${match.time}`);
        return matchDateTime >= currentDate;
      });


      return [{ subteamId: input.subteamIds[0], matches: validMatches }];
    } catch (error) {
      console.error("Error fetching future matches by subteams:", error);
      throw error;
    }
  },
  getFutureTrainingsBySubteam: async (
    _: any,
    { input }: { input: { subteamIds: string[] } },
    context: { db: { collection: (arg0: string) => any } }
  ) => {
    try {
      const currentDate = new Date();
      const trainingsSnapshot = await context.db
        .collection("Training")
        .where("subteamIdSelected", "in", input.subteamIds)
        .get();
  
      const trainings = trainingsSnapshot.docs.map((doc: any) => doc.data() as any);
  
      const validMatches = trainings.filter((training: any) => {
        const matchDateTime = new Date(`${training.date} ${training.time}`);
        return matchDateTime >= currentDate;
      });

      return [{ subteamId: input.subteamIds[0], trainings: validMatches }];
    } catch (error) {
      console.error("Error fetching future matches by subteams:", error);
      throw error;
    }
  },
  getDiscussionsBySubteam: async (
    _: any,
    { subteamId }: { subteamId: string },
    context: Context
  ): Promise<Discussion[] | null> => {
    try {
      const discussionsSnapshot = await context.db
        .collection("Discussion")
        .where("subteamId", "==", subteamId)
        .get();

      if (!discussionsSnapshot.empty) {
        const discussionsData = discussionsSnapshot.docs.map(
          (doc) => doc.data() as Discussion
        );
        return discussionsData;
      }

      return null;
    } catch (error) {
      console.error("Error fetching discussions by subteam:", error);
      throw error;
    }
  },
};
