import { firestore } from 'firebase-admin';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { gql } from 'graphql-tag';
import { createSchema, createYoga } from 'graphql-yoga';

import { verifyToken } from '@/server/verifyToken';

type Context = {
  user?: DecodedIdToken | undefined;
};

type DbUser = {
  date: Date;
  likes: number;
  title: string;
  userId: number;
};

const typeDefs = gql`
  type Query {
    posts: [Post!]!
  }

  type Post {
    nickname: String
    firstname: String
    surname: String
    avatarIcon: String
    id: Int
    userId: Int
    date: String
    title: String
    text: String
    likes: Int
    img: String
  }

  input PostInput {
    title: String!
    text: String!

    img: String!
  }

  type Mutation {
    createPost(input: PostInput!): Post
    deletePost(id: Int!): Boolean
    likePost(id: Int!): Boolean
    unlikePost(id: Int!): Boolean
  }
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-use-before-define
const posts: Array<Post> = [];

interface Post {
  id: number;
  userId: number;
  date: string;
  title: string;
  text: string;
  likes: number;
  img: string;
  nickname: string;
  firstname: string;
  surname: string;
  avatarIcon: string;
}

const db = firestore();

const resolvers = {
  Mutation: {
    createPost: async (
      _: any,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment, spaced-comment
      //@ts-ignore
      { input }: { input: PostInput },
    ): Promise<Post> => {
      const newPost = {
        id: Math.floor(Math.random() * 100_000),
        userId: Math.floor(Math.random() * 100_000),
        date: new Date()
          .toLocaleString('cs-CZ', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
          .replace(/\./g, '.')
          .replace(',', ''),
        title: input.title,
        text: input.text,
        likes: 0,
        img: input.img,
        nickname: 'Jouda',
        firstname: 'Pepek',
        surname: 'Namornik',
        avatarIcon: 'P',
      };
      const newPostRef = await db.collection('Post').add(newPost);
      const newPostId = newPostRef.id;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment, spaced-comment
      //@ts-ignorenpm
      return { ...newPost, id: newPostId };
    },
    deletePost: async (_: any, { id }: { id: number }): Promise<boolean> => {
      const postsRef = db.collection('Post');
      const querySnapshot = await postsRef.where('id', '==', id).get();

      const deletePromises = querySnapshot.docs.map((doc) => doc.ref.delete());
      await Promise.all(deletePromises);

      console.log(`Deleted ${querySnapshot.size} documents with ID ${id}`);
      return true;
    },
    likePost: async (_: any, { id }: { id: number }): Promise<boolean> => {
      // Fetch the post from the database using the provided id
      const postsRef = db.collection('Post');
      const postSnapshot = await postsRef.where('id', '==', id).get();

      // Check if the post exists
      if (postSnapshot.empty) {
        throw new Error('Post not found');
      }

      // Get the reference to the post document
      const postDoc = postSnapshot.docs[0];
      const postRef = postDoc.ref;

      // Get the current likes count
      const currentLikes = postDoc.data().likes || 0;

      // Update the likes count in the database
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      const updatedLikes = currentLikes + 1;
      await postRef.update({ likes: updatedLikes });

      console.log(`Post ${id} liked`);

      return true;
    },
    unlikePost: async (_: any, { id }: { id: number }): Promise<boolean> => {
      // Fetch the post from the database using the provided id
      const postsRef = db.collection('Post');
      const postSnapshot = await postsRef.where('id', '==', id).get();

      // Check if the post exists
      if (postSnapshot.empty) {
        throw new Error('Post not found');
      }

      // Get the reference to the post document
      const postDoc = postSnapshot.docs[0];
      const postRef = postDoc.ref;

      // Get the current likes count
      const currentLikes = postDoc.data().likes || 0;

      // Ensure that likes count is not negative
      if (currentLikes <= 0) {
        throw new Error('Likes count cannot be negative');
      }

      // Update the likes count in the database
      const updatedLikes = currentLikes - 1;
      await postRef.update({ likes: updatedLikes });

      console.log(`Post ${id} unliked`);

      return true;
    },
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
