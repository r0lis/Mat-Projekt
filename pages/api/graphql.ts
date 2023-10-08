import { firestore } from 'firebase-admin';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

import { gql } from 'graphql-tag';
import { createSchema, createYoga } from 'graphql-yoga';

import { verifyToken } from '@/server/verifyToken';

type Context = {
  user?: DecodedIdToken | undefined;
};

const db = firestore();

const resolvers = {
  Mutation: {
    
  },

  Query: {
    posts: async () => {
      const postsRef = db.collection(
        'Post',
      ) as FirebaseFirestore.CollectionReference<DbUser>;
      const docsRefs = await postsRef.listDocuments();
      const docsSnapshotPromises = docsRefs.map((doc) => doc.get());
      const docsSnapshots = await Promise.all(docsSnapshotPromises);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const dbdocs = docsSnapshots.map((doc) => doc.data()!);
      console.log(dbdocs);
      return dbdocs;
    },
  },
};

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
  graphqlEndpoint: '/api/graphql',
  context: async (context) => {
    const auth = context.request.headers.get('authorization');
    console.log(auth);
    return {
      user: auth ? await verifyToken(auth) : undefined,
    } as Context;
  },
});
