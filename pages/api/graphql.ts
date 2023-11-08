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
  IdTeam: [String];
  IsAdmin: boolean;
  Email: string;
};

type Team = {
  Name: string;
  teamId: string;
  MembersEmails: [String];
  AdminEmail: string;
  Email: string;
  Logo: string;
  Place: string;
  OwnerName: string;
  OwnerSurname: string;

};

type Mutation = {
  createUser(input: CreateUserInput): User
  creteTeam(input: CreateTeamInput): Team
  deleteUserByEmail(email: String): Boolean
};

type CreateUserInput = {
  Name: string;
  Surname: string;
  IdUser: string;
  IdTeam: [String];
  Email: string;
};

type CreateTeamInput = {
  Name: string;
  teamId: string;
  MembersEmails: [String];
  AdminEmail: string;
  Email: string;
  Logo: string;
  Place: string;
  OwnerName: string;
  OwnerSurname: string;
};

type NameAndSurname = {
  Name: String
  Surname: String
}

type TeamDetails = {
  Name: String
  Members: [String]
}

type Query = {
  user(id: String): User
  getUserByNameAndSurname(email: String): NameAndSurname
  getUserTeamsByEmail(email: String): [String]
}

const db = firestore();

async function addUserToTeam(adminEmail: any, teamId: String) {
  const userQuery = db.collection('User').where('Email', '==', adminEmail);
  const userSnapshot = await userQuery.get();
  if (!userSnapshot.empty) {
    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data() as User;

    userData.IdTeam.push(teamId);

    await userDoc.ref.update({ IdTeam: userData.IdTeam });
  }
}

const resolvers = {
  Query: {
    user: async (_: any, { id }: { id: string }, context: Context) => {
      // ...
    },

    getTeamDetails: async (_: any, { teamId }: { teamId: string }, context: Context) => {
  if (context.user) {
    const teamQuery = db.collection('Team').where('teamId', '==', teamId);
    const teamSnapshot = await teamQuery.get();
    if (!teamSnapshot.empty) {
      const teamData = teamSnapshot.docs[0].data() as Team;
      return {
        Name: teamData.Name,
        Members: teamData.MembersEmails,
      };
    }
  }
  return null;
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

    getUserTeamsByEmail: async (_: any, { email }: { email: string }, context: Context) => {
      if (context.user) {
        const userQuery = db.collection('User').where('Email', '==', email);
        const userSnapshot = await userQuery.get();
        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data() as User;
    
          const teamIds = userData.IdTeam;
          const teams = [];
    
          for (const teamId of teamIds) {
            const teamQuery = db.collection('Team').where('teamId', '==', teamId);
            const teamSnapshot = await teamQuery.get();
            if (!teamSnapshot.empty) {
              const teamData = teamSnapshot.docs[0].data() as Team;
              teams.push({ teamId: teamData.teamId, Name: teamData.Name }); 
            }
          }
    
          return teams; 
        }
      }
      return null;
    },
  },


  Mutation: {
    createUser: async (_: any, { input }: { input: CreateUserInput }, context: Context) => {
      try {
        const newUserDoc = db.collection('User').doc();
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
        };

        await newUserDoc.set(newUser);

        return newUser;
      } catch (error) {
        console.error('Chyba při vytváření uživatele:', error);
        throw error; 
      }
    },

    createTeam: async (_: any, { input }: { input: CreateTeamInput }, context: Context) => {
      try {
        const newTeamDoc = db.collection('Team').doc();
        const teamId = newTeamDoc.id;
        await addUserToTeam(input.AdminEmail, teamId);


        const newTeam = {
          Name: input.Name,
          teamId: teamId,
          AdminEmail: input.AdminEmail,
          MembersEmails: input.MembersEmails,
          Email: input.Email,
          Logo: input.Logo,
          Place: input.Place,
          OwnerName: input.OwnerName,
          OwnerSurname: input.OwnerSurname,

        };

        await newTeamDoc.set(newTeam);

        return newTeam;
      } catch (error) {
        console.error('Chyba při vytváření týmu:', error);
        throw error; 
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
    IdTeam: [String]!
    Email: String!
  }

  input CreateUserInput {
    Name: String!
    Surname: String!
    IdUser: String!
    IdTeam: [String]!
    Email: String!
  }

  input CreateTeamInput {
    Name: String!
    AdminEmail: String!
    MembersEmails: [String]!
    teamId: String!
    Email: String!
    Logo: String!
    Place: String!
    OwnerName: String!
    OwnerSurname: String!
  }

  type Team {
    Name: String!
    teamId: String!
    MembersEmails: [String]!
    AdminEmail: String!
    Email: String!
    Logo: String!
    Place: String!
    OwnerName: String!
    OwnerSurname: String!
  }

  type NameAndSurname {
    Name: String
    Surname: String
  }

  type Query {
    user(id: String): User
    getUserByNameAndSurname(email: String): NameAndSurname
    getUserTeamsByEmail(email: String!): [Team]
    getTeamDetails(teamId: String!): TeamDetails 
  }

  type Mutation {
    createUser(input: CreateUserInput): User
    createTeam(input: CreateTeamInput): Team
    deleteUserByEmail(email: String): Boolean
  }

  type TeamDetails {
    Name: String!
    Members: [String]!
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
