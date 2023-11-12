import React from "react";
import TextField from "@mui/material/TextField";
import { Box, Typography } from "@mui/material";
import { gql, useQuery } from "@apollo/client";

type Step2Props = {
  teamEmail: string;
};

const GET_TEAM_MEMBERS = gql`
  query GetTeamMembers($teamEmail: String!) {
    getTeamMembersByEmail(teamEmail: $teamEmail)
  }
`;

const Step2: React.FC<Step2Props> = ({ teamEmail }) => {
  const { loading, error, data } = useQuery(GET_TEAM_MEMBERS, {
    variables: { teamEmail },
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const members = data?.getTeamMembersByEmail || [];

  return (
    <Box sx={{ margin: "0 auto", marginTop: 10, paddingBottom: "4em" }}>
      <Box
        sx={{
          backgroundColor: "white",
          width: "60%",
          marginLeft: "auto",
          marginRight: "auto",
          padding: "5%",
          marginTop: "6em",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box>
          <Typography sx={{ textAlign: "center" }} variant="h4" gutterBottom>
            Nastavte práva uživatelů a nastavte účty a další infomace.
          </Typography>
          <Typography>{teamEmail}</Typography>
          <Typography variant="h6" sx={{ marginTop: 2 }}>
            Members:
          </Typography>
          {members.map((member: string, index: number) => (
            <Typography key={index}>{member}</Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Step2;
