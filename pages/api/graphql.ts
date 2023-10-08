import { firestore } from 'firebase-admin';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

import { gql } from 'graphql-tag';
import { createSchema, createYoga } from 'graphql-yoga';

import { verifyToken } from '@/server/verifyToken';

type Context = {
  user?: DecodedIdToken | undefined;
};

const db = firestore();

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    # Další údaje o uživateli
  }

  type Mutation {
    registerUser(input: RegisterInput!): User
  }

  input RegisterInput {
    email: String!
    password: String!
    # Další údaje potřebné pro registraci
  }

  type Query {
    # Definice vašich dotazů zde, pokud je potřebujete
  }
`;

const resolvers = {
  Mutation: {
    registerUser: async (_: any, { input }: any, context: any) => {
      try {
        const { email, password } = input;
        // Vygenerujte unikátní ID pro nového uživatele pomocí Firestore
        const userRef = db.collection('User');
        const newUserDoc = userRef.doc(); // Firestore vygeneruje unikátní ID
        const userId = newUserDoc.id;
  
        // Nastavte pole "idTeam" na hodnotu 10 pro nového uživatele
        const idTeam = 10;
  
        // Registrujte uživatele a použijte userId při vytváření záznamu v databázi
        await newUserDoc.set({
          IdUser: userId,
          idTeam,
          Email: email,
          // Další údaje o novém uživateli, pokud existují
        });
  
        // Vraťte informace o nově zaregistrovaném uživateli s přiděleným ID
        return {
          IdUser: userId,
          idTeam,
          Email: email,
          // Další údaje o novém uživateli
        };
      } catch (error) {
        console.error('Chyba při registraci:', error);
        throw new Error('Chyba při registraci');
      }
    },
  },
  Query: {
    // Definice vašich dotazů zde, pokud je potřebujete
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
