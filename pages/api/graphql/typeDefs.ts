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

  input AddMatchInput {
    subteamIdSelected: String! 
    opponentName: String!
    selectedHallId: String!
    date: String!
    time: String!
    players: [String!]!
    management: [String!]!
    matchType: String!
  }

  type Match {
    matchId: String!
    teamId: String!
    subteamIdSelected: String!
    opponentName: String!
    selectedHallId: String!
    date: String!
    time: String!
    selectedMembers: [String!]
    selectedPlayers: [String!]
    selectedManagement: [String!]
    matchType: String!
    attendance: [AttendanceEntry!]!
  }

  type AttendanceEntry {
    player: String!
    hisAttendance: Int!
    reason: String
  }
  
  input UpdatedMemberInput {
    member: String!
    role: Int!
  }

  input MemberInput {
    name: String!
    UpdatedMemberInput: [String]
  }

  input MatchesBySubteamInput {
    subteamIds: [String!]!
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
    TimeCreated: String!
    Halls: [Hall]
    TreningHalls: [TreningHall]
    Gyms: [Gym]
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
    Picture: String
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
    Logo: String!
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
    picture: String
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

  type Hall {
    name: String!
    location: String!
    hallId: String!
  }

  type TreningHall {
    name: String!
    location: String!
    treningHallId: String!
  }

  type Gym {
    name: String!
    location: String!
    gymId: String!
  }

  input GymInput {
    name: String!
    location: String!
  }

  input HallInput {
    name: String!
    location: String!
  }

  input TreningHallInput {
    name: String!
    location: String!
  }

  input MatchesBySubteamInput {
    subteamIds: [String!]!
  }
  
  type SubteamMatches {
    subteamId: String!
    matches: [Match]
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
    getTeam(teamId: String!): Team
    getHallsByTeamId(teamId: String!): [Hall]
    getTreningHallsByTeamId(teamId: String!): [TreningHall]
    getGymsByTeamId(teamId: String!): [Gym]
    getMatchesBySubteam(input: MatchesBySubteamInput): [SubteamMatches]
    getHallByTeamAndHallId(teamId: String!, hallId: String!): Hall 
    getPastMatchesBySubteam(input: MatchesBySubteamInput): [SubteamMatches]
    getFutureMatchesBySubteam(input: MatchesBySubteamInput): [SubteamMatches]
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
    addHallToTeam(teamId: String!, hall: HallInput!): Team
    deleteHallFromTeam(teamId: String!, hallId: String!): Team
    addTreningHallToTeam(teamId: String!, treningHall: TreningHallInput!): Team
    deleteTreningHallFromTeam(teamId: String!, treningHallId: String!): Team
    addGymToTeam(teamId: String!, gym: GymInput!): Team
    deleteGymFromTeam(teamId: String!, gymId: String!): Team
    addMatch(teamId: String!, input: AddMatchInput!): Match
    updateAttendance(matchId: String!, player: String!, hisAttendance: Int!, reason: String!): Boolean



  }

  



`;
