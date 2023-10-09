import { firestore } from 'firebase-admin';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { gql } from 'graphql-tag';
import { createSchema, createYoga } from 'graphql-yoga';

import { verifyToken } from '@/server/verifyToken';

type Context = {
  user?: DecodedIdToken | undefined;
};

type User = {
  IdUser: string;
  IdTeam: string;
  Email: string;
};

type Mutation = {
  createUser(input: CreateUserInput): User;
};

type CreateUserInput = {
  IdUser: string;
  IdTeam: string;
  Email: string;
};

const db = firestore();

const resolvers = {
  Query: {
    user: async (_: any, { id }: { id: string }, context: Context) => {
      // Provádějte dotaz na databázi nebo jiný úložiště dat, aby se získaly údaje o uživateli
      // V tomto příkladu používáme konstantní data pro ilustraci
      const userData = {
        IdUser: id,
        // Další uživatelské údaje získané z databáze
      };

      return userData;
    },
  },
  Mutation: {
    createUser: async (_: any, { input }: { input: CreateUserInput }, context: Context) => {
      try {
        // Firestore vygeneruje unikátní ID pro nového uživatele
        const newUserDoc = db.collection('User').doc();
        const userId = newUserDoc.id;
        const teamId = newUserDoc.id; // Použijeme stejné ID pro IdTeam
  
        // Použijte získaná userId a teamId pro vytvoření nového uživatele
        const newUser = {
          IdUser: userId,
          IdTeam: teamId,
          Email: input.Email,
          // Další údaje o uživateli získané z input parametrů
        };
  
        // Uložte nového uživatele do Firestore
        await newUserDoc.set(newUser);
  
        return newUser;
      } catch (error) {
        console.error('Chyba při vytváření uživatele:', error);
        throw error; // Volitelně můžete chybu předat zpět
      }
    },
  },
  // ... Další resolvery pro vaše typy a mutace
};

const typeDefs = gql`
  type User {
    IdUser: String!
    IdTeam: String!
    Email: String!
  }

  input CreateUserInput {
    IdUser: String!
    IdTeam: String!
    Email: String!
  }

  type Query {
    user(id: String): User
  }

  type Mutation {
    createUser(input: CreateUserInput): User
  }
`;

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
