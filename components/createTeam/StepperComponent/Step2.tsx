import React, { useState } from "react";
import { Box, Typography, MenuItem, Select, Button, Card, CardContent } from "@mui/material";
import { gql, useQuery } from "@apollo/client";

type Step2Props = {
  teamEmail: string;
};

type SelectedMembers = {
  Trainers: string[];
  Manegement: string[];
  Players: string[];
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
  const [roles, setRoles] = useState<{ [key: number]: string }>({});
  const [selectedMembers, setSelectedMembers] = useState<SelectedMembers>({
    Trainers: [],
    Manegement: [],
    Players: [],
  });
  const [isCompleted, setIsCompleted] = useState(false);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const members = data?.getTeamMembersByEmail || [];

  const handleRoleChange = (index: number, role: string) => {
    setRoles((prevRoles) => ({
      ...prevRoles,
      [index]: role,
    }));

    setSelectedMembers((prevMembers) => {
      const updatedMembers: SelectedMembers = { ...prevMembers };
      updatedMembers[role as keyof SelectedMembers] = [
        ...updatedMembers[role as keyof SelectedMembers],
        members[index],
      ];
      return updatedMembers;
    });
  };

  const handleComplete = () => {
    const isNoneSelected = Object.values(roles).some((role) => role === "None");
    setIsCompleted(!isNoneSelected);
  };

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
            Nastavte práva uživatelů
          </Typography>
          <Box sx={{ marginBottom: '2em' }}>
            <Typography variant="h6" sx={{ marginTop: 2 }}>
              Toto jsou členové, kteří již byli přidáni:
            </Typography>
          </Box>

          {members.map((member: string, index: number) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '40px',
                borderRadius: '10px',
                marginBottom: '2em',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.4)',
              }}
            >
              <Typography sx={{ marginRight: '1em' }}>{member}</Typography>
              <Select
                value={roles[index] || 'None'}
                onChange={(e) => handleRoleChange(index, e.target.value)}
                sx={{ marginLeft: '30%' }}
              >
                <MenuItem value="None">None</MenuItem>
                <MenuItem value="Trainers">Trainers</MenuItem>
                <MenuItem value="Manegement">Manegement</MenuItem>
                <MenuItem value="Players">Players</MenuItem>
              </Select>
            </Box>
          ))}

          <Button
            variant="contained"
            color="primary"
            onClick={handleComplete}
            sx={{ marginTop: '2em' }}
          >
            Dokončit
          </Button>

          {isCompleted && (
            <Card sx={{ marginTop: '2em' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Výsledky
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="subtitle1">Trainers</Typography>
                    {selectedMembers.Trainers.map((member, index) => (
                      <Typography key={index}>{member}</Typography>
                    ))}
                  </Box>
                  <Box>
                    <Typography variant="subtitle1">Manegement</Typography>
                    {selectedMembers.Manegement.map((member, index) => (
                      <Typography key={index}>{member}</Typography>
                    ))}
                  </Box>
                  <Box>
                    <Typography variant="subtitle1">Players</Typography>
                    {selectedMembers.Players.map((member, index) => (
                      <Typography key={index}>{member}</Typography>
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Step2;
