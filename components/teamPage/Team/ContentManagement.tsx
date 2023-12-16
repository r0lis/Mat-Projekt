/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import {
  Box,
  Button,
  CircularProgress,
  TableHead,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";
import React, { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import Checkbox from "@mui/material/Checkbox";

const CREATE_SUBTEAM = gql`
  mutation CreateSubteam(
    $teamId: String!
    $inputName: String!
    $subteamMembers: [String]!
  ) {
    createSubteam(
      teamId: $teamId
      inputName: $inputName
      subteamMembers: $subteamMembers
    ) {
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
      return "Není zvolena práva";
    case "No Role Assigned":
      return "Není zvolena práva";
    case "1":
      return "Management";
    case "2":
      return "Trenér";
    case "3":
      return "Hráč";
    default:
      return "";
  }
};

const ContentManagement: React.FC<TeamsProps> = ({ teamId }) => {
  const [addMode, setAddMode] = useState(false);
  const [name, setName] = useState("");
  const [createSubteam] = useMutation(CREATE_SUBTEAM);
  const [error, setError] = useState<string | null>(null);
  const [addMembers, setAddMembers] = useState<string[]>([]);

  const {
    loading,
    error: subteamError,
    data,
    refetch,
  } = useQuery(GET_SUBTEAMS, {
    variables: { teamId: teamId },
  });

  const {
    loading: loadingMembers,
    error: errorMembers,
    data: dataMembers,
  } = useQuery<{
    getTeamMembersDetails: Member[];
  }>(GET_TEAM_MEMBERS_DETAILS, {
    variables: { teamId: teamId },
  });

  const handleCheckboxChange = (email: string) => {
    if (addMembers.includes(email)) {
      setAddMembers((prevMembers) => prevMembers.filter((m) => m !== email));
    } else {
      setAddMembers((prevMembers) => [...prevMembers, email]);
    }
  };

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
        variables: {
          teamId: teamId,
          inputName: name,
          subteamMembers: addMembers,
        }, // Ensure teamId is a string
      });

      setName("");
      setAddMembers([]);
      setAddMode(false);
      setError(null); // Clear any previous errors
      refetch();
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
            <Box sx={{ marginLeft: "10%" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box>
                  <Typography sx={{ fontWeight: "600" }} variant="h5">
                    Týmy v klubu:
                  </Typography>
                </Box>
                <Box sx={{ marginLeft: "auto", marginRight: "20%" }}>
                  <Button onClick={handleAddTeamClick} variant="contained">
                    <Typography sx={{ fontWeight: "600" }}>
                      Přidat tým
                    </Typography>
                  </Button>
                </Box>
              </Box>
              {data && data.getSubteamData && (
                <Box ml={2}>
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
          <>
            <Box
              sx={{
                backgroundColor: "#F0F2F5",
                width: "70%",
                marginLeft: "auto",
                marginTop: "7%",
                marginRight: "auto",
                padding: "2em",
                position: "relative",
                display: "block",
                borderRadius: "15px",
                boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)",
              }}
            >
              <Box sx={{  }}>
                <Typography variant="h4">Přidání týmu do klubu</Typography>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  marginTop: "0.5em",
                  borderBottom: "3px solid gray", // Change the color as needed
                  position: "relative",
                  top: "53%",
                  transform: "translateY(-50%)",
                }}
              />
              <Box
                sx={{ marginTop: "1em", marginLeft: "auto", display: "block" }}
              >
                <form
                  style={{
                    marginLeft: "auto",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                   
                  }}
                >
                  <TextField
                    sx={{ width: "50%",  backgroundColor: "white", }}
                    label="Název týmu"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </form>
                {members && (
                  <TableContainer component={Paper} sx={{ marginTop: "1em",  boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)", }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Člen</TableCell>
                          <TableCell>Práva</TableCell>
                          <TableCell>Přidat</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {members.map((member: Member) => (
                          <TableRow key={member.Email}>
                            <TableCell>
                              <Typography variant="h6">
                                {member.Name} {member.Surname}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="h6">
                                {getRoleText(member.Role)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Checkbox
                                onChange={() =>
                                  handleCheckboxChange(member.Email)
                                }
                                checked={addMembers.includes(member.Email)}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
                <Box sx={{ marginTop: "2em", marginBottom: "2em" }}>
                  {addMembers.length === 0 ? (
                    <Alert severity="warning">Přidejte členy do týmu.</Alert>
                  ) : (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>E-maily členů</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {addMembers.map((email: string) => (
                            <TableRow key={email}>
                              <TableCell>{email}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Box>
                <Box sx={{display:"flex", marginLeft:"auto", marginRight:"auto",}}>
                  <Button
                    onClick={handleFormSubmit}
                    type="submit"
                    sx={{display:"flex", marginLeft:"auto", marginRight:"auto",  width:"20%", backgroundColor:"#3f51b5", color:"white", "&:hover":{backgroundColor:"#A020F0"}}}
                    variant="contained"
                  >
                    <Typography sx={{ fontWeight: "600" }}>
                      Vytvořit tým
                    </Typography>
                  </Button>
                </Box>
                <Box >
                  <Button onClick={() => setAddMode(false)}  sx={{display:"flex", marginLeft:"auto", marginRight:"auto"}}>Zrušit</Button>
                </Box>
              </Box>
            </Box>
          </>
        )}

        {error && <Typography color="error">{error}</Typography>}
      </Box>
    </Box>
  );
};

export default ContentManagement;
