/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Box, Button, CircularProgress, Typography } from "@mui/material";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import React, { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ContentRouster from "./ContentRouster";
import Formations from "./Formations";

const GET_SUBTEAMS = gql`
  query GetSubteamData($teamId: String!) {
    getSubteamData(teamId: $teamId) {
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

const ContentManagement: React.FC<TeamsProps> = ({ teamId }) => {
  const [isSelectVisible, setIsSelectVisible] = useState(false);
  useState(0);
  const [showFormations, setShowFormations] = useState(false);

  const {
    loading,
    error: subteamError,
    data,
  } = useQuery(GET_SUBTEAMS, {
    variables: { teamId: teamId },
  });

  const [selectedSubteam, setSelectedSubteam] = useState<string | null>(null);

  useEffect(() => {
    if (data && data.getSubteamData && data.getSubteamData.length > 0) {
      setSelectedSubteam(data.getSubteamData[0].subteamId);
    }
  }, [data]);

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

  const handleSubteamChange = (event: { target: { value: any } }) => {
    setSelectedSubteam(event.target.value);
    setIsSelectVisible(false);
  };

  const handleToggleSelect = () => {
    setIsSelectVisible(!isSelectVisible);
  };

  const toggleShowFormations = () => {
    setShowFormations(!showFormations);
  };

  const isMobile = window.innerWidth <= 600;

  return (
    <Box sx={{}}>
      <Box>
        <>
          <Box sx={{ marginLeft: "", marginRight: "2%" }}>
            <Box
              sx={{
                display: isMobile ? "block" : "flex",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: "600" }} variant="h5">
                  Přehled soupisek
                </Typography>
              </Box>
              <Box sx={{ marginLeft: "auto", marginRight: "" }}>
              <Box>

              <Button
                        sx={{ marginRight: "2em", backgroundColor: "#027ef2" }}
                        onClick={toggleShowFormations}
                        variant="contained"
                      >
                        {showFormations ? "Soupisky" : "Formace"}
                      </Button>
                {data &&
                  data.getSubteamData &&
                  data.getSubteamData.length > 1 && (
                    
                      <Button
                        sx={{ marginRight: "2em", backgroundColor: "#027ef2" }}
                        onClick={handleToggleSelect}
                        variant="contained"
                      >
                        Týmy ({data?.getSubteamData?.length || 0}){" "}
                        {isSelectVisible ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                      </Button>
                  )}
              </Box>
              </Box>

            </Box>
            <>
              {data && data.getSubteamData && data.getSubteamData.length > 0 ? (
                <Box>
                  {isSelectVisible && (
                    <Select
                      sx={{ width: "100%", height: "4em", marginTop: "1em" }}
                      value={selectedSubteam}
                      onChange={handleSubteamChange}
                    >
                      {data.getSubteamData.map((subteam: Subteam) => (
                        <MenuItem
                          key={subteam.subteamId}
                          value={subteam.subteamId}
                        >
                          <Typography variant="h6">{subteam.Name}</Typography>
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                  {data.getSubteamData.map((subteam: Subteam) => (
                    <div key={subteam.subteamId}>
                      {selectedSubteam === subteam.subteamId && (
                        <Typography variant="body1">
                          {showFormations ? (
                            <Formations
                              subteamId={subteam.subteamId}
                            />
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
              ) : (
                <Typography variant="body1">
                  V tomto klubu jste zatím nevytvořili žádný tým.
                </Typography>
              )}
            </>
          </Box>
        </>
      </Box>
    </Box>
  );
};

export default ContentManagement;
