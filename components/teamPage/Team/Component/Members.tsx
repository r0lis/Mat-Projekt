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

  if (loading)
    return (
      <CircularProgress
        color="primary"
        size={50}
        style={{ position: "absolute", top: "50%", left: "50%" }}
      />
    );
  if (error) return <Typography>Chyba</Typography>;

  const subteam = data.getCompleteSubteamDetail;
  
  return (
     <Box>
      <Typography variant="h5">Members</Typography>
      {subteam?.subteamMembers.map((member: Member) => (
        <Typography key={member.email}>
          {member.name} {member.surname} {member.email} - {member.role}
        </Typography>
      ))}
    </Box>
  );
};

export default Members;

