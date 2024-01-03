/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
  TextField,
  InputAdornment,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Avatar,
} from "@mui/material";
import { gql, useQuery } from "@apollo/client";
import { authUtils } from "@/firebase/auth.utils";

const GET_SUBTEAMS = gql`
  query GetYourSubteamData($teamId: String!, $email: String!) {
    getYourSubteamData(teamId: $teamId, email: $email) {
      Name
      subteamId
      teamId
    }
  }
`;

const GET_COMPLETESUBTEAM_DETAILS = gql`
  query GetCompleteSubteamDetail($subteamId: String!) {
    getCompleteSubteamDetail(subteamId: $subteamId) {
      Name
      subteamId
      teamId
      subteamMembers {
        name
        surname
        picture
        email
        role
        position
      }
    }
  }
`;

const GET_TEAM_HALLS = gql`
  query GetTeamHalls($teamId: String!) {
    getHallsByTeamId(teamId: $teamId) {
      name
      location
      hallId
    }
  }
`;

type Props = {
  teamId: string;
  closeAddMatch: () => void;
};

interface Subteam {
  subteamId: string;
  Name: string;
}

interface SubteamMember {
  name: string;
  surname: string;
  email: string;
  picture: string;
  role: string;
  position: string;
}

interface Hall {
  name: string;
  location: string;
  hallId: string;
}

const getPositionText = (position: string): string => {
  switch (position) {
    case "0":
      return "Není zvolena pozice";
    case "1":
      return "Správce";
    case "2":
      return "Hlavní trenér";
    case "3":
      return "Asistent trenéra";
    case "4":
      return "Hráč";
    default:
      return "";
  }
};

