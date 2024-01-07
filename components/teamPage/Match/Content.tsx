/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import {
  Box,
  CircularProgress,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import React, { useEffect, useState } from "react";
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

const GET_MATCHES_BY_SUBTEAM = gql`
  query GetMatchesBySubteam($input: MatchesBySubteamInput!) {
    getMatchesBySubteam(input: $input) {
      subteamId
      matches {
        matchId
        teamId
        opponentName
        selectedHallId
        subteamIdSelected
        date
        time
        selectedMembers
        matchType
      }
    }
  }
`;

const GET_SUBTEAM_DETAILS = gql`
  query GetSubteamDetails($subteamId: String!) {
    getCompleteSubteamDetail(subteamId: $subteamId) {
      Name
    }
  }
`;

const GET_HALL_BY_TEAM_AND_HALL_ID = gql`
  query GetHallByTeamAndHallId($teamId: String!, $hallId: String!) {
    getHallByTeamAndHallId(teamId: $teamId, hallId: $hallId) {
      hallId
      name
      location
    }
  }
`;

type Props = {
  teamId: string;
};

interface Match {
  matchId: string;
  opponentName: string;
  selectedHallId: string;
  subteamIdSelected: string;
  date: string;
  time: string;
  selectedMembers: string[];
  matchType: string;
}

const Content: React.FC<Props> = ({ teamId }) => {
  const user = authUtils.getCurrentUser();
  const [subteamIds, setSubteamIds] = useState<string[]>([]);
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);

  const {
    loading: subteamLoading,
    error: subteamError,
    data: subteamData,
  } = useQuery(GET_SUBTEAMS, {
    variables: { teamId, email: user?.email || "" },
    skip: !user,
  });

  useEffect(() => {
    if (subteamData) {
      const ids = subteamData.getYourSubteamData.map(
        (subteam: { subteamId: string }) => subteam.subteamId
      );
      setSubteamIds(ids);
    }
  }, [subteamData]);

  const {
    loading: matchesLoading,
    error: matchesError,
    data: matchesData,
  } = useQuery(GET_MATCHES_BY_SUBTEAM, {
    variables: { input: { subteamIds: subteamIds || [] } },
    skip: subteamIds.length === 0,
  });

  if (subteamLoading || matchesLoading)
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
  if (subteamError || matchesError) return <Typography>Chyba</Typography>;

  const getMatchTypeLabel = (matchType: string) => {
    return matchType === "home" ? "Domácí" : matchType === "away" ? "Hostí" : "";
  };

  return (
    <Box>
      {subteamIds.map((subteamId) => {
        const subteamMatches = matchesData?.getMatchesBySubteam
          .filter(
            (subteam: { subteamId: string }) => subteam.subteamId === subteamId
          )
          .map(
            (subteam: { subteamId: string; matches: Match[] }) =>
              subteam.matches
          )
          .flat();

        return (
          <Box key={subteamId}>
            {subteamMatches.map((match: Match) => (
              <Box
                sx={{
                  marginLeft: "2%",
                  marginRight: "2%",
                  marginBottom: "2em",
                  
                  paddingBottom: "1em",
                  borderRadius: "10px",
                  backgroundColor: "rgba(0, 56, 255, 0.24)",
                }}
                key={match.matchId}
              >
                <Box sx={{paddingLeft:"1em", paddingRight:"1em" ,  backgroundColor: "rgba(0, 56, 255, 0.24)", borderRadius:"10px 10px 0 0",paddingTop: "1em", paddingBottom:"0.5em" }}>
                <Typography variant="h6">
                  Zápas Protivník: {match.opponentName}
                </Typography>
                <Box sx={{ display: "flex" }}>
                  <Typography>
                    Datum:{" "}
                    {match.date &&
                      new Date(match.date).toLocaleDateString("cs-CZ", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                  </Typography>

                  <Typography sx={{ marginLeft: "1em" }}>
                    Čas: {match.time}
                  </Typography>
                </Box>
                </Box>
                <Box sx={{borderTop:"2px solid black", padding:0}}>
                  </Box>

                  <Box sx={{paddingLeft:"1em", paddingRight:"1em", paddingTop:"0.5em"}}>
                  <Grid container spacing={2}>
                <Grid item xs={1.5}>
                  <Typography sx={{fontWeight:"500"}}>Váš tým:</Typography>
                  <Typography sx={{fontWeight:"500"}}>Typ zápasu:</Typography>
                  
                </Grid>
                <Grid item xs={6}>
                <Box>
                    {match.subteamIdSelected && (
                      <SubteamDetails subteamId={match.subteamIdSelected} />
                    )}
                  </Box>
                  <Typography>{getMatchTypeLabel(match.matchType)}</Typography>
                </Grid>
              </Grid>

                <Typography sx={{fontWeight:"500", paddingTop:"0.5em", }}>Info haly</Typography>
                <Box>
                  {match.selectedHallId && (
                    <HallInfo teamId={teamId} hallId={match.selectedHallId} />
                  )}
                </Box>

                { expandedMatchId === match.matchId ? (
                  <Box>
                    <Box sx={{display:"flex"}}>
                    <Typography sx={{fontWeight:"500"}}>Nominovaní hráči:</Typography>
                    <Box>
                      
                    <ExpandLessIcon
                        onClick={() => setExpandedMatchId(null)}
                      />
                    </Box>
                    </Box>
                    {match.selectedMembers &&
                    match.selectedMembers.length > 0 ? (
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Číslo hráče</TableCell>
                            <TableCell>Jméno hráče</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {match.selectedMembers.map((member, index) => (
                            <TableRow key={index}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{member}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <Box>
                        <Typography sx={{fontWeight:"500"}}>Nominovaní hráči:</Typography>
                        <Typography>Žádní nominovaní hráči.</Typography>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Box>
                     <Box sx={{display:"flex"}}>
                    <Typography sx={{fontWeight:"500"}}>Nominovaní hráči:</Typography>
                    <Box>
                    <ExpandMoreIcon
                        onClick={() => setExpandedMatchId(match.matchId)}
                      />
                    </Box>
                    </Box>
                  </Box>
                )}
              </Box>
           </Box>

            )) }
          </Box>
          

        );
      
      })}
      
    </Box>
  );
};

interface HallInfoProps {
  teamId: string;
  hallId: string;
}

const HallInfo: React.FC<HallInfoProps> = ({ teamId, hallId }) => {
  const { loading, error, data } = useQuery(GET_HALL_BY_TEAM_AND_HALL_ID, {
    variables: { teamId, hallId },
  });

  if (loading) return <CircularProgress color="primary" size={20} />;
  if (error) return <Typography>Error loading hall information</Typography>;

  const hall = data.getHallByTeamAndHallId;
  return (
    <Box sx={{paddingBottom:"0.5em"}}>
      <Grid container spacing={2}>
        <Grid item xs={1.5}>
        <Typography sx={{fontWeight:"500"}}>Name: </Typography>
        <Typography sx={{fontWeight:"500"}}>Location: </Typography>
        </Grid>
        <Grid item xs={6}>
        <Typography >{hall.name}</Typography>
        <Typography>{hall.location}</Typography>
        </Grid>
      </Grid>
     
     
    </Box>
  );
};

const SubteamDetails: React.FC<{ subteamId: string }> = ({ subteamId }) => {
  const { loading, error, data } = useQuery(GET_SUBTEAM_DETAILS, {
    variables: { subteamId },
  });

  if (loading) return <CircularProgress color="primary" size={20} />;
  if (error) return <Typography>Error loading subteam information</Typography>;

  const subteamDetails = data.getCompleteSubteamDetail;
  return <Typography> {subteamDetails.Name}</Typography>;
};

export default Content;
