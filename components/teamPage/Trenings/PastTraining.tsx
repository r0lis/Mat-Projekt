/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Box, CircularProgress, Typography } from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import React, { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { authUtils } from "@/firebase/auth.utils";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

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
  query GetPastTrainingsBySubteam($input: MatchesBySubteamInput!) {
    getPastTrainingsBySubteam(input: $input) {
      subteamId
      trainings {
        matchId
        teamId
        opponentName
        endTime
        subteamIdSelected
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

const PastTraining: React.FC<Props> = ({ teamId }) => {
  const user = authUtils.getCurrentUser();
  const [subteamIds, setSubteamIds] = useState<string[]>([]);
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

  if (!matchesData || !matchesData.getPastTrainingsBySubteam) {
    return <Typography>Nemáte žádný zápas který už proběhl.</Typography>;
  }

  return (
    <Box>
      {subteamIds.map((subteamId) => {
        const subteamTrainings = matchesData?.getPastTrainingsBySubteam
          .filter(
            (subteam: { subteamId: string }) => subteam.subteamId === subteamId
          )
          .map(
            (subteam: { subteamId: string; trainings: Training[] }) =>
              subteam.trainings
          )
          .flat();

        const sortedTrainings = subteamTrainings.sort(
          (a: Training, b: Training) => {
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return dateB.getTime() - dateA.getTime(); // Compare timestamps in descending order
          }
        );

        return (
          <Box key={subteamId}>
            {sortedTrainings
              .filter((training: Training) => {
                console.log(training.selectedMembers);
                const isUserInTraining = training.selectedMembers.includes(
                  user?.email || ""
                );

                const isUserRoleNot3 = userRole !== 3;

                return isUserInTraining && isUserRoleNot3;
              })
              .map((training: Training) => (
                <Box
                  sx={{
                    marginLeft: "3%",
                    marginRight: "3%",
                    marginBottom: "1em",
                    borderRadius: "10px",
                    backgroundColor: "rgba(0, 56, 255, 0.24)",
                    border: "2px solid rgba(0, 34, 155, 1)",
                  }}
                  key={training.matchId}
                >
                  <Box
                    sx={{
                      paddingLeft: "0.5em",
                      paddingRight: "0.5em",
                      backgroundColor: "rgba(0, 56, 255, 0.24)",
                      borderRadius: "10px 10px 10px 10px",
                      paddingTop: "1em",
                      paddingBottom: "0.5em",
                    }}
                  >
                    <Typography variant="h6">
                      Trenink: {training.opponentName}
                    </Typography>
                    <Box sx={{ display: "flex" }}>
                      <Typography>
                        Datum:{" "}
                        {training.date &&
                          new Date(training.date).toLocaleDateString("cs-CZ", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                      </Typography>
                      <Typography sx={{ marginLeft: "0.5em" }}>
                        Čas: {training.time}-{training.endTime}
                      </Typography>
                      <Box sx={{ marginLeft: "auto" }}>
                        {isRole3 && (
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Box sx={{ marginLeft: "auto", cursor: "pointer" }}>
                              <Box sx={{ alignItems: "center" }}>
                                <Typography sx={{ fontWeight: "500" }}>
                                  účast
                                </Typography>

                                {training.attendance?.map(
                                  (attendanceRecord) =>
                                    user?.email === attendanceRecord.player && (
                                      <Box
                                        key={attendanceRecord.player}
                                        sx={{
                                          marginLeft: "1em",
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <>
                                          <>
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
                                            {attendanceRecord.hisAttendance ===
                                              0 && (
                                              <HelpIcon
                                                style={{
                                                  marginLeft: "0.5em",
                                                }}
                                              />
                                            )}
                                          </>
                                        </>
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
                </Box>
              ))}
          </Box>
        );
      })}
    </Box>
  );
};

export default PastTraining;
