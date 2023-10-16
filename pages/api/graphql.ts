import { firestore } from 'firebase-admin';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { gql } from 'graphql-tag';
import { createSchema, createYoga } from 'graphql-yoga';

import { verifyToken } from '@/server/verifyToken';

type Context = {
  user?: DecodedIdToken | undefined;
};

type User = {
  Name: string;
  Surname: string;
  IdUser: string;
  IdTeam: string;
  IsAdmin: boolean;
  Email: string;
};

type Mutation = {
  createUser(input: CreateUserInput): User
  deleteUserByEmail(email: String): Boolean 
};

type CreateUserInput = {
  Name: string;
  Surname: string;
  IdUser: string;
  IdTeam: string;
  Email: string;
};

type NameAndSurname = {
  Name: String
  Surname: String
}

type Query = {
  user(id: String): User
  getUserByNameAndSurname(email: String): NameAndSurname

  
}

const db = firestore();

const resolvers = {
  Query: {
    user: async (_: any, { id }: { id: string }, context: Context) => {
      // ...
    },
    getUserByNameAndSurname: async (_: any, { email }: { email: string }, context: Context) => {
      if (context.user) {
        const userQuery = db.collection('User').where('Email', '==', email);
        const userSnapshot = await userQuery.get();
        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data() as User;
          return {
            Name: userData.Name,
            Surname: userData.Surname,
          };
        }
      }
      return null;
    },
   
  },
 

  Mutation: {
    createUser: async (_: any, { input }: { input: CreateUserInput }, context: Context) => {
      try {
        // Firestore vygeneruje unikátní ID pro nového uživatele
        const newUserDoc = db.collection('User').doc();
        const userId = newUserDoc.id;
        const teamId = "";
        const IsAdmin = 0;

        // Použijte získaná userId a teamId pro vytvoření nového uživatele
        const newUser = {
          Name: input.Name,
          Surname: input.Surname,
          IdUser: userId,
          IdTeam: teamId,
          Email: input.Email,
          IsAdmin: IsAdmin,
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
  
  deleteUserByEmail: async (_: any, { email }: { email: string }, context: Context) => {
    try {
      if (context.user) {
        const userQuery = db.collection('User').where('Email', '==', email);
        const userSnapshot = await userQuery.get();
        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          await userDoc.ref.delete();
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Chyba při mazání uživatele:', error);
      throw error;
    }
  },
},
};


const typeDefs = gql`
type User {
  Name: String!
  Surname: String!
  IdUser: String!
  IdTeam: String!
  Email: String!
}

input CreateUserInput {
  Name: String!
  Surname: String!
  IdUser: String!
  IdTeam: String!
  Email: String!
}

type Query {
  user(id: String): User
  getUserByNameAndSurname(email: String): User
}

type Mutation {
  createUser(input: CreateUserInput): User
  deleteUserByEmail(email: String): Boolean
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
