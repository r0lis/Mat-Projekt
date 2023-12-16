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

  
export const subteamMutations = {
    //subteam mutations
    

  createSubteam: async (
    _: any,
    { teamId, inputName, subteamMembers }: { teamId: string; inputName: string; subteamMembers: string[] },
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
  };