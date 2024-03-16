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
} from "./../../types";
import "firebase/storage";
import * as admin from "firebase-admin";

interface UpdateUserInput {
  Name: string;
  Surname: string;
  DateOfBirth: string;
  postalCode: string;
  city: string;
  street: string;
  streetNumber: string;
  phoneNumber: string;
}


export const userMutations = {
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
        postalCode: input.postalCode,
        city: input.city,
        street: input.street,
        streetNumber: input.streetNumber,
        phoneNumber: input.phoneNumber,
      };

      await newUserDoc.set(newUser);

      return newUser;
    } catch (error) {
      console.error("Chyba při vytváření uživatele:", error);
      throw error;
    }
  },

  uploadImageUser: async (
    _: any,
    { imageBase64, userEmail }: { imageBase64: string; userEmail: string },
    context: Context
  ) => {
    try {
      const imageBuffer = Buffer.from(
        imageBase64.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );

      const filename = `user_logos/${userEmail}_${Date.now()}.jpg`;

      const bucket = admin.storage().bucket();

      await bucket.file(filename).save(imageBuffer, {
        metadata: {
          contentType: "image/jpeg", // Adjust the content type based on your image type
        },
      });

      const [downloadUrl] = await bucket.file(filename).getSignedUrl({
        action: "read",
        expires: "03-09-2491", // Adjust the expiration date as needed
      });

      const teamQuery = context.db
        .collection("User")
        .where("Email", "==", userEmail);
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
        postalCode: input.postalCode,
        city: input.city,
        street: input.street,
        streetNumber: input.streetNumber,
        phoneNumber: input.phoneNumber,
      };

      await newUserDoc.set(newUser);

      return newUser;
    } catch (error) {
      console.error("Chyba při vytváření uživatele:", error);
      throw error;
    }
  },

  updateUser: async (
    _: any,
    { email, input }: { email: string; input: UpdateUserInput },
    context: Context
  ) => {
    try {
      const userQuery = context.db
        .collection("User")
        .where("Email", "==", email);
      const userSnapshot = await userQuery.get();
      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        await userDoc.ref.update({
          Name: input.Name,
          Surname: input.Surname,
          DateOfBirth: input.DateOfBirth,
          postalCode: input.postalCode,
          city: input.city,
          street: input.street,
          streetNumber: input.streetNumber,
          phoneNumber: input.phoneNumber,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating user:", error);
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
        const userQuery = context.db
          .collection("User")
          .where("Email", "==", email);
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
};
