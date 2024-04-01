/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {  gql, useMutation, useQuery } from "@apollo/client";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  InputAdornment,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const GET_MATCH_BY_MATCH_ID = gql`
  query GetMatchByMatchId($matchId: String!) {
    getMatchByMatchId(matchId: $matchId) {
      matchId
      teamId
      opponentName
      selectedHallId
      subteamIdSelected
      selectedHallPosition
      date
      endTime
      time
      selectedMembers
      selectedPlayers
      selectedManagement
      matchType
      attendance {
        player
        hisAttendance
        reason
      }
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

const UPDATE_MATCH = gql`
  mutation UpdateMatch($input: UpdateMatchInput!) {
    updateMatch(input: $input)
  }
`;

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

interface SubteamMember {
  name: string;
  surname: string;
  email: string;
  picture: string;
  role: string;
  position: string;
}

interface Match {
  matchId: string;
  opponentName: string;
  selectedHallId: string;
  subteamIdSelected: string;
  selectedPlayers: string[];
  selectedManagement: string[];
  teamId: string;
  date: string;
  time: string;
  selectedMembers: string[];
  endTime: string;
  selectedHallPosition: string;
  matchType: string;
  attendance?: {
    player: string;
    hisAttendance: number;
    reason?: string;
  }[];
}

interface Hall {
  name: string;
  location: string;
  hallId: string;
}
type Props = {
  matchId: string;
  onClose: () => void;
};

const Edit: React.FC<Props> = ({ matchId, onClose }) => {
  const [selectedHallId, setSelectedHallId] = useState<string | null>(null);
  const [selectedHallLocation, setSelectedHallLocation] = useState<string>("");
  const [opponentName, setOpponentName] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [matchType, setMatchType] = useState<string>("home");
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [date, setDate] = useState<string>(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
    const currentDay = String(currentDate.getDate()).padStart(2, "0");
    return `${currentYear}-${currentMonth}-${currentDay}`;
  });
  const [updateMatch] = useMutation(UPDATE_MATCH);

  const { loading, error, data } = useQuery(GET_MATCH_BY_MATCH_ID, {
    variables: { matchId },
  });

  const {
    loading: subteamLoading,
    error: subteamError,
    data: subteamData,
  } = useQuery(GET_COMPLETESUBTEAM_DETAILS, {
    variables: { subteamId: data?.getMatchByMatchId?.subteamIdSelected || "" },
  });

  const {
    loading: hallLoading,
    error: hallError,
    data: hallsData,
  } = useQuery(GET_TEAM_HALLS, {
    variables: { teamId: data?.getMatchByMatchId?.teamId || "" },
  });

  useEffect(() => {
    if (!loading && !error && data) {
      const match = data.getMatchByMatchId;
      setOpponentName(match.opponentName);
      setTime(match.time || "");
      setEndTime(match.endTime || "");
      setDate(match.date || "");
      setSelectedMembers(match.selectedMembers || []);
      setSelectedHallId(match.selectedHallId || null);
      setMatchType(match.matchType);
      setSelectedHallLocation(hallsData.getHallsByTeamId.location || "");
    }
  }, [loading, error, data]);

  if (loading || subteamLoading || hallLoading)
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
  if (subteamError || subteamError || hallError)
    return <Typography>Chyba</Typography>;

  const matchData: Match = data.getMatchByMatchId;
  const subteamIdSelected = matchData.subteamIdSelected;
  const teamId = matchData.teamId;
  console.log(teamId);

  const handleOpponentNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOpponentName(event.target.value);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(event.target.value);
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;

    if (
      selectedDate.getFullYear() === currentYear ||
      selectedDate.getFullYear() === nextYear
    ) {
      setDate(event.target.value);
    } else {
      setErrorMessages((prevMessages) => [
        ...prevMessages,
        "Zadejte platné datum v aktuálním nebo příštím roce.",
      ]);
    }
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTime(event.target.value);
  };

  const handleMatchTypeChange = (type: string) => {
    setMatchType(type);
    setSelectedHallId(null);
  };

  const handleHallCheckboxChange = (hallId: string) => {
    setSelectedHallId(hallId);
  };

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
    const playersPosition4 =
      subteamData?.getCompleteSubteamDetail?.subteamMembers
        .filter((member: SubteamMember) => member.position === "4")
        .map((player: SubteamMember) => player.email) || [];

    setSelectedMembers((prevSelected) => {
      const newSelected = Array.from(
        new Set([...prevSelected, ...playersPosition4])
      );
      return newSelected;
    });
  };

  const hasPosition4Member = selectedMembers.some((email) =>
    subteamData?.getCompleteSubteamDetail?.subteamMembers.some(
      (member: SubteamMember) =>
        member.email === email && member.position === "4"
    )
  );

  const handleSaveMatch = async () => {
    setErrorMessages([]);
    if (!subteamIdSelected) {
      setErrorMessages((prevMessages) => [...prevMessages, "Vyberte tým."]);
    }

    if (opponentName.length < 2 || !/^[A-Z]/.test(opponentName)) {
      setErrorMessages((prevMessages) => [
        ...prevMessages,
        "Zadejte platné jméno soupeře (alespoň 2 znaky, začínající velkým písmenem).",
      ]);
    }

    if (!selectedHallId && matchType !== "away") {
      setErrorMessages((prevMessages) => [...prevMessages, "Vyberte halu."]);
    }

    if (!date || !time || !endTime) {
      setErrorMessages((prevMessages) => [
        ...prevMessages,
        "Zadejte platné datum a čas.",
      ]);
    }

    if (selectedMembers.length === 0) {
      setErrorMessages((prevMessages) => [
        ...prevMessages,
        "Vyberte alespoň jednoho člena týmu.",
      ]);
    }

    if (!matchType) {
      setErrorMessages((prevMessages) => [
        ...prevMessages,
        "Vyberte typ zápasu.",
      ]);
    }

    if (!hasPosition4Member) {
      setErrorMessages((prevMessages) => [
        ...prevMessages,
        "Vyberte alespoň jednoho člena týmu s pozicí hráč.",
      ]);
      return;
    }

    if (errorMessages.length > 0) {
      return;
    }

    const players = selectedMembers.filter((email) =>
      subteamData?.getCompleteSubteamDetail?.subteamMembers.some(
        (member: SubteamMember) =>
          member.email === email && member.position === "4"
      )
    );
    const management = selectedMembers.filter(
      (email) => !players.includes(email)
    );

    try {
      await updateMatch({
        variables: {
          input: {
            matchId,
            opponentName,
            selectedHallId: selectedHallId,
            subteamIdSelected,
            selectedPlayers: players,
            selectedManagement: management,
            selectedMembers,
            teamId,
            date,
            time,
            endTime,
            matchType,
          },
        },
      });
      onClose();
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

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
            <Typography variant="body2">Zvolte tým</Typography>
            <Select
              value={matchData.subteamIdSelected || ""}
              sx={{ width: "50%", marginTop: "1em" }}
            >
              <MenuItem value="" disabled>
                Prosím, zvolte tým
              </MenuItem>

              <MenuItem value={matchData.subteamIdSelected}>
                {subteamData?.getCompleteSubteamDetail?.Name || "Tým nenalezen"}
              </MenuItem>
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
              label="Začátek"
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
          <Box>
            <TextField
              label="Konec"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
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
          <Box sx={{ marginTop: "0.5em" }}>
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
          <Box sx={{ marginTop: "0.5em" }}>
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
                  {subteamData?.getCompleteSubteamDetail?.subteamMembers.map(
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
                  {subteamData?.getCompleteSubteamDetail?.subteamMembers
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
                      {hallsData?.getHallsByTeamId.map((hall: Hall) => (
                        <TableRow key={hall.hallId}>
                          <TableCell></TableCell>
                          <TableCell>{hall.name}</TableCell>
                          <TableCell>{hall.location}</TableCell>
                          <TableCell>
                            <Checkbox
                              onChange={() =>
                                handleHallCheckboxChange(hall.hallId)
                              }
                              checked={selectedHallId === hall.hallId}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            ) : (
              <Box>
                <Typography variant="h6">Hala hostí</Typography>
                {/* Přidání textových polí pro název a polohu haly */}
                <Box>
                  <TextField
                    label="Název haly"
                    type="text"
                    value={selectedHallId || ""}
                    onChange={(e) => setSelectedHallId(e.target.value)}
                    sx={{ width: "50%", marginTop: "1em" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Box>
                <Box>
                  <TextField
                    label="Poloha haly"
                    type="text"
                    value={selectedHallLocation || ""}
                    onChange={(e) => setSelectedHallLocation(e.target.value)}
                    sx={{ width: "50%", marginTop: "1em" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Box>
              </Box>
            )}
          </Box>
          {errorMessages.length > 0 && (
            <Box sx={{ marginBottom: "1em" }}>
              {errorMessages.map((message, index) => (
                <Alert
                  sx={{ marginBottom: "0.5em" }}
                  key={index}
                  severity="error"
                >
                  {message}
                </Alert>
              ))}
            </Box>
          )}
          <Box sx={{ marginTop: "1em" }}>
            <Box sx={{ marginBottom: "0.5em" }}>
              <Button variant="contained" onClick={handleSaveMatch}>
                Upravit zápas
              </Button>
            </Box>
            <Box sx={{ marginBottom: "1em" }}>
              <Button onClick={onClose}>Zrušit</Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Edit;

