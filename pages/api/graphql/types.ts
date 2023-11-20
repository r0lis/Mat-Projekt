/* eslint-disable @typescript-eslint/ban-types */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

export type Context = {
  user?: DecodedIdToken | undefined;
};

export type User = {
  Name: string;
  Surname: string;
  IdUser: string;
  IdTeam: [String];
  IsAdmin: boolean;
  Email: string;
};

export type Team = {
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
};

export type CreateUserInput = {
  Name: string;
  Surname: string;
  IdUser: string;
  IdTeam: [String];
  Email: string;
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

export type TeamDetails = {
  Name: String;
};

export type Query = {
  user(id: String): User;
  getUserByNameAndSurname(email: String): NameAndSurname;
  getUserTeamsByEmail(email: String): [String];
  getTeamMembersByEmail(teamEmail: String): [String];
  checkTeamEmailExistence(email: String): Boolean;
};
