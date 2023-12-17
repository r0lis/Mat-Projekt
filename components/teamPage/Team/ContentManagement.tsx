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
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import React, { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import Checkbox from "@mui/material/Checkbox";
import Content from "@/components/teamPage/Team/SubTeamContent";

const CREATE_SUBTEAM = gql`
  mutation CreateSubteam(
    $teamId: String!
    $inputName: String!
    $subteamMembers: [SubteamMemberInput]!
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
  Position: string;
  DateOfBirth: string;
}

interface Subteam {
  subteamId: string;
  Name: string;
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
  const [isSelectVisible, setIsSelectVisible] = useState(false);
  const [addMembers, setAddMembers] = useState<
    { email: string; role: string; position: string }[]
  >([]);

  const {
    loading,
    error: subteamError,
    data,
    refetch,
  } = useQuery(GET_SUBTEAMS, {
    variables: { teamId: teamId },
  });

  const [selectedSubteam, setSelectedSubteam] = useState<string | null>(null);

  useEffect(() => {
    if (data && data.getSubteamData && data.getSubteamData.length > 0) {
      setSelectedSubteam(data.getSubteamData[0].subteamId);
    }
  }, [data]);

  const {
    loading: loadingMembers,
    error: errorMembers,
    data: dataMembers,
  } = useQuery<{
    getTeamMembersDetails: Member[];
  }>(GET_TEAM_MEMBERS_DETAILS, {
    variables: { teamId: teamId },
  });

  const handleCheckboxChange = (
    email: string,
    role: string,
    position: string
  ) => {
    const memberIndex = addMembers.findIndex(
      (member) => member.email === email
    );

    if (memberIndex !== -1) {
      setAddMembers((prevMembers) => [
        ...prevMembers.slice(0, memberIndex),
        ...prevMembers.slice(memberIndex + 1),
      ]);
    } else {
      setAddMembers((prevMembers) => [
        ...prevMembers,
        { email, role, position },
      ]);
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

    if (name.length < 2 || !name.match(/^[A-Z]/)) {
      setError("Jméno musí mít alespoň 2 znaky a začínat velkým písmenem.");
      return;
    }

    // Validace členů
    if (
      addMembers.length < 2 ||
      addMembers.some((member) => member.position == "0")
    ) {
      setError(
        "Přidejte alespoň 2 členy do týmu a každý člen musí mít vybranou pozici."
      );
      return;
    }

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
      setError(null); // Clear any previous errors
      setAddMode(false);
      setError(null); // Clear any previous errors
      refetch();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Handle the error and set it in the state
      setError(error.message);
    }
  };

  const handleSubteamChange = (event: { target: { value: any } }) => {
    setSelectedSubteam(event.target.value);
    setIsSelectVisible(false);
  };

  const handlePositionChange = (
    e: SelectChangeEvent<string>,
    email: string
  ) => {
    const newPosition = e.target.value;
    setAddMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.email === email ? { ...member, position: newPosition } : member
      )
    );
  };

  const handleToggleSelect = () => {
    setIsSelectVisible(!isSelectVisible);
  };

  return (
    <Box sx={{}}>
      <Box>
        {!addMode && (
          <>
            <Box sx={{ marginLeft: "5%", marginRight: "5%" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box>
                  <Typography sx={{ fontWeight: "600" }} variant="h4">
                    Týmy v klubu:
                  </Typography>
                </Box>
                <Box sx={{ marginLeft: "auto", marginRight: "" }}>
                <Button sx={{marginRight:"2em"}} onClick={handleToggleSelect} variant="contained">
                      Týmy
                    </Button>

                  <Button onClick={handleAddTeamClick} variant="contained">
                    <Typography sx={{ fontWeight: "600" }}>
                      Přidat tým
                    </Typography>
                  </Button>
                
                </Box>
              </Box>
              <>
                {data &&
                data.getSubteamData &&
                data.getSubteamData.length > 0 ? (
                  <Box ml={2}>
                    
                    {isSelectVisible && (
                    <Select
                      sx={{ width: "100%", height: "4em", marginTop: "1em" }}
                      value={selectedSubteam}
                      onChange={handleSubteamChange}
                    >
                      {data.getSubteamData.map((subteam: Subteam) => (
                        <MenuItem
                          key={subteam.subteamId}
                          value={subteam.subteamId}
                        >
                          <Typography variant="h6">{subteam.Name}</Typography>
                        </MenuItem>
                      ))}
                    </Select>)}
                    {data.getSubteamData.map((subteam: Subteam) => (
                      <div key={subteam.subteamId}>
                        {selectedSubteam === subteam.subteamId && (
                          // Content to show when this subteam is selected
                          <Typography variant="body1">
                            {/* Assuming Content component accepts subteamId */}
                            <Content subteamId={subteam.subteamId} />
                          </Typography>
                        )}
                      </div>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body1">
                    V tomto klubu jste zatím nevytvořili žádný tým.
                  </Typography>
                )}
              </>
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
              <Box sx={{}}>
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
                    sx={{ width: "50%", backgroundColor: "white" }}
                    label="Název týmu"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </form>
                {members && (
                  <TableContainer
                    component={Paper}
                    sx={{
                      marginTop: "1em",
                      boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)",
                    }}
                  >
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
                                  handleCheckboxChange(
                                    member.Email,
                                    member.Role,
                                    "0"
                                  )
                                }
                                checked={addMembers.some(
                                  (m) => m.email === member.Email
                                )}
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
                          {addMembers.map((member) => (
                            <TableRow key={member.email}>
                              <TableCell>{member.email}</TableCell>
                              <TableCell> {getRoleText(member.role)}</TableCell>
                              <TableCell>
                                <Select
                                  value={member.position || "0"} // Default to "0" if position is not set
                                  onChange={(e) =>
                                    handlePositionChange(e, member.email)
                                  }
                                >
                                  <MenuItem value="0">Vyberte</MenuItem>
                                  <MenuItem value="1">Hlavní trenér</MenuItem>
                                  <MenuItem value="2">
                                    Asistent trenéra
                                  </MenuItem>
                                  <MenuItem value="3">Hráč</MenuItem>
                                </Select>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Box>
                <Box>{error && <Alert severity="error">{error}</Alert>}</Box>
                <Box
                  sx={{
                    display: "flex",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <Button
                    onClick={handleFormSubmit}
                    type="submit"
                    sx={{
                      display: "flex",
                      marginLeft: "auto",
                      marginRight: "auto",
                      width: "20%",
                      backgroundColor: "#3f51b5",
                      color: "white",
                      "&:hover": { backgroundColor: "#A020F0" },
                    }}
                    variant="contained"
                  >
                    <Typography sx={{ fontWeight: "600" }}>
                      Vytvořit tým
                    </Typography>
                  </Button>
                </Box>
                <Box>
                  <Button
                    onClick={() => setAddMode(false)}
                    sx={{
                      display: "flex",
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  >
                    Zrušit
                  </Button>
                </Box>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ContentManagement;
