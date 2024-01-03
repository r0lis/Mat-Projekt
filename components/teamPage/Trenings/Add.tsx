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

type Props = {
  teamId: string;
  closeAddTraining: () => void;
};

interface Subteam {
  subteamId: string;
  Name: string;
}

const AddTrening: React.FC<Props> = ({ teamId, closeAddTraining }) => {
  const user = authUtils.getCurrentUser();
  const [subteams, setSubteams] = useState<Subteam[]>([]);
  const [subteamIdSelected, setSubteamIdSelected] = useState<string | null>(
    null
  );
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");

  const {
    loading,
    error: subteamError,
    data,
  } = useQuery(GET_SUBTEAMS, {
    variables: { teamId: teamId, email: user?.email || "" },
    skip: !user,
  });

  useEffect(() => {
    if (data?.getYourSubteamData) {
      setSubteams(data.getYourSubteamData);
      if (data.getYourSubteamData.length === 1) {
        setSubteamIdSelected(data.getYourSubteamData[0].subteamId);
      }
    }
  }, [data]);

  const handleSubteamChange = (event: SelectChangeEvent<string | null>) => {
    setSubteamIdSelected(event.target.value);
  };
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTime(event.target.value);
  };

  if (loading)
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
  if (subteamError) return <Typography>Chyba</Typography>;

  return (
    <Box>
      <Box>
        <Typography>Přidat trénink</Typography>
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
          <Box sx={{ marginTop: "1em" }}>
            <Button variant="contained" onClick={closeAddTraining}>
              Zavřít
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AddTrening;
