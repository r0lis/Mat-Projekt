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

  input MemberInput {
    name: String!
    UpdatedMemberInput: [String]
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

  type MemberDetails {
    Name: String!
    Surname: String!
    Role: String!
    Email: String!
  }

  type NameAndSurname {
    Name: String
    Surname: String
    Id: String
  }

  type Query {
    user(id: String): User
    getUserByNameAndSurname(email: String): NameAndSurname
    getUserTeamsByEmail(email: String!): [Team]
    getTeamDetails(teamId: String!): TeamDetails
    getTeamMembersByEmail(teamEmail: String!): [String]
    checkTeamEmailExistence(email: String!): Boolean
    getTeamIdByEmail(teamEmail: String!): TeamDetails2
    checkUserMembership(teamId: String!, currentUserEmail: String!): Boolean!
    heartbeat: Boolean
    checkEmailsInTeam(teamId: String!, emails: [String!]!): [String!]!
    getTeamLogo(teamId: String!): String
    getTeamMembersDetails(teamId: String!): [MemberDetails] 
    checkUserMembershipInvite(teamId: String!, currentUserEmail: String!): Boolean!


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
    addUserToTeam(email: String!, teamId: String!): Boolean
    updateMembers(teamId: String!, newMembers: [String]!): Team
    uploadImage(imageBase64: String!, teamId: String!): String!

  }

  type TeamDetails {
    Name: String!
  }
`;
