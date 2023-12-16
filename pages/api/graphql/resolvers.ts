/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
import 'firebase/storage';
import { userQueries } from "./resolvers/queries/userQueries";
import { teamQueries } from "./resolvers/queries/teamQueries";
import { userMutations } from "./resolvers/mutations/userMutations";
import { teamMutations } from "./resolvers/mutations/teamMutations";
import {subteamMutations} from "./resolvers/mutations/subteamMutations";
import {subteamQueries} from "./resolvers/queries/subteamQueries";

export const resolvers = {
  Query: {
    ...userQueries,
    ...teamQueries,
    ...subteamQueries,
  },

  Mutation: {
    ...userMutations,
    ...teamMutations,
    ...subteamMutations,
  },
};
