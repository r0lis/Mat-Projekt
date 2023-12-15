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
import { userQueries } from "./resolvers/queries/userQueries";
import { teamQueries } from "./resolvers/queries/teamQueries";
import { userMutations } from "./resolvers/mutations/userMutations";
import { teamMutations } from "./resolvers/mutations/teamMutations";
import * as admin from 'firebase-admin';

export const resolvers = {
  Query: {
    ...userQueries,
    ...teamQueries,
      
  },

  Mutation: {
    ...userMutations,
    ...teamMutations,
  },
};
