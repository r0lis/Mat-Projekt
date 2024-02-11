/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { gql, useQuery } from "@apollo/client";
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
import React, { useState } from "react";

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


interface Training {
  matchId: string;
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

  const { loading, error, data } = useQuery(GET_TRAINING_BY_MATCH_ID, {
    variables: { matchId },
  });

  const { loading: subteamLoading, error: subteamError, data: subteamData } =
    useQuery(GET_COMPLETESUBTEAM_DETAILS, {
      variables: { subteamId: data?.getTrainingByMatchId?.subteamIdSelected || "" },
    });
  const {loading: hallLoading, error: hallError, data: hallsData } = useQuery(GET_TEAM_HALLS, {
    variables: { teamId: data?.getTrainingByMatchId?.teamId || "" },
  });

  const [formData, setFormData] = useState<Partial<Training>>({});

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

  const handleFormChange = (field: keyof Training, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value.toString(), // Převést hodnotu na řetězec
    }));
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


  const handleSave = async () => {};

  return (
    <Box sx={{ maxHeight: "100vh", overflowY: "auto" }}>
      <Box sx={{ textAlign: "center" }}>
        <Typography
          sx={{ fontFamily: "Roboto", fontWeight: "500" }}
          variant="h5"
        >
          Upravit trenink
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
            label="Opponent Name"
            sx={{ width: "50%", marginTop: "1em" }}
            value={formData.opponentName || trainingData.opponentName}
            onChange={(e) => handleFormChange("opponentName", e.target.value)}
          />
        </Box>
        <Box>
          <TextField
            label="Date"
            type="date"
            sx={{ width: "50%", marginTop: "1em" }}
            value={formData.date || trainingData.date}
            onChange={(e) => handleFormChange("date", e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
        <Box>
          <TextField
            label="Time"
            type="time"
            sx={{ width: "50%", marginTop: "1em" }}
            value={formData.time || trainingData.time}
            onChange={(e) => handleFormChange("time", e.target.value)}
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
            label="End Time"
            type="time"
            value={formData.endTime || trainingData.endTime}
            sx={{ width: "50%", marginTop: "1em" }}
            onChange={(e) => handleFormChange("endTime", e.target.value)}
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
            label="Description"
            sx={{ width: "50%", marginTop: "1em" }}

            value={formData.description || trainingData.description}
            onChange={(e) => handleFormChange("description", e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            multiline
            rows={4}
            helperText={`Minimálně 20 znaků, maximálně 250 znaků (${trainingData.description.length}/250)`}
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

        {/* Other fields to be filled similarly */}
        <Button onClick={handleSave}>Save</Button>
        <Button onClick={onClose}>Close</Button>
      </Box>
    </Box>
  );
};

export default Edit;
