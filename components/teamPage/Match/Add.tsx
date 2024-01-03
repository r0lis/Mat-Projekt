/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { gql, useQuery } from "@apollo/client";
import { authUtils } from "@/firebase/auth.utils";

const GET_SUBTEAMS = gql`
  query GetYourSubteamData($teamId: String! $email: String!) {
    getYourSubteamData(teamId: $teamId email: $email) {
      Name
      subteamId
      teamId
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

const AddMatch: React.FC<Props> = ({ teamId, closeAddMatch }) => {
  const user = authUtils.getCurrentUser();

  const [subteamIdSelected, setSubteamIdSelected] = useState<string | null>(
    null
  );

  const {
    loading,
    error: subteamError,
    data,
  } = useQuery(GET_SUBTEAMS, {
    variables: { teamId: teamId,  email: user?.email || "" },
    skip: !user,
  });

  const handleSubteamChange = (event: SelectChangeEvent<string | null>) => {
    setSubteamIdSelected(event.target.value);
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
        <Typography>Přidat zápas</Typography>
        <Box sx={{ width: "80%", marginLeft: "auto", marginRight: "auto" }}>
          <Select
            value={subteamIdSelected}
            sx={{ width: "50%", marginTop: "1em" }}
            onChange={handleSubteamChange}
          >
            {data.getYourSubteamData.map((subteam: Subteam) => (
              <MenuItem key={subteam.subteamId} value={subteam.subteamId}>
                {subteam.Name}
              </MenuItem>
            ))}
          </Select>
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
