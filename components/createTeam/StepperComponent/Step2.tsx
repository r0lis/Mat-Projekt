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
} from "@mui/material";
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
const TableDivider = () => (
  <Box
    sx={{
      borderRight: "1px solid rgba(224, 224, 224, 1)",
      height: "100%",
      margin: "0",
    }}
  />
);

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
  const [errorSliderVisible, setErrorSliderVisible] = useState(false);

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

      // Kontrola, zda je role různé od "None"
      if (role !== "None") {
        updatedMembers[role as keyof SelectedMembers] = [
          ...(updatedMembers[role as keyof SelectedMembers] || []), // Přidávání pouze tehdy, pokud pole není undefined
          members[index],
        ];
      }

      return updatedMembers;
    });
  };

  const handleComplete = () => {
    const areAllMembersSelected = Object.values(roles).every(
      (role) => role !== "None"
    );

    if (!areAllMembersSelected) {
      // Zobrazit slider s chybovou hláškou
      setErrorSliderVisible(true);

      // Skrýt slider po několika vteřinách
      setTimeout(() => {
        setErrorSliderVisible(false);
      }, 5000);
    } else {
      setIsCompleted(true);
    }
  };

  React.useEffect(() => {
    setRoles((prevRoles) => {
      const initializedRoles: { [key: number]: string } = {};
      members.forEach((_: any, index: number) => {
        initializedRoles[index] = "None";
      });
      return initializedRoles;
    });
  }, [members]);

  return (
    <Box sx={{ margin: "0 auto", marginTop: 10, paddingBottom: "4em" }}>
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
            <Typography sx={{ textAlign: "center" }} variant="h4" gutterBottom>
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
                }}
              >
                <Typography sx={{ marginRight: "1em", marginLeft: "2em" }}>
                  {member}
                </Typography>
                <Select
                  value={roles[index] || "None"}
                  onChange={(e) => handleRoleChange(index, e.target.value)}
                  sx={{ marginLeft: "auto", marginRight: "2em", width: "10em" }}
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

          <Card sx={{ marginTop: "2em", width: "100%", boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)" }}>
            <CardContent>
              <Box sx={{ textAlign: "center" }}>
                <Typography sx={{ fontWeight: "bold", fontSize: "2vw" }} variant="h6" gutterBottom>
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
                          <Typography sx={{ fontWeight: "bold" }}>Trainers</Typography>
                          <TableDivider />
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontWeight: "bold" }}>Manegement</Typography>
                          <TableDivider />
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontWeight: "bold" }}>Players</Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ borderRight: "1px solid rgba(224, 224, 224, 1)" }}>
                          {selectedMembers.Trainers.map((member, index) => (
                            <Typography key={index}>{member}</Typography>
                          ))}
                        </TableCell>
                        <TableCell sx={{ borderRight: "1px solid rgba(224, 224, 224, 1)" }}>
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
            sx={{ marginTop: "2em", }}
          >
            Dokončit
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Step2;
