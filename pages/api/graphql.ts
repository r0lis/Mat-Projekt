/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
import { firestore } from "firebase-admin";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { gql } from "graphql-tag";
import { createSchema, createYoga } from "graphql-yoga";
import { typeDefs } from "./graphql/typeDefs";
import { resolvers } from "./graphql/resolvers";
import { verifyToken } from "@/server/verifyToken";
import * as admin from 'firebase-admin';

type Context = {
  user?: DecodedIdToken | undefined;
};

const db = firestore();

const schema = createSchema({
  typeDefs,
  resolvers,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default createYoga({
  schema,
  // Needed to be defined explicitly because our endpoint lives at a different path other than `/graphql`
  graphqlEndpoint: "/api/graphql",
  context: async (context) => {
    const auth = context.request.headers.get("authorization");
    return {
      user: auth ? await verifyToken(auth) : undefined,
      db,
    } as Context;
  },
});
