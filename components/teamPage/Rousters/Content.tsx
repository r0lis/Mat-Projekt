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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import NoTeam from "@/components/teamPage/Team/Component/Noteam";
import ContentRouster from "./ContentRouster";
import Formations from "./Formations";

const GET_SUBTEAMS = gql`
  query GetYourSubteamData($teamId: String!, $email: String!) {
    getYourSubteamData(teamId: $teamId, email: $email) {
      Name
      subteamId
      teamId
    }
  }
`;

const GET_USER_ROLE_IN_TEAM = gql`
  query GetUserRoleInTeam($teamId: String!, $email: String!) {
    getUserRoleInTeam(teamId: $teamId, email: $email) {
      email
      role
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

const Content: React.FC<TeamsProps> = ({ teamId }) => {
  const user = authUtils.getCurrentUser();
  const {
    loading,
    error: subteamError,
    data,
  } = useQuery(GET_SUBTEAMS, {
    variables: { teamId: teamId, email: user?.email || "" },
    skip: !user,
  });

  const {
    loading: roleLoading,
    error: roleError,
    data: roleData,
  } = useQuery(GET_USER_ROLE_IN_TEAM, {
    variables: { teamId: teamId, email: user?.email || "" },
    skip: !user,
  });

  const [isSelectVisible, setIsSelectVisible] = useState(false);
  const [selectedSubteam, setSelectedSubteam] = useState<string | null>(null);
  const [showFormations, setShowFormations] = useState(false);
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

  if (loading || roleLoading)
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
  if (subteamError || roleError) return <Typography>Chyba</Typography>;

  const toggleShowFormations = () => {
    setShowFormations(!showFormations);
  };

  const role = roleData?.getUserRoleInTeam.role || "";

  return (
    <Box sx={{ marginLeft: "", marginRight: "2%" }}>
      {subteams.length === 1 ? (
        <Box ml={2}>
          {subteams.map((subteam: Subteam) => (
            <Box key={subteam.subteamId}>
              <Box sx={{ display: "flex" }}>
              <Typography sx={{ fontWeight: "600" }} variant="h5">
                Přehled soupisek
              </Typography>
              {role === "2" && (
              <Button 
                sx={{ marginLeft: "auto", backgroundColor: "#027ef2", marginRight:"5%" }}
                onClick={toggleShowFormations}
                variant="contained"
              >
                {showFormations ? "Soupisky" : "Formace"}
              </Button>
              )}
              </Box>

              {showFormations ? (
                      <Formations subteamId={subteam.subteamId} />
                    ) : (
                      <ContentRouster
                        subteamId={subteam.subteamId}
                        idTeam={teamId}
                      />
                    )}
            </Box>
          ))}
        </Box>
      ) : subteams.length === 0 ? (
        <NoTeam />
      ) : (
        <>
          <Box sx={{ display: "flex" }}>
            <Box>
              <Typography sx={{ fontWeight: "600" }} variant="h5">
                Přehled soupisek
              </Typography>{" "}
            </Box>
            <Box sx={{ marginLeft: "auto" }}>
              {role === "2" && (
              <Button
                sx={{ marginRight: "2em", backgroundColor: "#027ef2" }}
                onClick={toggleShowFormations}
                variant="contained"
              >
                {showFormations ? "Soupisky" : "Formace"}
              </Button>
              )}
              <Button
                sx={{ marginRight: "2em", backgroundColor: "#027ef2" }}
                onClick={handleToggleSelect}
                variant="contained"
              >
                Týmy ({subteams.length || ""}){" "}
                {isSelectVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </Button>
            </Box>
          </Box>
          <Box>
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
                    {showFormations ? (
                      <Formations subteamId={subteam.subteamId} />
                    ) : (
                      <ContentRouster
                        subteamId={subteam.subteamId}
                        idTeam={teamId}
                      />
                    )}
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
