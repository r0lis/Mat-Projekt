import { gql } from "graphql-tag";

export const typeDefs = gql`
  type User {
    Name: String!
    Surname: String!
    IdUser: String!
    IdTeam: [String]!
    Email: String!
    DateOfBirth: String!
    postalCode: String
    city: String
    street: String
    streetNumber: String
    phoneNumber: String
  }

  input CreateUserInput {
    Name: String!
    Surname: String!
    IdUser: String!
    IdTeam: [String]!
    Email: String!
    DateOfBirth: String!
    postalCode: String!
    city: String!
    street: String!
    streetNumber: String!
    phoneNumber: String!
  }

  input CreateUserToTeamInput {
    Name: String!
    Surname: String!
    IdUser: String!
    IdTeam: [String]!
    Email: String!
    DateOfBirth: String!
    postalCode: String!
    city: String!
    street: String!
    streetNumber: String!
    phoneNumber: String!
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
    endTime: String!
    date: String!
    time: String!
    selectedHallPosition: String
    players: [String!]!
    management: [String!]!
    matchType: String!
  }

  input AddTrainingInput{
    subteamIdSelected: String! 
    opponentName: String!
    selectedTrainingHallId: String!
    date: String!
    endTime: String!
    time: String!
    description: String!
    players: [String!]!
    management: [String!]!
  }

  type Match {
    matchId: String!
    teamId: String!
    subteamIdSelected: String!
    opponentName: String!
    selectedHallId: String!
    selectedHallPosition: String
    date: String!
    endTime: String!
    time: String!
    selectedMembers: [String!]
    selectedPlayers: [String!]
    selectedManagement: [String!]
    matchType: String!
    attendance: [AttendanceEntry!]!
  }

  type Training {
    matchId: String!
    teamId: String!
    subteamIdSelected: String!
    opponentName: String!
    selectedHallId: String!
    endTime: String!
    date: String!
    time: String!
    description: String!
    selectedMembers: [String!]
    selectedPlayers: [String!]
    selectedManagement: [String!]
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
    doc: String
    docDate: String
    street: String
    streetNumber: String
    postalCode: String
    city: String
    phoneNumber: String
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
    city: String
    street: String
    streetNumber: String
    postalCode: String
    phoneNumber: String
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
    doc: String
    docDate: String
    position: String!
    playPosition: String!
  }


  type CompleteSubteam {
    Name: String
    teamId: String
    subteamId: String
    Formations: [Formation]
    subteamMembers: [CompleteSubteamMember]
  }
  
  type CompleteSubteamMember {
    name: String
    surname: String
    email: String
    dateOfBirth: String
    picture: String
    doc: String
    docDate: String
    role: String
    position: String
    playPosition: String
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

  type SubteamTrainings {
    subteamId: String!
    trainings: [Training]
  }

  input AddDiscussionInput {
    subteamId: String!
    postText: String!
    userEmail: String!
    date: String!
    title: String!
    onComment: Boolean!
  }

  type Discussion
  {
    discussionId: String!
    subteamId: String!
    postText: String!
    userEmail: String!
    date: String!
    title: String!
    onComment: Boolean!
    Comments: [Comment]
    Seen: [SeenEntry]
  }

  input AddCommentInput {
    discussionId: String
    commentText: String
    userEmail: String
    date: String
  }
  
  type Comment {
    discussionId: String
    commentText: String
    userEmail: String
    date: String
    commentId: String
  }

  input UpdateDiscussionInput {
    discussionId: String!
    userEmail: String!
  }

  type SeenEntry {
    userEmail: String!
    date: String!
  }

  type SeenUser {
    userEmail: String!
  }

  input UpdateTrainingInput {
    matchId: String!
    opponentName: String
    selectedHallId: String
    subteamIdSelected: String
    endTime: String
    teamId: String
    description: String
    date: String
    time: String
    selectedMembers: [String]
    selectedPlayers: [String]
    selectedManagement: [String]
  }

  input UpdateMatchInput {
    matchId: String!
    teamId: String
    subteamIdSelected: String
    opponentName: String
    selectedHallId: String
    selectedHallPosition: String
    date: String
    time: String
    endTime: String
    selectedPlayers: [String]
    selectedManagement: [String]
    selectedMembers: [String]
    matchType: String
  }

  input SubteamMemberInput3 {
    email: String
    name: String
    surname: String
    position: String
    playPosition: String
  }

  type Formation {
    cards: Card
    formationId: String
    formationName: String
  }

  type SubteamMemberCard {
    email: String
    name: String
    surname: String
    position: String
    playPosition: String
  }

  type Card {
    lefU: SubteamMemberCard
    Cent: SubteamMemberCard
    rigU: SubteamMemberCard
    lefD: SubteamMemberCard
    rigD: SubteamMemberCard
  }
  
  input CardsInput {
    lefU: SubteamMemberInput3
    Cent: SubteamMemberInput3
    rigU: SubteamMemberInput3
    lefD: SubteamMemberInput3
    rigD: SubteamMemberInput3
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
    getAllMatchesBySubteam(input: MatchesBySubteamInput): [SubteamMatches]
    getTrainingsBySubteam(input: MatchesBySubteamInput): [SubteamTrainings]
    getAllTrainingsBySubteam(input: MatchesBySubteamInput): [SubteamTrainings]
    getHallByTeamAndHallId(teamId: String!, hallId: String!): Hall 
    getPastMatchesBySubteam(input: MatchesBySubteamInput): [SubteamMatches]
    getFutureMatchesBySubteam(input: MatchesBySubteamInput): [SubteamMatches]
    getPastTrainingsBySubteam(input: MatchesBySubteamInput): [SubteamTrainings]
    getFutureTrainingsBySubteam(input: MatchesBySubteamInput): [SubteamTrainings]
    getTrainingHallByTeamAndHallId(teamId: String!, treningHallId: String!): TreningHall
    getAllMatchBySubteamId(subteamId: String!): [Match]
    getAllTrainingBySubteamId(subteamId: String!): [Training]
    getTeamByEmail(email: String!): Team
    getDiscussionsBySubteam(subteamId: String!): [Discussion]
    getDiscussionSeenUsers(discussionId: String!): [SeenUser]!
    getMatchByMatchId(matchId: String!): Match
    getTrainingByMatchId(matchId: String!): Training
  }

  type Mutation {
    createUser(input: CreateUserInput): User
    createUserToTeam(input: CreateUserToTeamInput): User
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
      docDate: String!
      teamId: String!
    ): MemberDetails

    updateMemberMedicalDoc(
      email: String!
      teamId: String!
      doc: String!
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
    updatePositionSubteamMember(
      subteamId: String!
      email: String!
      playPosition: String!
    ): Boolean
    addHallToTeam(teamId: String!, hall: HallInput!): Team
    deleteHallFromTeam(teamId: String!, hallId: String!): Team
    addTreningHallToTeam(teamId: String!, treningHall: TreningHallInput!): Team
    deleteTreningHallFromTeam(teamId: String!, treningHallId: String!): Team
    addGymToTeam(teamId: String!, gym: GymInput!): Team
    deleteGymFromTeam(teamId: String!, gymId: String!): Team
    addMatch(teamId: String!, input: AddMatchInput!): Match
    addTraining(teamId: String!, input: AddTrainingInput!): Training
    updateAttendance(matchId: String!, player: String!, hisAttendance: Int!, reason: String!): Boolean
    updateTrainingAttendance(matchId: String!, player: String!, hisAttendance: Int!, reason: String!): Boolean
    addDiscussion(input: AddDiscussionInput): Discussion
    addComment(input: AddCommentInput): Comment
    updateDiscussion(input: UpdateDiscussionInput): Boolean
    deleteMatch(matchId: String!): Boolean
    deleteTraining(matchId: String!): Boolean
    updateTraining(input: UpdateTrainingInput): Boolean
    updateMatch(input: UpdateMatchInput): Boolean
    updateFormation(subteamId: String!, formationName: String!, cards: CardsInput!): Boolean
    deleteFormation(subteamId: String!, formationId: String!): Boolean

  }
  `;
