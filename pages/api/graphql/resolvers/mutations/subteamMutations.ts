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

type SubteamMemberInput = {
  email: String
  role: String
  position: String
}
type UpdatedSubteamMemberInput = {
  email: string;
  role: string;
  position: string;
};

type AddWallInput = {
  subteamId: String
  postText: String
  userEmail: String
  date: String
  title: String
  onComment: Boolean
}

type AddCommentInput = {
  discussionId: string;
  commentText: string;
  userEmail: string;
  date: string;
  commentId: string;
};

type AddMatchInput = {
  subteamIdSelected: String
  opponentName: String
  selectedHallId: String
  date: String
  selectedHallPosition: String
  endTime: String
  time: String
  matchType: String
  players: [String]
  management: [String]
}

type AddTrainingInput = {
  subteamIdSelected: String
  opponentName: String
  description: String
  endTime: String
  selectedTrainingHallId: String
  date: String
  time: String
  players: [String]
  management: [String]
  
}


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

  
export const subteamMutations = {

    createSubteam: async (
      _: any,
      { teamId, inputName, subteamMembers }: { teamId: string; inputName: string; subteamMembers: SubteamMemberInput[] },
      context: Context
    ) => {
      try {
        // Generate a random subteamId
        const subteamId = generateRandomString(30);
    
        console.log(inputName); // Add this line for debugging
    
        // Create a new document in the Teams collection
        const newSubteamDoc = context.db.collection("Teams").doc(subteamId);
    
        // Define the data for the new subteam
        const newSubteamData = {
          Name: inputName,
          subteamId: subteamId,
          teamId: teamId,
          subteamMembers: subteamMembers,
        };
    
        // Set the data for the new subteam
        await newSubteamDoc.set(newSubteamData);
    
        return newSubteamData;
      } catch (error) {
        console.error("Error creating subteam:", error);
        throw error;
      }
    },

    updateSubteamMembers: async (
      _: any,
      {
        subteamId,
        updatedMembers,
      }: { subteamId: string; updatedMembers: UpdatedSubteamMemberInput[] },
      context: Context
    ) => {
      try {
        // Fetch existing subteam members
        const subteamDoc = context.db.collection("Teams").doc(subteamId);
        const subteamSnapshot = await subteamDoc.get();
    
        if (!subteamSnapshot.exists) {
          throw new Error(`Subteam with ID ${subteamId} not found`);
        }
    
        const existingMembers = subteamSnapshot.data()?.subteamMembers || [];
    
        // Combine existing members with updated members
        const combinedMembers = [...existingMembers, ...updatedMembers];
    
        // Update subteam members in the Teams collection
        await subteamDoc.update({
          subteamMembers: combinedMembers,
        });
    
        return true;
      } catch (error) {
        console.error("Error updating subteam members:", error);
        throw error;
      }
    },

    updateSubteamMember: async (
      _: any,
      { subteamId, email, position }: { subteamId: string; email: string; position: string },
      context: Context
    ) => {
      try {
        // Fetch existing subteam members
        const subteamDoc = context.db.collection("Teams").doc(subteamId);
        const subteamSnapshot = await subteamDoc.get();
  
        if (!subteamSnapshot.exists) {
          throw new Error(`Subteam with ID ${subteamId} not found`);
        }
  
        const existingMembers = subteamSnapshot.data()?.subteamMembers || [];
  
        // Find the index of the member to be updated
        const memberIndex = existingMembers.findIndex((member: { email: string; }) => member.email === email);
  
        if (memberIndex === -1) {
          throw new Error(`Member with email ${email} not found in subteam ${subteamId}`);
        }
  
        // Update the member's position
        existingMembers[memberIndex].position = position;
  
        // Update subteam members in the Teams collection
        await subteamDoc.update({
          subteamMembers: existingMembers,
        });
  
        return true;
      } catch (error) {
        console.error("Error updating subteam member:", error);
        throw error;
      }
    },

    addMatch: async (
      _: any,
      { teamId, input }: { teamId: string; input: AddMatchInput },
      context: Context
    ) => {
      try {
        const { subteamIdSelected, opponentName, selectedHallId, selectedHallPosition, date, time, endTime, players, management, matchType } = input;
  
  
        const matchId = generateRandomString(30);
        const newMatchDoc = context.db.collection("Match").doc(matchId);
  
        const newMatchData = {
          matchId: matchId,
          teamId: teamId,
          subteamIdSelected: subteamIdSelected,
          opponentName: opponentName,
          selectedHallId: selectedHallId,
          selectedHallPosition: selectedHallPosition,
          date: date,
          endTime: endTime,
          time: time,
          selectedPlayers: players,
          selectedManagement: management,
          selectedMembers: [...players, ...management],
          matchType: matchType,
          attendance: players.map((player) => ({
            player: player,
            hisAttendance: 0,
          })),
        };
  
        await newMatchDoc.set(newMatchData);
  
        return newMatchData;
      } catch (error) {
        console.error("Error adding match:", error);
        throw error;
      }
    },

    addTraining: async (
      _: any,
      { teamId, input }: { teamId: string; input: AddTrainingInput },
      context: Context
    ) => {
      try {
        const { subteamIdSelected, opponentName, selectedTrainingHallId, date, endTime, description, time, players, management,  } = input;
  
  
        const matchId = generateRandomString(30);
        const newMatchDoc = context.db.collection("Training").doc(matchId);
  
        const newMatchData = {
          matchId: matchId,
          teamId: teamId,
          subteamIdSelected: subteamIdSelected,
          opponentName: opponentName,
          selectedHallId: selectedTrainingHallId,
          date: date,
          time: time,
          endTime: endTime,
          description: description,
          selectedPlayers: players,
          selectedManagement: management,
          selectedMembers: [...players, ...management],
          attendance: players.map((player) => ({
            player: player,
            hisAttendance: 0,
          })),
        };
  
        await newMatchDoc.set(newMatchData);
  
        return newMatchData;
      } catch (error) {
        console.error("Error adding match:", error);
        throw error;
      }
    },

    updateAttendance: async (
      _: any,
      { matchId, player, hisAttendance, reason }: { matchId: string; player: string; hisAttendance: number; reason?: string },
      context: Context
    ) => {
      try {
        const matchDoc = context.db.collection("Match").doc(matchId);
        const matchSnapshot = await matchDoc.get();
    
        if (!matchSnapshot.exists) {
          throw new Error(`Match with ID ${matchId} not found`);
        }
    
        const existingAttendance = matchSnapshot.data()?.attendance || [];
    
        const attendanceIndex = existingAttendance.findIndex(
          (attendanceRecord: { player: string }) => attendanceRecord.player === player
        );
    
        if (attendanceIndex === -1) {
          throw new Error(`Attendance record for player ${player} not found in match ${matchId}`);
        }
    
        existingAttendance[attendanceIndex].hisAttendance = hisAttendance;
        
          existingAttendance[attendanceIndex].reason = reason;
       
    
        await matchDoc.update({
          attendance: existingAttendance,
        });
    
        return true;
      } catch (error) {
        console.error("Error updating attendance:", error);
        throw error;
      }
    },

    updateTrainingAttendance: async (
      _: any,
      { matchId, player, hisAttendance, reason }: { matchId: string; player: string; hisAttendance: number; reason?: string },
      context: Context
    ) => {
      try {
        const matchDoc = context.db.collection("Training").doc(matchId);
        const matchSnapshot = await matchDoc.get();
    
        if (!matchSnapshot.exists) {
          throw new Error(`Match with ID ${matchId} not found`);
        }
    
        const existingAttendance = matchSnapshot.data()?.attendance || [];
    
        const attendanceIndex = existingAttendance.findIndex(
          (attendanceRecord: { player: string }) => attendanceRecord.player === player
        );
    
        if (attendanceIndex === -1) {
          throw new Error(`Attendance record for player ${player} not found in match ${matchId}`);
        }
    
        existingAttendance[attendanceIndex].hisAttendance = hisAttendance;
        
          existingAttendance[attendanceIndex].reason = reason;
       
    
        await matchDoc.update({
          attendance: existingAttendance,
        });
    
        return true;
      } catch (error) {
        console.error("Error updating attendance:", error);
        throw error;
      }
    },

    addDiscussion: async (
      _: any,
      { input }: { input: AddWallInput },
      context: Context
    ) => {
      try {
        const { subteamId, postText, userEmail, date, title, onComment } = input;

        const discussionId = generateRandomString(30);

  
        // Create a new document in the Wall collection
        const newDiscussionDoc = context.db.collection("Discussion").doc(discussionId);
  
        // Define the data for the new wall post
        const newDiscussionData = {
          discussionId: discussionId,
          subteamId: subteamId,
          title: title,
          postText: postText,
          userEmail: userEmail,
          date: date,
          onComment: onComment,
        };
  
        // Set the data for the new wall post
        await newDiscussionDoc.set(newDiscussionData);
  
        return newDiscussionData;
      } catch (error) {
        console.error("Error adding wall post:", error);
        throw error;
      }
    },

    addComment: async (
      _: any,
      { input }: { input: AddCommentInput },
      context: Context
    ) => {
      try {
        const { discussionId, commentText, userEmail, date, } = input;

        const discussionRef = context.db.collection("Discussion").doc(discussionId);

        // Získat aktuální data diskuse
        const discussionData = (await discussionRef.get()).data();

        const commentId = generateRandomString(30);

        if (!discussionData) {
          throw new Error("Discussion not found");
        }

        // Pokud Comments neexistuje, vytvořit prázdné pole
        const commentsArray = discussionData.Comments || [];
        
        // Nový komentář
        const newComment = {
          commentId,
          commentText,
          discussionId,
          userEmail,
          date,
        };

        // Přidat nový komentář do pole Comments
        commentsArray.push(newComment);

        // Aktualizovat diskusi s novými daty
        await discussionRef.update({
          Comments: commentsArray,
        });

        return true;
      } catch (error) {
        console.error("Error adding comment:", error);
        throw error;
      }
    },


    
  };