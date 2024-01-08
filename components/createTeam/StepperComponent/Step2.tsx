/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useState } from "react";
import {
  Box,
  Typography,
  MenuItem,
  Select,
  Button,
  Card,
  CardContent,
  Alert,
  Slide,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import { gql, useMutation, useQuery } from "@apollo/client";
import { authUtils } from "@/firebase/auth.utils";

type Step2Props = {
  teamEmail: string;
  onCompleteStep: () => void; // Add this prop
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

const UPDATE_USER_ROLES = gql`
  mutation UpdateUserRoles(
    $teamEmail: String!
    $updatedMembers: [UpdatedMemberInput]!
  ) {
    updateUserRoles(teamEmail: $teamEmail, updatedMembers: $updatedMembers) {
      MembersEmails
    }
  }
`;

const TableDivider = () => (
  <Box
    sx={{
      borderRight: "1px solid rgba(224, 224, 224, 1)",
      height: "100%",
      margin: "0",
    }}
  />
);

const Step2: React.FC<Step2Props> = ({ teamEmail, onCompleteStep }) => {
  const user = authUtils.getCurrentUser();
  const { loading, error, data } = useQuery(GET_TEAM_MEMBERS, {
    variables: { teamEmail },
  });
  const [updateUserRoles] = useMutation(UPDATE_USER_ROLES);
  const [roles, setRoles] = useState<{ [key: number]: string }>({});
  const [selectedMembers, setSelectedMembers] = useState<SelectedMembers>({
    Trainers: [],
    Manegement: [],
    Players: [],
  });
  const [isCompleted, setIsCompleted] = useState(false);
  const [errorSliderVisible, setErrorSliderVisible] = useState(false);

  const members = data?.getTeamMembersByEmail || [];

  React.useEffect(() => {
    setRoles((prevRoles) => {
      const initializedRoles: { [key: number]: string } = {};
      members.forEach((_: any, index: number) => {
        initializedRoles[index] = "None";
      });
      return initializedRoles;
    });
  }, [members]);

  React.useEffect(() => {
    const userIndex = members.findIndex((member: string | null | undefined) => member === user?.email);

    if (userIndex !== -1) {
      setRoles((prevRoles) => ({
        ...prevRoles,
        [userIndex]: "Manegement",
      }));

      setSelectedMembers((prevMembers) => ({
        ...prevMembers,
        Manegement: [...(prevMembers.Manegement || []), members[userIndex]],
      }));
    }
  }, [members, user]);

  if (loading) {
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
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const handleRoleChange = (index: number, role: string) => {
    setRoles((prevRoles) => ({
      ...prevRoles,
      [index]: role,
    }));

    setSelectedMembers((prevMembers) => {
      const updatedMembers: SelectedMembers = { ...prevMembers };

      Object.keys(updatedMembers).forEach((key) => {
        updatedMembers[key as keyof SelectedMembers] = updatedMembers[
          key as keyof SelectedMembers
        ].filter((member) => member !== members[index]);
      });

      if (role !== "None") {
        updatedMembers[role as keyof SelectedMembers] = [
          ...(updatedMembers[role as keyof SelectedMembers] || []),
          members[index],
        ];
      }

      if (members[index] === user?.email && role === "None") {
        updatedMembers["Manegement"] = [
          ...(updatedMembers["Manegement"] || []),
          members[index],
        ];
      }

      return updatedMembers;
    });
  };


  const handleComplete = async () => {
    try {
      const rolesAreSelected = Object.values(roles).every(
        (role) => role !== "None"
      );

      if (!rolesAreSelected) {
        setErrorSliderVisible(true);

        setTimeout(() => {
          setErrorSliderVisible(false);
        }, 5000);

        return;
      }

      const updatedMembersArray = Object.entries(roles).map(
        ([index, role]) => ({
          member: members[index],
          role: role === "Trainers" ? 2 : role === "Manegement" ? 1 : 3,
        })
      );

      console.log(updatedMembersArray);

      const { data: updatedTeamData } = await updateUserRoles({
        variables: {
          teamEmail,
          updatedMembers: updatedMembersArray,
        },
      });
      setIsCompleted(true);

      console.log(updatedTeamData);
    } catch (error) {
      // Handle errors
    }
  };

  return (
    <Box sx={{ margin: "0 auto", marginTop: 10, paddingBottom: "4em" }}>
      {isCompleted ? (
        <Box
          sx={{
            backgroundColor: "white",
            width: "64%",
            marginLeft: "auto",
            marginRight: "auto",
            padding: "5%",
            marginTop: "6em",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Card
            sx={{
              marginTop: "2em",
              width: "100%",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
              paddingBottom: "2em",
            }}
          >
            <CardContent>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  sx={{ fontWeight: "bold", fontSize: "2vw" }}
                  variant="h6"
                  gutterBottom
                >
                  Přehled práv
                </Typography>
              </Box>
              <Box sx={{}}>
                <TableContainer
                  component={Paper}
                  sx={{
                    border: "1px solid rgba(224, 224, 224, 1)",
                    borderRadius: "10px",
                    width: "90%",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Typography sx={{ fontWeight: "bold" }}>
                            Trainers
                          </Typography>
                          <TableDivider />
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontWeight: "bold" }}>
                            Manegement
                          </Typography>
                          <TableDivider />
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontWeight: "bold" }}>
                            Players
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell
                          sx={{
                            borderRight: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          {selectedMembers.Trainers.map((member, index) => (
                            <Typography key={index}>{member}</Typography>
                          ))}
                        </TableCell>
                        <TableCell
                          sx={{
                            borderRight: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          {selectedMembers.Manegement.map((member, index) => (
                            <Typography key={index}>{member}</Typography>
                          ))}
                        </TableCell>
                        <TableCell>
                          {selectedMembers.Players.map((member, index) => (
                            <Typography key={index}>{member}</Typography>
                          ))}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </CardContent>
          </Card>
          <Box
            sx={{ marginTop: "2em", display: "flex", justifyContent: "center" }}
          >
            <Button
              sx={{
                backgroundColor: "rgb(255, 224, 254)",
                padding: "1em",
                border: "1px solid rgb(255, 150, 252)",
                marginRight: "2em",
                marginLeft: "auto",
                width: "14em",
              }}
              onClick={() => setIsCompleted(false)}
            >
              <Typography sx={{ fontWeight: "bold", color: "black" }}>
                Zpět na úpravy
              </Typography>
            </Button>

            <Button
              sx={{
                backgroundColor: "rgb(255, 224, 254)",
                padding: "1em",
                border: "1px solid rgb(255, 150, 252)",
                marginLeft: "2em", // Adjust the margin as needed
                marginRight: "auto",
                width: "14em",
              }}
              onClick={onCompleteStep}
            >
              <Typography sx={{ fontWeight: "bold", color: "black" }}>
                Dokončit
              </Typography>
            </Button>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            backgroundColor: "white",
            width: "64%",
            marginLeft: "auto",
            marginRight: "auto",
            padding: "5%",
            marginTop: "6em",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box sx={{ width: "90%", marginLeft: "auto", marginRight: "auto" }}>
            <Box>
              <Typography
                sx={{ textAlign: "center" }}
                variant="h4"
                gutterBottom
              >
                Nastavte práva uživatelů
              </Typography>
              <Box sx={{ marginBottom: "2em" }}></Box>

              {members.map((member: string, index: number) => (
                <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  padding: "30px",
                  borderRadius: "10px",
                  marginBottom: "2em",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)",
                  // Correct the spelling of "lightgray"
                  backgroundColor: member === user?.email ? "lightgray" : "transparent",
                }}
              >
                  <Typography sx={{ marginRight: "1em", marginLeft: "2em" }}>
                    {member}
                  </Typography>
                  <Select
                    value={roles[index] || "None"}
                    onChange={(e) => handleRoleChange(index, e.target.value)}
                    sx={{
                      marginLeft: "auto",
                      marginRight: "2em",
                      width: "10em",
                    }}
                  >
                    <MenuItem value="None">Nevybráno</MenuItem>
                    <MenuItem value="Trainers">Trenér</MenuItem>
                    <MenuItem value="Manegement">Manegement</MenuItem>
                    <MenuItem value="Players">Hráč</MenuItem>
                  </Select>
                </Box>
              ))}
            </Box>

            {errorSliderVisible && (
              <Slide
                direction="down"
                in={errorSliderVisible}
                mountOnEnter
                unmountOnExit
              >
                <Alert severity="error" sx={{ marginTop: "2em" }}>
                  Vyberte prosím roli pro všechny členy týmu.
                </Alert>
              </Slide>
            )}

            <Card
              sx={{
                marginTop: "2em",
                width: "100%",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
              }}
            >
              <CardContent>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    sx={{ fontWeight: "bold", fontSize: "2vw" }}
                    variant="h6"
                    gutterBottom
                  >
                    Přehled práv
                  </Typography>
                </Box>
                <Box sx={{}}>
                  <TableContainer
                    component={Paper}
                    sx={{
                      border: "1px solid rgba(224, 224, 224, 1)",
                      borderRadius: "10px",
                    }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <Typography sx={{ fontWeight: "bold" }}>
                              Trainers
                            </Typography>
                            <TableDivider />
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ fontWeight: "bold" }}>
                              Manegement
                            </Typography>
                            <TableDivider />
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ fontWeight: "bold" }}>
                              Players
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell
                            sx={{
                              borderRight: "1px solid rgba(224, 224, 224, 1)",
                            }}
                          >
                            {selectedMembers.Trainers.map((member, index) => (
                              <Typography key={index}>{member}</Typography>
                            ))}
                          </TableCell>
                          <TableCell
                            sx={{
                              borderRight: "1px solid rgba(224, 224, 224, 1)",
                            }}
                          >
                            {selectedMembers.Manegement.map((member, index) => (
                              <Typography key={index}>{member}</Typography>
                            ))}
                          </TableCell>
                          <TableCell>
                            {selectedMembers.Players.map((member, index) => (
                              <Typography key={index}>{member}</Typography>
                            ))}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </CardContent>
            </Card>
            <Button
              variant="contained"
              color="primary"
              onClick={handleComplete}
              sx={{ marginTop: "2em" }}
            >
              Dokončit
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Step2;
