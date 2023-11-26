import { gql } from "graphql-tag";

export const typeDefs = gql`
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

  input CreateUserToTeamInput {
    Name: String!
    Surname: String!
    IdUser: String!
    IdTeam: [String]!
    Email: String!
  }

  input CreateTeamInput {
    Name: String!
    AdminEmail: String!
    MembersEmails: [String]
    teamId: String!
    Email: String!
    Logo: String!
    Place: String!
    OwnerName: String!
    OwnerSurname: String!
  }

  input UpdatedMemberInput {
    member: String!
    role: Int!
  }

  type Team {
    Name: String!
    teamId: String!
    MembersEmails: [String]
    AdminEmail: String!
    Email: String!
    Logo: String!
    Place: String!
    OwnerName: String!
    OwnerSurname: String!
  }

  type TeamDetails2 {
    teamId: String!
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
    getTeamMembersByEmail(teamEmail: String!): [String]
    checkTeamEmailExistence(email: String!): Boolean
    getTeamIdByEmail(teamEmail: String!): TeamDetails2

    heartbeat: Boolean
  }

  type Mutation {
    createUser(input: CreateUserInput): User
    createUserToTeam(input: CreateUserInput): User
    createTeam(input: CreateTeamInput): Team
    deleteUserByEmail(email: String): Boolean
    updateUserRoles(
      teamEmail: String!
      updatedMembers: [UpdatedMemberInput]!
    ): Team
    deleteTeamByEmail(email: String): Boolean
    updateTeamFinished(teamEmail: String!): Boolean

  }

  type TeamDetails {
    Name: String!
  }
`;