const AddMatch: React.FC<Props> = ({ teamId, closeAddMatch }) => {
  const user = authUtils.getCurrentUser();
  const [subteams, setSubteams] = useState<Subteam[]>([]);
  const [subteamIdSelected, setSubteamIdSelected] = useState<string | null>(
    null
  );
  const [opponentName, setOpponentName] = useState<string>("");
  const [selectedHallId, setSelectedHallId] = useState<string | null>(null);
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [matchType, setMatchType] = useState<string>("home"); 
  const [completeData, setCompleteData] = useState<any>(null); // Declare completeData here

  const {
    loading,
    error: subteamError,
    data: subteamData,
  } = useQuery(GET_SUBTEAMS, {
    variables: { teamId: teamId, email: user?.email || "" },
    skip: !user,
  });

  useEffect(() => {
    let initialSelectedMembers: string[] = [];

    if (subteamData?.getYourSubteamData) {
      setSubteams(subteamData.getYourSubteamData);
      if (subteamData.getYourSubteamData.length === 1) {
        setSubteamIdSelected(subteamData.getYourSubteamData[0].subteamId);
      }
    }

    if (completeData?.getCompleteSubteamDetail) {
      // Set initial selectedMembers with members having positions "1", "2", or "3"
      initialSelectedMembers = completeData.getCompleteSubteamDetail.subteamMembers
        .filter((member: SubteamMember) => ["1", "2", "3"].includes(member.position))
        .map((member: SubteamMember) => member.email);
    }

    setSelectedMembers(initialSelectedMembers);
  }, [subteamData, completeData]);

  const handleSubteamChange = (event: SelectChangeEvent<string | null>) => {
    setSubteamIdSelected(event.target.value);
    setSelectedMembers([]);
    // Add the current user's email to selectedMembers
    setSelectedMembers((prevSelected) => [...prevSelected, user?.email || ""]);
  };

  const handleOpponentNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOpponentName(event.target.value);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTime(event.target.value);
  };

  const handleMatchTypeChange = (type: string) => {
    setMatchType(type);
    setSelectedHallId(null); // Reset selected hall when changing match type
  };

  const {
    loading: loadingHalls,
    error: errorHalls,
    data: dataHalls,
  } = useQuery(GET_TEAM_HALLS, {
    variables: { teamId: teamId },
    skip: !user,
  });

  const handleHallCheckboxChange = (hallId: string) => {
    setSelectedHallId(hallId);
  };

  const {
    loading: completeLoading,
    error: completeError,
  } = useQuery(GET_COMPLETESUBTEAM_DETAILS, {
    variables: { subteamId: subteamIdSelected || "" },
    skip: !subteamIdSelected,
    onCompleted: (data) => {
      setCompleteData(data);
      console.log("Complete data:", data);
    },
  });

  const handleCheckboxChange = (email: string) => {
    if (selectedMembers.includes(email)) {
      setSelectedMembers((prevSelected) =>
        prevSelected.filter((selectedEmail) => selectedEmail !== email)
      );
    } else {
      setSelectedMembers((prevSelected) => [...prevSelected, email]);
    }
  };

  const handleSelectAllPlayers = () => {
    const playersPosition4 = completeData?.getCompleteSubteamDetail?.subteamMembers
      .filter((member: SubteamMember) => member.position === "4")
      .map((player: SubteamMember) => player.email) || [];

    setSelectedMembers((prevSelected) => {
      const newSelected = Array.from(new Set([...prevSelected, ...playersPosition4]));
      return newSelected;
    });
  };

  if (loading || completeLoading || loadingHalls)
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
  if (subteamError || completeError || errorHalls)
    return <Typography>Chyba</Typography>;

  return (
    <Box sx={{ maxHeight: "100vh", overflowY: "auto" }}>
      <Box>
        <Box sx={{ textAlign: "center" }}>
          <Typography
            sx={{ fontFamily: "Roboto", fontWeight: "500" }}
            variant="h5"
          >
            Přidat zápas
          </Typography>
        </Box>

        <Box sx={{ width: "80%", marginLeft: "auto", marginRight: "auto" }}>
          <Box>
            <Typography variant="body2">Tým</Typography>
            <Select
              value={subteamIdSelected || ""}
              sx={{ width: "50%", marginTop: "1em" }}
              onChange={handleSubteamChange}
            >
              {subteams.map((subteam: Subteam) => (
                <MenuItem key={subteam.subteamId} value={subteam.subteamId}>
                  {subteam.Name}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box>
            <TextField
              label="Název soupeře"
              type="text"
              value={opponentName}
              onChange={handleOpponentNameChange}
              sx={{ width: "50%", marginTop: "1em" }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
          <Box>
            <TextField
              label="Datum"
              type="date"
              value={date}
              onChange={handleDateChange}
              sx={{ width: "50%", marginTop: "1em" }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
          <Box>
            <TextField
              label="Čas"
              type="time"
              value={time}
              onChange={handleTimeChange}
              sx={{ width: "50%", marginTop: "1em" }}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography variant="body2">Hodina</Typography>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box sx={{marginTop:"0.5em"}}>
            <Typography variant="body2">Typ zápasu</Typography>
            <Button
              variant={matchType === "home" ? "contained" : "outlined"}
              sx={{ margin: "0.5em" }}
              onClick={() => handleMatchTypeChange("home")}
            >
              Domácí
            </Button>
            <Button
              variant={matchType === "away" ? "contained" : "outlined"}
              sx={{ margin: "0.5em" }}
              onClick={() => handleMatchTypeChange("away")}
            >
              Hostující
            </Button>
          </Box>
          <Box sx={{marginTop:"0.5em"}}>
            <Typography variant="h6">Seznam členů týmu</Typography>
            <Button
              variant="outlined"
              onClick={handleSelectAllPlayers}
              sx={{ margin: "0.5em" }}
            >
              Vybrat všechny hráče
            </Button>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Jméno</TableCell>
                    <TableCell>Pozice</TableCell>
                    <TableCell>Přidat</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {completeData?.getCompleteSubteamDetail?.subteamMembers.map(
                    (member: SubteamMember) => (
                      <TableRow key={member.email}>
                        <TableCell>
                          <Avatar src={member.picture} />
                        </TableCell>
                        <TableCell>
                          {member.name} {member.surname}
                        </TableCell>
                        <TableCell>
                          {getPositionText(member.position)}
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            onChange={() => handleCheckboxChange(member.email)}
                            checked={selectedMembers.includes(member.email)}
                          />
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box sx={{ marginTop: "1em" }}>
            <Typography variant="h6">Vybraní členové týmu</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Jméno</TableCell>
                    <TableCell>Pozice</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {completeData?.getCompleteSubteamDetail?.subteamMembers
                    .filter((member: SubteamMember) =>
                      selectedMembers.includes(member.email)
                    )
                    .map((member: SubteamMember) => (
                      <TableRow key={member.email}>
                        <TableCell>
                          <Avatar src={member.picture} />
                        </TableCell>
                        <TableCell>
                          {member.name} {member.surname}
                        </TableCell>
                        <TableCell>
                          {getPositionText(member.position)}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box>
          {matchType !== "away" ? (
            <Box>
            <Typography variant="h6">Dostupné Haly</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Název</TableCell>
                    <TableCell>Lokace</TableCell>
                    <TableCell>Vybrat</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataHalls?.getHallsByTeamId.map((hall: Hall) => (
                    <TableRow key={hall.hallId}>
                      <TableCell></TableCell>
                      <TableCell>{hall.name}</TableCell>
                      <TableCell>{hall.location}</TableCell>
                      <TableCell>
                        <Checkbox
                          onChange={() => handleHallCheckboxChange(hall.hallId)}
                          checked={selectedHallId === hall.hallId}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            </Box>
            ):(
              <Typography variant="h6">Hala hostí</Typography>
            )}
           
          </Box>
        

          <Box sx={{ marginTop: "1em" }}>
            <Button variant="contained" onClick={closeAddMatch}>
              Zavřít
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AddMatch;
