import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
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
const Overview: React.FC<OverviewProps> = (id) => {
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
    return <p>Loading...</p>;
  }

  if (matchError || trainingsError) {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    return <p>Error: {trainingsError?.message || matchError?.message}</p>;
  }

  const matches: Match[] = matchData.getAllMatchBySubteamId;
  const trainings: Training[] = trainingsData.getAllTrainingBySubteamId;

  const combinedArray = [...matches, ...trainings];

  const sortedArray = combinedArray.sort((a, b) => {
    const dateComparison = a.date.localeCompare(b.date);
    if (dateComparison === 0) {
      return a.time.localeCompare(b.time);
    }
    return dateComparison;
  });

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Začátek týdne

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Konec týdne

  const matchCount = matches.filter(
    (match) =>
      new Date(match.date) >= startOfWeek && new Date(match.date) <= endOfWeek
  ).length;

  const trainingCount = trainings.filter(
    (training) =>
      new Date(training.date) >= startOfWeek &&
      new Date(training.date) <= endOfWeek
  ).length;

  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const endOfNextWeek = new Date(nextWeek);
  endOfNextWeek.setDate(endOfNextWeek.getDate() + 6);

  const nextWeekFilteredArray = combinedArray.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= nextWeek && itemDate <= endOfNextWeek;
  });

  const nextWeekMatchCount = nextWeekFilteredArray.filter(
    (item) => item.matchType !== null
  ).length;

  const nextWeekTrainingCount = nextWeekFilteredArray.filter(
    (item) => item.matchType === null
  ).length;

  const filteredArray = sortedArray.filter((item) => {
    const itemDate = new Date(item.date + " " + item.time);
    const startOfWeekMinusOne = new Date(startOfWeek);
    startOfWeekMinusOne.setDate(startOfWeekMinusOne.getDate() - 1);
    return itemDate >= startOfWeekMinusOne;
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "1em",
          marginBottom: "1em",
        }}
      >
        <Card>
          <Typography>
            {startOfWeek.toLocaleDateString("cs-CZ")} -{" "}
            {endOfWeek.toLocaleDateString("cs-CZ")}
          </Typography>
          <CardContent>
            <Typography variant="h6">Tréninky tento týden</Typography>
            <Typography></Typography>
            <Typography>{trainingCount}</Typography>
          </CardContent>
          <CardContent>
            <Typography variant="h6">Zápasy tento týden</Typography>
            <Typography>{matchCount}</Typography>
          </CardContent>
        </Card>
        <Card>
          <Typography>
            {nextWeek.toLocaleDateString("cs-CZ")} -{" "}
            {endOfNextWeek.toLocaleDateString("cs-CZ")}
          </Typography>

          <CardContent>
            <Typography variant="h6">Tréninky nadcházející týden</Typography>
            <Typography>{nextWeekTrainingCount}</Typography>
          </CardContent>
          <CardContent>
            <Typography variant="h6">Zápasy nadcházející týden</Typography>

            <Typography>{nextWeekMatchCount}</Typography>
          </CardContent>
        </Card>
      </Box>
      {filteredArray.map((item, index) => (
        <Box
          key={index}
          sx={{
            marginLeft: "3%",
            marginRight: "3%",
            marginBottom: "1em",
            borderRadius: "10px",
            backgroundColor: "rgba(0, 56, 255, 0.24)",
            border: "2px solid rgba(0, 34, 155, 1)",
          }}
        >
          <Box
            sx={{
              paddingLeft: "1em",
              paddingRight: "1em",
              backgroundColor: "rgba(0, 56, 255, 0.24)",
              borderRadius: "10px 10px 10px 10px",
              paddingTop: "1em",
              paddingBottom: "0.5em",
            }}
          >
            <Typography variant="h6">
              {item.matchType == null ? "Zápas" : "Trénink"} -{" "}
              {item.opponentName}
            </Typography>
            <Typography>
              Datum:{" "}
              {new Date(item.date).toLocaleDateString("cs-CZ", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </Typography>
            <Typography>Čas: {item.time}</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default Overview;
