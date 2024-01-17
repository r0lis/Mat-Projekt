import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { gql, useQuery } from "@apollo/client";

const GET_ALL_MATCHES_BY_SUBTEAM_ID = gql`
  query GetAllMatchesBySubteamId($subteamId: String!) {
    getAllMatchBySubteamId(subteamId: $subteamId) {
      matchId
      teamId
      subteamIdSelected
      opponentName
      selectedHallId
      date
      time
      endTime
      selectedMembers
      selectedPlayers
      selectedManagement
      matchType
      attendance {
        player
        hisAttendance
        reason
      }
    }
  }
`;

const GET_ALL_TRAININGS_BY_SUBTEAM_ID = gql`
  query GetAllTrainingBySubteamId($subteamId: String!) {
    getAllTrainingBySubteamId(subteamId: $subteamId) {
      matchId
      teamId
      subteamIdSelected
      opponentName
      selectedHallId
      endTime
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

type OverviewProps = {
  subteamId: string;
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
  endTime: string;
  selectedMembers: string[];
  selectedHallPosition: string;
  matchType: string;
  attendance?: {
    player: string;
    hisAttendance: number;
    reason?: string;
  }[];
}

interface Training {
  matchId: string;
  opponentName: string;
  selectedHallId: string;
  subteamIdSelected: string;
  selectedPlayers: string[];
  selectedManagement: string[];
  date: string;
  time: string;
  endTime: string;
  description: string;
  matchType: string;
  selectedMembers: string[];
  attendance?: {
    player: string;
    hisAttendance: number;
    reason?: string;
  }[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const News: React.FC<OverviewProps> = (id) => {
  const subteamId = id.subteamId;

  const {
    loading: matchLoading,
    error: matchError,
    data: matchData,
  } = useQuery(GET_ALL_MATCHES_BY_SUBTEAM_ID, {
    variables: { subteamId },
  });

  const {
    loading: trainingsLoading,
    error: trainingsError,
    data: trainingsData,
  } = useQuery(GET_ALL_TRAININGS_BY_SUBTEAM_ID, {
    variables: { subteamId },
  });

  if (matchLoading || trainingsLoading) {
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
  }

  if (matchError || trainingsError) {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    return <p>Error: {trainingsError?.message || matchError?.message}</p>;
  }

  const matches: Match[] = matchData.getAllMatchBySubteamId;
  const trainings: Training[] = trainingsData.getAllTrainingBySubteamId;

  const combinedArray = [...matches, ...trainings];

  const filteredArray = combinedArray.filter((item) => {
    const itemDate = new Date(item.date + " " + item.time);
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setDate(twentyFourHoursAgo.getDate() - 1);
    return itemDate >= twentyFourHoursAgo;
  });

  const sortedArray = filteredArray.sort((a, b) => {
    const dateComparison = a.date.localeCompare(b.date);
    if (dateComparison === 0) {
      return a.time.localeCompare(b.time);
    }
    return dateComparison;
  });

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(today.getDate() + 2);

  const todayArray = sortedArray.filter((item) => {
    const itemDate = new Date(item.date);
    return (
      itemDate.getDate() === today.getDate() &&
      itemDate.getMonth() === today.getMonth() &&
      itemDate.getFullYear() === today.getFullYear()
    );
  });

  const tomorrowArray = sortedArray.filter((item) => {
    const itemDate = new Date(item.date);
    return (
      itemDate.getDate() === tomorrow.getDate() &&
      itemDate.getMonth() === tomorrow.getMonth() &&
      itemDate.getFullYear() === tomorrow.getFullYear()
    );
  });

  const dayAfterTomorrowArray = sortedArray.filter((item) => {
    const itemDate = new Date(item.date);
    return (
      itemDate.getDate() === dayAfterTomorrow.getDate() &&
      itemDate.getMonth() === dayAfterTomorrow.getMonth() &&
      itemDate.getFullYear() === dayAfterTomorrow.getFullYear()
    );
  });

  return (
    <Box
      sx={{
        marginLeft: "2%",
        marginRight: "2%",
        maxHeight: "100vh",
        overflowY: "auto",
      }}
    >
      <Box>
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              marginBottom: "1em",
            }}
          >
            <Typography variant="h6" sx={{ cursor: "pointer" }}>
              Dnes
            </Typography>
          </Box>
          {todayArray.length === 0 ? (
            <Typography sx={{marginLeft: "3%",
            marginRight: "3%",}} variant="body1">
              Dnes nemáte v plánu žádnou událost.
            </Typography>
          ) : (
            todayArray.map((item, index) => (
              <Box
                key={index}
                sx={{
                  marginLeft: "3%",
                  marginRight: "3%",
                  marginBottom: "1em",
                  borderRadius: "10px",
                  backgroundColor:  item.matchType == null ?"rgba(255, 130, 0, 0.15)": "rgba(0, 56, 255, 0.24)" ,
                  border:  item.matchType == null ? "2px solid rgba(255, 130, 0, 0.6)":"2px solid rgba(0, 34, 155, 1)",
                }}
              >
                <Box
                  sx={{
                    paddingLeft: "1em",
                    paddingRight: "1em",
                    backgroundColor: item.matchType == null ? "rgba(255, 130, 0, 0.15)":"rgba(0, 56, 255, 0.24)",
                    borderRadius: "10px 10px 10px 10px",
                    paddingTop: "1em",
                    paddingBottom: "0.5em",
                  }}
                >
                  <Typography variant="h6">
                  {item.matchType == null ? "Trénink" : "Zápas"} -{" "}
                    {item.opponentName}
                  </Typography>
                  <Typography>
                    Date:{" "}
                    {new Date(item.date).toLocaleDateString("cs-CZ", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </Typography>
                  <Typography>Time: {item.time}-{item.endTime}</Typography>
                </Box>
              </Box>
            ))
          )}
        </Box>
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              marginBottom: "1em",
            }}
          >
            <Typography variant="h6" sx={{ cursor: "pointer" }}>
              Zítra
            </Typography>
          </Box>
          {tomorrowArray.length === 0 ? (
            <Typography sx={{marginLeft: "3%",
            marginRight: "3%",}} variant="body1">
              Zítra nemáte v plánu žádnou událost.
            </Typography>
          ) : (
            tomorrowArray.map((item, index) => (
              <Box
                key={index}
                sx={{
                  marginLeft: "3%",
                  marginRight: "3%",
                  marginBottom: "1em",
                  borderRadius: "10px",
                  backgroundColor:  item.matchType == null ?"rgba(255, 130, 0, 0.15)": "rgba(0, 56, 255, 0.24)" ,
                  border:  item.matchType == null ? "2px solid rgba(255, 130, 0, 0.6)":"2px solid rgba(0, 34, 155, 1)",
                }}
              >
                <Box
                  sx={{
                    paddingLeft: "1em",
                    paddingRight: "1em",
                    backgroundColor:  item.matchType == null ?"rgba(255, 130, 0, 0.15)": "rgba(0, 56, 255, 0.24)" ,
                    borderRadius: "10px 10px 10px 10px",
                    paddingTop: "1em",
                    paddingBottom: "0.5em",
                  }}
                >
                  <Typography variant="h6">
                    {item.matchType == null ? "Trénink" : "Zápas"} -{" "}
                    {item.opponentName}
                  </Typography>
                  <Typography>
                    Date:{" "}
                    {new Date(item.date).toLocaleDateString("cs-CZ", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </Typography>
                  <Typography>Time: {item.time}-{item.endTime}</Typography>
                </Box>
              </Box>
            ))
          )}
        </Box>
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              marginBottom: "1em",
            }}
          >
            <Typography variant="h6" sx={{ cursor: "pointer" }}>
              Pozítří
            </Typography>
          </Box>

          {dayAfterTomorrowArray.length === 0 ? (
            <Typography sx={{marginLeft: "3%",
            marginRight: "3%",}} variant="body1">
              Pozítří nemáte v plánu žádnou událost.
            </Typography>
          ) : (
            dayAfterTomorrowArray.map((item, index) => (
              <Box
                key={index}
                sx={{
                  marginLeft: "3%",
                  marginRight: "3%",
                  marginBottom: "1em",
                  borderRadius: "10px",
                  backgroundColor:  item.matchType == null ?"rgba(255, 130, 0, 0.15)": "rgba(0, 56, 255, 0.24)" ,
                  border:  item.matchType == null ? "2px solid rgba(255, 130, 0, 0.6)":"2px solid rgba(0, 34, 155, 1)",
                }}
              >
                <Box
                  sx={{
                    backgroundColor:  item.matchType == null ?"rgba(255, 130, 0, 0.15)": "rgba(0, 56, 255, 0.24)" ,
                    borderRadius: "10px 10px 10px 10px",
                    paddingTop: "1em",
                    paddingBottom: "0.5em",
                    paddingLeft: "1em",
                    paddingRight: "1em",
                  }}
                >
                  <Typography variant="h6">
                  {item.matchType == null ? "Trénink" : "Zápas"} -{" "}
                    {item.opponentName}
                  </Typography>
                  <Typography>
                    Date:{" "}
                    {new Date(item.date).toLocaleDateString("cs-CZ", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </Typography>
                  <Typography>Time: {item.time}-{item.endTime}</Typography>
                </Box>
              </Box>
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default News;
