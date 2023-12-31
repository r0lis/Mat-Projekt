/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Box, CircularProgress, Typography } from "@mui/material";
import React from "react";
import { authUtils } from "@/firebase/auth.utils";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import ContentManagement from "./Team/ContentManagement";
import Content from "./Team/Content";


type TeamsProps = {
  id: string;
};

const GET_USER_ROLE_IN_TEAM = gql`
  query GetUserRoleInTeam($teamId: String!, $email: String!) {
    getUserRoleInTeam(teamId: $teamId, email: $email) {
      email
      role
    }
  }
`;

const TeamComponent: React.FC<TeamsProps> = ({ id }) => {
  const user = authUtils.getCurrentUser();

  const {
    loading: roleLoading,
    error: roleError,
    data: roleData,
  } = useQuery(GET_USER_ROLE_IN_TEAM, {
    variables: { teamId: id, email: user?.email || "" },
    skip: !user,
  });

  if (roleLoading)
    return ( 
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
        }}
      >
        <CircularProgress color="primary" size={50} />
      </Box>
    );
  if (roleError) return <Typography>Chyba</Typography>;

  const role = roleData?.getUserRoleInTeam.role || "";

  return (
    <>
      <Box sx={{}}>
        {role == "1" ? (
          <ContentManagement teamId={id as string} />
        ) : (
          <Content teamId={id as string} />
        )}
      </Box>
    </>
  );
};

export default TeamComponent;
