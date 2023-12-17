import { Box, CircularProgress, Typography } from "@mui/material";
import React from "react";
import { gql, useQuery } from "@apollo/client";
import { authUtils } from "@/firebase/auth.utils";

interface ContentProps {
  subteamId: string;
}

const GET_SUBTEAM_DETAILS = gql`
  query GetSubteamDetails($subteamId: String!) {
    getSubteamDetails(subteamId: $subteamId) {
      Name
      subteamId
      teamId
      subteamMembers {
        email
        role
        position
      }
    }
  }
`;

interface SubteamMember {
  email: string;
  role: string;
  position: string;
}

const Content: React.FC<ContentProps> = ({ subteamId }) => {
  const user = authUtils.getCurrentUser();

  const { loading, error, data } = useQuery(GET_SUBTEAM_DETAILS, {
    variables: { subteamId },
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

  const subteam = data.getSubteamDetails;

  return (
    <Box>
      <Typography variant="h5">{subteam.Name}</Typography>
      <Typography variant="h6">Subteam Members:</Typography>
      <ul>
        {subteam.subteamMembers.map((member: SubteamMember) => (
          <li key={member.email}>
            <Typography>{`${member.email} - Role: ${member.role}, Position: ${member.position}`}</Typography>
          </li>
        ))}
      </ul>
    </Box>
  );
};

export default Content;
