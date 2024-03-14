/* eslint-disable @typescript-eslint/ban-types */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

export type Context = {
  user?: DecodedIdToken | undefined;
  db: FirebaseFirestore.Firestore; // Include the db property
};

export type User = {
  Name: string;
  Surname: string;
  IdUser: string;
  IdTeam: [String];
  IsAdmin: boolean;
  Email: string;
  DateOfBirth: string;
  Picture: string;
};

export type Team = {
  Name: string;
  teamId: string;
  MembersEmails: [String];
  AdminEmail: string;
  Members: { member: string; role: string }[];
  Email: string;
  Logo: string;
  Place: string;
  OwnerName: string;
  OwnerSurname: string;
  TimeCreated: string;
  Halls?: Hall[];
  TreningHalls?: TreningHall[];
  Gyms?: Gym[];
};

export type Hall = {
  name: string;
  location: string;
  hallId: string;
};

export type TreningHall = {
  name: string;
  location: string;
  treningHallId: string;
};

export type Gym	= {
  name: string;
  location: string;
  gymId: string;
};

export type UpdatedMemberInput = {
  member: String;
  role: number;
};

export type Mutation = {
  createUser(input: CreateUserInput): User;
  creteTeam(input: CreateTeamInput): Team;
  deleteUserByEmail(email: String): Boolean;
  updateUserRoles(
    teamEmail: String,
    updatedMembers: [UpdatedMemberInput]
  ): Team;
  updateTeamFinished(teamEmail: String): Boolean;
  

};

export type CreateUserInput = {
  Name: string;
  Surname: string;
  IdUser: string;
  IdTeam: [String];
  Email: string;
  DateOfBirth: string;
  postalCode: string;
  city: string;
  street: string;
  streetNumber: string;
  phoneNumber: string;
};

export type CreateUserToTeamInput = {
    Name: string;
    Surname: string;
    IdUser: string;
    IdTeam: [String];
    Email: string;
    DateOfBirth: string;
  };

export type CreateTeamInput = {
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

export type NameAndSurname = {
  Name: String;
  Surname: String;
};

export type TeamDetails2 = {
    teamId: string;
  };

export type TeamDetails = {
  Name: String;
};

export type Query = {
  user(id: String): User;
  getUserByNameAndSurname(email: String): NameAndSurname;
  getUserTeamsByEmail(email: String): [String];
  getTeamMembersByEmail(teamEmail: String): [String];
  checkTeamEmailExistence(email: String): Boolean;
  getTeamIdByEmail(teamEmail: String): TeamDetails2


};


export type MemberDetails = {
  Name: string;
  Surname: string;
  Role: string;
  doc: string;
  Email: string;
  docDate: string;
  DateOfBirth: string;
  Picture: string;
  Subteams: Subteam[];
};

export type Subteam = {
  Name: string;
  teamId: string;
  Formations: [Formations];
  subteamId: string;
  subteamMembers: SubteamMember[];
};

export type SubteamMember = {
  email: string;
  role: string;
  position: string;
  playPosition: string;
};


export type CompleteSubteam = {
  Name: string;
  teamId: string;
  subteamId: string;
  Formations: [Formations];
  subteamMembers: CompleteSubteamMember[];
};

export type Formations = {
  formationId: string;
  formationName: string;
  cards: {
    Cent: Card[];
    lefD: Card[];
    lefU: Card[];
    rigD: Card[];
    rigU: Card[];
  };
};

export type SubteamMemberInput3 = {
  email: string;
  role: string;
  position: string;
  playPosition: string;
};

export type Card = {
  email: string;
  name: string;
  surname: string;
  playPosition: string;
  position: string;
};

export type CompleteSubteamMember = {
  name: string;
  surname: string;
  email: string;
  picture: string;
  dateOfBirth: string;
  playPosition: string;
  role: string;
  position: string;
};

