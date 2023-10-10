import { firestore } from 'firebase-admin';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { gql } from 'graphql-tag';
import { createSchema, createYoga } from 'graphql-yoga';

import { verifyToken } from '@/server/verifyToken';

type Context = {
  user?: DecodedIdToken | undefined;
};

type Admin = {
  IdUser: string;
  IdTeam: string;
  IsAdmin: boolean;
  Email: string;
};

type Mutation = {
  createUser(input: CreateAdminInput): Admin;
};

type CreateAdminInput = {
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
    createUser: async (_: any, { input }: { input: CreateAdminInput }, context: Context) => {
      try {
        // Firestore vygeneruje unikátní ID pro nového uživatele
        const newAdminDoc = db.collection('User').doc();
        
        const teamId = newAdminDoc.id;
        const IsAdmin = 1; 
  
        // Použijte získaná userId a teamId pro vytvoření nového uživatele
        const newAdmin = {
          IdUser: input.IdUser,
          IdTeam: teamId,
          Email: input.Email,
          IsAdmin: IsAdmin,
          // Další údaje o uživateli získané z input parametrů
        };
  
        // Uložte nového uživatele do Firestore
        await newAdminDoc.set(newAdmin);
  
        return newAdmin;
      } catch (error) {
        console.error('Chyba při vytváření uživatele:', error);
        throw error; // Volitelně můžete chybu předat zpět
      }
    },
  },
  // ... Další resolvery pro vaše typy a mutace
};

const typeDefs = gql`
  type Admin {
    IdUser: String!
    IdTeam: String!
    Email: String!
  }

  input CreateAdminInput {
    IdUser: String!
    IdTeam: String!
    Email: String!
  }

  type Query {
    user(id: String): Admin
  }

  type Mutation {
    createUser(input: CreateAdminInput): Admin
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
