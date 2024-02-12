/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import {
    Box,
    Button,
    CircularProgress,
    Typography,
  } from "@mui/material";

  import Select from "@mui/material/Select";
  import MenuItem from "@mui/material/MenuItem";
  import React, { useEffect, useState } from "react";
  import { gql, useQuery } from "@apollo/client";
  import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
  import ExpandLessIcon from "@mui/icons-material/ExpandLess";
  
 
  const GET_TEAM_MEMBERS_DETAILS = gql`
    query GetTeamMembersDetails($teamId: String!) {
      getTeamMembersDetails(teamId: $teamId) {
        Name
        Surname
        Role
        Email
        DateOfBirth
      }
    }
  `;
  
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
  
  interface Member {
    Name: string;
    Surname: string;
    Role: string;
    Email: string;
    Position: string;
    DateOfBirth: string;
  }
  
  interface Subteam {
    subteamId: string;
    Name: string;
  }
  
  
  const ContentManagement: React.FC<TeamsProps> = ({ teamId }) => {
    const [isSelectVisible, setIsSelectVisible] = useState(false);
      useState(0);
    
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
  
    const {
      loading: loadingMembers,
      error: errorMembers,
      data: dataMembers,
    } = useQuery<{
      getTeamMembersDetails: Member[];
    }>(GET_TEAM_MEMBERS_DETAILS, {
      variables: { teamId: teamId },
    });
  
    const members = dataMembers?.getTeamMembersDetails || [];
  
    
  
    if (loading || loadingMembers)
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
    if (subteamError || errorMembers) return <Typography>Chyba</Typography>;
    
  
    const handleSubteamChange = (event: { target: { value: any } }) => {
      setSelectedSubteam(event.target.value);
      setIsSelectVisible(false);
    };
  
  
    const handleToggleSelect = () => {
      setIsSelectVisible(!isSelectVisible);
    };
  
    const isMobile = window.innerWidth <= 600;
  
    return (
      <Box sx={{}}>
        <Box>
          
            <>
              <Box sx={{ marginLeft: "", marginRight: "2%" }}>
                <Box sx={{display: isMobile ? "block":"flex", alignItems: "center" }}>
                  <Box>
                    <Typography sx={{ fontWeight: "600" }} variant="h5">
                      Týmy v klubu:
                    </Typography>
                  </Box>
                  <Box sx={{ marginLeft: "auto", marginRight: "", }}>
                    {data && data.getSubteamData && data.getSubteamData.length > 1 && (
                    <Button
                      sx={{ marginRight: "2em", backgroundColor: "#027ef2" }}
                      onClick={handleToggleSelect}
                      variant="contained"
                    >
                      Týmy ({data?.getSubteamData?.length || 0}){" "}
                      {isSelectVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </Button>)}
  
                    
                  </Box>
                </Box>
                <>
                  {data &&
                  data.getSubteamData &&
                  data.getSubteamData.length > 0 ? (
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
                            // Content to show when this subteam is selected
                            <Typography variant="body1">
                              {/* Assuming Content component accepts subteamId */}
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
  