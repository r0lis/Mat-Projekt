import { gql } from "graphql-tag";

export const typeDefs = gql`
  type User {
    Name: String!
    Surname: String!
    IdUser: String!
    IdTeam: [String]!
    Email: String!
    DateOfBirth: String!
  }

  input CreateUserInput {
    Name: String!
    Surname: String!
    IdUser: String!
    IdTeam: [String]!
    Email: String!
    DateOfBirth: String!
  }

  input CreateUserToTeamInput {
    Name: String!
    Surname: String!
    IdUser: String!
    IdTeam: [String]!
    Email: String!
    DateOfBirth: String!
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
    DateOfBirth: String!
    Subteams: [Subteam]
  }

  type UserDetail {
    Name: String
    Surname: String
    Id: String
    DateOfBirth: String
    Picture: String
  }
  
  type UserRoleInTeam {
    email: String!
    role: String!
  }

  type TeamDetails {
    Name: String!
  }



  input SubteamMemberInput {
    email: String!
    role: String!
    position: String!
  }

  type Subteam {
    Name: String!
    subteamId: String!
    teamId: String!
    subteamMembers: [SubteamMember]!
  }

  type SubteamMember {
    email: String!
    role: String!
    position: String!
  }

  type CompleteSubteam {
    Name: String
    teamId: String
    subteamId: String
    subteamMembers: [CompleteSubteamMember]
  }
  
  type CompleteSubteamMember {
    name: String
    surname: String
    email: String
    role: String
    position: String
  }
  
  type SubteamMember2 {
    email: String
    role: Int
    name: String
    surname: String
  }

  input UpdatedSubteamMemberInput {
    email: String!
    role: String!
    position: String!
  }

  
  type Query {
    user(id: String): User
    getUserByNameAndSurname(email: String): UserDetail
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
    getUserRoleInTeam(teamId: String!, email: String!): UserRoleInTeam
    getTeamImg(teamId: String!): String
    getSubteamData(teamId: String!): [Subteam]
    getYourSubteamData(teamId: String!, email: String!): [Subteam]
    getSubteamDetails(subteamId: String!): Subteam
    getCompleteSubteamDetail(subteamId: String!): CompleteSubteam
    getMissingSubteamMembers(subteamId: String!): [SubteamMember2]

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
    uploadImageTeam(imageBase64: String!, teamEmail: String!): String!
    uploadImageUser(imageBase64: String!, userEmail: String!): String!
    updateMemberRole(
      email: String!
      role: String!
      teamId: String!
    ): MemberDetails
    deleteMember(teamId: String, memberEmail: String): Boolean
    createSubteam(
      teamId: String!
      inputName: String!
      subteamMembers: [SubteamMemberInput]!
    ): Subteam

    updateSubteamMembers(
      subteamId: String!
      updatedMembers: [UpdatedSubteamMemberInput]!
    ): Boolean
    updateSubteamMember(
      subteamId: String!
      email: String!
      position: String!
    ): Boolean
  }

  



`;



