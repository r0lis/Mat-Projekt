/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useQuery, gql } from "@apollo/client";
import {authUtils} from "@/firebase/auth.utils";

const GET_COMPLETESUBTEAM_DETAILS = gql`
  query GetCompleteSubteamDetail($subteamId: String!) {
    getCompleteSubteamDetail(subteamId: $subteamId) {
      Name
      subteamId
      teamId
      subteamMembers {
        name
        surname
        email
        role
        position
      }
    }
  }
`;

const GET_MISSING_SUBTEAM_MEMBERS = gql`
  query GetMissingSubteamMembers($subteamId: String!) {
    getMissingSubteamMembers(subteamId: $subteamId)
  }
`;

type MembersProps = {
  subteamId: string;
};

type Member = {
  name: string;
  surname: string;
  email: string;
  role: string;
  position: string;
};

const Members: React.FC<MembersProps> = (subteamId) => {
  const user = authUtils.getCurrentUser();
  const id = subteamId.subteamId;
  console.log(id);

  const { loading, error, data } = useQuery(GET_COMPLETESUBTEAM_DETAILS, {
    variables: { subteamId: id },
    skip: !user,
  });

  const {
    loading: missingMembersLoading,
    error: missingMembersError,
    data: missingMembersData,
  } = useQuery(GET_MISSING_SUBTEAM_MEMBERS, {
    variables: { subteamId: id },
    skip: !user,
  });

  if (loading || missingMembersLoading)
    return (
      <CircularProgress
        color="primary"
        size={50}
        style={{ position: "absolute", top: "50%", left: "50%" }}
      />
    );
  if (error || missingMembersError) return <Typography>Chyba</Typography>;

  const subteam = data.getCompleteSubteamDetail;
  const missingMembers = missingMembersData.getMissingSubteamMembers;
  
  return (
     <Box>
      <Typography variant="h5">Members</Typography>
      {subteam?.subteamMembers.map((member: Member) => (
        <Typography key={member.email}>
          {member.name} {member.surname} {member.email} - {member.role}
        </Typography>
      ))}
      <Typography variant="h5">Missing members</Typography>
      {missingMembers && missingMembers.map((email: string) => (
        <Typography key={email}>
          {email}
        </Typography>
      ))}
       
     
    </Box>
  );
};

export default Members;

