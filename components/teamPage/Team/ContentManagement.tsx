/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";

const CREATE_SUBTEAM = gql`
  mutation CreateSubteam($teamId: String!, $inputName: String!) {
    createSubteam(teamId: $teamId, inputName: $inputName) {
      Name
      subteamId
      teamId
    }
  }
`;
const GET_TEAM_MEMBERS_DETAILS = gql`
  query GetTeamMembersDetails($teamId: String!) {
    getTeamMembersDetails(teamId: $teamId) {
      Name
      Surname
      Role
      Email
      DateOfBirth
    }
  }
`;

const GET_SUBTEAMS = gql`
  query GetSubteamData($teamId: String!) {
    getSubteamData(teamId: $teamId) {
      Name
      subteamId
      teamId
    }
  }
`;

type TeamsProps = {
  teamId: string;
};

interface Member {
  Name: string;
  Surname: string;
  Role: string;
  Email: string;
  DateOfBirth: string;
}

const getRoleText = (role: string): string => {
  switch (role) {
    case "0":
      return 'Není zvolena práva';
    case "No Role Assigned":
      return 'Není zvolena práva';
    case "1":
      return 'Management';
    case "2":
      return 'Trenér';
    case "3":
      return 'Hráč';
    default:
      return '';
  }
};


const ContentManagement: React.FC<TeamsProps> = ({ teamId }) => {
  const [addMode, setAddMode] = useState(false);
  const [name, setName] = useState("");
  const [createSubteam] = useMutation(CREATE_SUBTEAM);
  const [error, setError] = useState<string | null>(null);

  const {
    loading,
    error: subteamError,
    data,
  } = useQuery(GET_SUBTEAMS, {
    variables: { teamId: teamId },
  });

  const { loading: loadingMembers, error: errorMembers, data: dataMembers,  } = useQuery<{
    getTeamMembersDetails: Member[];
  }>(GET_TEAM_MEMBERS_DETAILS, {
    variables: { teamId: teamId },
  });


  if (loading || loadingMembers)
    return (
      <CircularProgress
        color="primary"
        size={50}
        style={{ position: "absolute", top: "50%", left: "50%" }}
      />
    );
  if (subteamError || errorMembers) return <Typography>Chyba</Typography>;

  const members = dataMembers?.getTeamMembersDetails || [];

  const handleAddTeamClick = () => {
    setAddMode(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Perform your mutation here using createSubteam mutation
      // Pass teamId and name as variables to the mutation
      await createSubteam({
        variables: { teamId: teamId, inputName: name }, // Ensure teamId is a string
      });

      setName("");
      setAddMode(false);
      setError(null); // Clear any previous errors
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Handle the error and set it in the state
      setError(error.message);
    }
  };

  return (
    <Box sx={{}}>
      <Box>
        {!addMode && (
          <>
            <Button onClick={handleAddTeamClick} variant="contained">
              <Typography sx={{ fontWeight: "600" }}>Přidat tým</Typography>
            </Button>
            <Box>
              <Typography variant="h6">Týmy v klubu:</Typography>
              {data && data.getSubteamData && (
                <Box>
                  {data.getSubteamData.map((subteam: any) => (
                    <Typography variant="h6" key={subteam.subteamId}>
                      {subteam.Name}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>
          </>
        )}
      </Box>

      <Box>
        {addMode && (
          <Box>
            <form onSubmit={handleFormSubmit}>
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </form>
            {members   && (
                <Box>
                  {members.map((member: Member, ) => (
                    <Typography variant="h6" key={member.Email}>
                      {member.Name} {member.Surname} {getRoleText(member.Role)}
                    </Typography>
                  ))}
                </Box>
              )}
            <Box>
              <Button type="submit" variant="contained">
                <Typography sx={{ fontWeight: "600" }}>Vytvořit tým</Typography>
              </Button>
            </Box>
            <Box>
              <Button onClick={() => setAddMode(false)}>Zrušit</Button>
            </Box>
          </Box>
        )}

        {error && <Typography color="error">{error}</Typography>}
      </Box>
    </Box>
  );
};

export default ContentManagement;
