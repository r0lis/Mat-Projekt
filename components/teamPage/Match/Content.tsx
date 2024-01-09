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
  Avatar,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import React, { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { authUtils } from "@/firebase/auth.utils";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HelpIcon from "@mui/icons-material/Help";

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
        selectedPlayers
        selectedManagement
        matchType
        attendance {
          player
          hisAttendance
        }
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

const GET_USER_DETAILS = gql`
  query GetUserDetails($email: String!) {
    getUserByNameAndSurname(email: $email) {
      Name
      Surname
      Picture
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
  selectedPlayers: string[];
  selectedManagement: string[];
  date: string;
  time: string;
  selectedMembers: string[];
  matchType: string;
  attendance?: {
    player: string;
    hisAttendance: number;
  }[];
}

const Content: React.FC<Props> = ({ teamId }) => {
  const user = authUtils.getCurrentUser();
  const [subteamIds, setSubteamIds] = useState<string[]>([]);
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [, setUserDetails] = useState<any>(null);

  const {
    loading: roleLoading,
    error: roleError,
    data: roleData,
  } = useQuery(GET_USER_ROLE_IN_TEAM, {
    variables: { teamId: teamId, email: user?.email || "" },
    skip: !user,
  });

  const {
    loading: subteamLoading,
    error: subteamError,
    data: subteamData,
  } = useQuery(GET_SUBTEAMS, {
    variables: { teamId, email: user?.email || "" },
    skip: !user,
  });

  useEffect(() => {
    if (subteamData && subteamData.getYourSubteamData) {
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

  const {
    loading: userDetailsLoading,
    error: userDetailsError,
    data: userDetailsData,
  } = useQuery(GET_USER_DETAILS, {
    variables: { email: user?.email || "" },
    skip: !user,
  });

  useEffect(() => {
    if (userDetailsData) {
      setUserDetails(userDetailsData.getUserByNameAndSurname);
    }
  }, [userDetailsData]);

  if (subteamLoading || matchesLoading || userDetailsLoading || roleLoading)
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
  if (subteamError || matchesError || userDetailsError || roleError)
    return <Typography>Chyba</Typography>;

  const userRole = roleData?.getUserRoleInTeam?.role;
  const isRole3 = userRole == 3;

  const getMatchTypeLabel = (matchType: string) => {
    return matchType === "home"
      ? "Domácí"
      : matchType === "away"
      ? "Hostí"
      : "";
  };

  if (!matchesData || !matchesData.getMatchesBySubteam) {
    return <Typography>Nemáte naplánován žádný zápas.</Typography>;
  }

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
                  marginLeft: "3%",
                  marginRight: "3%",
                  marginBottom: "2em",
                  borderRadius: "10px",
                  backgroundColor: "rgba(0, 56, 255, 0.24)",
                  border: "2px solid rgba(0, 34, 155, 1)",
                }}
                key={match.matchId}
              >
                <Box
                  sx={{
                    paddingLeft: "1em",
                    paddingRight: "1em",
                    backgroundColor: "rgba(0, 56, 255, 0.24)",
                    borderRadius: "10px 10px 0 0",
                    borderBottom: "2px solid rgba(0, 34, 155, 1)",
                    paddingTop: "1em",
                    paddingBottom: "0.5em",
                  }}
                >
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
                    <Box sx={{ marginLeft: "auto" }}>
                      {isRole3 && (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box sx={{ marginLeft: "auto", cursor: "pointer" }}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Typography sx={{ fontWeight: "500" }}>
                                Změnit účast
                              </Typography>
                              {match.attendance?.map(
                                (attendanceRecord) =>
                                  user?.email === attendanceRecord.player && (
                                    <Box
                                      key={attendanceRecord.player}
                                      sx={{ marginLeft: "1em" }}
                                    >
                                      {user?.email ===
                                        attendanceRecord.player && (
                                        <>
                                          {attendanceRecord.hisAttendance ===
                                            0 && <HelpIcon />}
                                          {attendanceRecord.hisAttendance ===
                                            1 && (
                                            <CheckCircleIcon
                                              style={{
                                                color: "green",
                                                marginLeft: "0.5em",
                                              }}
                                            />
                                          )}
                                          {attendanceRecord.hisAttendance ===
                                            2 && (
                                            <CancelIcon
                                              style={{
                                                color: "red",
                                                marginLeft: "0.5em",
                                              }}
                                            />
                                          )}
                                        </>
                                      )}
                                    </Box>
                                  )
                              )}
                            </Box>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
                <Box
                  sx={{
                    paddingLeft: "1em",
                    paddingRight: "1em",
                    paddingTop: "0.5em",
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={1.5}>
                      <Typography sx={{ fontWeight: "500" }}>
                        Váš tým:
                      </Typography>
                      <Typography sx={{ fontWeight: "500" }}>
                        Typ zápasu:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Box>
                        {match.subteamIdSelected && (
                          <SubteamDetails subteamId={match.subteamIdSelected} />
                        )}
                      </Box>
                      <Typography>
                        {getMatchTypeLabel(match.matchType)}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Typography sx={{ fontWeight: "500", paddingTop: "0.5em" }}>
                    Info haly
                  </Typography>
                  <Box>
                    {match.selectedHallId && (
                      <HallInfo teamId={teamId} hallId={match.selectedHallId} />
                    )}
                  </Box>
                </Box>

                <Box
                  sx={{
                    paddingLeft: "1em",
                    paddingRight: "1em",
                    backgroundColor: "rgba(0, 56, 255, 0.15)",
                    borderRadius: "0px 0px 10px 10px",
                    borderTop: "2px solid rgba(0, 34, 155, 1)",
                    paddingBottom: "0.5em",
                    paddingTop: "0.5em",
                  }}
                >
                  {expandedMatchId === match.matchId ? (
                    <Box>
                      <Box sx={{ display: "flex" }}>
                        <Typography sx={{ fontWeight: "500" }}>
                          Účastníci:
                        </Typography>
                        <Box>
                          <ExpandLessIcon
                            onClick={() => setExpandedMatchId(null)}
                          />
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          backgroundColor: "white",
                          borderRadius: "10px",
                          marginTop: "0.5em",
                          paddingBottom: "1em",
                          marginBottom: "1em",
                        }}
                      >
                        <Box sx={{ paddingTop: "1em", display: "flex" }}>
                          <Typography
                            sx={{
                              fontWeight: "500",
                              marginLeft: "10%",
                              marginRight: "auto",
                              fontSize: "1.2em",
                            }}
                          >
                            Management a trenéři:
                          </Typography>
                        </Box>
                        {match.selectedManagement &&
                        match.selectedManagement.length > 0 ? (
                          <Table
                            sx={{
                              borderRadius: "10px",
                              width: "80%",
                              marginLeft: "auto",
                              marginRight: "auto",
                            }}
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {match.selectedManagement.map((member, index) => (
                                <TableRow
                                  sx={{ borderBottom: "2px solid gray" }}
                                  key={index}
                                >
                                  <UserDetails email={member} />
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <Box>
                            <Typography sx={{ fontWeight: "500" }}>
                              Účastníci:
                            </Typography>
                            <Typography>Žádní nominovaní hráči.</Typography>
                          </Box>
                        )}
                      </Box>

                      <Box
                        sx={{
                          backgroundColor: "white",
                          borderRadius: "10px",
                          marginTop: "0.5em",
                          paddingBottom: "1em",
                          marginBottom: "1em",
                        }}
                      >
                        {isRole3 ? (
                          <>
                            <Table
                              sx={{
                                borderRadius: "10px",
                                width: "80%",
                                marginLeft: "auto",
                                marginRight: "auto",
                              }}
                            >
                              <TableHead>
                                <TableRow>
                                  <TableCell></TableCell>
                                  <TableCell></TableCell>
                                  <TableCell></TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {match.selectedPlayers
                                  .filter((player) => player === user?.email)
                                  .map((member, index) => (
                                    <TableRow
                                      sx={{ borderBottom: "2px solid gray" }}
                                      key={index}
                                    >
                                      <UserDetails email={member} />
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </>
                        ) : (
                          <>
                            <Box sx={{ paddingTop: "1em", display: "flex" }}>
                              <Typography
                                sx={{
                                  fontWeight: "500",
                                  marginLeft: "10%",
                                  marginRight: "auto",
                                  fontSize: "1.2em",
                                }}
                              >
                                Hráči:
                              </Typography>
                            </Box>
                            {match.selectedPlayers &&
                            match.selectedPlayers.length > 0 ? (
                              <Table
                                sx={{
                                  borderRadius: "10px",
                                  width: "80%",
                                  marginLeft: "auto",
                                  marginRight: "auto",
                                }}
                              >
                                <TableHead>
                                  <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {match.selectedPlayers.map(
                                    (member, index) => (
                                      <TableRow
                                        sx={{ borderBottom: "2px solid gray" }}
                                        key={index}
                                      >
                                        <UserDetails email={member} />
                                      </TableRow>
                                    )
                                  )}
                                </TableBody>
                              </Table>
                            ) : (
                              <Box>
                                <Typography sx={{ fontWeight: "500" }}>
                                  Účastníci:{" "}
                                </Typography>
                                <Typography>Žádní nominovaní hráči.</Typography>
                              </Box>
                            )}
                          </>
                        )}
                      </Box>
                    </Box>
                  ) : (
                    <Box>
                      <Box sx={{ display: "flex" }}>
                        <Typography sx={{ fontWeight: "500" }}>
                          Účastníci:{" "}
                        </Typography>
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
            ))}
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
    <Box sx={{ paddingBottom: "0.5em" }}>
      <Grid container spacing={2}>
        <Grid item xs={1.5}>
          <Typography sx={{ fontWeight: "500" }}>Název: </Typography>
          <Typography sx={{ fontWeight: "500" }}>Umístení: </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>{hall.name}</Typography>
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

const UserDetails: React.FC<{ email: string }> = ({ email }) => {
  const { loading, error, data } = useQuery(GET_USER_DETAILS, {
    variables: { email },
  });

  if (loading) return <CircularProgress color="primary" size={20} />;
  if (error) return <Typography>Error loading user details</Typography>;

  const userDetails = data.getUserByNameAndSurname;
  return (
    <>
      <TableCell>{userDetails.Name}</TableCell>
      <TableCell>{userDetails.Surname}</TableCell>
      <TableCell>
        {userDetails.Picture && (
          <Avatar
            src={userDetails.Picture}
            alt={`Avatar for ${userDetails.Name}`}
            sx={{ width: "50px", height: "50px", borderRadius: "50%" }}
          />
        )}
      </TableCell>
    </>
  );
};

export default Content;
