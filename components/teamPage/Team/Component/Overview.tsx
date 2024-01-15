import React from "react";
import { Box, Typography } from "@mui/material";
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

  const { loading: matchLoading, error: matchError, data: matchData } = useQuery(GET_ALL_MATCHES_BY_SUBTEAM_ID, {
    variables: { subteamId },
  });

  const { loading: trainingsLoading, error: trainingsError, data: trainingsData } = useQuery(GET_ALL_TRAININGS_BY_SUBTEAM_ID, {
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

  return (
    <Box sx={{ marginLeft: "2%", marginRight: "2%", maxHeight: "100vh", overflowY: "auto" }}>
      <Typography variant="h4">Matches and Trainings Overview</Typography>
      {sortedArray.map((item, index) => (
        <Box key={index} sx={{ marginBottom: 2 }}>
          <Typography variant="h6">{item.matchType == null ? "Zápas" : "Trénink"} - {item.opponentName}</Typography>
          <Typography>Date: {item.date}</Typography>
          <Typography>Time: {item.time}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default Overview;
