/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { gql, useMutation, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  Avatar,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  InputAdornment,
  Alert,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const GET_TRAINING_BY_MATCH_ID = gql`
  query GetTrainingByMatchId($matchId: String!) {
    getTrainingByMatchId(matchId: $matchId) {
      matchId
      teamId
      opponentName
      selectedHallId
      subteamIdSelected
      endTime
      description
      date
      time
      selectedMembers
      selectedPlayers
      selectedManagement
      attendance {
        player
        hisAttendance
        reason
      }
    }
  }
`;

const GET_TEAM_HALLS = gql`
  query GetTreningHallsByTeamId($teamId: String!) {
    getTreningHallsByTeamId(teamId: $teamId) {
      name
      location
      treningHallId
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

const UPDATE_TRAINING = gql`
  mutation UpdateTraining($input: UpdateTrainingInput!) {
    updateTraining(input: $input)
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

interface Training {
  matchId: string;
  teamId: string;
  opponentName: string;
  selectedHallId: string;
  subteamIdSelected: string;
  endTime: string;
  selectedPlayers: string[];
  selectedManagement: string[];
  date: string;
  time: string;
  description: string;
  selectedMembers: string[];
  attendance?: {
    player: string;
    hisAttendance: number;
    reason?: string;
  }[];
}

interface Hall {
  name: string;
  location: string;
  treningHallId: string;
}

type Props = {
  matchId: string;
  onClose: () => void;
};

const Edit: React.FC<Props> = ({ matchId, onClose }) => {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectedTrainingHallId, setSelectedTrainingHallId] = useState<
    string | null
  >(null);
  const [time, setTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [opponentName, setOpponentName] = useState<string>("");
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [date, setDate] = useState<string>(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
    const currentDay = String(currentDate.getDate()).padStart(2, "0");
    return `${currentYear}-${currentMonth}-${currentDay}`;
  });
  const [updateTraining] = useMutation(UPDATE_TRAINING);

  const { loading, error, data } = useQuery(GET_TRAINING_BY_MATCH_ID, {
    variables: { matchId },
  });

  const {
    loading: subteamLoading,
    error: subteamError,
    data: subteamData,
  } = useQuery(GET_COMPLETESUBTEAM_DETAILS, {
    variables: {
      subteamId: data?.getTrainingByMatchId?.subteamIdSelected || "",
    },
  });

  const {
    loading: hallLoading,
    error: hallError,
    data: hallsData,
  } = useQuery(GET_TEAM_HALLS, {
    variables: { teamId: data?.getTrainingByMatchId?.teamId || "" },
  });

  useEffect(() => {
    if (!loading && !error && data) {
      const training = data.getTrainingByMatchId;
      setOpponentName(training.opponentName); // Naplnění jména soupeře
      setDescription(training.description || ""); // Naplnění popisu
      setTime(training.time || ""); // Naplněnsí času
      setEndTime(training.endTime || ""); // Naplnění konce
      setDate(training.date || ""); // Naplnění data
      setSelectedMembers(training.selectedMembers || []); // Naplnění vybraných členů týmu
      setSelectedTrainingHallId(training.selectedHallId || null); // Naplnění vybrané haly
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

  const trainingData: Training = data.getTrainingByMatchId;
  const subteamIdSelected = trainingData.subteamIdSelected;
  const teamId = trainingData.teamId;

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

  const handleCheckboxChange = (email: string) => {
    if (selectedMembers.includes(email)) {
      setSelectedMembers((prevSelected) =>
        prevSelected.filter((selectedEmail) => selectedEmail !== email)
      );
    } else {
      setSelectedMembers((prevSelected) => [...prevSelected, email]);
    }
  };

  const handleHallCheckboxChange = (treningHallId: string) => {
    setSelectedTrainingHallId(treningHallId);
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTime(event.target.value);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(event.target.value);
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;

    // Check if the selected date is in the current or next year
    if (
      selectedDate.getFullYear() === currentYear ||
      selectedDate.getFullYear() === nextYear
    ) {
      setDate(event.target.value);
    } else {
      // Display an error message or handle it as needed
      setErrorMessages((prevMessages) => [
        ...prevMessages,
        "Zadejte platné datum v aktuálním nebo příštím roce.",
      ]);
    }
  };

  const handleOpponentNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOpponentName(event.target.value);
  };

  const hasPosition4Member = selectedMembers.some((email) =>
    subteamData?.getCompleteSubteamDetail?.subteamMembers.some(
      (member: SubteamMember) =>
        member.email === email && member.position === "4"
    )
  );

  const handleSave = async () => {
    setErrorMessages([]);

    if (!trainingData.subteamIdSelected) {
      setErrorMessages((prevMessages) => [...prevMessages, "Vyberte tým."]);
    }

    if (opponentName.length < 2 || !/^[A-Z]/.test(opponentName)) {
      setErrorMessages((prevMessages) => [
        ...prevMessages,
        "Zadejte platné jméno soupeře (alespoň 2 znaky, začínající velkým písmenem).",
      ]);
    }

    if (!selectedTrainingHallId) {
      setErrorMessages((prevMessages) => [...prevMessages, "Vyberte halu."]);
    }

    if (description.length < 20 || description.length > 250) {
      setErrorMessages((prevMessages) => [
        ...prevMessages,
        "Zadejte popis o délce minimálně 20 znaků a maximálně 250 znaků.",
      ]);
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

    const selectedPlayers = selectedMembers.filter((email) =>
      subteamData?.getCompleteSubteamDetail?.subteamMembers.some(
        (member: SubteamMember) =>
          member.email === email && member.position === "4"
      )
    );
    const selectedManagement = selectedMembers.filter(
      (email) => !selectedPlayers.includes(email)
    );

    try {
      await updateTraining({
        variables: {
          input: {
            matchId,
            opponentName,
            selectedHallId: selectedTrainingHallId,
            subteamIdSelected,
            endTime,
            description,
            date,
            time,
            teamId,
            selectedMembers,
            selectedPlayers,
            selectedManagement,
          },
        },
      });

      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error while updating training:", error);
    }
  };
  return (
    <Box sx={{ maxHeight: "100vh", overflowY: "auto" }}>
      <Box sx={{ textAlign: "center" }}>
        <Typography
          sx={{ fontFamily: "Roboto", fontWeight: "500" }}
          variant="h5"
        >
          Upravit trénink
        </Typography>
      </Box>
      <Box sx={{ width: "80%", marginLeft: "auto", marginRight: "auto" }}>
        <Box>
          <Typography variant="body2">Tým</Typography>

          <Select
            value={trainingData.subteamIdSelected || ""}
            sx={{ width: "50%", marginTop: "1em" }}
          >
            <MenuItem value="" disabled>
              Prosím, zvolte tým
            </MenuItem>
            <MenuItem value={trainingData.subteamIdSelected}>
              {subteamData?.getCompleteSubteamDetail?.Name || "Tým nenalezen"}
            </MenuItem>
          </Select>
        </Box>
        <Box>
          <TextField
            label="Napis"
            sx={{ width: "50%", marginTop: "1em" }}
            value={opponentName}
            onChange={handleOpponentNameChange}
          />
        </Box>
        <Box>
          <TextField
            label="Datum"
            type="date"
            sx={{ width: "50%", marginTop: "1em" }}
            value={date}
            onChange={handleDateChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
        <Box>
          <TextField
            label="Začátek"
            type="time"
            sx={{ width: "50%", marginTop: "1em" }}
            value={time}
            onChange={handleTimeChange}
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
        <Box>
          <TextField
            label="Popis"
            sx={{ width: "50%", marginTop: "1em" }}
            value={description}
            onChange={handleDescriptionChange}
            InputLabelProps={{
              shrink: true,
            }}
            multiline
            rows={4}
            helperText={`Minimálně 20 znaků, maximálně 250 znaků (${description.length}/250)`}
          />
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
                      <TableCell>{getPositionText(member.position)}</TableCell>
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
                      <TableCell>{getPositionText(member.position)}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box>
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
                  {hallsData?.getTreningHallsByTeamId.map((hall: Hall) => (
                    <TableRow key={hall.treningHallId}>
                      <TableCell></TableCell>
                      <TableCell>{hall.name}</TableCell>
                      <TableCell>{hall.location}</TableCell>
                      <TableCell>
                        <Checkbox
                          onChange={() =>
                            handleHallCheckboxChange(hall.treningHallId)
                          }
                          checked={
                            selectedTrainingHallId === hall.treningHallId
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
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

        {/* Other fields to be filled similarly */}
        <Button onClick={handleSave}> Upravit trénink</Button>
        <Button onClick={onClose}>Zrušit</Button>
      </Box>
    </Box>
  );
};

export default Edit;
