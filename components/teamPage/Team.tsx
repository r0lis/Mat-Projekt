/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Box, CircularProgress, Typography } from "@mui/material";
import React from "react";
import { authUtils } from "@/firebase/auth.utils";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";

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
      <CircularProgress
        color="primary"
        size={50}
        style={{ position: "absolute", top: "50%", left: "50%" }}
      />
    );
  if (roleError) return <Typography>Chyba</Typography>;

  const role = roleData?.getUserRoleInTeam.role || "";

  return (
    <>
      <Box>
        <Typography sx={{ fontWeight: "600" }} variant="h5">
          {role == "1" ? "Přehled týmů v klubu" : "Váš tým"}
        </Typography>
      </Box>
      <Box sx={{}}></Box>
    </>
  );
};

export default TeamComponent;
