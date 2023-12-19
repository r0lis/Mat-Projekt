/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { authUtils } from "@/firebase/auth.utils";
import { gql, useQuery } from "@apollo/client";
import SubteamContent from "@/components/teamPage/Team/SubTeamContent";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import NoTeam from "@/components/teamPage/Team/Component/Noteam";

const GET_SUBTEAMS = gql`
  query GetYourSubteamData($teamId: String!, $email: String!) {
    getYourSubteamData(teamId: $teamId, email: $email) {
      Name
      subteamId
      teamId
    }
  }
`;

type TeamsProps = {
  teamId: string;
};

interface Subteam {
  subteamId: string;
  Name: string;
}

const Content: React.FC<TeamsProps> = (teamId) => {
  const user = authUtils.getCurrentUser();
  const {
    loading,
    error: subteamError,
    data,
  } = useQuery(GET_SUBTEAMS, {
    variables: { teamId: teamId.teamId, email: user?.email || "" },
    skip: !user,
  });
  const [isSelectVisible, setIsSelectVisible] = useState(false);
  const [selectedSubteam, setSelectedSubteam] = useState<string | null>(null);
  const subteams: Subteam[] = data?.getYourSubteamData || [];
  useEffect(() => {
    if (data && data.getYourSubteamData && data.getYourSubteamData.length > 0) {
      setSelectedSubteam(data.getYourSubteamData[0].subteamId);
    }
  }, [data]);

  const handleSubteamChange = (event: { target: { value: any } }) => {
    setSelectedSubteam(event.target.value);
    setIsSelectVisible(false);
  };

  const handleToggleSelect = () => {
    setIsSelectVisible(!isSelectVisible);
  };

  if (loading)
    return (
      <CircularProgress
        color="primary"
        size={50}
        style={{ position: "absolute", top: "50%", left: "50%" }}
      />
    );
  if (subteamError) return <Typography>Chyba</Typography>;

  return (
    <Box sx={{ marginLeft: "2%", marginRight: "2%" }}>
      {subteams.length === 1 ? (
        <Box ml={2}>
          {subteams.map((subteam: Subteam) => (
            <Box key={subteam.subteamId}>
              <Typography variant="h6">Váš tým</Typography>

              <Typography variant="body1">
                <SubteamContent subteamId={subteam.subteamId} />
              </Typography>
            </Box>
          ))}
        </Box>
      ) : subteams.length === 0 ? (
        <NoTeam />
      ) : (
        <>
          <Box sx={{ display: "flex" }}>
            <Box>
              <Typography variant="h6">Váš tým</Typography>
            </Box>
            <Box sx={{ marginLeft: "auto" }}>
              <Button
                sx={{ marginRight: "2em",backgroundColor: "#027ef2" }}
                onClick={handleToggleSelect}
                variant="contained"
              >
                Týmy ({subteams.length || ""}){" "}
                {isSelectVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </Button>
            </Box>
          </Box>
          <Box >
            {isSelectVisible && (
              <Select
                sx={{ width: "100%", height: "4em", marginTop: "1em" }}
                value={selectedSubteam}
                onChange={handleSubteamChange}
              >
                {subteams.map((subteam: Subteam) => (
                  <MenuItem key={subteam.subteamId} value={subteam.subteamId}>
                    <Typography variant="h6">{subteam.Name}</Typography>
                  </MenuItem>
                ))}
              </Select>
            )}
            {subteams.map((subteam: Subteam) => (
              <div key={subteam.subteamId}>
                {selectedSubteam === subteam.subteamId && (
                  <Typography variant="body1">
                    <SubteamContent subteamId={subteam.subteamId} />
                  </Typography>
                )}
              </div>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};
export default Content;
